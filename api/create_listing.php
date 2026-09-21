<?php

require 'db.php';

header('Content-Type: application/json');

$data = $_POST;

$buildingName = trim($data['buildingName'] ?? '');
$location = trim($data['location'] ?? '');

$latitude = $data['latitude'] ?? null;
$longitude = $data['longitude'] ?? null;

$unitName = trim(
    $data['unitName'] ?? 'Entire place'
);

$description = trim(
    $data['description'] ?? ''
);

$maxGuests = (int) (
    $data['maxGuests'] ?? 0
);

$ratePerNight = (float) (
    $data['ratePerNight'] ?? 0
);

$amenities = $data['amenities'] ?? [];

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (
    !$buildingName ||
    !$location ||
    !$description ||
    $maxGuests < 1 ||
    $ratePerNight <= 0
) {
    http_response_code(400);

    echo json_encode([
        'error' =>
            'Complete the required listing fields'
    ]);

    exit;
}

if (!is_array($amenities)) {
    http_response_code(400);

    echo json_encode([
        'error' => 'Invalid amenities'
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Latitude validation
|--------------------------------------------------------------------------
*/

if (
    $latitude !== null &&
    $latitude !== '' &&
    (
        !is_numeric($latitude) ||
        $latitude < -90 ||
        $latitude > 90
    )
) {
    http_response_code(400);

    echo json_encode([
        'error' => 'Invalid latitude'
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Longitude validation
|--------------------------------------------------------------------------
*/

if (
    $longitude !== null &&
    $longitude !== '' &&
    (
        !is_numeric($longitude) ||
        $longitude < -180 ||
        $longitude > 180
    )
) {
    http_response_code(400);

    echo json_encode([
        'error' => 'Invalid longitude'
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Normalize empty coordinates to NULL
|--------------------------------------------------------------------------
*/

if ($latitude === '') {
    $latitude = null;
}

if ($longitude === '') {
    $longitude = null;
}

/*
|--------------------------------------------------------------------------
| Both coordinates must exist together
|--------------------------------------------------------------------------
*/

if (
    ($latitude === null) !==
    ($longitude === null)
) {
    http_response_code(400);

    echo json_encode([
        'error' =>
            'Both latitude and longitude are required'
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Start transaction
|--------------------------------------------------------------------------
*/

try {

    $pdo->beginTransaction();

    /*
    |--------------------------------------------------------------------------
    | Create building
    |--------------------------------------------------------------------------
    */

    $building = $pdo->prepare(
        'INSERT INTO buildings
        (
            building_name,
            location,
            latitude,
            longitude
        )
        VALUES (?, ?, ?, ?)'
    );

    $building->execute([
        $buildingName,
        $location,
        $latitude,
        $longitude,
    ]);

    $buildingId = $pdo->lastInsertId();

    /*
    |--------------------------------------------------------------------------
    | Create unit
    |--------------------------------------------------------------------------
    */

    $unit = $pdo->prepare(
        'INSERT INTO units
        (
            building_id,
            unit_name,
            description,
            max_guests,
            rate_per_night
        )
        VALUES (?, ?, ?, ?, ?)'
    );

    $unit->execute([
        $buildingId,
        $unitName,
        $description,
        $maxGuests,
        $ratePerNight,
    ]);

    $unitId = $pdo->lastInsertId();

    /*
    |--------------------------------------------------------------------------
    | Save amenities
    |--------------------------------------------------------------------------
    */

    $saveAmenity = $pdo->prepare(
        'INSERT INTO unit_amenities
        (amenity_name)
        VALUES (?)
        ON DUPLICATE KEY UPDATE
        amenity_id = LAST_INSERT_ID(amenity_id)'
    );

    $linkAmenity = $pdo->prepare(
        'INSERT IGNORE INTO unit_amenity
        (unit_id, amenity_id)
        VALUES (?, ?)'
    );

    foreach ($amenities as $amenityName) {

        $amenityName = trim(
            (string) $amenityName
        );

        if ($amenityName === '') {
            continue;
        }

        $saveAmenity->execute([
            $amenityName
        ]);

        $amenityId =
            $pdo->lastInsertId();

        $linkAmenity->execute([
            $unitId,
            $amenityId
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Save property images
    |--------------------------------------------------------------------------
    */

    $uploadDirectory =
        __DIR__ .
        '/uploads/properties/';

    if (!is_dir($uploadDirectory)) {

        if (!mkdir(
            $uploadDirectory,
            0755,
            true
        )) {
            throw new Exception(
                'Unable to create image upload directory.'
            );
        }
    }

    $saveImage = $pdo->prepare(
        'INSERT INTO unit_images
        (
            unit_id,
            image_path
        )
        VALUES (?, ?)'
    );

    $uploadedImages = [];

    if (
        isset($_FILES['images']) &&
        isset($_FILES['images']['name']) &&
        is_array($_FILES['images']['name'])
    ) {

        $allowedMimeTypes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
        ];

        foreach (
            $_FILES['images']['tmp_name']
            as $index => $temporaryFile
        ) {

            $uploadError =
                $_FILES['images']['error'][$index]
                ?? UPLOAD_ERR_NO_FILE;

            if (
                $uploadError ===
                UPLOAD_ERR_NO_FILE
            ) {
                continue;
            }

            if (
                $uploadError !==
                UPLOAD_ERR_OK
            ) {
                throw new Exception(
                    'One of the images failed to upload.'
                );
            }

            $fileSize =
                (int) $_FILES['images']['size'][$index];

            /*
            | Maximum 10 MB
            */
            if (
                $fileSize >
                10 * 1024 * 1024
            ) {
                throw new Exception(
                    'Each image must be 10 MB or smaller.'
                );
            }

            /*
            | Detect actual MIME type
            */
            $mimeType =
                mime_content_type(
                    $temporaryFile
                );

            if (
                !isset(
                    $allowedMimeTypes[$mimeType]
                )
            ) {
                throw new Exception(
                    'Only JPG and PNG images are allowed.'
                );
            }

            $extension =
                $allowedMimeTypes[$mimeType];

            /*
            | Generate unique filename
            */
            $filename =
                $unitId .
                '_' .
                bin2hex(
                    random_bytes(16)
                ) .
                '.' .
                $extension;

            $destination =
                $uploadDirectory .
                $filename;

            /*
            | Move uploaded file
            */
            if (
                !move_uploaded_file(
                    $temporaryFile,
                    $destination
                )
            ) {
                throw new Exception(
                    'Failed to save an uploaded image.'
                );
            }

            /*
            | Path stored in database
            */
            $imagePath =
                'uploads/properties/' .
                $filename;

            $saveImage->execute([
                $unitId,
                $imagePath
            ]);

            $uploadedImages[] =
                $imagePath;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Require at least one image
    |--------------------------------------------------------------------------
    */

    if (count($uploadedImages) === 0) {
        throw new Exception(
            'Please upload at least one property image.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Finish transaction
    |--------------------------------------------------------------------------
    */

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'buildingId' => (int) $buildingId,
        'unitId' => (int) $unitId,
        'images' => $uploadedImages,
    ]);

} catch (Throwable $error) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        'error' =>
            $error->getMessage()
    ]);
}
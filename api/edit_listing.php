<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$buildingId = (int) ($data['buildingId'] ?? 0);
$buildingName = trim($data['buildingName'] ?? '');
$location = trim($data['location'] ?? '');
$latitude = $data['latitude'] ?? null;
$longitude = $data['longitude'] ?? null;
$unitName = trim($data['unitName'] ?? 'Entire place');
$description = trim($data['description'] ?? '');
$maxGuests = (int) ($data['maxGuests'] ?? 0);
$ratePerNight = (float) ($data['ratePerNight'] ?? 0);
$amenities = $data['amenities'] ?? [];

if (!$buildingId || !$buildingName || !$location || !$description || $maxGuests < 1 || $ratePerNight <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Complete the required listing fields']);
    exit;
}

if (!is_array($amenities)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amenities']);
    exit;
}

if ($latitude !== null && (!is_numeric($latitude) || $latitude < -90 || $latitude > 90)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid latitude']);
    exit;
}

if ($longitude !== null && (!is_numeric($longitude) || $longitude < -180 || $longitude > 180)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid longitude']);
    exit;
}

if (($latitude === null) !== ($longitude === null)) {
    http_response_code(400);
    echo json_encode(['error' => 'Both latitude and longitude are required']);
    exit;
}

try {
    $pdo->beginTransaction();

    $building = $pdo->prepare(
        'UPDATE buildings
         SET building_name = ?, location = ?, latitude = ?, longitude = ?
         WHERE building_id = ?'
    );
    $building->execute([
        $buildingName,
        $location,
        $latitude,
        $longitude,
        $buildingId,
    ]);

    $unit = $pdo->prepare(
        'UPDATE units
         SET unit_name = ?, description = ?, max_guests = ?, rate_per_night = ?
         WHERE building_id = ?'
    );
    $unit->execute([
        $unitName,
        $description,
        $maxGuests,
        $ratePerNight,
        $buildingId,
    ]);

    $unitQuery = $pdo->prepare(
        'SELECT unit_id FROM units WHERE building_id = ? LIMIT 1'
    );
    $unitQuery->execute([$buildingId]);
    $unitId = $unitQuery->fetchColumn();

    if (!$unitId) {
        throw new Exception('Unit not found');
    }

    $removeAmenities = $pdo->prepare(
        'DELETE FROM unit_amenity WHERE unit_id = ?'
    );
    $removeAmenities->execute([$unitId]);

    $saveAmenity = $pdo->prepare(
        'INSERT INTO unit_amenities (amenity_name) VALUES (?)
         ON DUPLICATE KEY UPDATE amenity_id = LAST_INSERT_ID(amenity_id)'
    );

    $linkAmenity = $pdo->prepare(
        'INSERT IGNORE INTO unit_amenity (unit_id, amenity_id) VALUES (?, ?)'
    );

    foreach ($amenities as $amenityName) {
        $amenityName = trim($amenityName);

        if ($amenityName === '') {
            continue;
        }

        $saveAmenity->execute([$amenityName]);
        $linkAmenity->execute([$unitId, $pdo->lastInsertId()]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'buildingId' => $buildingId,
        'unitId' => (int) $unitId,
    ]);
} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(['error' => 'Listing update failed']);
}
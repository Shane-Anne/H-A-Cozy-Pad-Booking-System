<?php

require 'db.php';

header('Content-Type: application/json');

$stmt = $pdo->query(
    "SELECT
        b.building_id,
        b.building_name,
        b.property_category,
        b.location,
        b.latitude,
        b.longitude,

        u.unit_id,
        u.unit_name,
        u.description,
        u.max_guests,
        u.rate_per_night,
        u.status,

        GROUP_CONCAT(
            DISTINCT a.amenity_name
            ORDER BY a.amenity_name
            SEPARATOR ', '
        ) AS amenities,

        GROUP_CONCAT(
            DISTINCT ui.image_path
            ORDER BY ui.image_id
            SEPARATOR '|||'
        ) AS images

    FROM buildings b

    INNER JOIN units u
        ON b.building_id = u.building_id

    LEFT JOIN unit_amenity ua
        ON ua.unit_id = u.unit_id

    LEFT JOIN unit_amenities a
        ON a.amenity_id = ua.amenity_id

    LEFT JOIN unit_images ui
        ON ui.unit_id = u.unit_id

    WHERE u.status = 'available'

    GROUP BY
        b.building_id,
        b.building_name,
        b.property_category,
        b.location,
        b.latitude,
        b.longitude,

        u.unit_id,
        u.unit_name,
        u.description,
        u.max_guests,
        u.rate_per_night,
        u.status

    ORDER BY u.created_at DESC"
);

$listings =
    $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($listings as &$listing) {

    if (!empty($listing['images'])) {

        $listing['images'] =
            explode(
                '|||',
                $listing['images']
            );

    } else {

        $listing['images'] = [];
    }
}

unset($listing);


echo json_encode($listings);
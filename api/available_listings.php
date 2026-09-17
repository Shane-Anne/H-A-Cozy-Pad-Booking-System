<?php
require 'db.php';

$stmt = $pdo->query(
    "SELECT
        b.building_id,
        b.building_name,
        b.location,
        b.latitude,
        b.longitude,
        u.unit_id,
        u.unit_name,
        u.description,
        u.max_guests,
        u.rate_per_night,
        u.status, #amenities fetching - added by sel
        GROUP_CONCAT(DISTINCT a.amenity_name ORDER BY a.amenity_name SEPARATOR ', ') AS amenities
    FROM buildings b
    INNER JOIN units u ON b.building_id = u.building_id
    LEFT JOIN unit_amenity ua ON ua.unit_id = u.unit_id
    LEFT JOIN unit_amenities a ON a.amenity_id = ua.amenity_id
    WHERE u.status = 'available'
    GROUP BY
        b.building_id,
        b.building_name,
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

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

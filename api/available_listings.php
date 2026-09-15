<?php
require 'db.php';

$stmt = $pdo->query(
    "SELECT
        b.building_id,
        b.building_name,
        b.location,
        u.unit_id,
        u.unit_name,
        u.description,
        u.max_guests,
        u.rate_per_night,
        u.status
    FROM buildings b
    INNER JOIN units u ON b.building_id = u.building_id
    WHERE u.status = 'available'
    ORDER BY u.created_at DESC"
);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

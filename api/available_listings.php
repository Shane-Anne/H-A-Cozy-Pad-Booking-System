<?php
require 'db.php';

$checkInDate = $_GET['check_in_date'] ?? '';
$checkOutDate = $_GET['check_out_date'] ?? '';

$params = [];
$dateCondition = '';

if ($checkInDate && $checkOutDate) {
    $dateCondition = "
        AND NOT EXISTS (
            SELECT 1
            FROM bookings bk
            WHERE bk.unit_id = u.unit_id
              AND bk.check_in_date < :check_out_date
              AND bk.check_out_date > :check_in_date
              AND bk.status NOT IN ('cancelled', 'rejected')
        )
    ";

    $params[':check_in_date'] = $checkInDate;
    $params[':check_out_date'] = $checkOutDate;
} elseif ($checkInDate) {
    $dateCondition = "
        AND NOT EXISTS (
            SELECT 1
            FROM bookings bk
            WHERE bk.unit_id = u.unit_id
              AND bk.check_in_date <= :selected_date
              AND bk.check_out_date > :selected_date
              AND bk.status NOT IN ('cancelled', 'rejected')
        )
    ";

    $params[':selected_date'] = $checkInDate;
}

$stmt = $pdo->prepare(
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
        u.status,
        GROUP_CONCAT(DISTINCT a.amenity_name ORDER BY a.amenity_name SEPARATOR ', ') AS amenities
    FROM buildings b
    INNER JOIN units u ON b.building_id = u.building_id
    LEFT JOIN unit_amenity ua ON ua.unit_id = u.unit_id
    LEFT JOIN unit_amenities a ON a.amenity_id = ua.amenity_id
    WHERE u.status = 'available'
    $dateCondition
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

$stmt->execute($params);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
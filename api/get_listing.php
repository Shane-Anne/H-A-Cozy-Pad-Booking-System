<?php
require "db.php";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$buildingId = (int) ($_GET['building_id'] ?? 0);

if (!$buildingId) {
    http_response_code(400);
    echo json_encode(['error' => 'Building ID is required']);
    exit;
}

$stmt = $pdo->prepare(
    'SELECT
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
    LEFT JOIN units u ON b.building_id = u.building_id
    WHERE b.building_id = ?'
);

$stmt->execute([$buildingId]);

$listing = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$listing) {
    http_response_code(404);
    echo json_encode(['error' => 'Listing not found']);
    exit;
}

echo json_encode($listing);
?>

<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$buildingName = trim($data['buildingName'] ?? '');
$location = trim($data['location'] ?? '');
$unitName = trim($data['unitName'] ?? 'Entire place');
$description = trim($data['description'] ?? '');
$maxGuests = (int) ($data['maxGuests'] ?? 0);
$ratePerNight = (float) ($data['ratePerNight'] ?? 0);
$amenities = $data['amenities'] ?? [];

if (!$buildingName || !$location || !$description || $maxGuests < 1 || $ratePerNight <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Complete the required listing fields']);
    exit;
}

if (!is_array($amenities)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amenities']);
    exit;
}

try {
    $pdo->beginTransaction();

    $building = $pdo->prepare(
        'INSERT INTO buildings (building_name, location) VALUES (?, ?)'
    );
    $building->execute([$buildingName, $location]);
    $buildingId = $pdo->lastInsertId();

    $unit = $pdo->prepare(
        'INSERT INTO units
        (building_id, unit_name, description, max_guests, rate_per_night)
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

    $saveAmenity = $pdo->prepare(
        'INSERT INTO unit_amenities (amenity_name) VALUES (?)
         ON DUPLICATE KEY UPDATE amenity_id = LAST_INSERT_ID(amenity_id)'
    );
    $linkAmenity = $pdo->prepare(
        'INSERT IGNORE INTO unit_amenity (unit_id, amenity_id) VALUES (?, ?)'
    );

    foreach ($amenities as $amenityName) {
        $saveAmenity->execute([trim($amenityName)]);
        $linkAmenity->execute([$unitId, $pdo->lastInsertId()]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'buildingId' => (int) $buildingId,
        'unitId' => (int) $unitId,
    ]);
} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(['error' => 'Listing creation failed']);
}

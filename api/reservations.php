<?php
require 'db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

if (!in_array(strtolower($_SESSION['role'] ?? ''), ['admin', 'assistant'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Host access required']);
    exit;
}

$expireBookings = $pdo->prepare(
    'UPDATE bookings
     SET status = \'rejected\'
     WHERE status NOT IN (\'cancelled\', \'rejected\')
     AND check_out_date < CURDATE()'
);
$expireBookings->execute();

$stmt = $pdo->query(
    'SELECT
        b.booking_id,
        b.check_in_date,
        b.check_out_date,
        b.num_of_guests,
        b.status,
        u.unit_id,
        u.unit_name,
        bu.building_name,
        bu.location,
        usr.full_name AS guest_name,
        usr.email AS guest_email,
        usr.contact_num AS guest_contact_num,
        bd.guest_name AS booked_guest_name,
        bd.guest_contact_num AS booked_guest_contact_num,
        bd.valid_id_path,
        bd.vehicle_type,
        bd.special_requests
     FROM bookings b
     JOIN customer_profiles cp ON cp.customer_id = b.customer_id
     JOIN users usr ON usr.user_id = cp.user_id
     JOIN units u ON u.unit_id = b.unit_id
     JOIN buildings bu ON bu.building_id = u.building_id
    LEFT JOIN booking_details bd ON bd.booking_id = b.booking_id
     ORDER BY b.check_in_date ASC, b.created_at DESC'
);

echo json_encode(['reservations' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
?>

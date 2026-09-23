<?php
require 'db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'error' => 'Authentication required'
    ]);
    exit;
}

if (!in_array(strtolower($_SESSION['role'] ?? ''), ['admin', 'assistant'], true)) {
    http_response_code(403);
    echo json_encode([
        'error' => 'Host access required'
    ]);
    exit;
}

$bookingId = $_GET['bookingId'] ?? null;

if (!$bookingId || !ctype_digit((string) $bookingId)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'A valid booking ID is required'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        'SELECT
            b.booking_id,
            cp.customer_id,
            usr.user_id,
            usr.full_name,
            usr.email,
            usr.contact_num,
            bd.guest_name,
            bd.guest_contact_num,
            bd.valid_id_path,
            bd.vehicle_type,
            bd.special_requests

         FROM bookings b

         JOIN customer_profiles cp
            ON cp.customer_id = b.customer_id

         JOIN users usr
            ON usr.user_id = cp.user_id

         LEFT JOIN booking_details bd
            ON bd.booking_id = b.booking_id

         WHERE b.booking_id = ?'
    );

    $stmt->execute([$bookingId]);

    $customer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$customer) {
        http_response_code(404);
        echo json_encode([
            'error' => 'Customer information not found'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'customer' => [
            'bookingId' => (int) $customer['booking_id'],
            'customerId' => (int) $customer['customer_id'],
            'userId' => (int) $customer['user_id'],
            'fullName' => $customer['full_name'],
            'email' => $customer['email'],
            'contactNum' => $customer['contact_num'],
            'bookedGuestName' => $customer['guest_name'],
            'bookedGuestContactNum' => $customer['guest_contact_num'],
            'validIdPath' => $customer['valid_id_path'],
            'vehicleType' => $customer['vehicle_type'],
            'specialRequests' => $customer['special_requests'],
        ]
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Unable to load customer information'
    ]);
}
?>

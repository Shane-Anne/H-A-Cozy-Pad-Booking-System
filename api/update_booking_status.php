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

if (strtolower($_SESSION['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Admin access required']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$bookingId = (int) ($data['bookingId'] ?? 0);
$status = strtolower(trim($data['status'] ?? ''));

if ($bookingId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid booking ID']);
    exit;
}

if (!in_array($status, ['confirmed', 'rejected'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid booking status']);
    exit;
}

$stmt = $pdo->prepare(
    'UPDATE bookings
     SET status = ?
     WHERE booking_id = ?
       AND status IN ("pending", "awaiting_payment", "payment_review")'
);

$stmt->execute([$status, $bookingId]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Booking not found or already processed']);
    exit;
}

echo json_encode([
    'success' => true,
    'bookingId' => $bookingId,
    'status' => $status
]);
?>
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

$data = json_decode(file_get_contents('php://input'), true);

$bookingId = (int) ($data['bookingId'] ?? 0);
$requestType = strtolower(trim($data['requestType'] ?? ''));
$requestReason = trim($data['requestReason'] ?? '');

$requestedCheckIn = trim($data['requestedCheckIn'] ?? '');
$requestedCheckOut = trim($data['requestedCheckOut'] ?? '');
$requestedGuests = (int) ($data['requestedGuests'] ?? 0);
$requestedSpecialRequests = trim($data['requestedSpecialRequests'] ?? '');

if ($bookingId <= 0) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid booking ID'
    ]);
    exit;
}

if (!in_array($requestType, ['cancellation', 'modification'], true)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid request type'
    ]);
    exit;
}

if ($requestReason === '') {
    http_response_code(400);
    echo json_encode([
        'error' => 'A reason or request description is required'
    ]);
    exit;
}

if ($requestType === 'modification') {
    if ($requestedCheckIn === '' || $requestedCheckOut === '') {
        http_response_code(400);
        echo json_encode([
            'error' => 'Check-in and check-out dates are required'
        ]);
        exit;
    }

    if ($requestedGuests <= 0) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Number of guests must be greater than zero'
        ]);
        exit;
    }

    if ($requestedCheckOut <= $requestedCheckIn) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Check-out date must be after check-in date'
        ]);
        exit;
    }
}

try {
    $customer = $pdo->prepare(
        'SELECT customer_id
         FROM customer_profiles
         WHERE user_id = ?'
    );

    $customer->execute([$_SESSION['user_id']]);
    $customerId = $customer->fetchColumn();

    if (!$customerId) {
        http_response_code(403);
        echo json_encode([
            'error' => 'Only customer accounts can submit booking requests'
        ]);
        exit;
    }

    $booking = $pdo->prepare(
        'SELECT booking_id
         FROM bookings
         WHERE booking_id = ?
         AND customer_id = ?'
    );

    $booking->execute([
        $bookingId,
        $customerId
    ]);

    if (!$booking->fetch()) {
        http_response_code(404);
        echo json_encode([
            'error' => 'Booking not found'
        ]);
        exit;
    }

    $existingRequest = $pdo->prepare(
        'SELECT request_id
         FROM booking_requests
         WHERE booking_id = ?
         AND request_status = \'pending\'
         LIMIT 1'
    );

    $existingRequest->execute([$bookingId]);

    if ($existingRequest->fetch()) {
        http_response_code(409);
        echo json_encode([
            'error' => 'This booking already has a pending request'
        ]);
        exit;
    }

    if ($requestType === 'modification') {
        $request = $pdo->prepare(
            'INSERT INTO booking_requests
                (
                    booking_id,
                    request_type,
                    request_reason,
                    request_status,
                    requested_check_in,
                    requested_check_out,
                    requested_guests,
                    requested_special_requests
                )
             VALUES (?, ?, ?, \'pending\', ?, ?, ?, ?)'
        );

        $request->execute([
            $bookingId,
            $requestType,
            $requestReason,
            $requestedCheckIn,
            $requestedCheckOut,
            $requestedGuests,
            $requestedSpecialRequests
        ]);
    } else {
        $request = $pdo->prepare(
            'INSERT INTO booking_requests
                (
                    booking_id,
                    request_type,
                    request_reason,
                    request_status
                )
             VALUES (?, ?, ?, \'pending\')'
        );

        $request->execute([
            $bookingId,
            $requestType,
            $requestReason
        ]);
    }

    echo json_encode([
        'success' => true,
        'requestId' => (int) $pdo->lastInsertId(),
        'bookingId' => $bookingId,
        'requestType' => $requestType,
        'requestStatus' => 'pending'
    ]);

} catch (Throwable $error) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Unable to submit booking request'
    ]);
}

<?php

require_once "db.php";

header("Content-Type: application/json");

try {

    // Check if customer is logged in
    if (!isset($_SESSION["user_id"])) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "error" => "Not logged in"
        ]);

        exit;
    }

    // Get form data
    $bookingId = $_POST["bookingId"] ?? null;
    $requestType = $_POST["requestType"] ?? null;
    $reason = trim($_POST["reason"] ?? "");

    // Validate required fields
    if (!$bookingId || !$requestType || $reason === "") {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "error" => "Booking, request type, and reason are required"
        ]);

        exit;
    }

    // Validate request type
    if (!in_array($requestType, ["cancel", "change"], true)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "error" => "Invalid request type"
        ]);

        exit;
    }

    // Get customer profile
    $stmt = $pdo->prepare("
        SELECT customer_id
        FROM customer_profiles
        WHERE user_id = ?
        LIMIT 1
    ");

    $stmt->execute([
        $_SESSION["user_id"]
    ]);

    $customer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$customer) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "error" => "Customer profile not found"
        ]);

        exit;
    }

    // Verify booking belongs to customer
    $stmt = $pdo->prepare("
        SELECT booking_id
        FROM bookings
        WHERE booking_id = ?
        AND customer_id = ?
        LIMIT 1
    ");

    $stmt->execute([
        $bookingId,
        $customer["customer_id"]
    ]);

    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "error" => "Booking not found"
        ]);

        exit;
    }

    // Check for an existing pending request
    $stmt = $pdo->prepare("
        SELECT request_id
        FROM booking_requests
        WHERE booking_id = ?
        AND request_type = ?
        AND status = 'pending'
        LIMIT 1
    ");

    $stmt->execute([
        $bookingId,
        $requestType
    ]);

    if ($stmt->fetch()) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "error" => "A request is already pending for this booking"
        ]);

        exit;
    }

    // Create booking request
    $stmt = $pdo->prepare("
        INSERT INTO booking_requests (
            booking_id,
            request_type,
            reason
        )
        VALUES (?, ?, ?)
    ");

    $stmt->execute([
        $bookingId,
        $requestType,
        $reason
    ]);

    // Return success response
    echo json_encode([
        "success" => true,
        "message" => "Request submitted successfully",
        "requestId" => (int) $pdo->lastInsertId()
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "An unexpected server error occurred"
    ]);
}
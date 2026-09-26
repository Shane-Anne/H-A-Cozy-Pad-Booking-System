<?php

require_once "db.php";

header("Content-Type: application/json");

session_start();

try {

    if (!isset($_SESSION["user_id"])) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "error" => "Not logged in"
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        SELECT
            br.request_id,
            br.booking_id,
            br.request_type,
            br.reason,
            br.status AS request_status,
            br.created_at,

            b.check_in_date,
            b.check_out_date,
            b.num_of_guests,
            b.status AS booking_status,

            cp.customer_id,

            bd.guest_name,
            bd.guest_contact_num,
            bd.vehicle_type,
            bd.special_requests,

            u.unit_name

        FROM booking_requests br

        INNER JOIN bookings b
            ON br.booking_id = b.booking_id

        INNER JOIN customer_profiles cp
            ON b.customer_id = cp.customer_id

        LEFT JOIN booking_details bd
            ON b.booking_id = bd.booking_id

        LEFT JOIN units u
            ON b.unit_id = u.unit_id

        WHERE br.status = 'pending'

        ORDER BY br.created_at DESC
    ");

    $stmt->execute();

    $requests = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $requests[] = [
            "requestId" => (int)$row["request_id"],
            "bookingId" => (int)$row["booking_id"],
            "requestType" => $row["request_type"],
            "reason" => $row["reason"],
            "requestStatus" => $row["request_status"],
            "createdAt" => $row["created_at"],

            "unitName" => $row["unit_name"],

            "checkIn" => $row["check_in_date"],
            "checkOut" => $row["check_out_date"],
            "guests" => (int)$row["num_of_guests"],

            "bookingStatus" => $row["booking_status"],

            "customerId" => (int)$row["customer_id"],
            "guestName" => $row["guest_name"],
            "guestContactNum" => $row["guest_contact_num"],
            "vehicleType" => $row["vehicle_type"],
            "specialRequests" => $row["special_requests"]
        ];
    }

    echo json_encode([
        "success" => true,
        "requests" => $requests
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
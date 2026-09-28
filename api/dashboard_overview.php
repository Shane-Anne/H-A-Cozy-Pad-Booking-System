<?php

header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

if (!in_array($_SESSION['role'] ?? '', ['admin', 'assistant'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

try {
    $statsQuery = $pdo->query("
        SELECT
            (SELECT COUNT(*) FROM bookings) AS total_bookings,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status IN ('confirmed', 'checked_in')
                AND check_in_date <= CURDATE()
                AND check_out_date > CURDATE()
            ) AS active_stays,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'pending'
            ) AS pending_bookings,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'payment_review'
            ) AS payment_reviews,

            (
                SELECT COUNT(*)
                FROM units
                WHERE status = 'available'
            ) AS available_units,

            (
                SELECT COUNT(*)
                FROM units
                WHERE status = 'occupied'
            ) AS occupied_units,

            (
                SELECT COUNT(*)
                FROM buildings
            ) AS total_properties,

            (
                SELECT COUNT(*)
                FROM users
                WHERE role = 'customer'
            ) AS total_customers,

            (
                SELECT COALESCE(SUM(amount), 0)
                FROM payments
                WHERE payment_status = 'verified'
            ) AS verified_revenue
    ");

    $stats = $statsQuery->fetch(PDO::FETCH_ASSOC);

    $summaryQuery = $pdo->query("
        SELECT
            status,
            COUNT(*) AS total
        FROM bookings
        GROUP BY status
    ");

    $bookingSummary = [
        'pending' => 0,
        'awaiting_payment' => 0,
        'payment_review' => 0,
        'confirmed' => 0,
        'checked_in' => 0,
        'checked_out' => 0,
        'cancelled' => 0,
        'rejected' => 0
    ];

    while ($row = $summaryQuery->fetch(PDO::FETCH_ASSOC)) {
        $bookingSummary[$row['status']] = (int) $row['total'];
    }

    $upcomingQuery = $pdo->query("
        SELECT
            b.booking_id,
            b.check_in_date,
            b.check_out_date,
            b.num_of_guests,
            b.status,
            u.unit_name,
            bu.building_name,
            bu.location,
            COALESCE(bd.guest_name, cu.full_name) AS guest_name
        FROM bookings b
        INNER JOIN units u
            ON b.unit_id = u.unit_id
        INNER JOIN buildings bu
            ON u.building_id = bu.building_id
        INNER JOIN customer_profiles cp
            ON b.customer_id = cp.customer_id
        INNER JOIN users cu
            ON cp.user_id = cu.user_id
        LEFT JOIN booking_details bd
            ON b.booking_id = bd.booking_id
        WHERE b.check_out_date >= CURDATE()
        AND b.status NOT IN ('cancelled', 'rejected', 'checked_out')
        ORDER BY b.check_in_date ASC, b.created_at ASC
        LIMIT 5
    ");

    $upcomingReservations = $upcomingQuery->fetchAll(PDO::FETCH_ASSOC);

    foreach ($upcomingReservations as &$reservation) {
        $reservation['booking_id'] = (int) $reservation['booking_id'];
        $reservation['num_of_guests'] = (int) $reservation['num_of_guests'];
    }

    unset($reservation);

    $recentPaymentsQuery = $pdo->query("
        SELECT
            p.payment_id,
            p.amount,
            p.payment_method,
            p.payment_status,
            p.created_at,
            b.booking_id,
            COALESCE(bd.guest_name, cu.full_name) AS guest_name,
            bu.building_name,
            u.unit_name
        FROM payments p
        INNER JOIN bookings b
            ON p.booking_id = b.booking_id
        INNER JOIN customer_profiles cp
            ON b.customer_id = cp.customer_id
        INNER JOIN users cu
            ON cp.user_id = cu.user_id
        INNER JOIN units u
            ON b.unit_id = u.unit_id
        INNER JOIN buildings bu
            ON u.building_id = bu.building_id
        LEFT JOIN booking_details bd
            ON b.booking_id = bd.booking_id
        ORDER BY p.created_at DESC
        LIMIT 5
    ");

    $recentPayments = $recentPaymentsQuery->fetchAll(PDO::FETCH_ASSOC);

    foreach ($recentPayments as &$payment) {
        $payment['payment_id'] = (int) $payment['payment_id'];
        $payment['booking_id'] = (int) $payment['booking_id'];
        $payment['amount'] = (float) $payment['amount'];
    }

    unset($payment);

    echo json_encode([
        'stats' => [
            'totalBookings' => (int) $stats['total_bookings'],
            'activeStays' => (int) $stats['active_stays'],
            'pendingBookings' => (int) $stats['pending_bookings'],
            'paymentReviews' => (int) $stats['payment_reviews'],
            'availableUnits' => (int) $stats['available_units'],
            'occupiedUnits' => (int) $stats['occupied_units'],
            'totalProperties' => (int) $stats['total_properties'],
            'totalCustomers' => (int) $stats['total_customers'],
            'verifiedRevenue' => (float) $stats['verified_revenue']
        ],
        'bookingSummary' => $bookingSummary,
        'upcomingReservations' => $upcomingReservations,
        'recentPayments' => $recentPayments
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Unable to load dashboard overview'
    ]);
}
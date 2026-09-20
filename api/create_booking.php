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

$data = $_POST ?: (json_decode(file_get_contents('php://input'), true) ?? []);
$unitId = (int) ($data['unitId'] ?? 0);
$checkIn = trim($data['checkIn'] ?? '');
$checkOut = trim($data['checkOut'] ?? '');
$guests = (int) ($data['guests'] ?? 1);
$guestName = trim($data['guestName'] ?? '');
$guestContactNum = trim($data['guestContactNum'] ?? '');
$validIdPath = 'not_uploaded';
$vehicleType = trim($data['vehicleType'] ?? '');
$specialRequests = trim($data['specialRequests'] ?? '');

if (!$unitId || !$checkIn || !$checkOut || $guests < 1 || !$guestName || !$guestContactNum) {
    http_response_code(400);
    echo json_encode(['error' => 'Unit, dates, guest count, name, and contact number are required']);
    exit;
}

if (strlen($guestName) > 50 || !preg_match('/^[0-9]{11}$/', $guestContactNum)) {
    http_response_code(400);
    echo json_encode(['error' => 'Guest name or contact number is invalid']);
    exit;
}

$checkInDate = DateTime::createFromFormat('Y-m-d', $checkIn);
$checkOutDate = DateTime::createFromFormat('Y-m-d', $checkOut);
if (!$checkInDate || !$checkOutDate || $checkOutDate <= $checkInDate) {
    http_response_code(400);
    echo json_encode(['error' => 'Check-out must be after check-in']);
    exit;
}

try {
    $customer = $pdo->prepare(
        'SELECT customer_id FROM customer_profiles WHERE user_id = ?'
    );
    $customer->execute([$_SESSION['user_id']]);
    $customerId = $customer->fetchColumn();

    if (!$customerId) {
        http_response_code(400);
        echo json_encode(['error' => 'Only customer accounts can make bookings']);
        exit;
    }

    $unit = $pdo->prepare('SELECT unit_id, max_guests FROM units WHERE unit_id = ?');
    $unit->execute([$unitId]);
    $unitData = $unit->fetch(PDO::FETCH_ASSOC);

    if (!$unitData) {
        http_response_code(404);
        echo json_encode(['error' => 'Unit not found']);
        exit;
    }

    if ($guests > (int) $unitData['max_guests']) {
        http_response_code(400);
        echo json_encode(['error' => 'Guest count exceeds the unit limit']);
        exit;
    }

    $pdo->beginTransaction();

    // Lock the room row while checking and creating the booking so concurrent users cannot claim it together.
    $lockedUnit = $pdo->prepare('SELECT unit_id FROM units WHERE unit_id = ? FOR UPDATE');
    $lockedUnit->execute([$unitId]);

    $overlap = $pdo->prepare(
        'SELECT booking_id FROM bookings
         WHERE unit_id = ?
         AND status NOT IN (\'cancelled\', \'rejected\')
         AND check_in_date < ? AND check_out_date > ?
         LIMIT 1'
    );
    $overlap->execute([$unitId, $checkOut, $checkIn]);

    if ($overlap->fetch()) {
        $pdo->rollBack();
        http_response_code(409);
        echo json_encode(['error' => 'This room is already booked for some or all of those dates']);
        exit;
    }

    $booking = $pdo->prepare(
        'INSERT INTO bookings (customer_id, unit_id, check_in_date, check_out_date, num_of_guests, status)
         VALUES (?, ?, ?, ?, ?, \'awaiting_payment\')'
    );
    $booking->execute([$customerId, $unitId, $checkIn, $checkOut, $guests]);
    $bookingId = (int) $pdo->lastInsertId();

    $uploadDirectory = __DIR__ . '/uploads/bookings/' . $bookingId;
    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
        throw new RuntimeException('Unable to create upload directory');
    }

    $saveUpload = static function (string $field, string $prefix) use ($uploadDirectory, $bookingId): ?string {
        if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        if ($_FILES[$field]['error'] !== UPLOAD_ERR_OK || $_FILES[$field]['size'] > 1024 * 1024) {
            throw new RuntimeException('Uploaded images must be JPG or PNG files smaller than 1 MB');
        }
        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($_FILES[$field]['tmp_name']);
        $extension = ['image/jpeg' => 'jpg', 'image/png' => 'png'][$mimeType] ?? null;
        if (!$extension) {
            throw new RuntimeException('Uploaded images must be JPG or PNG files');
        }
        $relativePath = 'uploads/bookings/' . $bookingId . '/' . $prefix . '.' . $extension;
        if (!move_uploaded_file($_FILES[$field]['tmp_name'], __DIR__ . '/' . $relativePath)) {
            throw new RuntimeException('Unable to save uploaded image');
        }
        return $relativePath;
    };

    $validIdPath = $saveUpload('govId', 'government-id') ?? 'not_uploaded';
    $proofOfPaymentPath = $saveUpload('proofOfPayment', 'proof-of-payment');

    $details = $pdo->prepare(
        'INSERT INTO booking_details
            (booking_id, guest_name, guest_contact_num, valid_id_path, vehicle_type, special_requests)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $details->execute([
        $bookingId,
        $guestName,
        $guestContactNum,
        $validIdPath,
        $vehicleType ?: null,
        $specialRequests ?: null,
    ]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'bookingId' => $bookingId,
        'status' => 'awaiting_payment',
        'proofOfPaymentPath' => $proofOfPaymentPath,
    ]);
} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Unable to create booking']);
}
?>

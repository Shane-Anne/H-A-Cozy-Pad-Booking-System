ALTER TABLE booking_requests
    MODIFY request_type ENUM('cancel', 'change', 'cancellation', 'modification') NOT NULL;

UPDATE booking_requests
SET request_type = CASE request_type
    WHEN 'cancel' THEN 'cancellation'
    WHEN 'change' THEN 'modification'
    ELSE request_type
END;

ALTER TABLE booking_requests
    MODIFY request_type ENUM('cancellation', 'modification') NOT NULL,
    CHANGE COLUMN reason request_reason TEXT NOT NULL,
    CHANGE COLUMN status request_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    ADD COLUMN requested_check_in DATE NULL AFTER request_status,
    ADD COLUMN requested_check_out DATE NULL AFTER requested_check_in,
    ADD COLUMN requested_guests INT NULL AFTER requested_check_out,
    ADD COLUMN requested_special_requests TEXT NULL AFTER requested_guests,
    ADD COLUMN payment_amount DECIMAL(10,2) NULL AFTER requested_special_requests,
    ADD COLUMN refund_amount DECIMAL(10,2) NULL AFTER payment_amount,
    ADD COLUMN proof_of_payment VARCHAR(255) NULL AFTER refund_amount,
    ADD COLUMN payment_status ENUM('not_required', 'pending', 'verified', 'rejected') NOT NULL DEFAULT 'not_required' AFTER proof_of_payment,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
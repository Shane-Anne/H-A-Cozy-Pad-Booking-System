ALTER TABLE payments
    MODIFY verified_at DATETIME NULL;

ALTER TABLE bookings
    ADD COLUMN cancellation_reason TEXT NULL,
    ADD COLUMN cancelled_at DATETIME NULL;

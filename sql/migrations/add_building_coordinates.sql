ALTER TABLE buildings
    ADD COLUMN latitude decimal(10, 7) null AFTER location,
    ADD COLUMN longitude decimal(10, 7) null AFTER latitude;

    
ALTER TABLE payments
    MODIFY verified_at DATETIME NULL;

ALTER TABLE bookings
    ADD COLUMN cancellation_reason TEXT NULL,
    ADD COLUMN cancelled_at DATETIME NULL;
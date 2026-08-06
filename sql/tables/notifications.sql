create table notifications(
    notification_id int auto_increment primary key,
    user_id int not null,
    booking_id int null,
    type enum('booking', 'payment', 'reminder', 'cancellation', 'system') not null,
    message text not null,
    is_read boolean not null default false,
    sent_at datetime not null,
    created_at timestamp default current_timestamp,
    constraint fk_notification_user
        foreign key (user_id)
        references users(user_id)
        on delete cascade,
    constraint fk_notification_booking
        foreign key (booking_id)
        references bookings(booking_id)
        on delete set null
);
/*
    CREATE TABLE notifications (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        booking_id INT NULL,
        type ENUM('booking', 'payment', 'reminder', 'cancellation', 'system') NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        sent_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_notification_user
            FOREIGN KEY (user_id)
            REFERENCES users(user_id)
            ON DELETE CASCADE,
        CONSTRAINT fk_notification_booking
            FOREIGN KEY (booking_id)
            REFERENCES bookings(booking_id)
            ON DELETE SET NULL
    );
*/
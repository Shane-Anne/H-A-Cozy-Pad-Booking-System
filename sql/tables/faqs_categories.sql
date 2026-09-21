create table faqs_categories(
    category_id int auto_increment primary key,
    category_name varchar(50) not null unique,
    created_at timestamp default current_timestamp
);

INSERT INTO faqs_categories (category_name) VALUES
('Bookings and Reservations'), -- category_id 1
('Payments & Fees'),           -- category_id 2
('Accommodations & Amenities'),-- category_id 3
('Policies & House Rules'),    -- category_id 4
('Location & Support');        -- category_id 5
create table units(
    unit_id int auto_increment primary key,
    building_id int not null,
    unit_name varchar(100) not null,
    description text null,
    max_guests int not null default 1,
    rate_per_night decimal(10, 2) not null,
    status enum('available', 'occupied', 'maintenance', 'unavailable') not null default 'available',
    created_at timestamp default current_timestamp,
    constraint fk_unit_building
        foreign key (building_id)
        references buildings(building_id)
        on delete cascade
);
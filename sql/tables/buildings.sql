create table buildings(
    building_id int auto_increment primary key,
    building_name varchar(100) not null,
    location varchar(150) not null,
    created_at timestamp default current_timestamp
);
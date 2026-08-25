create table admin_profiles(
    admin_id int auto_increment primary key,
    user_id int not null unique,
    position enum('admin', 'assistant') not null,
    created_at timestamp default current_timestamp,
    foreign key (user_id)
        references users(user_id)
        on delete cascade
);
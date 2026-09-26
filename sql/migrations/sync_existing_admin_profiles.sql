INSERT INTO admin_profiles (user_id, position)
SELECT users.user_id, users.role
FROM users
LEFT JOIN admin_profiles
    ON admin_profiles.user_id = users.user_id
WHERE users.role IN ('admin', 'assistant')
  AND admin_profiles.admin_id IS NULL;
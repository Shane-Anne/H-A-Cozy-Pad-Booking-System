<?php
    require 'db.php';
    session_start();
    
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['loggedIn' => false]);
        exit;
    }
    
    $stmt = $pdo->prepare('SELECT user_id, full_name, email, role FROM users WHERE user_id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(['loggedIn' => false]);
        exit;
    }
    
    echo json_encode([
        'loggedIn' => true,
        'user' => [
            'id' => $user['user_id'],
            'fullName' => $user['full_name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ],
    ]);
?>
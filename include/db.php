<?php
    $host = "localhost";
    $username = "root";
    $password = "";
    $db = "ha_cozy_pad_db";
    
    try {
        $pdo = new PDO (
            "mysql:host=$host,dbname=$db;charset=utf8mb4", 
            $username, 
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ],
        );
    } catch(PDOException $e) {
        exit("Database connection failed: " . $e->getMessage());
    }
?>
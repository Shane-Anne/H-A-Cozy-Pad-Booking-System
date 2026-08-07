<?php
    if(session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }

    function requireLogin() {
        if(!isLoggedIn()) {
            header('Location: ../login.php');
            exit;
        }
    }

    function requireRole(array $allowedRoles) {
        requireLogin();
        if(!in_array($_SESSION['role'], $allowedRoles, true)) {
            header('Location: ../index.php?error=unauthorized');
            exit;
        }
    }

    function isAdmin() {
        return isset($_SESSION['role']) && in_array($_SESSION['role'], ['admin', 'assistant'], true);
    }

    function currentUserName() {
        return $_SESSION['fullname'] ?? 'Guest';
    }

    function loggetOut() {
        session_unset();
        session_destroy();
        header('Location: ../login.php');
        exit;
    }
?>
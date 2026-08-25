<?php
    if(session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $pageTitle = $pageTitle ?? 'H&A Cozy Pad';
    $currentPage = basename($_SERVER['PHP_SELF']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?=  htmlspecialchars($pageTitle) ?>| H&A Cozy Pad</title>
    <!-- Paki add here pls ang location ng css -->
    <link rel="stylesheet" href="">
    <!-- Internet's Icon Library -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body>
    <header class="main-header">
        <a class="logo" href="/index.php"> <span>H&A</span> Cozy Pad </a>

        <nav>
            <a href="/index.php" class="<?= $currentPage === 'index.php' ? 'active' : '' ?>"> Home </a>
            <a href="/units.php" class="<?= $currentPage === 'units.php' ? 'active' : '' ?>"> Units </a>
            <a href="/faq.php" class="<?= $currentPage === 'faq.php' ? 'active' : '' ?>"> FAQ </a>

            <?php if(isset($_SESSION['user_id'])): ?>
                <?php if ($_SESSION['role'] === 'admin' || $_SESSION['role'] === 'assistant'): ?>
                    <a href="/admin/dashboard.php">Dashboard</a>
                <?php else: ?>
                    <a href="/my-bookins.php">My Bookings</a>
                <?php endif; ?>

                <a href="/logout.php" class="logout-link">Logout</a>
            <?php else: ?>
                <a href="/login.php">Login</a>
                <a href="/register.php" class="button-link">Book now</a>
            <?php endif; ?> 
        </nav>
    </header>

    <main class="page-content"></main>

    <footer class="main-footer">
        <div>
            <strong>H&A Cozy Pad</strong>
            <p>Hotel-like Staycation</p>
        </div>

        <div>
            <p>&copy; <?= date("Y") ?> H&A Cozy Pad. All Rights Reserved.</p>
        </div>
    </footer>
    
    <!-- lagay here location of javascript pls -->
    <script></script>
</body>
</html>
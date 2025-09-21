<?php
session_start();
require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $password = $_POST['password'];
    
    // Simple admin password check
    if ($password === 'admin123') {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['message'] = 'Admin login successful!';
        $_SESSION['message_type'] = 'success';
        header('Location: index.php?page=admin-dashboard');
    } else {
        $_SESSION['message'] = 'Invalid admin password';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=admin');
    }
} else {
    header('Location: index.php?page=admin');
}
?>

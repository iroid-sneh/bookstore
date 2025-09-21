<?php
session_start();
require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Simple validation
    if (empty($email) || empty($password)) {
        $_SESSION['message'] = 'Please fill in all fields';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=login');
        exit;
    }
    
    // Check user credentials
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND password = ? AND is_active = 1");
    $stmt->execute([$email, $password]);
    $user = $stmt->fetch();
    
    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        
        $_SESSION['message'] = 'Welcome back, ' . $user['name'] . '!';
        $_SESSION['message_type'] = 'success';
        header('Location: index.php');
    } else {
        $_SESSION['message'] = 'Invalid email or password';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=login');
    }
} else {
    header('Location: index.php?page=login');
}
?>

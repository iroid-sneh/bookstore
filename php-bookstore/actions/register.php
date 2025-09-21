<?php
session_start();
require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Simple validation
    if (empty($name) || empty($email) || empty($phone) || empty($password) || empty($confirm_password)) {
        $_SESSION['message'] = 'Please fill in all fields';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=register');
        exit;
    }
    
    if ($password !== $confirm_password) {
        $_SESSION['message'] = 'Passwords do not match';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=register');
        exit;
    }
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        $_SESSION['message'] = 'Email already exists';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=register');
        exit;
    }
    
    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$name, $email, $phone, $password])) {
        $_SESSION['message'] = 'Registration successful! Please login.';
        $_SESSION['message_type'] = 'success';
        header('Location: index.php?page=login');
    } else {
        $_SESSION['message'] = 'Registration failed. Please try again.';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=register');
    }
} else {
    header('Location: index.php?page=register');
}
?>

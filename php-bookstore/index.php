<?php
session_start();
require_once 'config/database.php';

// Simple routing
$page = $_GET['page'] ?? 'home';

// Include header
include 'includes/header.php';

// Route to appropriate page
switch($page) {
    case 'admin':
        include 'pages/admin/login.php';
        break;
    case 'admin-dashboard':
        include 'pages/admin/dashboard.php';
        break;
    case 'admin-books':
        include 'pages/admin/books.php';
        break;
    case 'admin-create':
        include 'pages/admin/create_book.php';
        break;
    case 'admin-edit':
        include 'pages/admin/edit_book.php';
        break;
    case 'login':
        include 'pages/customer/login.php';
        break;
    case 'register':
        include 'pages/customer/register.php';
        break;
    case 'book-details':
        include 'pages/customer/book_details.php';
        break;
    case 'cart':
        include 'pages/customer/cart.php';
        break;
    case 'checkout':
        include 'pages/customer/checkout.php';
        break;
    case 'orders':
        include 'pages/customer/orders.php';
        break;
    case 'profile':
        include 'pages/customer/profile.php';
        break;
    default:
        include 'pages/customer/home.php';
        break;
}

// Include footer
include 'includes/footer.php';
?>

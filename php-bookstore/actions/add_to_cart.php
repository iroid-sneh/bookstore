<?php
session_start();
require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_SESSION['user_id'])) {
        $_SESSION['message'] = 'Please login to add items to cart';
        $_SESSION['message_type'] = 'warning';
        header('Location: index.php?page=login');
        exit;
    }
    
    $book_id = $_POST['book_id'];
    $user_id = $_SESSION['user_id'];
    
    // Check if book exists and has stock
    $stmt = $pdo->prepare("SELECT * FROM books WHERE id = ? AND is_active = 1 AND stock > 0");
    $stmt->execute([$book_id]);
    $book = $stmt->fetch();
    
    if (!$book) {
        $_SESSION['message'] = 'Book not available';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php');
        exit;
    }
    
    // Check if item already in cart
    $stmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$user_id, $book_id]);
    $existing_item = $stmt->fetch();
    
    if ($existing_item) {
        // Update quantity
        $new_quantity = $existing_item['quantity'] + 1;
        if ($new_quantity <= $book['stock']) {
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND book_id = ?");
            $stmt->execute([$new_quantity, $user_id, $book_id]);
            $_SESSION['message'] = 'Cart updated successfully!';
            $_SESSION['message_type'] = 'success';
        } else {
            $_SESSION['message'] = 'Not enough stock available';
            $_SESSION['message_type'] = 'warning';
        }
    } else {
        // Add new item
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, 1)");
        $stmt->execute([$user_id, $book_id]);
        $_SESSION['message'] = 'Item added to cart successfully!';
        $_SESSION['message_type'] = 'success';
    }
    
    header('Location: index.php');
} else {
    header('Location: index.php');
}
?>

<?php
session_start();
require_once 'config/database.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: index.php?page=login');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $book_id = $_POST['book_id'];
    $action = $_POST['action'];
    $user_id = $_SESSION['user_id'];
    
    // Get current cart item
    $stmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$user_id, $book_id]);
    $cart_item = $stmt->fetch();
    
    if (!$cart_item) {
        $_SESSION['message'] = 'Item not found in cart';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=cart');
        exit;
    }
    
    // Get book stock
    $stmt = $pdo->prepare("SELECT stock FROM books WHERE id = ?");
    $stmt->execute([$book_id]);
    $book = $stmt->fetch();
    
    $new_quantity = $cart_item['quantity'];
    
    if ($action == 'increase') {
        if ($new_quantity < $book['stock']) {
            $new_quantity++;
        } else {
            $_SESSION['message'] = 'Not enough stock available';
            $_SESSION['message_type'] = 'warning';
            header('Location: index.php?page=cart');
            exit;
        }
    } elseif ($action == 'decrease') {
        if ($new_quantity > 1) {
            $new_quantity--;
        } else {
            // Remove item if quantity becomes 0
            $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND book_id = ?");
            $stmt->execute([$user_id, $book_id]);
            $_SESSION['message'] = 'Item removed from cart';
            $_SESSION['message_type'] = 'info';
            header('Location: index.php?page=cart');
            exit;
        }
    }
    
    // Update cart
    $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$new_quantity, $user_id, $book_id]);
    
    $_SESSION['message'] = 'Cart updated successfully';
    $_SESSION['message_type'] = 'success';
    header('Location: index.php?page=cart');
} else {
    header('Location: index.php?page=cart');
}
?>

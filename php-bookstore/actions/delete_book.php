<?php
session_start();
require_once 'config/database.php';

if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: index.php?page=admin');
    exit;
}

if (isset($_GET['id'])) {
    $book_id = $_GET['id'];
    
    try {
        $pdo->beginTransaction();
        
        // Remove book from all carts
        $stmt = $pdo->prepare("DELETE FROM cart WHERE book_id = ?");
        $stmt->execute([$book_id]);
        
        // Remove book from all order items
        $stmt = $pdo->prepare("DELETE FROM order_items WHERE book_id = ?");
        $stmt->execute([$book_id]);
        
        // Delete the book
        $stmt = $pdo->prepare("DELETE FROM books WHERE id = ?");
        $stmt->execute([$book_id]);
        
        $pdo->commit();
        
        $_SESSION['message'] = 'Book deleted successfully!';
        $_SESSION['message_type'] = 'success';
        
    } catch (Exception $e) {
        $pdo->rollBack();
        $_SESSION['message'] = 'Error deleting book. Please try again.';
        $_SESSION['message_type'] = 'danger';
    }
    
    header('Location: index.php?page=admin-dashboard');
} else {
    header('Location: index.php?page=admin-dashboard');
}
?>

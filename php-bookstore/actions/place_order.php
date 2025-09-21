<?php
session_start();
require_once 'config/database.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: index.php?page=login');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['user_id'];
    $street = $_POST['street'];
    $city = $_POST['city'];
    $state = $_POST['state'];
    $zip = $_POST['zip'];
    $save_address = isset($_POST['save_address']);
    
    // Get cart items
    $stmt = $pdo->prepare("
        SELECT c.*, b.title, b.author, b.price, b.stock 
        FROM cart c 
        JOIN books b ON c.book_id = b.id 
        WHERE c.user_id = ? 
        ORDER BY c.created_at DESC
    ");
    $stmt->execute([$user_id]);
    $cart_items = $stmt->fetchAll();
    
    if (empty($cart_items)) {
        $_SESSION['message'] = 'Your cart is empty';
        $_SESSION['message_type'] = 'warning';
        header('Location: index.php?page=cart');
        exit;
    }
    
    // Calculate total
    $total_amount = 0;
    foreach ($cart_items as $item) {
        $total_amount += $item['price'] * $item['quantity'];
    }
    
    try {
        $pdo->beginTransaction();
        
        // Create order
        $stmt = $pdo->prepare("
            INSERT INTO orders (user_id, total_amount, shipping_street, shipping_city, shipping_state, shipping_zip, status, payment_method, payment_status) 
            VALUES (?, ?, ?, ?, ?, ?, 'delivered', 'cod', 'paid')
        ");
        $stmt->execute([$user_id, $total_amount, $street, $city, $state, $zip]);
        $order_id = $pdo->lastInsertId();
        
        // Add order items
        foreach ($cart_items as $item) {
            $stmt = $pdo->prepare("
                INSERT INTO order_items (order_id, book_id, quantity, price) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$order_id, $item['book_id'], $item['quantity'], $item['price']]);
            
            // Update book stock
            $stmt = $pdo->prepare("UPDATE books SET stock = stock - ? WHERE id = ?");
            $stmt->execute([$item['quantity'], $item['book_id']]);
        }
        
        // Clear cart
        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt->execute([$user_id]);
        
        // Save address if requested
        if ($save_address) {
            $stmt = $pdo->prepare("
                UPDATE users 
                SET address_street = ?, address_city = ?, address_state = ?, address_zip = ? 
                WHERE id = ?
            ");
            $stmt->execute([$street, $city, $state, $zip, $user_id]);
        }
        
        $pdo->commit();
        
        $_SESSION['message'] = '🎉 Order placed successfully! Your order will be delivered to your address. Thank you for shopping with us!';
        $_SESSION['message_type'] = 'success';
        header('Location: index.php?page=orders');
        
    } catch (Exception $e) {
        $pdo->rollBack();
        $_SESSION['message'] = 'Error placing order. Please try again.';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=checkout');
    }
} else {
    header('Location: index.php?page=checkout');
}
?>

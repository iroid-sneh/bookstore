<?php
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php?page=login');
    exit;
}

$user_id = $_SESSION['user_id'];

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

// Get user details for address
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

$total_amount = 0;
foreach ($cart_items as $item) {
    $total_amount += $item['price'] * $item['quantity'];
}
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <h2><i class="fas fa-credit-card"></i> Checkout</h2>
        </div>
    </div>
    
    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5>Shipping Address</h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="actions/place_order.php">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="street" class="form-label">Street Address</label>
                                <input type="text" class="form-control" id="street" name="street" 
                                       value="<?php echo htmlspecialchars($user['address_street']); ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="city" class="form-label">City</label>
                                <input type="text" class="form-control" id="city" name="city" 
                                       value="<?php echo htmlspecialchars($user['address_city']); ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="state" class="form-label">State</label>
                                <input type="text" class="form-control" id="state" name="state" 
                                       value="<?php echo htmlspecialchars($user['address_state']); ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="zip" class="form-label">ZIP Code</label>
                                <input type="text" class="form-control" id="zip" name="zip" 
                                       value="<?php echo htmlspecialchars($user['address_zip']); ?>" required>
                            </div>
                        </div>
                        
                        <div class="card mt-4">
                            <div class="card-header">
                                <h6>Order Items</h6>
                            </div>
                            <div class="card-body">
                                <?php foreach ($cart_items as $item): ?>
                                    <div class="row align-items-center mb-2">
                                        <div class="col-md-6">
                                            <strong><?php echo htmlspecialchars($item['title']); ?></strong>
                                            <br>
                                            <small class="text-muted">by <?php echo htmlspecialchars($item['author']); ?></small>
                                        </div>
                                        <div class="col-md-2">
                                            <span>Qty: <?php echo $item['quantity']; ?></span>
                                        </div>
                                        <div class="col-md-2">
                                            <span>$<?php echo number_format($item['price'], 2); ?></span>
                                        </div>
                                        <div class="col-md-2">
                                            <strong>$<?php echo number_format($item['price'] * $item['quantity'], 2); ?></strong>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="save_address" name="save_address" checked>
                                <label class="form-check-label" for="save_address">
                                    Save this address for future orders
                                </label>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <button type="submit" class="btn btn-success btn-lg">
                                <i class="fas fa-check"></i> Place Order (Cash on Delivery)
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5>Order Summary</h5>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>$<?php echo number_format($total_amount, 2); ?></span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-3">
                        <strong>Total:</strong>
                        <strong>$<?php echo number_format($total_amount, 2); ?></strong>
                    </div>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <strong>Payment Method:</strong> Cash on Delivery
                        <br>
                        <small>You will pay when the order is delivered to your address.</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

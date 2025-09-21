<?php
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php?page=login');
    exit;
}

$user_id = $_SESSION['user_id'];

// Get cart items with book details
$stmt = $pdo->prepare("
    SELECT c.*, b.title, b.author, b.price, b.image, b.stock 
    FROM cart c 
    JOIN books b ON c.book_id = b.id 
    WHERE c.user_id = ? 
    ORDER BY c.created_at DESC
");
$stmt->execute([$user_id]);
$cart_items = $stmt->fetchAll();

$total_amount = 0;
foreach ($cart_items as $item) {
    $total_amount += $item['price'] * $item['quantity'];
}
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <h2><i class="fas fa-shopping-cart"></i> Shopping Cart</h2>
        </div>
    </div>
    
    <?php if (empty($cart_items)): ?>
        <div class="row">
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle"></i> Your cart is empty
                    <br>
                    <a href="index.php" class="btn btn-primary mt-2">Continue Shopping</a>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="row">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h5>Cart Items</h5>
                    </div>
                    <div class="card-body">
                        <?php foreach ($cart_items as $item): ?>
                            <div class="row align-items-center mb-3 pb-3 border-bottom">
                                <div class="col-md-2">
                                    <?php if (!empty($item['image'])): ?>
                                        <img src="<?php echo $item['image']; ?>" class="img-fluid rounded" alt="<?php echo htmlspecialchars($item['title']); ?>">
                                    <?php else: ?>
                                        <div class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 80px;">
                                            <i class="fas fa-book fa-2x text-muted"></i>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                <div class="col-md-4">
                                    <h6><?php echo htmlspecialchars($item['title']); ?></h6>
                                    <p class="text-muted mb-0">by <?php echo htmlspecialchars($item['author']); ?></p>
                                </div>
                                <div class="col-md-2">
                                    <p class="mb-0">$<?php echo number_format($item['price'], 2); ?></p>
                                </div>
                                <div class="col-md-2">
                                    <div class="input-group">
                                        <form method="POST" action="actions/update_cart.php" class="d-flex">
                                            <input type="hidden" name="book_id" value="<?php echo $item['book_id']; ?>">
                                            <input type="hidden" name="action" value="decrease">
                                            <button type="submit" class="btn btn-outline-secondary btn-sm" <?php echo $item['quantity'] <= 1 ? 'disabled' : ''; ?>>
                                                <i class="fas fa-minus"></i>
                                            </button>
                                        </form>
                                        <span class="form-control text-center"><?php echo $item['quantity']; ?></span>
                                        <form method="POST" action="actions/update_cart.php" class="d-flex">
                                            <input type="hidden" name="book_id" value="<?php echo $item['book_id']; ?>">
                                            <input type="hidden" name="action" value="increase">
                                            <button type="submit" class="btn btn-outline-secondary btn-sm" <?php echo $item['quantity'] >= $item['stock'] ? 'disabled' : ''; ?>>
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <p class="mb-0 fw-bold">$<?php echo number_format($item['price'] * $item['quantity'], 2); ?></p>
                                </div>
                                <div class="col-md-1">
                                    <form method="POST" action="actions/remove_from_cart.php">
                                        <input type="hidden" name="book_id" value="<?php echo $item['book_id']; ?>">
                                        <button type="submit" class="btn btn-outline-danger btn-sm">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        <?php endforeach; ?>
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
                        <div class="d-grid">
                            <a href="index.php?page=checkout" class="btn btn-primary">
                                <i class="fas fa-credit-card"></i> Proceed to Checkout
                            </a>
                        </div>
                        <div class="text-center mt-2">
                            <a href="index.php" class="btn btn-outline-secondary btn-sm">Continue Shopping</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>

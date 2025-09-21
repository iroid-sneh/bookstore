<?php
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php?page=login');
    exit;
}

$user_id = $_SESSION['user_id'];

// Get user orders
$stmt = $pdo->prepare("
    SELECT o.*, 
           GROUP_CONCAT(CONCAT(oi.quantity, 'x ', b.title) SEPARATOR ', ') as items_summary
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN books b ON oi.book_id = b.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
");
$stmt->execute([$user_id]);
$orders = $stmt->fetchAll();
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <h2><i class="fas fa-list-alt"></i> My Orders</h2>
        </div>
    </div>
    
    <?php if (empty($orders)): ?>
        <div class="row">
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle"></i> You haven't placed any orders yet.
                    <br>
                    <a href="index.php" class="btn btn-primary mt-2">Start Shopping</a>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="row">
            <?php foreach ($orders as $order): ?>
                <div class="col-12 mb-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-0">Order #<?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?></h5>
                                <small class="text-muted">Placed on <?php echo date('M d, Y H:i', strtotime($order['created_at'])); ?></small>
                            </div>
                            <div class="text-end">
                                <span class="badge bg-success"><?php echo ucfirst($order['status']); ?></span>
                                <br>
                                <strong>$<?php echo number_format($order['total_amount'], 2); ?></strong>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h6>Items:</h6>
                                    <p class="text-muted"><?php echo $order['items_summary']; ?></p>
                                    
                                    <h6>Shipping Address:</h6>
                                    <p class="text-muted">
                                        <?php echo htmlspecialchars($order['shipping_street']); ?><br>
                                        <?php echo htmlspecialchars($order['shipping_city']); ?>, 
                                        <?php echo htmlspecialchars($order['shipping_state']); ?> 
                                        <?php echo htmlspecialchars($order['shipping_zip']); ?>
                                    </p>
                                </div>
                                <div class="col-md-4">
                                    <h6>Payment Details:</h6>
                                    <p class="text-muted">
                                        <strong>Method:</strong> <?php echo strtoupper($order['payment_method']); ?><br>
                                        <strong>Status:</strong> <?php echo ucfirst($order['payment_status']); ?>
                                    </p>
                                    
                                    <?php if ($order['status'] == 'delivered'): ?>
                                        <div class="alert alert-success">
                                            <i class="fas fa-check-circle"></i>
                                            <strong>Order Delivered!</strong><br>
                                            <small>Your order has been successfully delivered to your address.</small>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

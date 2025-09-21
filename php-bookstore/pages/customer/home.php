<?php
// Get all active books
$stmt = $pdo->prepare("SELECT * FROM books WHERE is_active = 1 ORDER BY created_at DESC");
$stmt->execute();
$books = $stmt->fetchAll();

// Get unique categories
$stmt = $pdo->prepare("SELECT DISTINCT category FROM books WHERE is_active = 1");
$stmt->execute();
$categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <h1 class="text-center mb-4">Welcome to BookStore</h1>
            <p class="text-center text-muted mb-5">Discover amazing books and build your personal library</p>
        </div>
    </div>
    
    <!-- Search and Filter -->
    <div class="row mb-4">
        <div class="col-md-8">
            <form method="GET" class="d-flex">
                <input type="hidden" name="page" value="home">
                <input type="text" name="search" class="form-control me-2" placeholder="Search books..." value="<?php echo $_GET['search'] ?? ''; ?>">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-search"></i> Search
                </button>
            </form>
        </div>
        <div class="col-md-4">
            <form method="GET" class="d-flex">
                <input type="hidden" name="page" value="home">
                <input type="hidden" name="search" value="<?php echo $_GET['search'] ?? ''; ?>">
                <select name="category" class="form-select me-2">
                    <option value="">All Categories</option>
                    <?php foreach($categories as $category): ?>
                        <option value="<?php echo $category; ?>" <?php echo ($_GET['category'] ?? '') == $category ? 'selected' : ''; ?>>
                            <?php echo $category; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <button type="submit" class="btn btn-outline-primary">Filter</button>
            </form>
        </div>
    </div>
    
    <!-- Books Grid -->
    <div class="row">
        <?php
        $search = $_GET['search'] ?? '';
        $category = $_GET['category'] ?? '';
        
        // Build query based on filters
        $sql = "SELECT * FROM books WHERE is_active = 1";
        $params = [];
        
        if (!empty($search)) {
            $sql .= " AND (title LIKE ? OR author LIKE ? OR description LIKE ?)";
            $searchTerm = "%$search%";
            $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
        }
        
        if (!empty($category)) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $filtered_books = $stmt->fetchAll();
        
        if (empty($filtered_books)):
        ?>
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No books found matching your criteria.
                </div>
            </div>
        <?php else: ?>
            <?php foreach($filtered_books as $book): ?>
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card book-card h-100">
                        <div class="text-center p-3 bg-light">
                            <?php if (!empty($book['image'])): ?>
                                <img src="<?php echo $book['image']; ?>" class="book-image card-img-top" alt="<?php echo htmlspecialchars($book['title']); ?>">
                            <?php else: ?>
                                <div class="book-image d-flex align-items-center justify-content-center bg-white">
                                    <i class="fas fa-book fa-4x text-muted"></i>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title"><?php echo htmlspecialchars($book['title']); ?></h5>
                            <p class="card-text text-muted">by <?php echo htmlspecialchars($book['author']); ?></p>
                            <p class="card-text">
                                <span class="badge bg-secondary"><?php echo htmlspecialchars($book['category']); ?></span>
                            </p>
                            <p class="card-text flex-grow-1"><?php echo substr(htmlspecialchars($book['description']), 0, 100); ?>...</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="text-primary mb-0">$<?php echo number_format($book['price'], 2); ?></h6>
                                    <small class="text-muted">Stock: <?php echo $book['stock']; ?></small>
                                </div>
                                <div class="d-grid gap-2">
                                    <a href="index.php?page=book-details&id=<?php echo $book['id']; ?>" class="btn btn-outline-primary btn-sm">
                                        View Details
                                    </a>
                                    <?php if ($book['stock'] > 0): ?>
                                        <form method="POST" action="actions/add_to_cart.php" class="d-inline">
                                            <input type="hidden" name="book_id" value="<?php echo $book['id']; ?>">
                                            <button type="submit" class="btn btn-primary btn-sm w-100">
                                                <i class="fas fa-cart-plus"></i> Add to Cart
                                            </button>
                                        </form>
                                    <?php else: ?>
                                        <button class="btn btn-secondary btn-sm w-100" disabled>
                                            Out of Stock
                                        </button>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

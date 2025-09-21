<?php
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: index.php?page=admin');
    exit;
}

if (!isset($_GET['id'])) {
    header('Location: index.php?page=admin-dashboard');
    exit;
}

$book_id = $_GET['id'];

// Get book details
$stmt = $pdo->prepare("SELECT * FROM books WHERE id = ?");
$stmt->execute([$book_id]);
$book = $stmt->fetch();

if (!$book) {
    header('Location: index.php?page=admin-dashboard');
    exit;
}
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-edit"></i> Edit Book</h2>
                <a href="index.php?page=admin-dashboard" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5>Book Information</h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="actions/update_book.php" enctype="multipart/form-data">
                        <input type="hidden" name="book_id" value="<?php echo $book['id']; ?>">
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="title" class="form-label">Title *</label>
                                <input type="text" class="form-control" id="title" name="title" value="<?php echo htmlspecialchars($book['title']); ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="author" class="form-label">Author *</label>
                                <input type="text" class="form-control" id="author" name="author" value="<?php echo htmlspecialchars($book['author']); ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="publish_year" class="form-label">Publish Year *</label>
                                <input type="number" class="form-control" id="publish_year" name="publish_year" min="1000" max="2024" value="<?php echo $book['publish_year']; ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="price" class="form-label">Price *</label>
                                <input type="number" class="form-control" id="price" name="price" min="0" step="0.01" value="<?php echo $book['price']; ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="category" class="form-label">Category *</label>
                                <select class="form-select" id="category" name="category" required>
                                    <option value="">Select a category</option>
                                    <option value="Fiction" <?php echo $book['category'] == 'Fiction' ? 'selected' : ''; ?>>Fiction</option>
                                    <option value="Non-Fiction" <?php echo $book['category'] == 'Non-Fiction' ? 'selected' : ''; ?>>Non-Fiction</option>
                                    <option value="Science" <?php echo $book['category'] == 'Science' ? 'selected' : ''; ?>>Science</option>
                                    <option value="History" <?php echo $book['category'] == 'History' ? 'selected' : ''; ?>>History</option>
                                    <option value="Biography" <?php echo $book['category'] == 'Biography' ? 'selected' : ''; ?>>Biography</option>
                                    <option value="Technology" <?php echo $book['category'] == 'Technology' ? 'selected' : ''; ?>>Technology</option>
                                    <option value="Business" <?php echo $book['category'] == 'Business' ? 'selected' : ''; ?>>Business</option>
                                    <option value="Health" <?php echo $book['category'] == 'Health' ? 'selected' : ''; ?>>Health</option>
                                    <option value="Education" <?php echo $book['category'] == 'Education' ? 'selected' : ''; ?>>Education</option>
                                    <option value="Children" <?php echo $book['category'] == 'Children' ? 'selected' : ''; ?>>Children</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="stock" class="form-label">Stock Quantity</label>
                                <input type="number" class="form-control" id="stock" name="stock" min="0" value="<?php echo $book['stock']; ?>">
                            </div>
                            <div class="col-12 mb-3">
                                <label for="image" class="form-label">Book Image</label>
                                <input type="file" class="form-control" id="image" name="image" accept="image/*">
                                <div class="form-text">Upload a new image to replace the current one (optional)</div>
                                <?php if (!empty($book['image'])): ?>
                                    <div class="mt-2">
                                        <p class="text-muted">Current image:</p>
                                        <img src="<?php echo $book['image']; ?>" class="img-thumbnail" style="width: 100px; height: 100px; object-fit: cover;" alt="Current image">
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div class="col-12 mb-3">
                                <label for="description" class="form-label">Description *</label>
                                <textarea class="form-control" id="description" name="description" rows="4" required><?php echo htmlspecialchars($book['description']); ?></textarea>
                            </div>
                            <div class="col-12 mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="is_active" name="is_active" value="1" <?php echo $book['is_active'] ? 'checked' : ''; ?>>
                                    <label class="form-check-label" for="is_active">
                                        Active (book is visible to customers)
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-end gap-2">
                            <a href="index.php?page=admin-dashboard" class="btn btn-secondary">Cancel</a>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Update Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h6>Book Preview</h6>
                </div>
                <div class="card-body">
                    <div class="text-center">
                        <?php if (!empty($book['image'])): ?>
                            <img src="<?php echo $book['image']; ?>" class="img-fluid rounded mb-3" alt="<?php echo htmlspecialchars($book['title']); ?>">
                        <?php else: ?>
                            <div class="bg-light rounded d-flex align-items-center justify-content-center mb-3" style="height: 200px;">
                                <i class="fas fa-book fa-3x text-muted"></i>
                            </div>
                        <?php endif; ?>
                        <h6><?php echo htmlspecialchars($book['title']); ?></h6>
                        <p class="text-muted">by <?php echo htmlspecialchars($book['author']); ?></p>
                        <p class="text-primary fw-bold">$<?php echo number_format($book['price'], 2); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

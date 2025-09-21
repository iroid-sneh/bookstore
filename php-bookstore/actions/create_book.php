<?php
session_start();
require_once 'config/database.php';

if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: index.php?page=admin');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $author = $_POST['author'];
    $publish_year = $_POST['publish_year'];
    $price = $_POST['price'];
    $description = $_POST['description'];
    $category = $_POST['category'];
    $stock = $_POST['stock'] ?? 0;
    
    // Simple validation
    if (empty($title) || empty($author) || empty($publish_year) || empty($price) || empty($description) || empty($category)) {
        $_SESSION['message'] = 'Please fill in all required fields';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=admin-create');
        exit;
    }
    
    // Handle image upload
    $image_path = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (in_array(strtolower($file_extension), $allowed_extensions)) {
            $filename = uniqid() . '.' . $file_extension;
            $upload_path = $upload_dir . $filename;
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
                $image_path = $upload_path;
            }
        }
    }
    
    // Insert book
    $stmt = $pdo->prepare("
        INSERT INTO books (title, author, publish_year, price, description, image, category, stock) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    if ($stmt->execute([$title, $author, $publish_year, $price, $description, $image_path, $category, $stock])) {
        $_SESSION['message'] = 'Book created successfully!';
        $_SESSION['message_type'] = 'success';
        header('Location: index.php?page=admin-dashboard');
    } else {
        $_SESSION['message'] = 'Error creating book. Please try again.';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=admin-create');
    }
} else {
    header('Location: index.php?page=admin-create');
}
?>

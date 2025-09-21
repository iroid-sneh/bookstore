<?php
session_start();

// Clear admin session
unset($_SESSION['admin_logged_in']);

// Redirect to admin login
header('Location: index.php?page=admin');
exit;
?>

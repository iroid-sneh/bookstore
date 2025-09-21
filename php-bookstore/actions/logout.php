<?php
session_start();

// Clear all session data
session_destroy();

// Redirect to home page
header('Location: index.php');
exit;
?>

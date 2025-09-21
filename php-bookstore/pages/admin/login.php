<?php
if (isset($_SESSION['admin_logged_in'])) {
    header('Location: index.php?page=admin-dashboard');
    exit;
}
?>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header text-center">
                    <h3><i class="fas fa-user-shield"></i> Admin Login</h3>
                </div>
                <div class="card-body">
                    <form method="POST" action="actions/admin_login.php">
                        <div class="mb-3">
                            <label for="password" class="form-label">Admin Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>
                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                        </div>
                    </form>
                    <div class="text-center mt-3">
                        <p>Customer? <a href="index.php">Go to Customer Site</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

# PHP BookStore

A simple, beginner-friendly bookstore application built with PHP, MySQL, HTML, CSS, and Bootstrap.

## Features

### Customer Features

-   Browse books with search and category filtering
-   User registration and login
-   Shopping cart functionality
-   Checkout with address saving
-   Order history
-   Cash on Delivery (COD) payment

### Admin Features

-   Admin login (password: admin123)
-   Add, edit, and delete books
-   Image upload for books
-   View statistics (total books, orders, users)
-   Book management dashboard

## Requirements

-   PHP 7.4 or higher
-   MySQL 5.7 or higher
-   Web server (Apache/Nginx) or PHP built-in server

## Installation

1. **Clone or download the project**

    ```bash
    git clone <repository-url>
    cd php-bookstore
    ```

2. **Set up the database**

    - Create a MySQL database named `bookstore_db`
    - Import the database schema:

    ```bash
    mysql -u root -p bookstore_db < database/schema.sql
    ```

3. **Configure database connection**

    - Edit `config/database.php` with your database credentials:

    ```php
    $host = 'localhost';
    $dbname = 'bookstore_db';
    $username = 'root';
    $password = 'your_password';
    ```

4. **Set up file permissions**

    ```bash
    chmod 755 uploads/
    ```

5. **Start the application**

    - Using PHP built-in server:

    ```bash
    php -S localhost:8000
    ```

    - Or configure your web server to point to the project directory

6. **Access the application**
    - Open your browser and go to `http://localhost:8000`
    - Admin panel: `http://localhost:8000?page=admin`

## Project Structure

```
php-bookstore/
├── config/
│   └── database.php          # Database configuration
├── database/
│   └── schema.sql           # Database schema and sample data
├── includes/
│   ├── header.php           # Common header
│   └── footer.php           # Common footer
├── pages/
│   ├── customer/            # Customer pages
│   │   ├── home.php
│   │   ├── login.php
│   │   ├── register.php
│   │   ├── cart.php
│   │   ├── checkout.php
│   │   └── orders.php
│   └── admin/               # Admin pages
│       ├── login.php
│       ├── dashboard.php
│       ├── create_book.php
│       └── edit_book.php
├── actions/                 # Form processing scripts
│   ├── login.php
│   ├── register.php
│   ├── add_to_cart.php
│   ├── update_cart.php
│   ├── remove_from_cart.php
│   ├── place_order.php
│   ├── logout.php
│   ├── admin_login.php
│   ├── admin_logout.php
│   ├── create_book.php
│   ├── update_book.php
│   └── delete_book.php
├── uploads/                 # Image upload directory
├── index.php               # Main entry point
└── README.md
```

## Default Credentials

-   **Admin Login**: Password is `admin123`
-   **Sample Books**: 5 sample books are included in the database

## Key Features Explained

### Simple Routing

The application uses a simple routing system based on the `page` parameter in the URL:

-   `index.php` - Home page
-   `index.php?page=login` - Customer login
-   `index.php?page=admin` - Admin login
-   `index.php?page=admin-dashboard` - Admin dashboard

### Database Design

-   **books**: Stores book information
-   **users**: Customer accounts with address storage
-   **cart**: Shopping cart items
-   **orders**: Order information
-   **order_items**: Individual items in each order

### Image Upload

-   Images are uploaded to the `uploads/` directory
-   Supports JPG, PNG, GIF formats
-   Automatic filename generation to prevent conflicts

### Security Features

-   Basic input validation
-   SQL injection prevention using prepared statements
-   Session management for user authentication
-   File upload validation

## Customization

### Adding New Categories

Edit the category options in:

-   `pages/admin/create_book.php`
-   `pages/admin/edit_book.php`

### Styling

The application uses Bootstrap 5. You can customize the appearance by:

-   Modifying the CSS in `includes/header.php`
-   Adding custom CSS files
-   Changing Bootstrap theme

### Database Configuration

Update `config/database.php` for different database settings.

## Troubleshooting

### Common Issues

1. **Database Connection Error**

    - Check database credentials in `config/database.php`
    - Ensure MySQL is running
    - Verify database exists

2. **Image Upload Issues**

    - Check `uploads/` directory permissions
    - Ensure PHP has file upload enabled
    - Check `upload_max_filesize` in PHP settings

3. **Session Issues**
    - Ensure sessions are enabled in PHP
    - Check session directory permissions

## Development Notes

This application is designed to be beginner-friendly with:

-   Simple, readable PHP code
-   Clear separation of concerns
-   Minimal dependencies
-   Basic error handling
-   Straightforward database operations

Perfect for learning PHP web development fundamentals!

## License

This project is open source and available under the MIT License.

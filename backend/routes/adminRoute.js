import express from "express";
import { Book } from "../models/bookModel.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});

// Admin password middleware
const adminPassword = "admin123"; // You can move this to environment variables

const verifyAdminPassword = (req, res, next) => {
    const { password } = req.headers;
    if (password !== adminPassword) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    next();
};

// Apply password verification to all admin routes
router.use(verifyAdminPassword);

// Route for save a new book with image upload
router.post("/books", upload.single("image"), async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear ||
            !request.body.price ||
            !request.body.description ||
            !request.body.category
        ) {
            return response.status(400).send({
                message: "Send all required fields!",
            });
        }

        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
            price: request.body.price,
            description: request.body.description,
            image: request.file ? `/uploads/${request.file.filename}` : "",
            category: request.body.category,
            stock: request.body.stock || 0,
        };

        const book = await Book.create(newBook);
        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for update a book with image upload
router.put("/books/:id", upload.single("image"), async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear ||
            !request.body.price ||
            !request.body.description ||
            !request.body.category
        ) {
            return response.status(400).send({
                message: "Send all required fields!",
            });
        }

        const { id } = request.params;
        const updateData = { ...request.body };

        // If a new image is uploaded, update the image path
        if (request.file) {
            updateData.image = `/uploads/${request.file.filename}`;
        }

        const result = await Book.findByIdAndUpdate(id, updateData);

        if (!result) {
            return response.status(404).json({ message: "Book not found!" });
        }
        return response
            .status(200)
            .json({ message: "Book updated successfully!" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for get all books from db
router.get("/books", async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for get books from db by id
router.get("/books/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const book = await Book.findById(id);
        return response.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for delete a book
router.delete("/books/:id", async (request, response) => {
    try {
        const { id } = request.params;

        // First, remove this book from all user orders
        await Order.updateMany(
            { "items.book": id },
            { $pull: { items: { book: id } } }
        );

        // Also remove from all carts
        await Cart.updateMany(
            { "items.book": id },
            { $pull: { items: { book: id } } }
        );

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: "Book not found!" });
        }
        return response
            .status(200)
            .json({ message: "Book deleted successfully!" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;

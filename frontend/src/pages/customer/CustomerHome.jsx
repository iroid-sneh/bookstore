import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { getImageUrl } from "../../utils/imageUtils";

const CustomerHome = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const loadBooks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/books");
            setBooks(response.data.data);

            // Extract unique categories
            const uniqueCategories = [
                ...new Set(response.data.data.map((book) => book.category)),
            ];
            setCategories(uniqueCategories);
        } catch (error) {
            enqueueSnackbar("Error loading books", { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("q", searchTerm);
            if (selectedCategory) params.append("category", selectedCategory);

            const response = await axios.get(
                `http://localhost:3000/api/search?${params}`
            );
            setBooks(response.data.data);
        } catch (error) {
            enqueueSnackbar("Error searching books", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (bookId) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            enqueueSnackbar("Please login to add items to cart", {
                variant: "warning",
            });
            return;
        }

        try {
            await axios.post("http://localhost:3000/api/cart/add", {
                userId,
                bookId,
                quantity: 1,
            });
            enqueueSnackbar("Added to cart successfully!", {
                variant: "success",
            });
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || "Error adding to cart",
                { variant: "error" }
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                BookStore
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/cart"
                                className="text-gray-700 hover:text-gray-900"
                            >
                                <span className="text-lg">🛒 Cart</span>
                            </Link>
                            {localStorage.getItem("userId") ? (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        to="/orders"
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Orders
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem("userId");
                                            window.location.reload();
                                        }}
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Search and Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="md:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div
                                key={book._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    {book.image ? (
                                        <img
                                            src={getImageUrl(book.image)}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display =
                                                    "block";
                                            }}
                                        />
                                    ) : null}
                                    <span
                                        className="text-gray-500 text-4xl"
                                        style={{
                                            display: book.image
                                                ? "none"
                                                : "block",
                                        }}
                                    >
                                        📚
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        by {book.author}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {book.category}
                                    </p>
                                    <p className="text-lg font-bold text-blue-600 mb-3">
                                        ${book.price}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {book.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/book/${book._id}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => addToCart(book._id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {books.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No books found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerHome;

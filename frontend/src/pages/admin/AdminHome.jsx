import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { getImageUrl } from "../../utils/imageUtils";

const AdminHome = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const loadBooks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://localhost:3000/admin/books",
                {
                    headers: {
                        password: "admin123",
                    },
                }
            );
            setBooks(response.data.data);
        } catch (error) {
            enqueueSnackbar("Error loading books", { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        if (!localStorage.getItem("adminLoggedIn")) {
            window.location.href = "/admin";
            return;
        }
        loadBooks();
    }, [loadBooks]);

    const deleteBook = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/admin/books/${id}`, {
                headers: {
                    password: "admin123",
                },
            });
            enqueueSnackbar("Book deleted successfully!", {
                variant: "success",
            });
            loadBooks();
        } catch (error) {
            enqueueSnackbar("Error deleting book", { variant: "error" });
        }
    };

    const logout = () => {
        localStorage.removeItem("adminLoggedIn");
        window.location.href = "/admin";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/admin/books/create"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Add New Book
                            </Link>
                            <button
                                onClick={logout}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Books Management
                    </h2>
                    <p className="text-gray-600">
                        Manage your bookstore inventory
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {books.map((book) => (
                                <li key={book._id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                                                    {book.image ? (
                                                        <img
                                                            src={getImageUrl(
                                                                book.image
                                                            )}
                                                            alt={book.title}
                                                            className="h-full w-full object-cover rounded"
                                                            onError={(e) => {
                                                                e.target.style.display =
                                                                    "none";
                                                                e.target.nextSibling.style.display =
                                                                    "block";
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span
                                                        className="text-gray-500 text-2xl"
                                                        style={{
                                                            display: book.image
                                                                ? "none"
                                                                : "block",
                                                        }}
                                                    >
                                                        📚
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="flex items-center">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {book.title}
                                                        </h3>
                                                        <span
                                                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                                                book.isActive
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {book.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        by {book.author}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {book.category} •
                                                        Published:{" "}
                                                        {book.publishYear}
                                                    </p>
                                                    <p className="text-sm font-medium text-blue-600">
                                                        ${book.price} • Stock:{" "}
                                                        {book.stock}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    to={`/admin/books/edit/${book._id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteBook(book._id)
                                                    }
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {books.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No books found</p>
                        <Link
                            to="/admin/books/create"
                            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                        >
                            Add Your First Book
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHome;

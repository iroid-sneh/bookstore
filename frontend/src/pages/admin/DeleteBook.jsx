import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";

const DeleteBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!localStorage.getItem("adminLoggedIn")) {
            window.location.href = "/admin";
            return;
        }
        loadBook();
    }, [id]);

    const loadBook = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/admin/books/${id}`,
                {
                    headers: {
                        password: "admin123",
                    },
                }
            );
            setBook(response.data);
        } catch (error) {
            enqueueSnackbar("Error loading book", { variant: "error" });
            navigate("/admin/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`http://localhost:3000/admin/books/${id}`, {
                headers: {
                    password: "admin123",
                },
            });

            enqueueSnackbar("Book deleted successfully!", {
                variant: "success",
            });
            navigate("/admin/dashboard");
        } catch (error) {
            enqueueSnackbar("Error deleting book", { variant: "error" });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Book not found
                    </h1>
                    <Link
                        to="/admin/dashboard"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Delete Book
                        </h1>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/admin/dashboard"
                                className="text-gray-700 hover:text-gray-900"
                            >
                                Back to Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("adminLoggedIn");
                                    window.location.href = "/admin";
                                }}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                        <h2 className="text-lg font-semibold text-red-800">
                            ⚠️ Confirm Deletion
                        </h2>
                        <p className="text-red-600">
                            This action cannot be undone. Are you sure you want
                            to delete this book?
                        </p>
                    </div>

                    <div className="px-6 py-6">
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                <div className="h-32 w-24 bg-gray-200 rounded flex items-center justify-center">
                                    {book.image ? (
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className="h-full w-full object-cover rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-4xl">
                                            📚
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {book.title}
                                </h3>
                                <p className="text-lg text-gray-600 mb-2">
                                    by {book.author}
                                </p>
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                        {book.category}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Published: {book.publishYear}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Stock: {book.stock}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-blue-600 mb-4">
                                    ${book.price}
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    {book.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md">
                            <h4 className="text-sm font-medium text-red-800 mb-2">
                                ⚠️ Warning
                            </h4>
                            <ul className="text-sm text-red-700 space-y-1">
                                <li>
                                    • This book will be permanently removed from
                                    the database
                                </li>
                                <li>
                                    • Any existing orders containing this book
                                    will be affected
                                </li>
                                <li>• This action cannot be undone</li>
                            </ul>
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <Link
                                to="/admin/dashboard"
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
                            >
                                {deleting ? "Deleting..." : "Delete Book"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteBook;

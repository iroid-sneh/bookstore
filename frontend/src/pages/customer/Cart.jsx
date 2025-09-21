import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { getImageUrl } from "../../utils/imageUtils";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            enqueueSnackbar("Please login to view cart", {
                variant: "warning",
            });
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:3000/api/cart/${userId}`
            );
            setCart(response.data);
        } catch (error) {
            enqueueSnackbar("Error loading cart", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (bookId, newQuantity) => {
        setUpdating(true);
        const userId = localStorage.getItem("userId");

        try {
            const response = await axios.put(
                "http://localhost:3000/api/cart/update",
                {
                    userId,
                    bookId,
                    quantity: newQuantity,
                }
            );
            setCart(response.data.cart);
            enqueueSnackbar("Cart updated successfully!", {
                variant: "success",
            });
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || "Error updating cart",
                { variant: "error" }
            );
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (bookId) => {
        setUpdating(true);
        const userId = localStorage.getItem("userId");

        try {
            const response = await axios.delete(
                "http://localhost:3000/api/cart/remove",
                {
                    data: { userId, bookId },
                }
            );
            setCart(response.data.cart);
            enqueueSnackbar("Item removed from cart!", { variant: "success" });
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || "Error removing item",
                { variant: "error" }
            );
        } finally {
            setUpdating(false);
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => {
            return total + item.book.price * item.quantity;
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!localStorage.getItem("userId")) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Please login to view cart
                    </h1>
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Login
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
                        <Link
                            to="/"
                            className="text-3xl font-bold text-gray-900"
                        >
                            BookStore
                        </Link>
                        <div className="flex items-center space-x-4">
                            <span className="text-lg text-gray-700">
                                🛒 Cart
                            </span>
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Shopping Cart
                </h1>

                {!cart || !cart.items || cart.items.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add some books to get started!
                        </p>
                        <Link
                            to="/"
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Cart Items
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {cart.items.map((item) => (
                                        <div
                                            key={item.book._id}
                                            className="p-6 flex items-center space-x-4"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="h-20 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                    {item.book.image ? (
                                                        <img
                                                            src={getImageUrl(
                                                                item.book.image
                                                            )}
                                                            alt={
                                                                item.book.title
                                                            }
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
                                                            display: item.book
                                                                .image
                                                                ? "none"
                                                                : "block",
                                                        }}
                                                    >
                                                        📚
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {item.book.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    by {item.book.author}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.book.category}
                                                </p>
                                                <p className="text-lg font-semibold text-blue-600">
                                                    ${item.book.price}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.book._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        updating ||
                                                        item.quantity <= 1
                                                    }
                                                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-medium w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.book._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        updating ||
                                                        item.quantity >=
                                                            item.book.stock
                                                    }
                                                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    $
                                                    {(
                                                        item.book.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        removeItem(
                                                            item.book._id
                                                        )
                                                    }
                                                    disabled={updating}
                                                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Order Summary
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Subtotal
                                        </span>
                                        <span className="font-medium">
                                            ${calculateTotal().toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Shipping
                                        </span>
                                        <span className="font-medium">
                                            Free
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold">
                                                Total
                                            </span>
                                            <span className="text-lg font-semibold">
                                                ${calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        // Navigate to checkout
                                        window.location.href = "/checkout";
                                    }}
                                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium"
                                >
                                    Proceed to Checkout
                                </button>
                                <Link
                                    to="/"
                                    className="block w-full mt-3 text-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";

const Profile = () => {
    const [formData, setFormData] = useState({
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // In a real app, you'd have an API endpoint to update user profile
            enqueueSnackbar("Profile updated successfully!", {
                variant: "success",
            });
        } catch (error) {
            enqueueSnackbar("Error updating profile", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (!localStorage.getItem("userId")) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Please login to view profile
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
                            <Link
                                to="/cart"
                                className="text-gray-700 hover:text-gray-900"
                            >
                                <span className="text-lg">🛒 Cart</span>
                            </Link>
                            <Link
                                to="/orders"
                                className="text-gray-700 hover:text-gray-900"
                            >
                                Orders
                            </Link>
                            <span className="text-lg text-gray-700">
                                👤 Profile
                            </span>
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
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Profile
                </h1>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Personal Information
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Shipping Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="address.street"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address.street"
                                        name="address.street"
                                        value={formData.address.street}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address.city"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="address.city"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address.state"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        id="address.state"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address.zipCode"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        id="address.zipCode"
                                        name="address.zipCode"
                                        value={formData.address.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Account Actions
                        </h2>
                    </div>
                    <div className="px-6 py-6">
                        <div className="flex space-x-4">
                            <Link
                                to="/orders"
                                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 font-medium"
                            >
                                View Order History
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("userId");
                                    localStorage.removeItem("userName");
                                    localStorage.removeItem("userEmail");
                                    window.location.href = "/";
                                }}
                                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

import React from "react";
import { Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// Customer pages
import CustomerHome from "./pages/customer/CustomerHome";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import BookDetails from "./pages/customer/BookDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import Profile from "./pages/customer/Profile";

// Admin pages
import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";
import CreateBook from "./pages/admin/CreateBook";
import EditBook from "./pages/admin/EditBook";
import DeleteBook from "./pages/admin/DeleteBook";

const App = () => {
    return (
        <SnackbarProvider maxSnack={3}>
            <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminHome />} />
                <Route path="/admin/books/create" element={<CreateBook />} />
                <Route path="/admin/books/edit/:id" element={<EditBook />} />
                <Route
                    path="/admin/books/delete/:id"
                    element={<DeleteBook />}
                />
            </Routes>
        </SnackbarProvider>
    );
};

export default App;

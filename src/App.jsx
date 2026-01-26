import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleGuard from "./components/RoleGuard.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Customers from "./pages/Customers.jsx";
import Inventory from "./pages/Inventory.jsx";
import Coupons from "./pages/Coupons.jsx";
import Reviews from "./pages/Reviews.jsx";
import Reports from "./pages/Reports.jsx";
import Notifications from "./pages/Notifications.jsx";
import Search from "./pages/Search.jsx";
import Admin from "./pages/Admin.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import AdminLandingPage from "./pages/AdminLandingPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/products"
                element={
                  <RoleGuard allow={["admin", "manager"]}>
                    <Products />
                  </RoleGuard>
                }
              />
              <Route
                path="/products/new"
                element={
                  <RoleGuard allow={["admin", "manager"]}>
                    <AddProduct />
                  </RoleGuard>
                }
              />
               <Route
                path="/landing"
                element={
                  <RoleGuard allow={["admin", "manager"]}>
                   <AdminLandingPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/products/edit/:id"
                element={
                  <RoleGuard allow={["admin", "manager"]}>
                    <EditProduct />
                  </RoleGuard>
                }
              />

              <Route
                path="/products/details"
                element={
                  <RoleGuard allow={["admin", "manager"]}>
                    <ProductDetails />
                  </RoleGuard>
                }
              />
              <Route
                path="/orders"
                element={
                  <RoleGuard allow={["admin", "manager", "support"]}>
                    <Orders />
                  </RoleGuard>
                }
              />
              <Route
                path="/orders/details"
                element={
                  <RoleGuard allow={["admin", "manager", "support"]}>
                    <OrderDetails />
                  </RoleGuard>
                }
              />
              <Route
                path="/customers"
                element={
                  <RoleGuard allow={["admin"]}>
                    <Customers />
                  </RoleGuard>
                }
              />

              <Route
                path="/inventory"
                element={
                  <RoleGuard allow={["admin", "manager"]}>
                    <Inventory />
                  </RoleGuard>
                }
              />
              <Route
                path="/coupons"
                element={
                  <RoleGuard allow={["admin"]}>
                    <Coupons />
                  </RoleGuard>
                }
              />
              <Route
                path="/reviews"
                element={
                  <RoleGuard allow={["admin", "support"]}>
                    <Reviews />
                  </RoleGuard>
                }
              />
              <Route
                path="/reports"
                element={
                  <RoleGuard allow={["admin"]}>
                    <Reports />
                  </RoleGuard>
                }
              />
              <Route
                path="/notifications"
                element={
                  <RoleGuard allow={["admin", "manager", "support"]}>
                    <Notifications />
                  </RoleGuard>
                }
              />
              <Route
                path="/search"
                element={
                  <RoleGuard allow={["admin", "manager", "support"]}>
                    <Search />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin"
                element={
                  <RoleGuard allow={["admin"]}>
                    <Admin />
                  </RoleGuard>
                }
              />
              <Route
                path="/settings"
                element={
                  <RoleGuard allow={["admin"]}>
                    <Settings />
                  </RoleGuard>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

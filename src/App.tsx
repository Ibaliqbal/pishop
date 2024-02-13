import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/auth.context";
import { Toaster } from "sonner";
import PrivateRoute from "./route/PrivateRoute";
import AddNewProduct from "./pages/AddNewProduct";
import EditProduct from "./pages/EditProduct";
import PrivateRouteAdmin from "./route/PrivateRouteAdmin";
import { CartProdvider } from "./context/cart.context";
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Home = lazy(() => import("@/pages/Home"));
const ViewShop = lazy(() => import("@/pages/ViewShop"));

function App() {
  return (
    <>
      <AuthProvider>
        <CartProdvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <Suspense fallback={<div className="loader"></div>}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            >
              <Route
                path="cart"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="transaction"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="report"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="product_manage"
                element={
                  <PrivateRouteAdmin>
                    <Dashboard />
                  </PrivateRouteAdmin>
                }
              />
            </Route>
            <Route path="/add_new_product" element={<AddNewProduct />} />
            <Route
              path="/:id"
              element={
                <Suspense fallback={<div className="loader"></div>}>
                  <ProductDetail />
                </Suspense>
              }
            />
            <Route
              path="/shop/:id"
              element={
                <Suspense fallback={<div className="loader"></div>}>
                  <ViewShop />
                </Suspense>
              }
            />
            <Route path="/edit_product/:id" element={<EditProduct />} />
          </Routes>
        </CartProdvider>
        <Toaster position="top-center" richColors duration={2000} />
      </AuthProvider>
    </>
  );
}

export default App;

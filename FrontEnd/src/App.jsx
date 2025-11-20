import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { BrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import { FilterProvider } from "./context/FilterProvider";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartProvider";

// Import custom CSS
import "./css/category.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div>
              <FilterProvider>
                <Routes>
                  {/* Redirect "/" sang "/about" */}
                  {/* <Route

              path="/"
              element={<Navigate to="/user-info-detail" replace />}
            /> */}

                  {routes.map((route) => {
                    const Page = route.page;
                    const Layout = route.isShowHeader
                      ? DefaultComponent
                      : React.Fragment;
                    return (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={
                          <Layout>
                            <Page />
                          </Layout>
                        }
                      />
                    );
                  })}
                </Routes>
              </FilterProvider>
            </div>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

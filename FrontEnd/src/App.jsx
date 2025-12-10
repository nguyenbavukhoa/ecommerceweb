import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { routes } from "./routes";
import { FilterProvider } from "./context/FilterProvider";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartProvider";
import { initializeDatabase } from "./data/mockData";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";
import "./css/category.css";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <NotificationProvider>
              {/* --- SỬA TẠI ĐÂY: Đưa FilterProvider ra ngoài CartProvider --- */}
              <FilterProvider>
                <CartProvider>
                  {/* Bên trong CartProvider mới render Routes */}
                  <Routes>
                    {routes.map((route) => {
                      const Page = route.page;
                      const Layout = route.isShowHeader
                        ? DefaultComponent
                        : React.Fragment;

                      let elementToRender = (
                        <Layout>
                          <Page />
                        </Layout>
                      );

                      if (route.isPrivate) {
                        elementToRender = (
                          <ProtectedRoute>{elementToRender}</ProtectedRoute>
                        );
                      }

                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={elementToRender}
                        />
                      );
                    })}
                  </Routes>
                </CartProvider>
              </FilterProvider>
              {/* ----------------------------------------------------------- */}
            </NotificationProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

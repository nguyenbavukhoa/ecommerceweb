import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { routes } from "./routes";
import { CategoryProvider } from "./Hooks/useCategory";

// Import custom CSS
import "./css/category.css";

function App() {
  return (
    <div>
      <CategoryProvider>
        <Router>
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
      </Router>
      </CategoryProvider>
    </div>
  );
}

export default App;

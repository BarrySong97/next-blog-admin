import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Dashboard from "./pages/Dashboard/index.tsx";
import Login from "./pages/Login/index.tsx";
import Posts from "./pages/Posts/index.tsx";
import { AuthProvider, RequireAuth } from "./auth/index.tsx";
import NewPost from "./pages/NewPost/index.tsx";
import Categories from "./pages/Categories/index.tsx";
import Photos from "./pages/Photos/index.tsx";
import Projects from "./pages/Projects/index.tsx";
import Setting from "./pages/Setting/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <RequireAuth>
          <App />
        </RequireAuth>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "posts/new",
        element: <NewPost />,
      },
      {
        path: "posts/:id",
        element: <NewPost />,
      },
      {
        path: "photos",
        element: <Photos />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "settings",
        element: <Setting />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

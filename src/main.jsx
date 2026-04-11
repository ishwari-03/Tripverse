import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import CreateTrip from "./create-trip/index.jsx";
import Header from "./components/custom/Header.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ViewTrip from './view-trip/[tripId]/index.jsx'
import Mytrips from "./my-trips/index.jsx";
import { Toaster } from "sonner";

// Layout component to provide a consistent Header across all pages
const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: '/create-trip',
        element: <CreateTrip />
      },
      {
        path: '/view-trip/:tripId',
        element: <ViewTrip />
      },
      {
        path: '/my-trips',
        element: <Mytrips />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

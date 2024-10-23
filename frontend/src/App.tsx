import HomePage from "@/pages/homepage";
import ProfilePage from "@/pages/profile-page";
import Layout from "@/layout/layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />
      },
      {
        path: "/profile",
        element: <ProfilePage />
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
])

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}

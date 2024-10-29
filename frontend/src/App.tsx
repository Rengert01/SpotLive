import HomePage from "@/components/homepage.tsx";
import ProfilePage from "@/components/profile-page.tsx";
import Layout from "@/layout/layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";

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

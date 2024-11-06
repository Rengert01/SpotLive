import HomePage from "@/components/homepage.tsx";
import ProfilePage from "@/components/profile-page.tsx";
import Layout from "@/layout/layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import { Toaster } from "@/components/ui/toaster";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

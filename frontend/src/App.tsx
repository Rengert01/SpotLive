import HomePage from "@/pages/homepage";
import ProfilePage from "@/pages/profile-page";
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
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background">
          <RouterProvider router={router} />
        </main>
      </body>
    </html>
  )
}

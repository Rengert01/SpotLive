import HomePage from '@/pages/homepage.tsx';
import Layout from '@/layout/layout';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import { Toaster } from '@/components/ui/toaster';
import axios from '@/config/axios';
import UserProfile from '@/pages/user-page';
import ProfilePage from './pages/profile-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: `/user/:id`,
        element: <UserProfile />,
      },
    ],
    loader: async () => {
      // TODO: This can be a custom hook to set user information (an auth provider)
      try {
        await axios.get('/api/auth/session');
        return true;
      } catch (err) {
        console.error(err);
        return redirect('/login');
      }
    },
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

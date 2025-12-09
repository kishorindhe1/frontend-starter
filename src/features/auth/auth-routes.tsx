import ForgotPasswordPage from './pages/forgot-password-page';
import LoginPage from './pages/login-page';

export const authRoutes = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
];

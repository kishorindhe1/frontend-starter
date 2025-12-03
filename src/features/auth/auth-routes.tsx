import { LoginForm, RegisterForm } from "@/features/auth";

export const authRoutes = [
  {
    path: "/",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
];

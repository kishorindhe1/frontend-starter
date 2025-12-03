import { useRoutes } from "react-router-dom";

import { authRoutes } from "@/features/auth/auth-routes";

export default function PublicRoutes() {
  const routes = [...authRoutes];

  return useRoutes(routes);
}

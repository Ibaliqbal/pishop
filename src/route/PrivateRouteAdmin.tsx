import { AuthContext } from "@/context/auth.context";
import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteAdminProps = {
  children: ReactNode;
};

const PrivateRouteAdmin = ({ children }: PrivateRouteAdminProps) => {
  const authContext = useContext(AuthContext);
  if (authContext?.user?.email === "adminpishop@gmail.com") {
    return <Navigate to={"/"} />;
  }
  return children;
};

export default PrivateRouteAdmin;

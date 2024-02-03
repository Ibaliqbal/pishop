import { AuthContext } from "@/context/auth.context";
import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const authContext = useContext(AuthContext);
  if (!authContext?.user) {
    return <Navigate to={"/login"} />;
  }
  return children;
};

export default PrivateRoute;

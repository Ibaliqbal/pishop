import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth.context";
import { IoHomeSharp } from "react-icons/io5";
import { motion } from "framer-motion";

const route = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/profile",
    label: "Profile",
  },
  {
    path: "/",
    label: "Cart",
  },
  {
    path: "/",
    label: "Product Promo",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const location = useLocation();

  return (
    <header className="w-full text-white p-4 mb-6 flex items-center justify-between">
      <motion.h1
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "backInOut" }}
        className="font-bold text-2xl"
      >
        PiShopp
      </motion.h1>
      {location.pathname === "/profile" ||
      location.pathname === "/profile/cart" ||
      location.pathname === "/profile/transaction" ||
      location.pathname === "/profile/dashboard" ||
      location.pathname === "/profile/report" ? (
        authContext?.user ? (
          <div className="flex gap-3 items-center">
            <IoHomeSharp
              className="text-2xl cursor-pointer"
              onClick={() => navigate("/")}
            />
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-800 text-white"
              onClick={() => authContext.SignOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <IoHomeSharp
              className="text-2xl cursor-pointer"
              onClick={() => navigate("/")}
            />
            <Button
              type="button"
              onClick={() => navigate("/login")}
              className="text-white bg-slate-600 hover:bg-slate-800"
            >
              Login
            </Button>
          </div>
        )
      ) : (
        <div className="flex items-center gap-3">
          <nav
            className={`fixed bottom-0 left-0 w-full flex justify-center items-center py-4 lg:p-0 lg:static lg:block bg-blue-400`}
          >
            <ul
              className={`flex items-center ${
                isOpen ? "flex-col" : null
              } gap-4 navbar`}
            >
              {route.map((to, i) => (
                <motion.li
                  animate={{ scale: 1, opacity: 1 }}
                  initial={{ opacity: 0, scale: 0 }}
                  transition={{ type: "tween", duration: 1, delay: i * 0.2 }}
                  className="inline-block cursor-pointer"
                  key={i}
                >
                  <NavLink to={to.path}>{to.label}</NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

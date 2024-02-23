import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth.context";
import { IoHomeSharp } from "react-icons/io5";
import { motion } from "framer-motion";

const route = [
  {
    path: "/profile",
    label: "Profile",
  },
  {
    path: "/",
    label: "Product Promo",
  },
];

const profileRoute = [
  "/profile",
  "/profile/cart",
  "/profile/transaction",
  "/profile/dashboard",
  "/profile/report",
  "/profile/product_manage",
  "/on_the_way",
  "/purchase_history",
  "/gift_rating",
];

const Navbar = () => {
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
      {profileRoute.includes(location.pathname) ? (
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
            className={`fixed bottom-0 left-0 w-full z-20 lg:z-0 bg-slate-800 lg:bg-transparent flex justify-center items-center py-4 lg:p-0 lg:static lg:block`}
          >
            <ul className={`flex items-center gap-4 navbar`}>
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

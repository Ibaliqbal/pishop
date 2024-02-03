import { DocumentData } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

type SidebarProps = {
  data: DocumentData | null | undefined;
};

const routeAdmin = [
  {
    path: "/profile",
    label: "Dashboard",
  },
  {
    path: "/profile/report",
    label: "Report",
  },
];

const routeUser = [
  {
    path: "/profile",
    label: "Profile",
  },
  {
    path: "/profile/cart",
    label: "Cart",
  },
  {
    path: "/profile/transaction",
    label: "Transaction",
  },
];

const Sidebar = ({ data }: SidebarProps) => {
  return (
    <aside className="text-white col-span-1 bg-[#1e1e1e84] h-full sticky max-h-[100svh] top-0">
      <ul className="grid gap-9 side-list text-lg">
        {data
          ? data.role === "user"
            ? routeUser.map((route, i) => (
                <motion.li
                  className="w-full px-3 py-4 text-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2, delay: i * 0.2, type: "spring" }}
                  key={i}
                >
                  <NavLink to={route.path}>{route.label}</NavLink>
                </motion.li>
              ))
            : routeAdmin.map((route, i) => (
                <motion.li
                  className="w-full px-3 py-4 text-center"
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    type: "spring",
                  }}
                >
                  <NavLink to={route.path}>{route.label}</NavLink>
                </motion.li>
              ))
          : null}
      </ul>
    </aside>
  );
};

export default Sidebar;

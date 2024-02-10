import DefaultLayout from "@/components/Layout/DefaultLayout";
import { useLocation } from "react-router-dom";
import Profile from "./Profile";
import Cart from "./Cart";
import Transaction from "./Transaction";
import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";
import UserReport from "./UserReport";
import ManageDashboard from "./ManageDashboard";
import { useGetUserById } from "@/hooks/useGetUserById";

type DasboarUserProps = {
  data: DocumentData | null | undefined;
  user: User | null | undefined;
  id: string | undefined;
};

const Dashboard = () => {
  const { data, user, id } = useGetUserById();
  return (
    <DefaultLayout>
      <section className="w-full text-white">
        {data ? (
          <>
            <section className="w-full">
              {data.role === "user" ? (
                <DashboardUser data={data} user={user} id={id} />
              ) : (
                <DashboardAdmin />
              )}
            </section>
          </>
        ) : (
          <div className="loader"></div>
        )}
      </section>
    </DefaultLayout>
  );
};

const DashboardUser = ({ data, user, id }: DasboarUserProps) => {
  const location = useLocation();
  return location.pathname === "/profile" ? (
    <Profile data={data} user={user} id={id} />
  ) : location.pathname === "/profile/cart" ? (
    <Cart />
  ) : (
    <Transaction />
  );
};

const DashboardAdmin = () => {
  const location = useLocation();
  return location.pathname === "/profile" ||
    location.pathname === "/profile/product_manage" ? (
    <ManageDashboard />
  ) : (
    <UserReport />
  );
};

export default Dashboard;

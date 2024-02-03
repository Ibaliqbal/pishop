import {
  HiOutlineShoppingBag,
  HiUser,
  HiOutlineSpeakerphone,
} from "react-icons/hi";
import CountUp from "react-countup";
import { useGetUser } from "@/hooks/useGetUser";
import { GetDataType } from "@/types/data.type";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Title from "@/components/Title";
import UserDataTable from "./data-table";
import { columns } from "./columns";
import { useNavigate } from "react-router-dom";
const ManageDashboard = () => {
  const data = useGetUser();
  const navigate = useNavigate();
  return (
    <section className="text-white p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Title size="text-3xl" text="Dashboard" />
        {data
          ?.filter((doc: GetDataType) => doc.role === "admin")
          .map((doc: GetDataType) => (
            <div className="flex gap-3 items-center" key={doc.id}>
              <Avatar className="w-[50px] h-[50px]">
                <AvatarImage alt="Profile" src={doc.image} />
              </Avatar>
              <h2>{doc.username}</h2>
            </div>
          ))}
      </div>
      <div className="grid md:grid-cols-3 gap-2">
        <div className="p-4 relative bg-white/40 w-full h-40 flex flex-col items-end justify-end gap-3 rounded-md cursor-pointer">
          <HiUser className="text-[120px] opacity-50 absolute -left-[5px] top-0" />
          <h1 className="font-semibold text-xl">
            {data ? (
              <CountUp
                start={0}
                end={
                  data.filter((doc: GetDataType) => doc.role !== "admin").length
                }
                duration={5}
              />
            ) : (
              "0"
            )}
          </h1>
          <p>Total User</p>
        </div>
        <div className="p-4 relative bg-white/40 w-full h-40 flex flex-col items-end justify-end gap-3 rounded-md cursor-pointer">
          <HiOutlineShoppingBag className="text-[120px] opacity-50 absolute -left-[5px] top-0" />
          <h1 className="font-semibold text-xl">
            {data ? <CountUp start={0} end={100} duration={10} /> : "0"}
          </h1>
          <p>Total Product</p>
        </div>
        <div
          className="p-4 relative bg-white/40 w-full h-40 flex flex-col items-end justify-end gap-3 rounded-md cursor-pointer"
          onClick={() => navigate("/profile/report")}
        >
          <HiOutlineSpeakerphone className="text-[120px] opacity-50 absolute -left-[5px] top-0" />
          <h1 className="font-semibold text-xl">
            {data ? <CountUp start={0} end={150} duration={5} /> : "0"}
          </h1>
          <p>Total Reports</p>
        </div>
      </div>
      <UserDataTable
        columns={columns}
        data={data?.filter((doc: GetDataType) => doc.role !== "admin")}
      />
    </section>
  );
};

export default ManageDashboard;

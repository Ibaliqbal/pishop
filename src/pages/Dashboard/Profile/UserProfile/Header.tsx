import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { useGetUserById } from "@/hooks/useGetUserById";
import Title from "@/components/Title";

type HeaderProfileProps = {
  setIsOpenEdit: Dispatch<SetStateAction<boolean>>;
};

const HeaderProfile = ({ setIsOpenEdit }: HeaderProfileProps) => {
  const { data, user } = useGetUserById();
  return (
    <header className="w-full flex items-center justify-between gap-6">
      <Title size="text-3xl" text={`Hello, ${data?.username}`} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, type: "spring" }}
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setIsOpenEdit((prev) => !prev)}
      >
        <Avatar className="w-[50px] h-[50px]">
          <AvatarImage
            alt="Profile"
            src={
              user
                ? data?.image
                  ? data.image
                  : "https://github.com/shadcn.png"
                : "https://github.com/shadcn.png"
            }
          />
          <AvatarFallback className="text-black">CN</AvatarFallback>
        </Avatar>
        <h1 className="text-sm md:text-lg">
          {user ? data?.username : "Belum Login"}
        </h1>
      </motion.div>
    </header>
  );
};

export default HeaderProfile;

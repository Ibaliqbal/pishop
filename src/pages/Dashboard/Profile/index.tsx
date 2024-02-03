import { DocumentData } from "firebase/firestore";
import { useState } from "react";
import EditUser from "./EditUser";
import { User } from "firebase/auth";
import UserProfile from "./UserProfile";

type ProfileProps = {
  data: DocumentData | null | undefined;
  user: User | null | undefined;
  id: string | undefined;
};

const Profile = ({ user, data, id }: ProfileProps) => {
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);

  return isOpenEdit ? (
    <EditUser setIsOpenEdit={setIsOpenEdit} data={data} user={user} id={id} />
  ) : (
    <UserProfile setIsOpenEdit={setIsOpenEdit} />
  );
};

export default Profile;

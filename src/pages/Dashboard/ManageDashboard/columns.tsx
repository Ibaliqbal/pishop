import { Button } from "@/components/ui/button";
import { GetDataType } from "@/types/data.type";
import { ColumnDef } from "@tanstack/react-table";
import UserProfileDefault from "@/assets/userProfile.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { toast } from "sonner";

async function handleDeleteUser(id: string) {
  await deleteDoc(doc(db, "users", id));
  toast.success("User deleted successfully")
}

export const columns: ColumnDef<GetDataType>[] = [
  {
    id: "S.No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
    header: "No",
  },
  {
    header: "Profile",
    accessorKey: "image",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Avatar className={`${user.image ? null : "bg-white"}`}>
          <AvatarImage
            src={user.image ? user.image : UserProfileDefault}
            alt={user.username}
          />
        </Avatar>
      );
    },
  },
  {
    header: "Username",
    accessorKey: "username",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <BsThreeDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleDeleteUser(user.id)}
              className="text-red-600 flex items-center gap-3"
            >
              <BsTrash /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

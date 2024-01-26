import React, { useState, useContext } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { dataUser } from "@/types/dataUser.type";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/auth.context";
import { toast } from "sonner";
import { AiOutlineReload } from "react-icons/ai";
import RegistImg from "@/assets/regis.svg";
import { motion } from "framer-motion";

const inputsRegis = [
  {
    type: "text",
    name: "username",
    label: "Username",
    placeholder: "John Doe",
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "example@gmail.com",
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Please input your password...",
  },
];

const FormRegister = () => {
  const [data, setData] = useState({} as dataUser);
  const authContext = useContext(AuthContext);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      Object.keys(data).includes(" ") ||
      Object.keys(data).length === 0 ||
      Object.keys(data).length < inputsRegis.length
    ) {
      toast.error("All input required");
    } else {
      console.log("semua input berhasil di input");
      authContext?.SignUp(data);
    }
  };

  return (
    <motion.div
      className="flex items-center gap-4 signin p-8 rounded-md"
      initial={{ opacity: 0.5, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, type: "spring", stiffness: 100 }}
    >
      <img
        src={RegistImg}
        alt="Regis"
        width={600}
        className="md:block hidden"
      />
      <form
        className="w-[400px] py-6 flex flex-col gap-5 items-center"
        onSubmit={handleCreate}
      >
        <h1 className="font-bold text-xl">Register</h1>
        {inputsRegis.map((input, i) => {
          return (
            <div className="w-[75%] grid gap-2" key={i}>
              <Label htmlFor={input.name}>{input.label}</Label>
              <Input
                placeholder={input.placeholder}
                type={input.type}
                id={input.name}
                name={input.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, [e.target.id]: e.target.value })
                }
              />
            </div>
          );
        })}
        {authContext?.loading ? (
          <Button disabled className="text-white cursor-not-allowed">
            <AiOutlineReload className="mr-2 w-4 h-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="text-white">
            Create
          </Button>
        )}
        <div className="flex gap-3">
          <p>Do you already have an account?</p>
          <Link
            to={"/login"}
            className="text-blue-900 underline underline-offset-8"
          >
            SignIn
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default FormRegister;

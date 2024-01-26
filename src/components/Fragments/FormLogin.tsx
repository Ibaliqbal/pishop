import React, { useContext, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/auth.context";
import { toast } from "sonner";
import { AiOutlineReload } from "react-icons/ai";
import { motion } from "framer-motion";
import LoginImg from "@/assets/signin.svg";
import { FcGoogle } from "react-icons/fc";

const inputsLogin = [
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

export type UserLogin = {
  [index: string]: string;
};

const FormLogin = () => {
  const [data, setData] = useState({} as UserLogin);
  const authContext = useContext(AuthContext);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      Object.keys(data).includes(" ") ||
      Object.keys(data).length === 0 ||
      Object.keys(data).length < inputsLogin.length
    ) {
      toast.error("All input required");
    } else {
      authContext?.SignIn(data);
    }
  };

  return (
    <motion.div
      className="flex items-center gap-4 signin p-6 rounded-md"
      initial={{ opacity: 0.5, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, type: "spring", stiffness: 100 }}
    >
      <img src={LoginImg} alt="Login" width={300} className="md:block hidden" />
      <form
        className="w-[400px] py-6 flex flex-col gap-5 items-center"
        onSubmit={handleLogin}
      >
        <h1 className="font-bold text-xl">SignIn</h1>
        {inputsLogin.map((input, i) => {
          return (
            <div className="w-[75%]" key={i}>
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
          <p>Don't you have an account yet?</p>
          <Link
            to={"/register"}
            className="text-blue-900 underline underline-offset-8"
          >
            Register
          </Link>
        </div>
        <div className="w-[75%] flex flex-col gap-2">
          <h2 className="text-center font-semibold text-xl">Or</h2>
          <hr className="w-[50%] self-center" />
          <section className="flex items-center gap-3 self-center">
            <FcGoogle
              className="text-3xl cursor-pointer"
              onClick={() => {
                authContext?.SignGoogle();
              }}
            />
          </section>
        </div>
      </form>
    </motion.div>
  );
};

export default FormLogin;

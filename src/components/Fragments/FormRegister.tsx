import React, { useState, useContext } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { dataUser } from "@/types/data.type";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth.context";
import { toast } from "sonner";
import { AiOutlineReload } from "react-icons/ai";
import RegistImg from "@/assets/regis.svg";
import { motion } from "framer-motion";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

const registerSchema = z.object({
  username: z.string().refine((val) => val !== "", "Username required"),
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

type TRegisterSchema = z.infer<typeof registerSchema>;

const FormRegister = () => {
  const [data, setData] = useState({} as dataUser);
  const authContext = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      Object.keys(data).includes(" ") ||
      Object.keys(data).length === 0 ||
      Object.keys(data).length < inputsRegis.length
    ) {
      toast.error("All input required");
    } else {
      authContext?.SignUp(data);
      // const SignUp = async (data: dataUser) => {

      // };
    }
  };

  const onSubmitRegis = async (data: TRegisterSchema) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        image: res.user.photoURL ? res.user.photoURL : "-",
        phone: "-",
        address: "-",
        isSeller: false,
        role: "user",
        e_wallet: 1500000,
        timestamp: serverTimestamp(),
      });
      toast.success("Login Successfully");
      navigate("/");
    } catch (error) {
      const err = error as FirebaseError;
      const errorCode = err.code;
      if (errorCode === "auth/email-already-in-use") {
        toast.error("Sorry, email already use");
      } else if (errorCode === "auth/weak-password") {
        toast.error("Sorry, password to weak at least 6 characters");
      }
    }
    console.log(data);
  };

  return (
    <motion.div
      className="flex md:flex-col lg:flex-row items-center gap-4 signin p-8 rounded-md"
      initial={{ opacity: 0.5, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, type: "spring", stiffness: 50 }}
    >
      <img
        src={RegistImg}
        alt="Regis"
        width={600}
        className="md:block hidden"
      />
      <form
        className="w-[400px] py-6 flex flex-col gap-5 items-center text-white"
        onSubmit={handleSubmit(onSubmitRegis)}
      >
        <h1 className="font-bold text-xl">Register</h1>
        <div className="w-[75%] grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            placeholder="John Doe"
            {...register("username")}
            type="text"
            id="username"
            className="text-black"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="w-[75%] grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="example@gmail.com"
            {...register("email")}
            type="email"
            id="email"
            className="text-black"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="w-[75%] grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="********"
            {...register("password")}
            type="password"
            id="password"
            className="text-black"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        {isSubmitting ? (
          <Button disabled>
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
            className="text-blue-500 underline underline-offset-8"
          >
            SignIn
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default FormRegister;

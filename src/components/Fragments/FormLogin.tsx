import { useContext } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth.context";
import { toast } from "sonner";
import { AiOutlineReload } from "react-icons/ai";
import { motion } from "framer-motion";
import LoginImg from "@/assets/signin.svg";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";

const signInSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6, "Password at least 8 word"),
});

type TSignInSchema = z.infer<typeof signInSchema>;

const FormLogin = () => {
  const authContext = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: TSignInSchema) => {
    if (authContext?.user) {
      toast.error("Sorry your have already login");
      navigate("/");
    } else {
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Login successfuly");
        navigate("/");
      } catch (error) {
        toast.error("Sorry, password or email is not valid");
      }
    }
    console.log(data);
  };

  return (
    <motion.div
      className="flex items-center gap-4 signin p-6 rounded-md"
      initial={{ opacity: 0.5, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, type: "spring", stiffness: 50 }}
    >
      <img src={LoginImg} alt="Login" width={300} className="md:block hidden" />
      <form
        className="w-[400px] py-6 flex flex-col gap-5 items-center text-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <h2 className="font-bold text-md">SignIn</h2>
        <div className="w-[75%]">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="expmale@gmail.com"
            type="email"
            id="email"
            {...register("email")}
            className="text-black"
          />
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
        </div>
        <div className="w-[75%]">
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Please input your password"
            type="password"
            id="password"
            className="text-black"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}
        </div>
        {isSubmitting ? (
          <Button disabled>
            <AiOutlineReload className="mr-2 w-4 h-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
        <div className="flex gap-3">
          <p>Don't you have an account yet?</p>
          <Link
            to={"/register"}
            className="text-blue-500 underline underline-offset-8"
          >
            Register
          </Link>
        </div>
        <div className="w-[75%] flex flex-col gap-2">
          <h2 className="text-center font-semibold text-xl">Or</h2>
          <hr className="w-[50%] self-center" />
          <section className="flex items-center gap-3 self-center">
            <div
              className="bg-primary flex items-center gap-3 p-3 rounded-md cursor-pointer"
              onClick={() => {
                if (authContext?.user) {
                  toast.error("Sorry your have already login");
                  navigate("/");
                } else {
                  authContext?.SignGoogle();
                }
              }}
            >
              <FcGoogle className="text-3xl" />
              <p>SignIn with Google</p>
            </div>
          </section>
        </div>
      </form>
    </motion.div>
  );
};

export default FormLogin;

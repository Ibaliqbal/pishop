import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  ReactElement,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { db, auth, googleProvider } from "@/firebaseConfig";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { dataUser } from "@/types/data.type";
import { toast } from "sonner";
import { UserLogin } from "@/components/Fragments/FormLogin";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  SignIn: (data: UserLogin) => Promise<void>;
  SignUp: (data: dataUser) => Promise<void>;
  SignGoogle: () => Promise<void>;
  SignOut: () => Promise<void>;
  user: User | null;
  loading: boolean;
  id: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [user, setUser] = useState<User | null>({} as User);
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const navigate = useNavigate();
  const SignIn = async (data: UserLogin) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Login successfuly");
      navigate("/");
    } catch (error) {
      toast.error("Sorry, password or email is not valid");
    } finally {
      setLoading(false);
    }
  };
  const SignUp = async (data: dataUser) => {
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await setDoc(doc(db, "users", res.user.uid), {
        username: data.username,
        email: data.email,
        password: data.password,
        image: res.user.photoURL ? res.user.photoURL : "-",
        phone: "-",
        address: "-",
        isSeller: false,
        role: "user",
        timestamp: serverTimestamp(),
      });
      toast.success("Login Successfully");
      setUser(res.user);
      navigate("/");
    } catch (error) {
      const err = error as FirebaseError;
      const errorCode = err.code;
      if (errorCode === "auth/email-already-in-use") {
        toast.error("Sorry, email already use");
      } else if (errorCode === "auth/weak-password") {
        toast.error("Sorry, password to weak at least 6 characters");
      }
      //   toast.error("Sorry, an error occurred on the server");
    } finally {
      setLoading(false);
    }
  };

  const SignGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        phone: res.user.phoneNumber ? res.user.phoneNumber : "-",
        image: res.user.photoURL,
        username: res.user.displayName,
        address: "-",
        isSeller: false,
        role: "user",
        timestamp: serverTimestamp(),
      });
      navigate("/");
      toast.success("Login successful");
    } catch (error) {
      console.log(error);
    }
  };

  const SignOut = async () => {
    try {
      await signOut(auth);
      toast.error("Logout successfuly");
      setUser(null);
    } catch (error) {
      toast.error("Sorry, an error occurred on the server");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userdata) => {
      if (userdata) {
        setUser(userdata);
        setId(userdata.uid);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    SignIn,
    SignUp,
    SignOut,
    SignGoogle,
    id,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

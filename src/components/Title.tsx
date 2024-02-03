import { motion } from "framer-motion";

type TitleProps = {
  size: string;
  text: string;
  className?: string
};

const Title = ({ size, text, className }: TitleProps) => {
  return (
    <motion.h1
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, type: "spring", stiffness: 100 }}
      className={`font-bold ${size} ${className}`}
    >
      {text}
    </motion.h1>
  );
};

export default Title;

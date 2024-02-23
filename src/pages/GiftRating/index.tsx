import DefaultLayout from "@/components/Layout/DefaultLayout";
import Title from "@/components/Title";
import { useComments } from "@/hooks/useComments";
import { BsArrowLeft } from "react-icons/bs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Rating, ThinStar } from "@smastrom/react-rating";
import { useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { toast } from "sonner";
import { AiOutlineReload } from "react-icons/ai";
import { useGetUserById } from "@/hooks/useGetUserById";

const GiftRating = () => {
  const { giftComments } = useComments();
  const [rating, setRating] = useState<{ rating: number; id: string }>(
    {} as { rating: number; id: string }
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [teks, setTeks] = useState<string>("");
  const { data, id: idUsers } = useGetUserById();

  const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: "#ffb700",
    inactiveFillColor: "#fbf1a9",
  };

  const handleRating = async (id: string) => {
    const comment = {
      rating: rating.rating,
      teks,
      uploadAt: new Date().getTime(),
      name_customer: data?.username,
      avatar_customer: data?.image,
    };
    const filterComments = giftComments?.find(
      (comment) => comment.idProduct === id
    );
    try {
      setLoading(true);
      const docProduct = await getDoc(doc(db, "allproducts", id));
      if (filterComments) {
        if (!idUsers) return;
        await deleteDoc(
          doc(doc(db, "users", idUsers), "gift_comments", filterComments.id)
        );
      }
      if (!docProduct.exists()) return toast.error("Sorry product not found");
      const q = query(
        collection(db, "users"),
        where("username", "==", docProduct.data().name_seller)
      );

      const docSeller = await getDocs(q);
      if (!docSeller.docs[0].exists()) return;
      await updateDoc(doc(db, "allproducts", id), {
        comments_product: [...docProduct.data().comments_product, comment],
        ratings: docProduct.data()?.ratings
          ? docProduct.data().ratings + rating.rating
          : 0 + rating.rating,
      });
      await updateDoc(doc(docSeller.docs[0].ref, "products", id), {
        comments_product: [...docProduct.data().comments_product, comment],
        ratings: docProduct.data()?.ratings
          ? docProduct.data().ratings + rating.rating
          : 0 + rating.rating,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTeks("");
      setRating({ rating: 0, id: "" });
      location.reload();
    }
  };

  return (
    <DefaultLayout>
      <section className="p-4 md:pb-10 pb-24 text-white">
        <button
          onClick={() => history.back()}
          className="text-white text-3xl mb-10"
        >
          <BsArrowLeft />
        </button>
        <Title text="Gift Rating" size="text-3xl" />
        {giftComments === null ? (
          <div className="loader" />
        ) : giftComments?.length > 0 ? (
          <Accordion type="single" collapsible className="w-full mt-6 ">
            {giftComments.map((comment, i) => {
              return (
                <AccordionItem
                  key={comment.id}
                  value={`item-${i + 1}`}
                  className="w-full mb-4"
                >
                  <AccordionTrigger>
                    <motion.main
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 1,
                        delay: i * 0.2,
                        type: "spring",
                        bounce: 0.5,
                      }}
                      className="w-full flex md:flex-row flex-col gap-4 md:items-center items-start hover:no-underline"
                    >
                      <img
                        src={comment.product.thumbnail_product}
                        alt={comment.product.name_product}
                        className="w-[150px] h-[150px] md:grow-0"
                      />
                      <div className="flex flex-col h-full justify-around md:grow md:gap-16 md:items-start">
                        <h2 className="text-lg font-bold no-underline">
                          {comment.product.name_product}
                        </h2>
                      </div>
                    </motion.main>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-5">
                    <Rating
                      value={rating.id === comment.id ? rating.rating : 0}
                      style={{ maxWidth: 180 }}
                      itemStyles={myStyles}
                      onChange={(rating: number) => {
                        setRating({ id: comment.id, rating: rating });
                      }}
                    />
                    <Textarea
                      placeholder="Input some sentence"
                      className="text-black"
                      value={teks}
                      onChange={(e) => setTeks(e.target.value)}
                    />
                    <Button
                      className="bg-orange-500 hover:bg-orange-700 hover:text-white md:self-start self-end"
                      size={"lg"}
                      variant={"ghost"}
                      disabled={loading}
                      onClick={() => handleRating(comment.idProduct)}
                    >
                      {loading ? (
                        <AiOutlineReload className="animate-spin text-xl" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p>Please buy some product</p>
        )}
      </section>
    </DefaultLayout>
  );
};

export default GiftRating;

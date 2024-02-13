import DefaultLayout from "@/components/Layout/DefaultLayout";
import ProductList from "@/features/products/ProductList";
import BannerSlider from "@/components/BannerSlider";
import "animate.css";
const Home = () => {
  return (
    <DefaultLayout>
      <section className="p-4">
          <BannerSlider />

        <ProductList />
      </section>
    </DefaultLayout>
  );
};

export default Home;

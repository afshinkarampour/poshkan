import React from "react";
import Hero from "../components/Hero";
import LatestCollections from "../components/LatestCollections";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import Slider from "../components/Slider";
import CategoriesCart from "../components/CategoriesCart";
import FixedBackground from "../components/FixedBackground";
import SubCategoriesCarts from "../components/SubCategoriesCarts";
import TypsCart from "../components/TypsCart";

const Home = () => {
  return (
    <div>
      {/* <Hero /> */}
      <Slider />
      <CategoriesCart />
      <TypsCart />
      <LatestCollections />
      <SubCategoriesCarts />
      <BestSeller />
      <OurPolicy />
      <FixedBackground />
    </div>
  );
};

export default Home;

import { Routes, Route } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import CategorizedProducts from "./pages/CategorizedProducts";
import SpecialProducts from "./pages/SpecialProducts";
import Dashboard from "./pages/Dashboard";
import OrderReciverInfo from "./pages/OrderReciverInfo";
import TypedProducts from "./pages/TypedProducts";
import PaymentVerify from "./pages/PaymentVerify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Ads from "./components/Ads";
import MenuBar from "./components/MenuBar";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Ads />
      {/* <div> */}
      {/* px-4 sm:px-[5vw] md:px-[7vw] lg:px-[4vw] */}
      <Navbar />
      <MenuBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<CategorizedProducts />} />
        <Route path="/type" element={<TypedProducts />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/user-info-order" element={<OrderReciverInfo />} />
        <Route path="/special-products" element={<SpecialProducts />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/payment/verify" element={<PaymentVerify />} /> */}
        <Route
          path="/payment/success"
          element={<PaymentResult type="success" />}
        />
        <Route
          path="/payment/failed"
          element={<PaymentResult type="failed" />}
        />
      </Routes>
      {/* </div> */}
      <Footer />
    </div>
  );
};

export default App;

import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../services/axiosInstance";

// import { products as dummyProducts } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "تومان";
  const delivery_fee = 70000; //Post fee
  const itemsPerPage = 16; //for pagination
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [specialName, setSpecialName] = useState("");
  const [currentState, setCurrentState] = useState("SignIn");
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [userInfo, setUserInfo] = useState({
    gender: "",
    name: "",
    family: "",
    phoneNumber: "",
    postalCode: "",
    province: "",
    city: "",
    address: "",
  });
  const [isLogin, setLogin] = useState(false);

  const navigate = useNavigate();

  const addToCart = async (itemId, size, color, selectedProductCount) => {
    if (color === null) {
      toast.error("رنگ مورد نظر خود را انتحاب کنید");
      return;
    }

    if (size === null) {
      toast.error("سایز مورد نظر خود را انتحاب کنید");
      return;
    }

    if (!isLogin) {
      setShowDialogBox(true);
      return;
    }

    let cartData = structuredClone(cartItems);

    if (
      cartData[itemId] &&
      cartData[itemId][`${color},${size}`] === selectedProductCount
    ) {
      toast.error("حداکثر تعداد مجاز انتخاب شده است.");
      return;
    }

    if (cartData[itemId]) {
      if (cartData[itemId][`${color},${size}`]) {
        cartData[itemId][`${color},${size}`] += 1;
      } else {
        cartData[itemId][`${color},${size}`] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][`${color},${size}`] = 1;
    }
    setCartItems(cartData);

    setShowDialogBox(true);

    try {
      await axiosInstance.post(backendUrl + "/api/cart/add", {
        itemId,
        size,
        color,
      });
      toast.success("محصول با موقفقیت به سبد خرید شما اضافه شد");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        // items => id of mahsol && item => size
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const maxQuantityInWateHouse = (productData, size) => {
    const colorAndSize = size.split(",");

    //جهت یافتن تعداد موجودی از محصول انتخاب شده در انبار
    for (let i = 0; i < productData.features.length; i++)
      if (
        productData.features[i].color === colorAndSize[0] &&
        productData.features[i].size === colorAndSize[1]
      )
        return productData.features[i].count;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    try {
      await axiosInstance.post(
        backendUrl + "/api/cart/update",
        { itemId, size, quantity }
        // { headers: { token } }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCartAmount = () => {
    let totalAmountWithDiscount = 0;
    let totalAmount = 0;
    let benefit = 0;
    // items => id of mahsol
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmountWithDiscount += itemInfo.discount
              ? itemInfo.discount * cartItems[items][item]
              : itemInfo.price * cartItems[items][item];
            totalAmount += itemInfo.price * cartItems[items][item];
            benefit = totalAmount - totalAmountWithDiscount;
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    return { totalAmountWithDiscount, totalAmount, benefit };
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list", {
        params: { isPublish: true },
      });

      if (response.data.success && Array.isArray(response.data.products)) {
        // اول محصولاتی که موجودی دارند، بعد ناموجودها
        const sortedProducts = [...response.data.products].sort((a, b) => {
          return a.warehouseInventory === 0
            ? 1
            : b.warehouseInventory === 0
            ? -1
            : 0;
        });

        setProducts(sortedProducts);
      } else {
        toast.error(response.data.message || "خطا در دریافت محصولات");
      }
      // if (response.data.success) {
      //   //اونایی که موجود نیستند میندازه آخر
      //   const sortedproducts = [...response.data.products].sort(
      //     (a, b) => (b.warehouseInventory === 0) - (a.warehouseInventory === 0)
      //   );

      //   setProducts(sortedproducts.reverse());
      // } else {
      //   toast.error(response.data.message);
      // }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    try {
      const response = await axiosInstance.get(
        backendUrl + "/api/cart/get"
        // { headers: { token } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  function convertToPersianDigits(input) {
    if (!input) return null;
    // Convert the input to a string to ensure replace works
    const inputStr = input.toString();
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return inputStr.replace(/\d/g, (digit) => persianDigits[digit]);
  }

  function formatAmount(amount) {
    // Check if the input is a valid number
    if (typeof amount !== "number" && typeof amount !== "string") {
      console.error(
        "Invalid input type. Input must be a number or a numeric string."
      );
      return "Invalid input";
    }

    // Convert input to a string
    const amountStr = amount.toString();

    // Validate if it's a numeric string
    if (!/^\d+$/.test(amountStr)) {
      console.error(
        "Input contains invalid characters. Only numbers are allowed."
      );
      return "Invalid input";
    }

    // Use regex to format with commas
    return amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getUserInfo = async () => {
    try {
      const { data } = await axiosInstance.get(backendUrl + "/api/user/me");
      if (data.success === false) {
        return;
      }

      if (data?.data) {
        setUserInfo((prevState) => ({
          ...prevState,
          gender: data.data.gender,
          name: data.data.name,
          family: data.data.family,
          phoneNumber: data.data.phoneNumber,
          postalCode: data.data.postalCode,
          province: data.data.province,
          city: data.data.city,
          address: data.data.address,
        }));
      } else {
        console.warn("No user data found in response");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await axiosInstance.post(backendUrl + "/api/user/logout");
      toast.success("شما با موفقیت از حساب کاربریتان خارج شدید");
      localStorage.removeItem("isLogin");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      toast.error("خطایی رخ داده است");
    }
  };

  useEffect(() => {
    getProductData();
    // setProducts(dummyProducts);
    setLogin(JSON.parse(localStorage.getItem("isLogin")));
    try {
      if (isLogin === true) {
        getUserInfo();
        getUserCart();
      }
    } catch (error) {
      setLogin(false);
    }
  }, []);

  useEffect(() => {
    setLogin(JSON.parse(localStorage.getItem("isLogin")));
    if (isLogin) {
      getUserInfo();
      getUserCart();
    }
  }, [isLogin]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    getUserCart,
    navigate,
    backendUrl,
    userInfo,
    setCartItems,
    categoryName,
    setCategoryName,
    subCategoryName,
    setSubCategoryName,
    specialName,
    setSpecialName,
    convertToPersianDigits,
    formatAmount,
    itemsPerPage,
    isLogin,
    setLogin,
    handleLogOut,
    currentState,
    setCurrentState,
    maxQuantityInWateHouse,
    showDialogBox,
    setShowDialogBox,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;

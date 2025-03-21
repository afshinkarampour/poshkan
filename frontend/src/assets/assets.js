import logo from "./logo.png";
import slide1 from "./slide1.jpg";
import slide2 from "./slide2.jpg";
import slide3 from "./slide3.jpg";
import slide4 from "./slide4.jpg";
import childCat from "./childCat.png";
import menCat from "./menCat.png";
import menShirt from "./men-shirt.png";
import menTshirt from "./men-t-shirt.png";
import menShalvar from "./men-shalvar.png";
import menHoodi from "./men-hoodi.png";
import menKapshen from "./men-kapshen.png";
import menDoors from "./men-doors.png";
import menShalvarak from "./men-shalvarak.png";
import menZir from "./men-zir.png";
import menJorab from "./men-jorab.png";
import kidTshirt from "./kid-t-shirt.png";
import kidShalvar from "./kid-shalvar.png";
import kidHoodi from "./kid-hoodi.png";
import kidKapshen from "./kid-kapshen.png";
import kidDoors from "./kid-doors.png";
import kidShalvarak from "./kid-shalvarak.png";
import kidJorab from "./kid-jorab.png";
import bg3 from "./bg3.webp";
import bg4 from "./bg4.webp";
import emptycart from "./emptycart.png";
import typeCasual from "./typeCasual.png";
import typeFormal from "./typeFormal.png";
import typeWinterwear from "./typeWinterwear.png";
import typeAccessories from "./typeAccessories.png";

export const assets = {
  logo,
  emptycart,
  bg3,
  bg4,
};

export const sliderImages = [
  {
    id: 1,
    src: slide1,
    alt: "slider1",
  },
  {
    id: 2,
    src: slide2,
    alt: "slider2",
  },
  {
    id: 3,
    src: slide3,
    alt: "slider3",
  },
  {
    id: 4,
    src: slide4,
    alt: "slider4",
  },
];

export const categories = [
  {
    id: 100,
    name: "مردانه",
    src: menCat,
    alt: "دسته‌بندی مردانه",
    subCategory: [
      { id: 1000, name: "پیراهن", src: menShirt },
      { id: 1001, name: "تی‌شرت", src: menTshirt },
      { id: 1002, name: "شلوار", src: menShalvar },
      { id: 1003, name: "هودی و سویشرت", src: menHoodi },
      { id: 1004, name: "کاپشن و پالتو", src: menKapshen },
      { id: 1005, name: "بافت و دورس", src: menDoors },
      { id: 1006, name: "شلوارک", src: menShalvarak },
      { id: 1007, name: "لباس زیر", src: menZir },
      { id: 1008, name: "جوراب", src: menJorab },
    ],
  },
  {
    id: 200,
    name: "بچگانه",
    src: childCat,
    alt: "دسته‌بندی بچگانه",
    subCategory: [
      { id: 2000, name: "پیراهن و تی‌شرت", src: kidTshirt },
      { id: 2001, name: "شلوار", src: kidShalvar },
      { id: 2002, name: "هودی و سویشرت", src: kidHoodi },
      { id: 2003, name: "کاپشن و پالتو", src: kidKapshen },
      { id: 2004, name: "بافت و دورس", src: kidDoors },
      { id: 2005, name: "شلوارک", src: kidShalvarak },
      { id: 2006, name: "جوراب", src: kidJorab },
    ],
  },
];

export const productTypes = [
  { id: 3000, name: "روزمره", src: typeCasual },
  { id: 3001, name: "رسمی", src: typeFormal },
  { id: 3002, name: "زمستانه", src: typeWinterwear },
  { id: 3003, name: "اکسسوری", src: typeAccessories },
];

// export const products = [
//   {
//     _id: "aaa",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 100,
//     img: [product1, product2, product3, product5],
//     category: "Men",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "aab",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 101,
//     img: [product2, product2, product2, product2],
//     category: "Men",
//     subCategory: "Topwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "abb",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 102,
//     img: [product3, product3, product3, product3],
//     category: "Men",
//     subCategory: "Topwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "bbb",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 103,
//     img: [product4, product4, product4, product4],
//     category: "Men",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "aac",
//     name: "Man fit Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 104,
//     img: [product5, product5, product5, product5],
//     category: "Men",
//     subCategory: "Topwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "abc",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 105,
//     img: [product6, product6, product6, product6],
//     category: "Men",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "acc",
//     name: "Man Round Neck bottomfit",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 105,
//     img: [product7, product7, product7, product7],
//     category: "Women",
//     subCategory: "Winterwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "bcc",
//     name: "Man Round Neck fit bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 106,
//     img: [product7, product7, product7, product6],
//     category: "Women",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "ccc",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 107,
//     img: [product9, product9, product9, product9],
//     category: "Women",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "aaaa",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 108,
//     img: [product1, product2, product3, product4],
//     category: "Women",
//     subCategory: "Topwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: true,
//   },
//   {
//     _id: "aabz",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 109,
//     img: [product2, product2],
//     category: "Women",
//     subCategory: "bottom",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "abba",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 110,
//     img: [product3, product3, product3],
//     category: "Women",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: true,
//   },
//   {
//     _id: "bbba",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 111,
//     img: [product4, product4, product4],
//     category: "Women",
//     subCategory: "bottom",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: true,
//   },
//   {
//     _id: "aaca",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 112,
//     img: [product5, product5, product5],
//     category: "Kids",
//     subCategory: "Winterwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "abca",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 113,
//     img: [product6, product6],
//     category: "Kids",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: true,
//   },
//   {
//     _id: "acca",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 114,
//     img: [product7, product7, product7, product7],
//     category: "Kids",
//     subCategory: "Topwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: false,
//   },
//   {
//     _id: "bcca",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 115,
//     img: [product4, product5, product3, product2],
//     category: "kids",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: true,
//   },
//   {
//     _id: "ccca",
//     name: "Man Round Neck bottom",
//     description:
//       "Lorem ipsum dolor sit amet incididunt sed sed dolore occaecat officia et ex. Eu sit non officia commodo. In pariatur veniam commodo ut ipsum dolore non. Commodo ea nulla eu eu. Veniam est do duis reprehenderit sed exercitation nisi nostrud.",
//     price: 116,
//     img: [product9, product9, product9],
//     category: "Kids",
//     subCategory: "Bottomwear",
//     sizes: ["s", "M", "L"],
//     date: 14030803,
//     bestseller: true,
//   },
// ];

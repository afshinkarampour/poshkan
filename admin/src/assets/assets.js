import logo from "./logo.png";
import uploadImage from "./upload-image.png";
import noImage from "./noImage.png";
import product1 from "./product1.jpg";

export const assets = {
  logo,
  uploadImage,
  noImage,
  product1,
};

export const categories = [
  {
    id: 100,
    name: "مردانه",
    alt: "دسته‌بندی مردانه",
    subCategory: [
      { id: 1000, name: "پیراهن" },
      { id: 1001, name: "تی‌شرت" },
      { id: 1002, name: "شلوار" },
      { id: 1003, name: "هودی و سویشرت" },
      { id: 1004, name: "کاپشن و پالتو" },
      { id: 1005, name: "بافت و دورس" },
      { id: 1006, name: "شلوارک" },
      { id: 1007, name: "لباس زیر" },
      { id: 1008, name: "جوراب" },
    ],
  },
  {
    id: 200,
    name: "بچگانه",
    alt: "دسته‌بندی بچگانه",
    subCategory: [
      { id: 2000, name: "پیراهن و تی‌شرت" },
      { id: 2001, name: "شلوار" },
      { id: 2002, name: "هودی و سویشرت" },
      { id: 2003, name: "کاپشن و پالتو" },
      { id: 2004, name: "بافت و دورس" },
      { id: 2005, name: "شلوارک" },
      { id: 2006, name: "جوراب" },
    ],
  },
];

export const productTypes = [
  { id: 3000, name: "روزمره" },
  { id: 3001, name: "رسمی" },
  { id: 3002, name: "زمستانه" },
  { id: 3003, name: "اکسسوری" },
];

export function separate(Number) {
  Number += "";
  Number = Number.replace(",", "");
  let x = Number.split(".");
  let y = x[0];
  let z = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(y)) y = y.replace(rgx, "$1" + "," + "$2");
  return y + z;
}

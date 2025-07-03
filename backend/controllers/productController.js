import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import "dotenv/config";
import * as fs from "fs/promises";
import moment from "jalali-moment";
import Joi from "joi";
import sharp from "sharp"; // Import sharp for image processing
import path from "path";
import { fileURLToPath } from "url"; // برای تبدیل meta.url به مسیر فایل
import { dirname } from "path"; // برای دریافت دایرکتوری

// دریافت مسیر دایرکتوری فایل جاری
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// مسیر فولدرهای ذخیره‌سازی، تنظیم شده برای `backend/uploads`
const uploadsFolder = path.join(__dirname, "..", "uploads");
const originalFolder = path.join(uploadsFolder, "original");

const processImage = async (imagePath) => {
  try {
    const ext = path.extname(imagePath);
    const baseName = path.basename(imagePath, ext);
    const newFileName = `${baseName}_${Date.now()}.webp`;
    const outputPath = path.join(uploadsFolder, newFileName);

    // پردازش و ذخیره تصویر
    const imageBuffer = await sharp(imagePath)
      .resize(1280, 1600)
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    await fs.writeFile(outputPath, imageBuffer);

    // انتقال تصویر اصلی به فولدر `/uploads/original`
    const originalPath = path.join(originalFolder, path.basename(imagePath));
    await fs.rename(imagePath, originalPath);

    return newFileName; // فقط نام فایل را برمی‌گردانیم
  } catch (err) {
    console.error("Error processing image:", err);
    throw err;
  }
};

// تابع برای دریافت لیست تمام تصاویر از پایگاه داده
const getAllProductImages = async () => {
  try {
    // دریافت تمامی محصولات و تصاویر آنها
    const products = await productModel.find({});
    let allImages = [];
    products.forEach((product) => {
      if (product.img && product.img.length > 0) {
        allImages = [...allImages, ...product.img];
      }
    });
    return allImages; // بازگشت لیست تصاویر موجود در پایگاه داده
  } catch (err) {
    console.error("Error fetching product images:", err);
    return [];
  }
};

//---------**************نکته خیلی خیلی مهم******************----------------
//در فولدر uploads فقط باید تصویر محصولات قرار گیرد.
//اگر بخواهیم مثلاً عکس دسته بندی ها رو در سایت توسط مدیر آپلود کنیم، باید برای آن فولدر مجزایی تشکیل بدیم
//به دلیل اینکه پس از عمل add یا edit محصول، تمامی تصویرهای اضافی در این فولدر پاک می‌شوند
// تابع برای پاکسازی فایل‌های اضافی از فولدر `uploads`
const cleanupExteraImagesInUploadsFolder = async () => {
  try {
    // دریافت لیست تصاویر موجود در پایگاه داده
    const allProductImages = await getAllProductImages();

    // دریافت لیست تمام فایل‌های موجود در فولدر original
    const files = await fs.readdir(uploadsFolder);

    // حذف فایل‌هایی که در پایگاه داده وجود ندارند
    for (const file of files) {
      const filePath = path.join(uploadsFolder, file);
      if (!allProductImages.includes(file)) {
        try {
          await fs.unlink(filePath); // حذف فایل
          // console.log(`Deleted ${filePath}`);
        } catch (err) {
          console.error(`Error deleting ${filePath}:`, err);
        }
      }
    }
  } catch (err) {
    console.error("Error cleaning up original images:", err);
  }
};

// حذف فایل‌های داخل فولدر `/uploads/original` پس از پردازش و ذخیره محصول
const cleanupOriginalImages = async () => {
  try {
    const files = await fs.readdir(originalFolder);
    for (const file of files) {
      const filePath = path.join(originalFolder, file);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Error deleting ${filePath}:`, err);
      }
    }
  } catch (err) {
    console.error("Error reading original folder:", err);
  }
};

const addProduct = async (req, res) => {
  try {
    const productSchema = Joi.object({
      name: Joi.string().min(3).max(80).required(),
      description: Joi.string().min(3).max(200).required(),
      price: Joi.number().required(),
      category: Joi.string().required(),
      subCategory: Joi.string().required(),
      productType: Joi.string().required(),
      features: Joi.string().required(),
      userSizeGuide: Joi.string().required(),
      warehouseInventory: Joi.number().required(),
      weight: Joi.number().required(),
      discount: Joi.any(),
      bestSeller: Joi.string().valid("true", "false").required(),
      isPublish: Joi.string().valid("true", "false").required(),
      image1: Joi.object(),
      image2: Joi.object(),
      image3: Joi.object(),
      image4: Joi.object(),
    });
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const {
      name,
      description,
      price,
      category,
      subCategory,
      productType,
      features,
      userSizeGuide,
      warehouseInventory,
      weight,
      discount,
      bestSeller,
      isPublish,
    } = req.body;

    const imgUrls = [];
    for (const imageKey of ["image1", "image2", "image3", "image4"]) {
      const image = req.files[imageKey] && req.files[imageKey][0];
      if (image) {
        const processedImagePath = await processImage(image.path); // Process image with sharp
        imgUrls.push(processedImagePath); // Store the processed image path
      }
    }

    const productData = {
      name,
      description,
      category,
      subCategory,
      productType,
      price: Number(price),
      discount: Number(discount),
      warehouseInventory: Number(warehouseInventory),
      weight: Number(weight),
      bestSeller: bestSeller === "true" ? true : false,
      isPublish: isPublish === "true" ? true : false,
      features: JSON.parse(features),
      userSizeGuide: JSON.parse(userSizeGuide),
      img: imgUrls,
      date: moment().locale("fa").format("YYYY/M/D"),
      // date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    // پس از ذخیره محصول، حذف تصاویر اضافی از فولدر uploads
    await cleanupExteraImagesInUploadsFolder();

    //حذف تصاویر انتقال یافته (تصاویر اصلی بدون تغییر اندازه) از فولدر original
    await cleanupOriginalImages();

    res.status(201).json({ success: true, message: "Product Added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//function for list product
const listProduct = async (req, res) => {
  try {
    const isPublish = req.query.isPublish;
    const products = await productModel.find(
      isPublish ? { isPublished: true } : {}
    );
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//function for removing product
const removeProduct = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { id } = req.body;
    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    // حذف تصاویر از سرور
    if (product.img && product.img.length > 0) {
      for (const imgPath of product.img) {
        const fullPath = path.join(__dirname, "..", "uploads", imgPath);

        try {
          await fs.access(fullPath); // بررسی وجود فایل
          await fs.unlink(fullPath); // حذف فایل
        } catch (err) {
          console.warn(`File not found or already deleted: ${fullPath}`);
        }
      }
    }

    //حذف محصول از سبد خرید تمام کاربران
    await userModel.updateMany(
      { [`cartData.${id}`]: { $exists: true } }, // شرط: کاربرانی که این محصول را در سبد دارند
      { $unset: { [`cartData.${id}`]: 1 } } // حذف محصول از سبد آنها
    );

    // حذف محصول از دیتابیس
    await productModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body; // تغییر به req.params برای خوانایی بیشتر
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update a product
const updateProduct = async (req, res) => {
  try {
    const productSchema = Joi.object({
      productId: Joi.string().hex().length(24).required(),
      name: Joi.string().min(3).max(80).required(),
      description: Joi.string().min(3).max(200).required(),
      price: Joi.number().required(),
      category: Joi.string().required(),
      subCategory: Joi.string().required(),
      productType: Joi.string().required(),
      features: Joi.string().required(),
      userSizeGuide: Joi.string().required(),
      warehouseInventory: Joi.number().required(),
      weight: Joi.number().required(),
      discount: Joi.any(),
      bestSeller: Joi.string().valid("true", "false").required(),
      isPublish: Joi.string().valid("true", "false").required(),
      image1: Joi.alternatives()
        .try(
          Joi.string().min(1), // برای بررسی رشته که URL است
          Joi.object().required() // برای بررسی شیء
        )
        .optional(),
      image2: Joi.alternatives()
        .try(
          Joi.string().min(1), // برای بررسی رشته که URL است
          Joi.object().required() // برای بررسی شیء
        )
        .optional(),
      image3: Joi.alternatives()
        .try(
          Joi.string().min(1), // برای بررسی رشته که URL است
          Joi.object().required() // برای بررسی شیء
        )
        .optional(),
      image4: Joi.alternatives()
        .try(
          Joi.string().min(1), // برای بررسی رشته که URL است
          Joi.object().required() // برای بررسی شیء
        )
        .optional(),
    });
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { productId } = req.body;

    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let i = 0;
    const imgUrls = [];

    for (const imageKey of ["image1", "image2", "image3", "image4"]) {
      const image = req.files[imageKey] && req.files[imageKey][0];

      if (image && !product.img.includes(image.originalname)) {
        const processedImagePath = await processImage(image.path); // Process image with sharp
        imgUrls.push(processedImagePath); // Store the processed image path
      } else if (product.img[i]) {
        imgUrls.push(product.img[i]);
      }
      i++;
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          subCategory: req.body.subCategory,
          productType: req.body.productType,
          features: JSON.parse(req.body.features),
          userSizeGuide: JSON.parse(req.body.userSizeGuide),
          warehouseInventory: req.body.warehouseInventory,
          weight: req.body.weight,
          discount: req.body.discount,
          bestSeller: req.body.bestSeller,
          isPublish: req.body.isPublish,
          img: imgUrls,
        },
      },
      { new: true } // Return the updated document
    );

    // پس از ذخیره محصول، حذف تصاویر اضافی از فولدر uploads
    await cleanupExteraImagesInUploadsFolder();

    //حذف تصاویر انتقال یافته (تصاویر اصلی بدون تغییر اندازه) از فولدر original
    await cleanupOriginalImages();

    res.status(200).json({
      success: true,
      message: "product updated sucessfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct };

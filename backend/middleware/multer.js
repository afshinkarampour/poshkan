import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//------------when useing Liara storage-------------
// const storage = multer.diskStorage({
//   filename: (req, file, callback) => {
//     callback(null, file.originalname);
//   },
// });

//---------------whitout using Liara storage------------
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../uploads")); // ذخیره در backend/uploads
  },
  filename: (req, file, callback) => {
    // Generate a unique filename (timestamp + file extension)
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    callback(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

export default upload;

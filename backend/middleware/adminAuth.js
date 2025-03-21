import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  const token = req.cookies.adminAccessToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token Not Provided" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_AMIN_ACCESS_SECRET);
    req.admin = { email: token_decode.email };
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;

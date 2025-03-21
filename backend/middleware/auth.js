import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token Not Provided" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: token_decode.id, name: token_decode.name };
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;

import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { createResponse, ErrorResponse } from "../utils/responseWrapper.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json(ErrorResponse(400,"User already exist"));

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

   return  res.status(201).json(createResponse(201,user,"user create successfully"));
  } catch (error) {
    return res.status(500).json(ErrorResponse(500,"internal server error"));
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(ErrorResponse(400,"User Not Found"));


    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json(ErrorResponse(400,"Invalid credential"));

    

    return res.status(200).json(createResponse(200,user,{}));
  } catch (error) {
    return res.status(500).json(ErrorResponse(500,"internal server error"));
  }
};

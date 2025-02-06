import { Request, Response } from "express";
import { signInUser, userRegister } from "../usecases/authUseCases";

const register = async (req: Request, res: Response) => {
  try {
    const user = await userRegister(req.body);
    res.status(200).json({
      success: true,
      message: "user created successfully",
      user,
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { token, refreshToken, user } = await signInUser(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      token,
      user: { name: user.firstName, id: user._id },
      message: "Successfully Logged in",
    });
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred";
    res.status(400).json({ success: false, error: errorMessage });
  }
};

export default { register, signIn };

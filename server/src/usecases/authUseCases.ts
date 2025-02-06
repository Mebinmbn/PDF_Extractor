import { IUser } from "../models/userModel";
import authRepository from "../repositories/authRepository";

import { comparePassword, hashPassword } from "../services/bcryptService";
import { generateRefreshToken, generateToken } from "../services/tokenService";

import validation from "../utils/validation";

export const userRegister = async (user: IUser) => {
  try {
    validation.validateUserSignup(user);
    const existinguser = await authRepository.findUserByEmail(user.email);
    if (existinguser) {
      throw new Error("User already exist with this email");
    }
    user.password = await hashPassword(user.password);
    const respone = await authRepository.createUser(user);
    console.log(respone);
    return respone;
  } catch (error) {
    throw new Error("Error in register new user");
  }
};

export const signInUser = async (email: string, password: string) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  } else if (!user.isVerified) {
    throw new Error("User is not verified");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(user.firstName, user.id);
  const refreshToken = generateRefreshToken(user.firstName, user.id);
  return { token, refreshToken, user };
};

import { IUser } from "../models/userModel";

const validateUserSignup = (userData: IUser) => {
  console.log("Reached validation");
  if (
    !userData.firstName ||
    !userData.lastName ||
    !userData.email ||
    !userData.phone
  ) {
    throw new Error("All fields are required");
  }
  // Additional validation logic can be added here
};

const validateUserSignin = (userData: IUser) => {
  if (!userData.email || !userData.password) {
    throw new Error("All fields are required");
  }
};

export default {
  validateUserSignup,
  validateUserSignin,
};

import UserModel, { IUser } from "../models/userModel";

const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await UserModel.findOne({ email });
  console.log("find user by email ", user);
  return user;
};

const createUser = async (user: Partial<IUser>) => {
  try {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error("Error in creating new user");
  }
};

const verifyUser = async (email: string): Promise<IUser | null> => {
  const user = await UserModel.findOneAndUpdate(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  );

  return user;
};

const resetPassword = async (hashedPassword: string, email: string) => {
  try {
    const patient = await UserModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return patient;
  } catch (error) {
    throw new Error("Error in reseting password");
  }
};

export default { createUser, findUserByEmail, verifyUser, resetPassword };

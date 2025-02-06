import UserModel, { IUser } from "../models/userModel";

const verifyPatient = async (email: string): Promise<IUser | null> => {
  const patient = await UserModel.findOneAndUpdate(
    { email },
    { $set: { verified: true } },
    { new: true }
  );
  return patient;
};

export default verifyPatient;

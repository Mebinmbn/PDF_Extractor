import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  isVerified: boolean;
  registeredAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now },
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;

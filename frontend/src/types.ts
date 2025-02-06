import { IUser } from "./../../server/src/models/userModel";

export interface PDF {
  _id: string;
  fileReference: string;
  userId: IUser;
  contentType: string;
  createdAt: Date;
}

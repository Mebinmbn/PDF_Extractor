import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPDF extends Document {
  // title: string;
  fileReference: string;
  userId: Schema.Types.ObjectId;
  contentType: string;
}

const PDFSchema: Schema<IPDF> = new Schema<IPDF>(
  {
    // title: { type: String, required: true },
    fileReference: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    // contentType: { type: String },
  },
  {
    timestamps: true,
  }
);

const PDFModel: Model<IPDF> = mongoose.model<IPDF>("PDF", PDFSchema);

export default PDFModel;

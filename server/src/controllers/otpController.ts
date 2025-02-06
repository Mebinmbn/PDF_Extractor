import { Request, Response } from "express";
import { sendVerificationEmail, verifyEmail } from "../usecases/otpUsecases";
import { emailService } from "../services/emailService";

export const sendVerification = async (req: Request, res: Response) => {
  console.log("otpcontroller");
  try {
    const { email, userType } = req.body;
    console.log(email, userType);

    const otp = await sendVerificationEmail(email, emailService, userType);
    console.log("otp cotroller", otp);
    if (otp) {
      res.status(200).json({ success: true, message: "OTP sent successfully" });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { email, otp, userType } = req.body;
    console.log(email, otp, userType);
    const isVerified = await verifyEmail(email, otp, userType);
    if (isVerified) {
      res.status(200).json({ success: true, email, message: "Email verified" });
    } else {
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

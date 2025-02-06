const otpMap = new Map<string, string>();

export const generateOTP = (email: string): string => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpMap.set(email, otp);

  setTimeout(() => otpMap.delete(email), 2 * 60 * 1000);
  return otp;
};
//////////////////////////////////////////////////////
export const verifyOTP = (email: string, otp: string): boolean => {
  const storedOtp = otpMap.get(email);
  console.log(otpMap);
  if (storedOtp === otp) {
    otpMap.delete(email);
    return true;
  }
  return false;
};

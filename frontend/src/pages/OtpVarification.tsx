import React, {
  FormEvent,
  useCallback,
  useState,
  useEffect,
  CSSProperties,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import background from "../assets/login_background.jpg";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "[#007E85]",
};

const OtpVerification = () => {
  const initialValue = {
    one: "",
    two: "",
    three: "",
    four: "",
  };
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(initialValue);
  const [timer, setTimer] = useState(0);
  const location = useLocation();
  const { email } = location.state || "a@gmail.com";

  useEffect(() => {
    const startTime = localStorage.getItem("otpStartTime");
    if (startTime) {
      const elapsedTime = Math.floor(
        (new Date().getTime() - parseInt(startTime)) / 1000
      );
      const remainingTime = 120 - elapsedTime;
      if (remainingTime > 0) {
        setTimer(remainingTime);
      }
    }
  }, []);

  const onChangeHandle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (value.length <= 1) {
        setOtpValues((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    },
    []
  );

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text");
    const otp = paste.split("");

    if (otp.length === 4) {
      setOtpValues({
        one: otp[0],
        two: otp[1],
        three: otp[2],
        four: otp[3],
      });
    }
    e.preventDefault();
  };

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const otp =
      otpValues.one + otpValues.two + otpValues.three + otpValues.four;
    console.log(otp);
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/otp/verify",
        {
          email,
          otp,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(isLoading, response);
      toast.success("OTP verified successfully. Your email is verified.");
      setOtpValues(initialValue);
      localStorage.removeItem("otpStartTime");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendClick = async () => {
    try {
      setIsLoading(true);
      setIsOtpSent(true);

      const startTime = new Date().getTime();

      const response = await axios.post(
        "http://localhost:8080/api/otp/send",
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      localStorage.setItem("otpStartTime", startTime.toString());
      setTimer(120);
      toast.success("OTP sent successfully. Please check your email.");
      setOtpValues(initialValue);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
      setIsOtpSent(false);
    }
  };

  useEffect(() => {
    const startTime = localStorage.getItem("otpStartTime");
    if (startTime) {
      const elapsedTime = Math.floor(
        (new Date().getTime() - parseInt(startTime)) / 1000
      );
      const remainingTime = 120 - elapsedTime;
      if (remainingTime > 0) {
        setTimer(remainingTime);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div>
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('${background}')` }}
      >
        <div className="bg-white bg-opacity-10  backdrop-filter backdrop-blur-lg h-[20rem] w-96 text-center p-4 drop-shadow-xl border-2">
          <h1 className="text-2xl font-bold pt-2 pb-2 ">OTP Verification</h1>
          <p className="m-4">Enter your OTP</p>
          <form onSubmit={verifyOtp}>
            <div className="flex justify-between text-center w-64 mx-auto mt-5">
              <input
                type="text"
                name="one"
                value={otpValues.one}
                onChange={onChangeHandle}
                onPaste={handlePaste}
                className="h-12 w-12 border-[1px] border-[#007E85] bg-blue-100 text-center"
                maxLength={1}
              />
              <input
                type="text"
                name="two"
                value={otpValues.two}
                onChange={onChangeHandle}
                onPaste={handlePaste}
                className="h-12 w-12 border-[1px] border-[#007E85] bg-blue-100 text-center"
                maxLength={1}
              />
              <input
                type="text"
                name="three"
                value={otpValues.three}
                onChange={onChangeHandle}
                onPaste={handlePaste}
                className="h-12 w-12 border-[1px] border-[#007E85] bg-blue-100 text-center"
                maxLength={1}
              />
              <input
                type="text"
                name="four"
                value={otpValues.four}
                onChange={onChangeHandle}
                onPaste={handlePaste}
                className="h-12 w-12 border-[1px] border-[#007E85] bg-blue-100 text-center"
                maxLength={1}
              />
            </div>
            <div className="mt-2">
              {isOtpSent && (
                <ClipLoader
                  cssOverride={override}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              )}
            </div>

            {/* <p className="mt-5">
                Time remaining: {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? "0" : ""}
                {timer % 60}
              </p> */}
            <p className="mt-5">
              Didn't get the OTP?{" "}
              <span
                className={`text-blue-800 cursor-pointer ${
                  timer > 0 ? "pointer-events-none text-gray-500" : ""
                }`}
                onClick={timer === 0 ? handleResendClick : undefined}
              >
                Resend OTP{" "}
                {timer > 0 &&
                  `in ${Math.floor(timer / 60)}:${timer % 60 < 10 ? "0" : ""}${
                    timer % 60
                  }`}
              </span>
            </p>
            <button
              type="submit"
              className="border-2  w-20 h-10 font-bold m-4 hover:bg-gray-100"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

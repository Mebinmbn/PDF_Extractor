import React, { FormEvent, useCallback, useEffect, useState } from "react";
import background from "../assets/login_background.jpg";
import image from "../assets/login_image.jpg";
import { toast } from "react-toastify";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { setUser } from "../app/featrue/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface AxiosError {
  response?: {
    data: {
      error?: string;
    };
  };
}

function Signup() {
  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  };
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [signState, setSignState] = useState("Sign in");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneRegex = /^[6-9]\d{9}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (!values.firstName) {
      errors.firstName = "First name is required!";
    } else if (!nameRegex.test(values.firstName)) {
      errors.firstName = "First name contains invalid characters!";
    }

    if (!values.lastName) {
      errors.lastName = "Last name is required!";
    } else if (!nameRegex.test(values.lastName)) {
      errors.lastName = "Last name contains invalid characters!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    if (!values.phone) {
      errors.phone = "Phone is required!";
    } else if (!phoneRegex.test(values.phone)) {
      errors.phone = "Not a valid mobile number";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (!passwordRegex.test(values.password)) {
      errors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    return errors;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await api.post("/auth/register", formData);

        console.log("User created:", response.data);
        toast.success("Account created, please verify your account");
        setLoading(true);
        await api.post("otp/send", {
          email: formData.email,
        });
        console.log(response);
        if (response.data.success) {
          const startTime = new Date().getTime();
          localStorage.setItem("otpStartTime", startTime.toString());
          navigate("/otp", { state: { email: formData.email } });
        }
        setLoading(false);
        setFormData(initialValues);
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError;
        console.error("Error in signup request:", axiosError);
        if (
          axiosError.response &&
          axiosError.response.data.error ===
            "User already exists with this email"
        ) {
          toast.error(
            "User already exists with this email. Please try logging in."
          );
        } else {
          toast.error(axiosError.response?.data.error);
        }
        setFormData(initialValues);
      }
    }
  };

  const validateSigninData = (email: string, password: string) => {
    const errors: FormErrors = {};
    if (!email) {
      errors.email = "Email is required!";
    } else if (!emailRegex.test(email)) {
      errors.email = "This is not a valid email format!";
    }

    if (!password) {
      errors.password = "Password is required!";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }
    return errors;
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateSigninData(formData.email, formData.password);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const email = formData.email;
        const password = formData.password;

        const response = await api.post("/auth/signin", {
          email,
          password,
        });
        console.log(response.data.success);
        if (response.data.success === true) {
          toast.success("Logged in Successfully");
          const { user, token } = response.data;
          dispatch(setUser({ user, token }));
          localStorage.setItem("token", token);
          navigate("/");
        }

        setFormData(initialValues);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(
          "Error in signup request:",
          axiosError.response?.data.error
        );
        toast.error(axiosError.response?.data.error);
        if (axiosError.response?.data.error === "User is not verified") {
          const response = await api.post("/otp/send", {
            email: formData.email,
          });
          console.log(response.data.success);
          if (response.data.success) navigate("/otp");
          setFormData(initialValues);
        }

        setFormData(initialValues);
      }
    }
  };

  return (
    <>
      {!loading && (
        <div
          className={`flex align-center h-screen w-screen p-5 bg-cover bg-center`}
          style={{ backgroundImage: `url('${background}')` }}
        >
          <div className="grid grid-cols-2 w-3/5 h-fit min-h-4/5 m-auto drop-shadow-lg border-2 border-gray-200 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
            <div
              className={` h-full w-full  bg-cover bg-center bg-{background} max-h-4/5 `}
              style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="w-full h-full max-h-4/5  text-center py-10">
              <h1 className="text-2xl font-extrabold mb-2">{signState}</h1>
              {signState === "Sign in" ? (
                <form onSubmit={handleSignIn}>
                  <InputField
                    name="email"
                    value={formData.email}
                    error={formErrors.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <PassField
                    name="password"
                    value={formData.password}
                    error={formErrors.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  <button className=" border-2 p-2 mt-4 mt-2 drop-shadow-lg  w-24 font-bold hover:bg-gray-100 mb-2">
                    Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <InputField
                    name="firstName"
                    value={formData.firstName}
                    error={formErrors.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                  <InputField
                    name="lastName"
                    value={formData.lastName}
                    error={formErrors.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                  <InputField
                    name="email"
                    value={formData.email}
                    error={formErrors.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <InputField
                    name="phone"
                    value={formData.phone}
                    error={formErrors.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                  <PassField
                    name="password"
                    value={formData.password}
                    error={formErrors.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  <button className=" border-2 p-2 mt-4 mt-2 drop-shadow-lg  w-24 font-bold hover:bg-gray-100 mb-2">
                    Sign Up
                  </button>
                </form>
              )}
              {signState === "Sign in" ? (
                <p onClick={() => setSignState("Register")}>
                  New to us{" "}
                  <span className="text-blue-800 cursor-pointer">Register</span>
                </p>
              ) : (
                <p onClick={() => setSignState("Sign in")}>
                  Already have an account{" "}
                  <span className="text-blue-800 cursor-pointer">Sing in</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {loading && <Loader />}
    </>
  );
}

export default Signup;

const InputField = ({
  name,
  value,
  error,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <>
    <input
      type="text"
      name={name}
      className="w-4/5 h-10 p-3 my-2 drop-shadow-lg focus:outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <p className="  text-xs p-0 m-0">{error}</p>
  </>
);

const PassField = ({
  name,
  value,
  error,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <>
    <input
      type="password"
      name={name}
      className="w-4/5 h-10 p-3 my-2 drop-shadow-lg focus:outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <p className=" text-sm p-0 m-0">{error}</p>
  </>
);

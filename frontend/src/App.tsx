import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import OtpVerification from "./pages/OtpVarification";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import MyPdfs from "./pages/MyPdfs";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute children={<Home />} />} />
          <Route path="/login" element={<Signup />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route
            path="/profile"
            element={<ProtectedRoute children={<Profile />} />}
          />

          <Route
            path="/user/blogs"
            element={<ProtectedRoute children={<MyPdfs />} />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

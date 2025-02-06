import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../app/store";
import { clearUser } from "../app/featrue/userSlice";
import { toast } from "react-toastify";

const UserNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const distpatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    distpatch(clearUser());
    toast.success("Logged out successfully");
  };
  return (
    <nav
      className={`text-gray-800 fixed top-0 left-0 w-screen z-10 drop-shadow-sm py-1 px-28 ${
        scrolled ? "bg-[#4fc9fa] drop-shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex gap-10 items-center p-4">
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-blue-800">
            PdfExtractor
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-blue-800">
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-blue-800">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/user/blogs" className="hover:text-blue-800">
              Extracted PDFs
            </Link>
          </li>
        </ul>

        <div className="ml-auto">
          {user && (
            <Link to="/" className="font-bold hover:text-blue-800 mr-5">
              {user.name}
            </Link>
          )}
          {user ? (
            <Link
              to="/login"
              className="font-bold hover:text-blue-800 border-2 border-blue-300 ml-2 px-3 py-2 hover:bg-blue-300 "
              onClick={handleLogout}
            >
              Logout
            </Link>
          ) : (
            <Link
              to="/login"
              className="font-bold hover:text-blue-800  px-4 py-2 "
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNav;

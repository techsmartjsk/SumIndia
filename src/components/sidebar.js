import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, File, Files, User2, LogOut } from "lucide-react";
import logo from "../assets/logo.png";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`h-screen px-5 border-r-[1px] transition-all duration-300 ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        <img src={logo} className="w-[100px] mx-auto rounded-full"></img>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" focus:outline-none"
        ></button>
      </div>
      <div>
        <User2 size={60} className="mx-auto rounded-full border-[2px] p-2" />
        <p className="text-center py-2 text-lg">Jaskirat</p>
      </div>
      <nav className="mt-4">
        <ul className="flex flex-col gap-y-2">
          <li className="p-4 rounded transition">
            <Link to="/" className="flex items-center gap-3">
              <LayoutDashboard size={24} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="p-4 rounded transition">
            <Link to="/prescription/create" className="flex items-center gap-3">
              <File size={24} />
              <span>New Prescription</span>
            </Link>
          </li>
          <li className="p-4 rounded transition">
            <Link to="/" className="flex items-center gap-3">
              <Files size={24} />
              <span>All Prescriptions</span>
            </Link>
          </li>
          <li className="p-4 rounded transition">
            <Link to="/login" className="flex items-center gap-3">
              <LogOut size={24} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

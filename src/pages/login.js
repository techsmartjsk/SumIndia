import { useState } from "react";
import axios from "axios";
import bg from "../assets/bg.jpg";
import logo from "../assets/logo.png";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("api/users/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("auth-token", token);
      toast.success("Login successful!");
      navigate("/")
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="relative w-full h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-md border p-10 w-[500px] bg-white shadow-lg">
          <img src={logo} className="mx-auto w-[70px] mb-5" alt="Logo" />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border p-2"
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md border p-2"
            />
            <div className="flex gap-x-4 mx-auto py-5">
              <button
                type="submit"
                className="bg-[#08b4fc] w-[100px] p-2 text-white text-md rounded-md"
              >
                Login
              </button>
              <a
                href="/register"
                className="bg-[#08b4fc] w-[100px] p-2 text-white text-md rounded-md text-center"
              >
                Register
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

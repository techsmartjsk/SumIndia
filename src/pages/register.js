import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import bg from "../assets/bg.jpg";
import logo from "../assets/logo.jpg";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/api/users/register", userData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return response.json();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      mutation.reset();
      mutation.mutate({ message: "Passwords do not match!" });
      return;
    }
    mutation.mutate({ name, email, password });
    toast.success("Registration successful! Please log in.");
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
        <div className="rounded-md border-[1px] p-10 w-[500px] bg-white shadow-lg">
          <img src={logo} className="mx-auto w-[70px] mb-5" alt="Logo" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md border-[1px] p-2"
            />
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border-[1px] p-2"
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md border-[1px] p-2"
            />
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="rounded-md border-[1px] p-2"
            />

            {/* Display error or success messages */}
            {mutation.isError && (
              <p className="text-red-500 text-sm">{mutation.error.message}</p>
            )}
            {mutation.isSuccess && (
              <p className="text-green-500 text-sm">
                Registration successful! Please log in.
              </p>
            )}

            <div className="flex gap-x-4 mx-auto py-5">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-[#08b4fc] w-[100px] p-2 text-white text-md rounded-md"
              >
                {mutation.isPending ? "Registering..." : "Register"}
              </button>
              <a
                href="/login"
                className="bg-[#08b4fc] text-center w-[100px] p-2 text-white text-md rounded-md"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

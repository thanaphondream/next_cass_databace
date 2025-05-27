"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginResponse {
  token?: string;
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    try {
      const res = await fetch("https://b4d3-202-29-24-230.ngrok-free.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const data: LoginResponse = await res.json();

        if (data.token) {
          document.cookie = `token=${data.token}; path=/;`;
          localStorage.setItem("token", data.token);
          router.push("/dashboard-layout/Home");
        } else {
          alert("Login failed: Token not found");
        }
      } else {
        const text = await res.text();
        alert("Login failed: " + text);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("เกิดข้อผิดพลาดในการล็อกอิน");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4 w-full"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full"
      >
        Login
      </button>
    </div>
  );
}

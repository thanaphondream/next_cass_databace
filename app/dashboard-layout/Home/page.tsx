"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (!hasToken) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">หน้า Home</h1>
      <p>ยินดีต้อนรับกลับมา!</p>
    </div>
  );
}

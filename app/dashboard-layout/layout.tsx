// app/dashboard-layout/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (!hasToken) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div className="flex">
      <aside className="w-60 h-screen bg-gray-800 text-white p-6 fixed">
        <div className="text-2xl font-bold mb-10">ข้อมูลรายวัน</div>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard-layout/Home" className="hover:text-blue-400">
            หน้าหลัก
          </Link>
          <Link href="/dashboard-layout/Download" className="hover:text-blue-400">
            โหลดข้อมูล
          </Link>
          <Link href="/dashboard-layout/About" className="hover:text-blue-400">
            เกี่ยวกับเรา
          </Link>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white p-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="ml-60 p-6 w-full">{children}</main>
    </div>
  );
}

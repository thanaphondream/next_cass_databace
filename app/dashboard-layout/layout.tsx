"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showSubMenu, setShowSubMenu] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (!hasToken) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    // ถ้า path ตรงกับ Download ให้แสดงเมนูย่อยอัตโนมัติ
    if (pathname === "/dashboard-layout/Download") {
      setShowSubMenu(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const toggleSubMenu = () => {
    setShowSubMenu((prev) => !prev);
  };

  return (
    <div className="flex">
      <aside className="w-60 h-screen bg-gray-800 text-white p-6 fixed">
        <div className="text-2xl font-bold mb-10">ข้อมูลรายวัน</div>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard-layout/Home" className="hover:text-blue-400">
            หน้าหลัก
          </Link>
          <button
            onClick={toggleSubMenu}
            className="text-left hover:text-blue-400"
          >
            ดูข้อมูลต่างๆ
          </button>

          {showSubMenu && (
            <div className="ml-4 mt-2 flex flex-col space-y-1 text-sm text-gray-300">
                <Link href="/dashboard-layout/Download" className="hover:text-blue-400">
                ข้อมูลปริมาณน้ำฝน
              </Link>
              <Link href="/dashboard-layout/Ges/So2" className="hover:text-blue-400">
                ข้อมูลแก๊ช
              </Link>
              <Link href="/dashboard-layout/pm25" className="hover:text-blue-400">
                ข้อมูล PM2.5
              </Link>
            </div>
          )}

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

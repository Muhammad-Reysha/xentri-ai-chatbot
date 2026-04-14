"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  LayoutDashboard,
  Users,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Upload Files", href: "/admin/upload", icon: Upload },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0
        h-screen
        bg-[#0B1B34]
        transition-all duration-300 ease-in-out
        ${open ? "w-[240px]" : "w-[90px]"}
        flex flex-col
        z-50
      `}
    >
      {/* HEADER */}
      <div className="h-20 flex items-center justify-center border-b border-white/10">
        <div className="flex items-center w-full px-5">
          <button
            onClick={() => setOpen(!open)}
            className="text-white"
          >
            <Menu size={26} />
          </button>

          {open && (
            <div className="ml-4 transition-opacity duration-300">
              <Image
                src="/cancer/logo/new-logo.png"
                alt="Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 py-10 flex flex-col gap-6 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`
                  flex items-center
                  ${open ? "justify-start px-4" : "justify-center"}
                  gap-4
                  h-12
                  rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#68E6A8] to-[#2AA0B6] text-black shadow-md"
                      : "text-white hover:bg-white/10"
                  }
                `}
              >
                <item.icon size={22} />
                {open && <span className="text-sm">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-5 border-t border-white/10">
        <div className="flex items-center gap-4 cursor-pointer hover:bg-white/10 h-12 rounded-xl px-4 transition text-white">
          <LogOut size={22} />
          {open && <span className="text-sm">Logout</span>}
        </div>
      </div>
    </aside>
  );
}
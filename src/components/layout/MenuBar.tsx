"use client";

import * as Menubar from "@radix-ui/react-menubar"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Home, Bot, BookMarked, Headset, CircleChevronDown } from "lucide-react"
import { useAppSelector } from "@/lib/hooks/reduxHooks";
import { selectIsAuthenticated } from "@/lib/store/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const pageOptions = [
  { label: "Wall", value: "wall", path: "/", icon: Home },
  { label: "Assistant", value: "assistant", path: "/assistant", authRequired: true, icon: Bot },
  { label: "Collection", value: "collection", path: "/collection", authRequired: true, icon: BookMarked },
  { label: "Support", value: "support", path: "/support", icon: Headset },
]

const MenuBar = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [currentPage, setCurrentPage] = useState(pageOptions[0].label);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const found = pageOptions.find((page) => page.path === currentPath);
    if (found) setCurrentPage(found.label);
  }, []);

  const handleSelect = (page: typeof pageOptions[number]) => {
    if (page.authRequired && !isAuthenticated) {
      router.push("/sign-in")
    } else {
      setCurrentPage(page.label);
      router.push(page.path)
    }
  }

  return (
    <>
      <div className="hidden md:flex p-1">
        <Menubar.Root className="flex">
          <Menubar.Menu>
            {pageOptions.map((page) => {
              const Icon = page.icon;
              return (
                <Menubar.Trigger
                  key={page.value}
                  onClick={() => handleSelect(page)}
                  className="px-3 py-2 vi-button rounded-sm flex items-center gap-2"
                >
                  <Icon size={18} /> {page.label}
                </Menubar.Trigger>
              );
            })}
          </Menubar.Menu>
        </Menubar.Root>
      </div>

      <div className="flex md:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="vi-button outline-0 border-none px-3 flex gap-1 cursor-pointer">
            {currentPage}
            <CircleChevronDown size={16} strokeWidth={2}/>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="bg-white vi-shadow p-1 min-w-[150px] z-20 rounded-2xl">
            {pageOptions.map((page) => {
              const Icon = page.icon;
              return (
                <DropdownMenu.Item
                  key={page.value}
                  onClick={() => handleSelect(page)}
                  className="vi-button vi-text justify-start cursor-pointer flex items-center gap-2 outline-0 border-0"
                >
                  <Icon size={18} /> {page.label}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </>
  );
};

export default MenuBar;
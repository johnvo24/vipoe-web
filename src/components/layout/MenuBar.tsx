"use client"

import { useAppSelector } from "@/lib/hooks/reduxHooks";
import { selectIsAuthenticated } from "@/lib/store/auth/authSlice";
import * as Menubar from "@radix-ui/react-menubar";
import { useRouter } from "next/navigation";

const MenuBar = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return (
    <Menubar.Root className="flex p-1">
      <Menubar.Menu>
        <Menubar.Trigger 
          className="px-4 py-2 hover:bg-gray-200 hover:rounded-sm cursor-pointer"
          onClick={() => router.push('/')}
          >
            Wall
        </Menubar.Trigger>
        <Menubar.Trigger 
          className="px-4 py-2 hover:bg-gray-200 hover:rounded-sm cursor-pointer"
          onClick={() => isAuthenticated ? router.push('/assistant') : router.push('/sign-in')}
          >
            Assistant
        </Menubar.Trigger>
        <Menubar.Trigger 
          className="px-4 py-2 hover:bg-gray-200 hover:rounded-sm cursor-pointer"
          onClick={() => isAuthenticated ? router.push('/collection') : router.push('/sign-in')}
          >
            Collection
        </Menubar.Trigger>
        <Menubar.Trigger 
          className="px-4 py-2 hover:bg-gray-200 hover:rounded-sm cursor-pointer"
          onClick={() => router.push('/support')}
          >
            Support
        </Menubar.Trigger>
      </Menubar.Menu>
    </Menubar.Root>
  )
}

export default MenuBar;
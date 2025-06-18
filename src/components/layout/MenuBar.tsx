"use client"

import * as Menubar from "@radix-ui/react-menubar";
import { useRouter } from "next/navigation";

const MenuBar = () => {
  const router = useRouter();
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
          onClick={() => router.push('/write')}
          >
            Write
        </Menubar.Trigger>
        <Menubar.Trigger 
          className="px-4 py-2 hover:bg-gray-200 hover:rounded-sm cursor-pointer"
          onClick={() => router.push('/edit')}
          >
            Edit
        </Menubar.Trigger>
        <Menubar.Trigger 
          className="px-4 py-2 hover:bg-gray-200 hover:rounded-sm cursor-pointer"
          onClick={() => router.push('/collection')}
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
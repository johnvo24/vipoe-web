import React from 'react'
import MenuBar from '@/components/layout/MenuBar'
import UserMenu from '@/components/layout/UserMenu'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={`${className} header flex w-full justify-between bg-background vi-shadow-b z-5`}>
      <div className="logo_box w-24">
        <p className="logo-text h-full font-bold content-center text-lg text-center tracking-widest">VIPOE</p>
      </div>
      <div className='menu_bar'>
        <MenuBar />
      </div>
      <div className="user_box w-24 inline-flex items-center justify-end pr-4">
        <UserMenu />
      </div>
    </div>
  )
}

export default Header
'use client'

import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { ShoppingBag, Tag, UserCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

const ProfilePage = () => {
  const { user, isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="py-6 px-4">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-20 h-20">
              <Image
                src={user.imageUrl || '/default-avatar.png'}
                alt="Profile Picture"
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-indigo-200"
                priority
              />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-center text-gray-800 mb-6">
            {user.firstName} {user.lastName}
          </h2>
          <nav>
            <ul className="space-y-2">
              <MenuItem href="/historialCompra" icon={ShoppingBag}>
                Mis Compras
              </MenuItem>
              <MenuItem href="/historialVenta" icon={Tag}>
                Mis Ventas
              </MenuItem>
              <MenuItem href="#datos" icon={UserCircle}>
                Mis Datos
              </MenuItem>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Perfil</h1>
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-4">
              <Image
                src={user.imageUrl || '/default-avatar.png'}
                alt="Profile Picture"
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-blue-200"
                priority
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600 mb-1">{user.emailAddresses[0]?.emailAddress}</p>
            <p className="text-gray-500 text-sm">
              {user.createdAt && `Miembro desde ${user.createdAt.toLocaleDateString()}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

type MenuItemProps = {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
};

const MenuItem = ({ href, icon: Icon, children }: MenuItemProps) => {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out"
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="text-sm font-medium">{children}</span>
      </Link>
    </li>
  )
}

export default ProfilePage


"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu,  Home, HelpCircle, Calendar, Ticket, LogIn, UserPlus } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import ClientSearchBar from './ClientSearchBar';
import { useState } from 'react';

export default function Header({ userId }: { userId?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Ticket className="h-6 w-6 text-orange-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Re-Ticket
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <Home className="h-4 w-4" />
            <span>Inicio</span>
          </Link>
          <Link 
            href="/sobre-nosotros" 
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Preguntas Frecuentes</span>
          </Link>
          <Link 
            href="/eventos" 
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <Calendar className="h-4 w-4" />
            <span>Eventos</span>
          </Link>
        </nav>

        {/* Desktop Search and Auth */}
        <div className="hidden md:flex items-center gap-4">
          <ClientSearchBar />
          {!userId ? (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrarse
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/perfil"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                Perfil
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          {userId && <UserButton afterSignOutUrl="/" />}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-orange-500">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                <ClientSearchBar />
                <nav className="flex flex-col gap-4">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Inicio</span>
                  </Link>
                  <Link 
                    href="/sobre-nosotros" 
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Preguntas Frecuentes</span>
                  </Link>
                  <Link 
                    href="/eventos" 
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Eventos</span>
                  </Link>
                </nav>
                {!userId && (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
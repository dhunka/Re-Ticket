"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ShoppingBag, Tag, UserCircle, Loader2, Menu, X } from "lucide-react"; // Añadidos iconos Menu y X
import { UserResource } from "@clerk/types";
import { ConnectMPView } from "@/components/ui/vistaConexionMercado";
import { useRouter } from 'next/navigation' 

// Tipos y interfaces (igual que antes)
type ViewType = "profile" | "connect-mp" | "success" | "purchases" | "sales";

interface MenuItemProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface ProfileViewProps {
  user: UserResource;
}

const ProfilePage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [currentView, setCurrentView] = useState<ViewType>("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Nuevo estado para el sidebar móvil
  

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("status") === "success") {
      setCurrentView("success");
    }
  }, []);

  // Loading y Auth checks quedan igual
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600">
            You need to be signed in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const handleMenuClick =
    (view: ViewType) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setCurrentView(view);
      setIsSidebarOpen(false); // Cerrar sidebar en móvil después de click
    };

  const Sidebar = () => (
    <div
      className={`
      fixed md:relative top-0 left-0 h-full bg-white shadow-lg
      transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:transform-none transition-transform duration-300 ease-in-out
      w-64 z-30
    `}
    >
      {/* Botón cerrar solo visible en móvil */}
      <button
        className="md:hidden absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        onClick={() => setIsSidebarOpen(false)}
      >
        <X className="w-6 h-6" />
      </button>

      <div className="py-6 px-4">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-20 h-20">
            <Image
              src={user.imageUrl || "/default-avatar.png"}
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
            <MenuItem
              href="/historialCompra"
              icon={ShoppingBag}
              onClick={handleMenuClick("purchases")}
            >
              Mis Compras
            </MenuItem>
            <MenuItem
              href="/historialVenta"
              icon={Tag}
              onClick={handleMenuClick("sales")}
            >
              Mis Ventas
            </MenuItem>
            <MenuItem
              href="#"
              icon={UserCircle}
              onClick={handleMenuClick("profile")}
            >
              Mis Datos
            </MenuItem>
            <MenuItem
              href="#"
              icon={UserCircle}
              onClick={handleMenuClick("connect-mp")}
            >
              Conectar Mercadopago
            </MenuItem>
          </ul>
        </nav>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay para móvil cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Header móvil */}
      <div className="md:hidden bg-white shadow-md p-4 sticky top-0 z-10">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {currentView === "profile" && <ProfileView user={user} />}
          {currentView === "connect-mp" && <ConnectMPView />}
          {currentView === "success" && <SuccessView />}
        </div>
      </div>
    </div>
  );
};

// MenuItem component (igual que antes)
const MenuItem: React.FC<MenuItemProps> = ({
  href,
  icon: Icon,
  children,
  onClick,
}) => {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out"
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="text-sm font-medium">{children}</span>
      </a>
    </li>
  );
};

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-800">
        Perfil
      </h1>
      <div className="flex flex-col items-center">
        {/* Contenedor de la imagen */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
          <Image
            src={user.imageUrl || "/default-avatar.png"}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full border-4 border-blue-200"
            priority
          />
        </div>
                {/* Información del usuario */}
                
        <div className="text-center space-y-2 w-full max-w-md px-4">
                    
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                      
          </h2>
                    
          <p className="text-sm md:text-base text-gray-600">
                        {user.emailAddresses[0]?.emailAddress}
                      
          </p>
                    
          <p className="text-xs md:text-sm text-gray-500">
                        
            {user.createdAt &&
              `Miembro desde ${new Date(user.createdAt).toLocaleDateString()}`}
                      
          </p>
                    {/* Sección de estadísticas - Opcional */}
                    
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                        
            <div className="text-center">
                            
              <p className="text-2xl md:text-3xl font-bold text-orange-500">
                0
              </p>
                            
              <p className="text-xs md:text-sm text-gray-600">Compras</p>
                          
            </div>
                        
            <div className="text-center">
                            
              <p className="text-2xl md:text-3xl font-bold text-orange-500">
                0
              </p>
                            
              <p className="text-xs md:text-sm text-gray-600">Ventas</p>
                          
            </div>
                        
            <div className="text-center col-span-2 md:col-span-1">
                            
              <p className="text-2xl md:text-3xl font-bold text-orange-500">
                0%
              </p>
                            
              <p className="text-xs md:text-sm text-gray-600">Satisfacción</p>
                          
            </div>
                      
          </div>
                    {/* Sección de información adicional */}
                    
          <div className="mt-6 space-y-4 text-left">
                        
            <div className="bg-gray-50 p-4 rounded-lg">
                            
              <h3 className="text-sm md:text-base font-semibold text-gray-700 mb-2">
                                Información de Contacto               
              </h3>
                            
              <div className="space-y-2">
                                
                <p className="text-xs md:text-sm text-gray-600">
                                    <span className="font-medium">Email:</span>{" "}
                  {user.emailAddresses[0]?.emailAddress}
                                  
                </p>
                                
                {/* Añade más información de contacto según necesites */}
                              
              </div>
                          
            </div>
                      
          </div>
                  
        </div>
              
      </div>
          
    </div>
  );
};

const SuccessView: React.FC = () => {
  const router = useRouter()

  const handleButtonClick = () => {
    router.push('/VentaEntrada');
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-xl max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8">
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-orange-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800">
          ¡Conexión Exitosa!
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-600 max-w-md px-4">
          Tu cuenta ha sido conectada correctamente con Mercado Pago.
        </p>

        {/* Additional Details */}
        <div className="w-full max-w-md mt-4 p-4 sm:p-6 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-orange-700 mb-2 sm:mb-4">
            ¿Qué sigue?
          </h3>
          
          <ul className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 space-y-2 sm:space-y-3">
            <li className="flex items-center">
              <span className="mr-2 text-orange-500">•</span>
              Ya puedes empezar a vender tickets
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-orange-500">•</span>
              Recibirás los pagos directamente en tu cuenta de Mercado Pago
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-orange-500">•</span>
              Podrás gestionar tus ventas desde el panel de vendedor
            </li>
          </ul>
        </div>

        {/* New: Call-to-action button */}
        <button onClick={handleButtonClick} className="mt-4 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out">
          Vende tu primera entrada
        </button>
      
      </div>
    </div>
  );
};


export default ProfilePage;

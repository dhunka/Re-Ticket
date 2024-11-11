"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import EstadioImage from '../../../public/images/estadio.png';
import HomeImage from '../../../public/images/profile.jpg';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectGroup } from "@/components/ui/select";
import { Globe, Mail, AlertCircle, Calendar1 } from "lucide-react";

export default function EntradaPage() {
  // Establecer la opción predeterminada como "option1"
  const [selectedOption, setSelectedOption] = React.useState<string>("option1");

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    console.log(`Se seleccionó la opción: ${value}`);
  };

  return (
    <div className="min-h-screen bg-[#030303]">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Reducir el gap */}
          <div>
            <div className="relative rounded-lg overflow-hidden mb-4"> {/* Reducción del margen */}
              <Image 
                src={HomeImage} 
                alt="Duki - A.D.A Tour 2024" 
                width={600}  
                height={200} 
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <div className="relative rounded-lg overflow-hidden mb-4"> {/* Reducción del margen */}
              <Image 
                src={EstadioImage} 
                alt="Duki - A.D.A Tour 2024 - Segunda Imagen" 
                width={500}  
                height={100} 
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>

          <div>
            <div className="relative flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Duki - A.D.A Tour 2024</h1>
            </div>
            <Card className="bg-[#aa0608] border-0 mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center text-center text-white">
                    <Globe className="h-6 w-6 mb-2" />
                    <div className="text-sm">Chile</div>
                    <div className="text-xs text-white/70">Se puede revender</div>
                  </div>
                  <div className="flex flex-col items-center text-center text-white">
                    <Calendar1 className="h-6 w-6 mb-2" />
                    <div className="text-sm">15 de noviembre de 2024</div>
                  </div>
                  <div className="flex flex-col items-center text-center text-white">
                    <Mail className="h-6 w-6 mb-2" />
                    <div className="text-sm">Envio a correo electronico</div>
                    <div className="text-xs text-white/70">Entrega Inmediata</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-white">$40.000</div>
                </div>
                <Button className="w-full bg-yellow-400 hover:bg-[#c5a436] text-black">
                  Comprar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-yellow-400/10 border-yellow-400/20 mb-6">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white">
                  <strong className="font-semibold block mb-1">Noticia Importante:</strong>
                  No todas las entradas pueden ser revendidas
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h3 className="text-white text-lg font-semibold">Selecciona una entrada:</h3>
              <Select onValueChange={handleOptionSelect} value={selectedOption}>
                <SelectTrigger className="bg-[#000000] border-0 text-white hover:bg-[#0000]/90 focus:bg-[#0000]/90 focus:outline-none">
                  <SelectValue className="text-white">
                    {selectedOption === "option1"
                      ? "Duki - A.D.A Tour 2024: CANCHA GENERAL"
                      : selectedOption === "option2"
                      ? "Duki - A.D.A Tour 2024: CANCHA VIP"
                      : "Duki - A.D.A Tour 2024: RAPA NUI" }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#000000] border-0 text-white max-h-[250px] overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel className="bg-[#0000]/90 text-white/80 px-4 py-2">
                      Tipos de entradas
                    </SelectLabel>
                    <SelectItem
                      value="option1"
                      className="px-4 py-2 hover:bg-[#0000]/70 focus:bg-[#ffb618]/70 focus:outline-none flex items-center"
                    >
                      <Image 
                        src={HomeImage} 
                        alt="Duki - A.D.A Tour 2024" 
                        width={100}  
                        height={100} 
                        className="object-cover rounded-full mr-3"
                        priority
                      />
                      <div>
                        <div className="font-semibold text-white">Duki - A.D.A Tour 2024</div>
                        <div className="text-xs text-white/70">CANCHA GENERAL</div>
                        <div className="text-xs text-white/70">$45.000</div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="option2"
                      className="px-4 py-2 hover:bg-[#0000]/70 focus:bg-[#df3c6c]/70 focus:outline-none flex items-center"
                    >
                      <Image 
                        src={HomeImage} 
                        alt="Duki - A.D.A Tour 2024" 
                        width={100}  
                        height={100} 
                        className="object-cover rounded-full mr-3"
                        priority
                      />
                      <div>
                        <div className="font-semibold text-white">Duki - A.D.A Tour 2024</div>
                        <div className="text-xs text-white/70">CANCHA VIP</div>
                        <div className="text-xs text-white/70">$85.000</div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="option3"
                      className="px-4 py-2 hover:bg-[#0000]/70 focus:bg-[#e2ff36]/70 focus:outline-none flex items-center"
                    >
                      <Image 
                        src={HomeImage} 
                        alt="Duki - A.D.A Tour 2024" 
                        width={100}  
                        height={100}  
                        className="object-cover rounded-full mr-3"
                        priority
                      />
                      <div>
                        <div className="font-semibold text-white">Duki - A.D.A Tour 2024</div>
                        <div className="text-xs text-white/70">RAPA NUI</div>
                        <div className="text-xs text-white/70">$75.000</div>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

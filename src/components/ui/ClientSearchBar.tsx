'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import Link from 'next/link'; // Asegúrate de que esté importado Link

interface Evento {
  id: number;
  nombre: string;
}

export default function ClientSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null); // Índice del elemento resaltado
  const [isResultsVisible, setIsResultsVisible] = useState(false); // Estado para controlar la visibilidad de los resultados
  const searchRef = useRef<HTMLDivElement>(null); // Ref para el contenedor de la barra de búsqueda

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/buscarEvento?query=${searchTerm}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Error al buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]); // Limpia los resultados si no hay búsqueda
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsResultsVisible(true); // Muestra los resultados mientras se escribe
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita la recarga por defecto del formulario
      if (highlightedIndex !== null) {
        // Si hay un índice resaltado, redirige a ese evento
        const selectedEvent = results[highlightedIndex];
        window.location.href = `/evento/${selectedEvent.id}`;
      } else if (results.length > 0) {
        // Si no hay resaltado pero hay resultados, redirige al primero
        const firstEvent = results[0];
        window.location.href = `/evento/${firstEvent.id}`;
      } else {
        // Aquí podrías redirigir a una página genérica o mostrar un mensaje
        console.log("No se encontraron resultados.");
      }
    } else if (e.key === 'ArrowDown') {
      // Navega al siguiente elemento
      setHighlightedIndex((prevIndex) =>
        prevIndex === null ? 0 : Math.min(results.length - 1, prevIndex + 1)
      );
    } else if (e.key === 'ArrowUp') {
      // Navega al elemento anterior
      setHighlightedIndex((prevIndex) =>
        prevIndex === null ? results.length - 1 : Math.max(0, prevIndex - 1)
      );
    }
  };
  

  const handleClickOutside = (e: MouseEvent) => {
    // Si el clic ocurrió fuera del área de la barra de búsqueda, cierra los resultados
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsResultsVisible(false);
    }
  };

  useEffect(() => {
    // Escucha los clics fuera del contenedor de la barra de búsqueda
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <form className="flex items-center space-x-2" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown} // Añadido el manejador de tecla
          placeholder="Buscar..."
          className="w-full sm:w-64 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
        />
        <Button
          size="icon"
          variant="ghost"
          className="text-orange-500 hover:bg-orange-50"
          onClick={handleSearch} // También se puede hacer clic en el botón para buscar
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Buscar</span>
        </Button>
      </form>

      {loading && <p className="text-gray-500"></p>}

      {isResultsVisible && results.length > 0 && (
        <div className="absolute bg-white shadow-lg w-full sm:w-64 mt-2 rounded-md z-10 max-h-60 overflow-y-auto">
          <ul>
            {results.map((evento, index) => (
              <li
                key={evento.id}
                className={`px-4 py-2 hover:bg-orange-100 ${highlightedIndex === index ? 'bg-orange-100' : ''}`} 
              >
                <Link href={`/evento/${evento.id}`} passHref>
                  <div className="w-full h-full">{evento.nombre}</div> 
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

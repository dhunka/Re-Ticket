'use client';
import { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface Evento {
  id: number;
  nombre: string;
}

export default function ClientSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);

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
  };

  return (
    <div className="relative">
      <form className="flex items-center space-x-2">
        <Input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar..."
          className="w-64 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
        />
        <Button size="icon" variant="ghost" className="text-orange-500 hover:bg-orange-50">
          <Search className="h-5 w-5" />
          <span className="sr-only">Buscar</span>
        </Button>
      </form>

      {loading && <p className="text-gray-500">Cargando...</p>}

      {/* Aquí aseguramos que la lista de resultados aparezca debajo del input */}
      {results.length > 0 && (
        <div className="absolute bg-white shadow-lg w-64 mt-2 rounded-md z-10 max-h-60 overflow-y-auto">
          <ul>
            {results.map((evento) => (
              <li key={evento.id} className="px-4 py-2 hover:bg-orange-100">
                {evento.nombre}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

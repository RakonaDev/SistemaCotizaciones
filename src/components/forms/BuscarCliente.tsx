'use client'

import { Global } from '@/database/Global';
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';

// Tipo para el cliente
interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
}

// Props del componente
interface ClienteSearchProps {
  onClienteSelect?: (cliente: Cliente) => void;
  placeholder?: string;
  nombreCliente?: string
  apiUrl?: string;
}

const BuscarCliente: React.FC<ClienteSearchProps> = ({ 
  onClienteSelect,
  nombreCliente,
  placeholder = "Buscar cliente...",
  apiUrl = "/api/clientes/buscar"
}) => {
  const [query, setQuery] = useState<string>(nombreCliente ?? '');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  useEffect(() => {
    console.log(query)
  }, [query])
  // Función para buscar clientes en el backend
  const buscarClientes = useCallback(async (searchTerm: string) => {
    if (searchTerm.length <= 3) {
      setClientes([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${Global.api}/${apiUrl}?search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al buscar clientes');
      }

      const data = await response.json();
      setClientes(data);
      setShowDropdown(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setClientes([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Efecto para realizar la búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      buscarClientes(query);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [query, buscarClientes]);

  // Manejar cambio en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Manejar selección de cliente
  const handleClienteSelect = (cliente: Cliente) => {
    setQuery(() => `${cliente.nombre}`);
    setShowDropdown(false);
    onClienteSelect?.(cliente);
  };

  // Manejar click fuera del componente
  const handleBlur = () => {
    // Delay para permitir click en opciones
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="relative w-full">
      <label htmlFor="cliente" className='block text-sm font-medium mb-1 text-secondary'>Cliente</label>
      <div className="relative">
        <Input
          type="text"
          label='Cliente'
          value={query}
          id='cliente'
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => query.length > 3 && clientes.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-3 pr-4 py-3 bg-slate-200 text-secondary rounded-lg outline-none"
        />
        
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Dropdown con resultados */}
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {error && (
            <div className="px-4 py-2 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          {!error && clientes.length === 0 && query.length > 3 && !loading && (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No se encontraron clientes
            </div>
          )}

          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              onClick={() => handleClienteSelect(cliente)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{cliente.nombre}</div>
              <div className="text-sm text-gray-600">{cliente.email}</div>
              {cliente.empresa && (
                <div className="text-xs text-gray-500">{cliente.empresa}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de ayuda */}
      {query.length > 0 && query.length <= 3 && (
        <div className="mt-1 text-xs text-gray-500">
          Escribe al menos 4 caracteres para buscar
        </div>
      )}
    </div>
  );
};

export default BuscarCliente;
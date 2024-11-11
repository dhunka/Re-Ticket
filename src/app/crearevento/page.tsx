'use client'
import { useState } from 'react';

export default function CrearEvento() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaEvento, setFechaEvento] = useState('');
  const [fechaTermino, setFechaTermino] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [organizador_id, setOrganizadorId] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          ubicacion,
          fecha_evento: fechaEvento,
          fecha_termino: fechaTermino,
          descripcion,
          categoria,
          id: parseInt(organizador_id),
        }),
      });

    if (res.ok) {
      alert('Evento creado con éxito');
      setErrorMessage(''); 
      const data = await res.json();
      setErrorMessage(data.error || 'Hubo un error al crear el evento');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Crear un Nuevo Evento</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        <div>
          <label>Nombre del evento</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label>Ubicación</label>
          <input 
            type="text" 
            value={ubicacion} 
            onChange={(e) => setUbicacion(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label>Fecha de inicio</label>
          <input 
            type="datetime-local" 
            value={fechaEvento} 
            onChange={(e) => setFechaEvento(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label>Fecha de término</label>
          <input 
            type="datetime-local" 
            value={fechaTermino} 
            onChange={(e) => setFechaTermino(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label>Categoría</label>
          <input 
            type="text" 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label>ID del organizador</label>
          <input 
            type="number" 
            value={organizador_id} 
            onChange={(e) => setOrganizadorId(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Mostrar mensaje de error */}

        <button 
          type="submit" 
          style={{
            padding: '12px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px'
          }}>
          Crear evento
        </button>
      </form>
    </div>
  );
}

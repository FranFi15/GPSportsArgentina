import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AddEditPerson.css';

const AddEditPerson = () => {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '', // Cambiado de 'edad' a 'fechaNacimiento'
    nacionalidad: '',
    categoria: '',
    equipo: '',
    posicion: '',
    inst: '',
  });
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPersona = async () => {
      setError('');
      try {
        const url = tipo === 'jugador' ? `${API_BASE_URL}/api/jugadores/${id}` :`${API_BASE_URL}/api/entrenadores/${id}`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error al cargar ${tipo}`);
        }
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) {
      fetchPersona();
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '', // Inicializado como string vacía
        nacionalidad: '',
        categoria: '',
        equipo: '',
        posicion: '',
        inst: '',
      });
    }
  }, [tipo, id, token, API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Token antes de la petición:', token);
    console.log('Estado isAuthenticated:', isAuthenticated);
    try {
      const url = id ?
        (tipo === 'jugador' ? `${API_BASE_URL}/api/jugadores/${id}` : `${API_BASE_URL}/api/entrenadores/${id}`) :
        (tipo === 'jugador' ?  `${API_BASE_URL}/api/jugadores`: `${API_BASE_URL}/api/entrenadores`);
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, tipo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${id ? 'editar' : 'agregar'} ${tipo}`);
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-edit-person-container">
      <h2 className="add-edit-person-title">{id ? `Editar ${tipo}` : `Agregar Nuevo ${tipo}`}</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="add-edit-person-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input type="text" id="apellido" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="dni">DNI:</label>
          <input type="number" id="dni" name="dni" className="form-control" value={formData.dni} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label> {/* Etiqueta actualizada */}
          <input type="date" id="fechaNacimiento" name="fechaNacimiento" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} /> {/* Tipo actualizado */}
        </div>
        <div className="form-group">
          <label htmlFor="nacionalidad">Nacionalidad:</label>
          <input type="text" id="nacionalidad" name="nacionalidad" className="form-control" value={formData.nacionalidad} onChange={handleChange}  />
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoría:</label>
          <input type="text" id="categoria" name="categoria" className="form-control" value={formData.categoria} onChange={handleChange}  />
        </div>
        <div className="form-group">
          <label htmlFor="equipo">Equipo:</label>
          <input type="text" id="equipo" name="equipo" className="form-control" value={formData.equipo} onChange={handleChange} />
        </div>
        {tipo === 'jugador' && (
          <>
            <div className="form-group">
              <label htmlFor="posicion">Posición:</label>
              <select id="posicion" name="posicion" className="form-control" value={formData.posicion} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                <option value="base">Base</option>
                <option value="escolta">Escolta</option>
                <option value="alero">Alero</option>
                <option value="ala-pivot">Ala-Pivot</option>
                <option value="pivot">Pivot</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="inst">Instagram:</label>
              <input type="text" id="inst" name="inst" className="form-control" value={formData.inst} onChange={handleChange} />
            </div>
          </>
        )}
        {tipo === 'entrenador' && (
          <div className="form-group">
            <label htmlFor="inst">Instagram:</label>
            <input type="text" id="inst" name="inst" className="form-control" value={formData.inst} onChange={handleChange} />
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="submit-button">{id ? 'Guardar Cambios' : 'Agregar'}</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/admin')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AddEditPerson;
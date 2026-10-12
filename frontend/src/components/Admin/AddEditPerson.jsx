import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { countries, countriesFromValue, flagSrc } from '../../data/countries';
import './AddEditPerson.css';

const emptyForm = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  nacionalidad: [],
  categoria: '',
  equipo: '',
  posicion: '',
  inst: '',
  eurobasket: '',
  highlights: '',
  googleDriveLink: '',
};

const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');

const normalizeUrl = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const coverLayout = (frameWidth, frameHeight, imageWidth, imageHeight) => {
  const scale = Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
  return {
    width: imageWidth * scale,
    height: imageHeight * scale,
  };
};

const clampOffset = (x, y, layout, frame) => ({
  x: Math.min(0, Math.max(frame.width - layout.width, x)),
  y: Math.min(0, Math.max(frame.height - layout.height, y)),
});

const cropImageFile = (image, frame, offset, layout) => new Promise((resolve, reject) => {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1200;
  const context = canvas.getContext('2d');
  context.drawImage(
    image,
    offset.x * (canvas.width / frame.width),
    offset.y * (canvas.height / frame.height),
    layout.width * (canvas.width / frame.width),
    layout.height * (canvas.height / frame.height),
  );
  canvas.toBlob((blob) => {
    if (!blob) {
      reject(new Error('No se pudo recortar la foto.'));
      return;
    }
    resolve(new File([blob], 'foto.jpg', { type: 'image/jpeg' }));
  }, 'image/jpeg', 0.92);
});

const AddEditPerson = () => {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [naturalSize, setNaturalSize] = useState(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const frameRef = useRef(null);
  const loadedImageRef = useRef(null);
  const dragRef = useRef(null);
  const positionedFor = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    setNaturalSize(null);
    const image = new Image();
    image.onload = () => {
      loadedImageRef.current = image;
      setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const measure = () => setFrameSize({ width: frame.clientWidth, height: frame.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [previewUrl, formData.googleDriveLink]);

  useEffect(() => {
    const fetchPersona = async () => {
      setError('');
      try {
        const url = tipo === 'jugador' ? `${API_BASE_URL}/api/jugadores/${id}` : `${API_BASE_URL}/api/entrenadores/${id}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error al cargar ${tipo}`);
        }
        const data = await response.json();
        const dataFields = { ...data };
        delete dataFields.dni;
        delete dataFields._id;
        delete dataFields.__v;
        setFormData({
          ...emptyForm,
          ...dataFields,
          fechaNacimiento: toDateInput(data.fechaNacimiento),
          nacionalidad: countriesFromValue(data.nacionalidad).map((country) => country.code),
          eurobasket: data.eurobasket || '',
          highlights: data.highlights || '',
          googleDriveLink: data.googleDriveLink || '',
        });
        setImageFile(null);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) {
      fetchPersona();
    } else {
      setFormData(emptyForm);
      setImageFile(null);
    }
  }, [tipo, id, token, API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addNationality = (code) => {
    if (!code || formData.nacionalidad.includes(code)) return;
    setFormData({ ...formData, nacionalidad: [...formData.nacionalidad, code] });
  };

  const removeNationality = (code) => {
    setFormData({
      ...formData,
      nacionalidad: formData.nacionalidad.filter((item) => item !== code),
    });
  };

  const layout = useMemo(() => {
    if (!naturalSize || !frameSize.width || !frameSize.height) return null;
    return coverLayout(frameSize.width, frameSize.height, naturalSize.width, naturalSize.height);
  }, [naturalSize, frameSize]);

  useEffect(() => {
    if (!layout || !frameSize.width || !naturalSize) return;
    if (positionedFor.current !== naturalSize) {
      positionedFor.current = naturalSize;
      setOffset(clampOffset((frameSize.width - layout.width) / 2, 0, layout, frameSize));
      return;
    }
    setOffset((current) => clampOffset(current.x, current.y, layout, frameSize));
  }, [naturalSize, layout, frameSize]);

  const movePhoto = (event) => {
    if (!dragRef.current || !layout) return;
    setOffset(clampOffset(
      dragRef.current.originX + event.clientX - dragRef.current.pointerX,
      dragRef.current.originY + event.clientY - dragRef.current.pointerY,
      layout,
      frameSize,
    ));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('El archivo tiene que ser una imagen.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen supera el límite de 5 MB.');
      return;
    }
    setError('');
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nacionalidad.length) {
      setError('Seleccioná al menos una nacionalidad.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      let imageUrl = formData.googleDriveLink || '';

      if (imageFile) {
        if (!layout || !loadedImageRef.current) {
          throw new Error('Esperá a que cargue la foto para encuadrarla.');
        }
        const cropped = await cropImageFile(loadedImageRef.current, frameSize, offset, layout);
        const body = new FormData();
        body.append('image', cropped);
        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
        });
        const uploadData = await uploadResponse.json().catch(() => ({}));
        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || 'No se pudo subir la imagen');
        }
        imageUrl = uploadData.url;
      }

      const url = id
        ? (tipo === 'jugador' ? `${API_BASE_URL}/api/jugadores/${id}` : `${API_BASE_URL}/api/entrenadores/${id}`)
        : (tipo === 'jugador' ? `${API_BASE_URL}/api/jugadores` : `${API_BASE_URL}/api/entrenadores`);
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tipo,
          fechaNacimiento: toDateInput(formData.fechaNacimiento),
          eurobasket: normalizeUrl(formData.eurobasket),
          highlights: normalizeUrl(formData.highlights),
          googleDriveLink: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${id ? 'editar' : 'agregar'} ${tipo}`);
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const shownPreview = previewUrl || formData.googleDriveLink;

  return (
    <div className="add-edit-person-container">
      <h2 className="add-edit-person-title">{id ? `Editar ${tipo}` : `Agregar Nuevo ${tipo}`}</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="add-edit-person-form" onSubmit={handleSubmit}>
        <div className="form-group form-group-photo">
          <label htmlFor="foto">Foto</label>
          <div
            className={`photo-frame${previewUrl ? ' photo-frame-adjust' : ''}`}
            ref={frameRef}
            onPointerDown={(event) => {
              if (!previewUrl || !layout) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              dragRef.current = {
                pointerX: event.clientX,
                pointerY: event.clientY,
                originX: offset.x,
                originY: offset.y,
              };
            }}
            onPointerMove={movePhoto}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
          >
            {previewUrl && layout ? (
              <img
                src={previewUrl}
                alt=""
                className="photo-adjust"
                draggable={false}
                style={{ width: layout.width, height: layout.height, transform: `translate(${offset.x}px, ${offset.y}px)` }}
              />
            ) : shownPreview ? (
              <img src={shownPreview} alt="" className="photo-preview" />
            ) : (
              <span className="photo-placeholder">Sin foto</span>
            )}
            {previewUrl && <span className="photo-adjust-hint">Arrastrá para encuadrar</span>}
          </div>
          <label className="file-picker">
            {imageFile ? imageFile.name : 'Elegir imagen'}
            <input id="foto" type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <div className="form-main">
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input type="text" id="apellido" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <input type="date" id="fechaNacimiento" name="fechaNacimiento" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="nacionalidad">Nacionalidad</label>
          <div className="nationality-field">
            {countriesFromValue(formData.nacionalidad).length > 0 && (
              <div className="nationality-selected">
                {countriesFromValue(formData.nacionalidad).map((country) => (
                  <span key={country.code} className="nationality-chip">
                    <img className="nationality-flag" src={flagSrc(country.code)} alt="" />
                    <span>{country.es}</span>
                    <button type="button" onClick={() => removeNationality(country.code)} aria-label={`Quitar ${country.es}`}>×</button>
                  </span>
                ))}
              </div>
            )}
            <select id="nacionalidad" value="" onChange={(e) => addNationality(e.target.value)}>
              <option value="">Agregar país</option>
              {countries.filter((country) => !formData.nacionalidad.includes(country.code)).map((country) => (
                <option key={country.code} value={country.code}>{country.es}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoría</label>
          <input type="text" id="categoria" name="categoria" className="form-control" value={formData.categoria} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="equipo">Equipo</label>
          <input type="text" id="equipo" name="equipo" className="form-control" value={formData.equipo} onChange={handleChange} />
        </div>
        {tipo === 'jugador' && (
          <div className="form-group">
            <label htmlFor="posicion">Posición</label>
            <select id="posicion" name="posicion" className="form-control" value={formData.posicion} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="base">Base</option>
              <option value="escolta">Escolta</option>
              <option value="alero">Alero</option>
              <option value="ala-pivot">Ala-Pivot</option>
              <option value="pivot">Pivot</option>
            </select>
          </div>
        )}
        </div>
        <div className="form-group form-group-wide">
          <label htmlFor="inst">Instagram</label>
          <input type="text" id="inst" name="inst" className="form-control" value={formData.inst || ''} onChange={handleChange} />
        </div>
        <div className="form-group form-group-wide">
          <label htmlFor="eurobasket">Eurobasket</label>
          <input
            type="text"
            id="eurobasket"
            name="eurobasket"
            className="form-control"
            placeholder="https://www.eurobasket.com/..."
            value={formData.eurobasket || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group form-group-wide">
          <label htmlFor="highlights">Highlights</label>
          <input
            type="text"
            id="highlights"
            name="highlights"
            className="form-control"
            placeholder="https://www.youtube.com/..."
            value={formData.highlights || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={saving}>
            {saving ? 'Guardando...' : (id ? 'Guardar Cambios' : 'Agregar')}
          </button>
          <button type="button" className="cancel-button" onClick={() => navigate('/admin')} disabled={saving}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AddEditPerson;

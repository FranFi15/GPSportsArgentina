import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { clampFrame, defaultFrame, frameStyle } from '../../data/carouselFrame';
import './FamiliaAdmin.css';

const MAX_PHOTOS = 40;
const MAX_BYTES = 5 * 1024 * 1024;

const emptyDraft = { title: '', caption: '', photos: [] };

const PhotoFrame = ({ photo, disabled, onChange }) => {
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const frame = clampFrame(photo);

  const nudge = (xDelta, yDelta) => {
    onChange(clampFrame({
      ...frame,
      x: frame.x + xDelta,
      y: frame.y + yDelta,
    }));
  };

  return (
    <div className="familia-frame-editor">
      <div
        className="familia-frame"
        ref={frameRef}
        onPointerDown={(event) => {
          if (disabled) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragRef.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            x: frame.x,
            y: frame.y,
          };
        }}
        onPointerMove={(event) => {
          if (!dragRef.current || !frameRef.current) return;
          const rect = frameRef.current.getBoundingClientRect();
          const deltaX = ((event.clientX - dragRef.current.pointerX) / rect.width) * 100;
          const deltaY = ((event.clientY - dragRef.current.pointerY) / rect.height) * 100;
          onChange(clampFrame({
            ...frame,
            x: dragRef.current.x - deltaX,
            y: dragRef.current.y - deltaY,
          }));
        }}
        onPointerUp={() => { dragRef.current = null; }}
        onPointerCancel={() => { dragRef.current = null; }}
      >
        <img src={photo.url} alt="" draggable={false} style={frameStyle(frame)} />
      </div>
      <div className="familia-pan">
        <button type="button" aria-label="Arriba" onClick={() => nudge(0, -8)} disabled={disabled}>↑</button>
        <div>
          <button type="button" aria-label="Izquierda" onClick={() => nudge(-8, 0)} disabled={disabled}>←</button>
          <button type="button" aria-label="Derecha" onClick={() => nudge(8, 0)} disabled={disabled}>→</button>
        </div>
        <button type="button" aria-label="Abajo" onClick={() => nudge(0, 8)} disabled={disabled}>↓</button>
      </div>
      <label className="familia-zoom">
        Zoom
        <input
          type="range"
          min="1"
          max="2.5"
          step="0.05"
          value={frame.zoom}
          disabled={disabled}
          onChange={(event) => onChange(clampFrame({ ...frame, zoom: Number(event.target.value) }))}
        />
      </label>
    </div>
  );
};

const FamiliaAdmin = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const isNew = location.pathname.endsWith('/nuevo');
  const isEditor = isNew || Boolean(id);

  const [albums, setAlbums] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      setDraft({ title: '', caption: '', photos: [] });
      setError('');
      setLoading(false);
      return undefined;
    }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/api/albums`);
        if (!response.ok) throw new Error('No se pudieron cargar los álbumes.');
        const data = await response.json();
        setAlbums(Array.isArray(data) ? data : []);
        if (id) {
          const current = data.find((album) => album._id === id);
          if (!current) throw new Error('Álbum no encontrado.');
          setDraft({
            title: current.title || '',
            caption: current.caption || '',
            photos: (current.photos || []).map((photo) => ({
              url: photo.url,
              alt: photo.alt || '',
              ...clampFrame(photo),
            })),
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
    return undefined;
  }, [apiBaseUrl, id, isNew]);

  const uploadFile = async (file) => {
    const body = new FormData();
    body.append('image', file);
    const response = await fetch(`${apiBaseUrl}/api/upload?preset=familia`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'No se pudo subir la imagen.');
    return data.url;
  };

  const addFiles = (fileList) => {
    const files = [...fileList];
    if (!files.length) return;
    if (draft.photos.length + files.length > MAX_PHOTOS) {
      setError(`Cada álbum admite hasta ${MAX_PHOTOS} fotos.`);
      return;
    }
    const next = [];
    for (const file of files) {
      if (!file.type.startsWith('image/') || file.size > MAX_BYTES) {
        next.forEach((photo) => URL.revokeObjectURL(photo.url));
        setError(file.type.startsWith('image/') ? 'La imagen supera el límite de 5 MB.' : 'El archivo tiene que ser una imagen.');
        return;
      }
      next.push({ url: URL.createObjectURL(file), alt: '', file, ...defaultFrame });
    }
    setError('');
    setDraft((current) => ({ ...current, photos: [...current.photos, ...next] }));
  };

  const movePhoto = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= draft.photos.length) return;
    const photos = [...draft.photos];
    const [item] = photos.splice(index, 1);
    photos.splice(target, 0, item);
    setDraft((current) => ({ ...current, photos }));
  };

  const updateFrame = (index, frame) => {
    setDraft((current) => ({
      ...current,
      photos: current.photos.map((photo, photoIndex) => (
        photoIndex === index ? { ...photo, ...clampFrame(frame) } : photo
      )),
    }));
  };

  const removePhoto = (index) => {
    const photo = draft.photos[index];
    if (photo?.url?.startsWith('blob:')) URL.revokeObjectURL(photo.url);
    setDraft((current) => ({ ...current, photos: current.photos.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const save = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      setError('El álbum necesita un título.');
      return;
    }
    if (!draft.photos.length) {
      setError('Agregá al menos una foto.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const photos = [];
      for (const photo of draft.photos) {
        const url = photo.file ? await uploadFile(photo.file) : photo.url;
        photos.push({ url, alt: photo.alt || '', ...clampFrame(photo) });
      }
      const response = await fetch(isNew ? `${apiBaseUrl}/api/albums` : `${apiBaseUrl}/api/albums/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: draft.title.trim(),
          caption: draft.caption.trim(),
          photos,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'No se pudo guardar el álbum.');
      navigate('/admin/familia');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeAlbum = async (album) => {
    if (!window.confirm(`¿Eliminar el álbum "${album.title}"?`)) return;
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/albums/${album._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'No se pudo eliminar el álbum.');
      setAlbums((current) => current.filter((item) => item._id !== album._id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isEditor) {
    return (
      <div className="familia-admin-page">
      <div className="familia-admin">
        <h2>La Familia</h2>
        <p className="familia-admin-note">Creá, editá o eliminá los álbumes que se ven en La Familia.</p>
        {error && <p className="familia-admin-error">{error}</p>}
        <div className="familia-admin-toolbar">
          <button type="button" className="familia-admin-gold" onClick={() => navigate('/admin/familia/nuevo')}>Nuevo álbum</button>
          <button type="button" onClick={() => navigate('/admin')}>Volver</button>
        </div>
        {loading && <p className="familia-admin-note">Cargando álbumes...</p>}
        {!loading && !albums.length && !error && <p className="familia-admin-note">Todavía no hay álbumes.</p>}
        <ul className="familia-admin-list">
          {albums.map((album) => (
            <li key={album._id} className="familia-admin-card">
              <div className="familia-admin-cover">
                {album.photos?.[0]?.url && <img src={album.photos[0].url} alt="" style={frameStyle(album.photos[0])} />}
              </div>
              <div>
                <h3>{album.title}</h3>
                {album.caption && <p>{album.caption}</p>}
                <p>{album.photos?.length || 0} fotos</p>
                <div className="familia-admin-actions">
                  <button type="button" className="familia-admin-gold" onClick={() => navigate(`/admin/familia/${album._id}`)}>Editar</button>
                  <button type="button" className="familia-admin-danger" onClick={() => removeAlbum(album)}>Eliminar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </div>
    );
  }

  return (
    <div className="familia-admin-page">
    <form className="familia-admin" onSubmit={save}>
      <h2>{isNew ? 'Nuevo álbum' : 'Editar álbum'}</h2>
      {loading && !isNew && <p className="familia-admin-note">Cargando álbum...</p>}
      {error && <p className="familia-admin-error">{error}</p>}
      <label htmlFor="album-title">Título</label>
      <input
        id="album-title"
        type="text"
        value={draft.title}
        maxLength={80}
        onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
        disabled={busy}
        required
      />
      <label htmlFor="album-caption">Nota</label>
      <input
        id="album-caption"
        type="text"
        value={draft.caption}
        maxLength={300}
        placeholder="Ciudad, fecha o un detalle del encuentro"
        onChange={(event) => setDraft((current) => ({ ...current, caption: event.target.value }))}
        disabled={busy}
      />
      <div className="familia-admin-toolbar">
        <label className="familia-admin-gold familia-admin-file">
          Agregar fotos
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = '';
            }}
          />
        </label>
      </div>
      <ul className="familia-admin-photos">
        {draft.photos.map((photo, index) => (
          <li key={`${photo.url}-${index}`}>
            <PhotoFrame
              photo={photo}
              disabled={busy}
              onChange={(frame) => updateFrame(index, frame)}
            />
            <div className="familia-admin-actions">
              <button type="button" onClick={() => movePhoto(index, -1)} disabled={busy || index === 0}>Subir</button>
              <button type="button" onClick={() => movePhoto(index, 1)} disabled={busy || index === draft.photos.length - 1}>Bajar</button>
              <button type="button" className="familia-admin-danger" onClick={() => removePhoto(index)} disabled={busy}>Quitar</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="familia-admin-toolbar">
        <button type="submit" className="familia-admin-gold" disabled={busy}>{busy ? 'Guardando...' : 'Guardar'}</button>
        <button type="button" onClick={() => navigate('/admin/familia')} disabled={busy}>Cancelar</button>
      </div>
    </form>
    </div>
  );
};

export default FamiliaAdmin;

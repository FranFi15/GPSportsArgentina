import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import defaultCarouselImages from '../../data/carouselDefaults';
import { clampFrame, defaultFrame, frameStyle } from '../../data/carouselFrame';
import './CarouselAdmin.css';

const MAX_SLIDES = 20;
const MAX_BYTES = 5 * 1024 * 1024;

const needsUpload = (url) => {
  if (!url || url.startsWith('blob:')) return true;
  try {
    return new URL(url, window.location.origin).origin === window.location.origin;
  } catch {
    return true;
  }
};

const withFrame = (slide) => ({
  ...defaultFrame,
  ...slide,
  ...clampFrame(slide),
});

const SlideFrame = ({ slide, disabled, onChange }) => {
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const frame = clampFrame(slide);

  const nudge = (xDelta, yDelta) => {
    onChange(clampFrame({
      ...frame,
      x: frame.x + xDelta,
      y: frame.y + yDelta,
    }));
  };

  return (
    <div className="carousel-frame-editor">
      <div
        className="carousel-frame"
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
        <img src={slide.url} alt={slide.alt || ''} draggable={false} style={frameStyle(frame)} />
      </div>
      <div className="carousel-pan">
        <button type="button" aria-label="Arriba" onClick={() => nudge(0, -8)} disabled={disabled}>↑</button>
        <div>
          <button type="button" aria-label="Izquierda" onClick={() => nudge(-8, 0)} disabled={disabled}>←</button>
          <button type="button" aria-label="Derecha" onClick={() => nudge(8, 0)} disabled={disabled}>→</button>
        </div>
        <button type="button" aria-label="Abajo" onClick={() => nudge(0, 8)} disabled={disabled}>↓</button>
      </div>
      <label className="carousel-zoom">
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

const CarouselAdmin = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [slides, setSlides] = useState([]);
  const [usingDefaults, setUsingDefaults] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/carousel`);
        if (!response.ok) throw new Error('No se pudo cargar el carrusel.');
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setSlides(data.map((slide) => withFrame({ url: slide.url, alt: slide.alt || '', zoom: slide.zoom, x: slide.x, y: slide.y })));
          setUsingDefaults(false);
          return;
        }
      } catch (err) {
        setError(err.message);
      }
      setSlides(defaultCarouselImages.map((image) => withFrame({ url: image.src, alt: image.alt })));
      setUsingDefaults(true);
    };

    load();
  }, [apiBaseUrl]);

  const uploadFile = async (file) => {
    const body = new FormData();
    body.append('image', file);
    const response = await fetch(`${apiBaseUrl}/api/upload?preset=hero`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'No se pudo subir la imagen.');
    return data.url;
  };

  const saveSlides = async (nextSlides) => {
    setBusy(true);
    setError('');
    setStatus('Guardando carrusel...');
    try {
      const prepared = [];
      for (const slide of nextSlides) {
        let url = slide.url;
        if (slide.file) {
          url = await uploadFile(slide.file);
        } else if (needsUpload(url)) {
          const response = await fetch(url);
          if (!response.ok) throw new Error('No se pudo leer una foto actual.');
          const blob = await response.blob();
          const extension = blob.type.includes('png') ? 'png' : 'avif';
          const file = new File([blob], `${slide.alt || 'slide'}.${extension}`, { type: blob.type || 'image/avif' });
          url = await uploadFile(file);
        }
        prepared.push({
          url,
          alt: slide.alt || '',
          zoom: clampFrame(slide).zoom,
          x: clampFrame(slide).x,
          y: clampFrame(slide).y,
        });
      }

      const response = await fetch(`${apiBaseUrl}/api/carousel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slides: prepared }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'No se pudo guardar el carrusel.');

      if (!data.length) {
        setSlides(defaultCarouselImages.map((image) => withFrame({ url: image.src, alt: image.alt })));
        setUsingDefaults(true);
      } else {
        setSlides(data.map((slide) => withFrame(slide)));
        setUsingDefaults(false);
      }
      setStatus('Carrusel actualizado.');
    } catch (err) {
      setError(err.message);
      setStatus('');
    } finally {
      setBusy(false);
    }
  };

  const checkFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('El archivo tiene que ser una imagen.');
      return false;
    }
    if (file.size > MAX_BYTES) {
      setError('La imagen supera el límite de 5 MB.');
      return false;
    }
    return true;
  };

  const move = (index, direction) => {
    const target = index + direction;
    if (busy || target < 0 || target >= slides.length) return;
    const next = [...slides];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setSlides(next);
    saveSlides(next);
  };

  const remove = (index) => {
    if (busy) return;
    saveSlides(slides.filter((_, itemIndex) => itemIndex !== index));
  };

  const replace = (index, file) => {
    if (busy || !file || !checkFile(file)) return;
    const next = slides.map((slide, itemIndex) => (
      itemIndex === index ? withFrame({ ...slide, file, url: URL.createObjectURL(file), ...defaultFrame }) : slide
    ));
    setSlides(next);
    saveSlides(next);
  };

  const add = (file) => {
    if (busy || !file || !checkFile(file)) return;
    if (slides.length >= MAX_SLIDES) {
      setError('El carrusel admite hasta 20 fotos.');
      return;
    }
    const next = [...slides, withFrame({ url: URL.createObjectURL(file), alt: '', file, ...defaultFrame })];
    setSlides(next);
    saveSlides(next);
  };

  const updateFrame = (index, frame) => {
    setSlides((current) => current.map((slide, itemIndex) => (
      itemIndex === index ? { ...slide, ...clampFrame(frame) } : slide
    )));
  };

  const updateAlt = (index, alt) => {
    setSlides((current) => current.map((slide, itemIndex) => (
      itemIndex === index ? { ...slide, alt } : slide
    )));
  };

  return (
    <div className="carousel-admin">
      <h2>Carrusel de inicio</h2>
      <p className="carousel-admin-note">
        {usingDefaults
          ? 'Estas son las fotos del inicio. Ajustá el zoom y la posición. Al guardar, se guarda el carrusel completo.'
          : 'Mové cada foto con las flechas o arrastrándola, cambiá el zoom y guardá.'}
      </p>
      {error && <p className="carousel-admin-error">{error}</p>}
      {status && <p className="carousel-admin-status">{status}</p>}

      <ul className="carousel-admin-list">
        {slides.map((slide, index) => (
          <li key={`${slide.url}-${index}`} className="carousel-admin-item">
            <SlideFrame
              slide={slide}
              disabled={busy}
              onChange={(frame) => updateFrame(index, frame)}
            />
            <div className="carousel-admin-fields">
              <label htmlFor={`slide-alt-${index}`}>Nombre</label>
              <input
                id={`slide-alt-${index}`}
                value={slide.alt}
                onChange={(event) => updateAlt(index, event.target.value)}
                disabled={busy}
              />
              <div className="carousel-admin-actions">
                <button type="button" onClick={() => move(index, -1)} disabled={busy || index === 0}>Subir</button>
                <button type="button" onClick={() => move(index, 1)} disabled={busy || index === slides.length - 1}>Bajar</button>
                <label className="carousel-admin-file">
                  Cambiar
                  <input
                    type="file"
                    accept="image/*"
                    disabled={busy}
                    onChange={(event) => {
                      replace(index, event.target.files?.[0]);
                      event.target.value = '';
                    }}
                  />
                </label>
                <button type="button" className="carousel-admin-remove" onClick={() => remove(index)} disabled={busy}>Quitar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="carousel-admin-footer">
        <label className="carousel-admin-add">
          Agregar foto
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(event) => {
              add(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </label>
        <button type="button" className="carousel-admin-save" onClick={() => saveSlides(slides)} disabled={busy}>
          Guardar cambios
        </button>
        <button type="button" className="carousel-admin-back" onClick={() => navigate('/admin')} disabled={busy}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default CarouselAdmin;

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import './LaFamilia.css';

const copy = {
  es: {
    title: 'Estar cerca es lo que también nos define',
    paragraphs: [
      'En GP Sports entendemos que la representación va mucho más allá de los contratos y las negociaciones. Para nosotros, cada jugador, entrenador y atleta es parte de nuestra familia. Y a la familia se la acompaña siempre.',
      'Recorremos kilómetros, cruzamos fronteras y estamos presentes en cada ciudad donde laten sus sueños. Nos apasiona visitarlos en sus casas, compartir un café, ponernos al día, llevarles un detalle pensado para ellos y hacerles sentir que, sin importar cuán lejos jueguen, nunca están solos.',
      'Esta sección es un reflejo de esos encuentros: momentos reales, sonrisas compartidas, entregas especiales y la calidez de construir una relación auténtica día a día.',
    ],
    loading: 'Cargando encuentros...',
    empty: 'Los encuentros van a aparecer acá.',
    error: 'No se pudieron cargar los álbumes.',
    back: 'Todos los álbumes',
    photos: 'fotos',
    close: 'Cerrar',
    previous: 'Anterior',
    next: 'Siguiente',
  },
  en: {

    title: 'Being close is also what defines us',
    paragraphs: [
      'At GP Sports we understand that representation goes far beyond contracts and negotiations. For us, every player, coach, and athlete is part of our family. And family is always looked after.',
      'We travel for miles, cross borders, and show up in every city where their dreams are alive. We love visiting them at home, sharing a coffee, catching up, bringing a gift chosen for them, and making them feel that no matter how far they play, they are never alone.',
      'This section reflects those meetings: real moments, shared smiles, special deliveries, and the warmth of building an authentic relationship day by day.',
    ],
    loading: 'Loading visits...',
    empty: 'The visits will appear here.',
    error: 'The albums could not be loaded.',
    back: 'All albums',
    photos: 'photos',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
  },
};

const LaFamilia = () => {
  const { language } = useLanguage();
  const text = copy[language] || copy.es;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('loading');
  const [photoIndex, setPhotoIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/albums`);
        if (!response.ok) throw new Error('albums');
        const data = await response.json();
        setAlbums(Array.isArray(data) ? data : []);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    };
    load();
  }, [apiBaseUrl]);

  const active = albums.find((album) => album._id === searchParams.get('album')) || null;

  useEffect(() => {
    setPhotoIndex(null);
  }, [active?._id]);

  useEffect(() => {
    if (photoIndex === null) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setPhotoIndex(null);
      if (!active?.photos?.length) return;
      if (event.key === 'ArrowRight') setPhotoIndex((index) => (index + 1) % active.photos.length);
      if (event.key === 'ArrowLeft') {
        setPhotoIndex((index) => (index - 1 + active.photos.length) % active.photos.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photoIndex, active]);

  const openAlbum = (id) => {
    setSearchParams({ album: id });
    window.scrollTo(0, 0);
  };

  return (
    <main className="la-familia">
      <section className="la-familia-intro">
        <p className="la-familia-kicker">{text.kicker}</p>
        <h1>{text.title}</h1>
        {text.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {status === 'loading' && <p className="la-familia-status">{text.loading}</p>}
      {status === 'error' && <p className="la-familia-status">{text.error}</p>}
      {status === 'ready' && !albums.length && <p className="la-familia-status">{text.empty}</p>}

      {status === 'ready' && albums.length > 0 && !active && (
        <div className="familia-albums">
          {albums.map((album) => (
            <button key={album._id} type="button" className="familia-album" onClick={() => openAlbum(album._id)}>
              {album.photos?.[0]?.url && <img src={album.photos[0].url} alt="" />}
              <span>
                {album.title}
                <small>{album.photos?.length || 0} {text.photos}</small>
              </span>
            </button>
          ))}
        </div>
      )}

      {active && (
        <section className="familia-detail">
          <button type="button" className="familia-back" onClick={() => setSearchParams({})}>
            {text.back}
          </button>
          <h2>{active.title}</h2>
          {active.caption && <p>{active.caption}</p>}
          <div className="familia-photos">
            {active.photos.map((photo, index) => (
              <button key={`${photo.url}-${index}`} type="button" className="familia-photo" onClick={() => setPhotoIndex(index)}>
                <img src={photo.url} alt={photo.alt || active.title} />
              </button>
            ))}
          </div>
        </section>
      )}

      {active && photoIndex !== null && (
        <div className="familia-lightbox" role="dialog" aria-modal="true" aria-label={active.title}>
          <button type="button" className="familia-lightbox-close" onClick={() => setPhotoIndex(null)}>{text.close}</button>
          <button
            type="button"
            className="familia-lightbox-nav familia-lightbox-prev"
            onClick={() => setPhotoIndex((index) => (index - 1 + active.photos.length) % active.photos.length)}
          >
            {text.previous}
          </button>
          <img src={active.photos[photoIndex].url} alt={active.photos[photoIndex].alt || active.title} />
          <button
            type="button"
            className="familia-lightbox-nav familia-lightbox-next"
            onClick={() => setPhotoIndex((index) => (index + 1) % active.photos.length)}
          >
            {text.next}
          </button>
        </div>
      )}
    </main>
  );
};

export default LaFamilia;

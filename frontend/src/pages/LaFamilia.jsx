import { useEffect, useRef, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import useLanguage from '../hooks/useLanguage';
import { frameStyle } from '../data/carouselFrame';
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
  },
};

const LaFamilia = () => {
  const { language } = useLanguage();
  const text = copy[language] || copy.es;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [albums, setAlbums] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeId, setActiveId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const carouselRef = useRef(null);

  const stopVideos = () => {
    carouselRef.current?.querySelectorAll('video').forEach((video) => video.pause());
    setPlaying(false);
  };

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

  useEffect(() => {
    if (!albums.length) return;
    setActiveId((current) => (
      albums.some((album) => album._id === current) ? current : albums[0]._id
    ));
  }, [albums]);

  useEffect(() => {
    setPlaying(false);
  }, [activeId]);

  const active = albums.find((album) => album._id === activeId) || null;
  const photos = active?.photos || [];
  const activeTitle = language === 'en' && active?.titleEn ? active.titleEn : active?.title;
  const activeCaption = language === 'en' && active?.captionEn ? active.captionEn : active?.caption;

  return (
    <main className="la-familia">
      <section className="la-familia-intro">
        <h1>{text.title}</h1>
        {text.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {status === 'loading' && <p className="la-familia-status">{text.loading}</p>}
      {status === 'error' && <p className="la-familia-status">{text.error}</p>}
      {status === 'ready' && !albums.length && <p className="la-familia-status">{text.empty}</p>}

      {status === 'ready' && albums.length > 0 && (
        <section className="familia-gallery">
          <div className="familia-filters" role="tablist">
            {albums.map((album) => (
              <button
                key={album._id}
                type="button"
                role="tab"
                aria-selected={album._id === active?._id}
                className={`familia-pill${album._id === active?._id ? ' familia-pill-active' : ''}`}
                onClick={() => {
                  if (album._id !== activeId) setActiveId(album._id);
                }}
              >
                {language === 'en' && album.titleEn ? album.titleEn : album.title}
              </button>
            ))}
          </div>
          {photos.length > 0 && (
            <div className={`familia-carousel${playing ? ' is-playing' : ''}`} key={active._id} ref={carouselRef}>
              <Carousel
                showArrows={photos.length > 1}
                showIndicators={photos.length > 1}
                infiniteLoop={photos.length > 1}
                showThumbs={false}
                showStatus={false}
                swipeable
                emulateTouch
                onChange={stopVideos}
              >
                {photos.map((photo, index) => (
                  <div className="familia-slide" key={`${photo.url}-${index}`}>
                    {photo.kind === 'video' ? (
                      <>
                        <video
                          src={photo.url}
                          controls={playing}
                          playsInline
                          preload="metadata"
                          onPlay={() => setPlaying(true)}
                          onPause={() => setPlaying(false)}
                        />
                        <button
                          type="button"
                          className="familia-play"
                          aria-label="Reproducir"
                          onClick={(event) => {
                            event.stopPropagation();
                            event.currentTarget.parentElement.querySelector('video')?.play()?.catch(() => {});
                          }}
                        />
                      </>
                    ) : (
                      <img src={photo.url} alt={photo.alt || activeTitle} style={frameStyle(photo)} />
                    )}
                  </div>
                ))}
              </Carousel>
              <div className="familia-overlay">
                <h2>{activeTitle}</h2>
                {activeCaption && <p>{activeCaption}</p>}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default LaFamilia;

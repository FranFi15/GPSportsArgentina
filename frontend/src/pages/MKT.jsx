// src/components/MarketingEventos/MarketingEventos.jsx

import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage'; // Assuming you still need language context
import Gallery from '../components/Gallery'; // Assuming Gallery is used here
import "./MKT.css"; // Create this CSS file for styling
import manGil from '../assets/gillettemanu.jpg';
import luchagat from '../assets/gatelucha.jpg';
import paretocol from '../assets/paretocolchon.jpg';
import img1 from '../assets/IMG_2450.png';
import img2 from '../assets/IMG_2453.png';
import img3 from '../assets/IMG_2454.png'

const MarketingEventos = () => {
    const { language } = useLanguage();
    const mktEventRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const textos = {
        es: {
            mktEventTitulo: 'Marketing y Eventos',
            mktEventContenido: 'Queremos que tu imagen fuera de la cancha sea tan valiosa como tus logros deportivos. En GP SPORTS, te ayudamos a construir una marca personal sólida y atractiva para los patrocinadores. Analizamos tu perfil y necesidades para crear una estrategia de imagen a tu medida, incrementando tu reconocimiento y abriendo puertas a oportunidades de ingresos adicionales. Buscamos las marcas ideales para vos, gestionamos tu relación con los medios y potenciamos tus redes sociales para conectar con tus fans. Con nosotros, tu éxito deportivo se traduce en un crecimiento económico y de imagen imparable.',
        },
        en: {
            mktEventTitulo: 'Marketing & Events',
            mktEventContenido: 'We want your off-field image to be as valuable as your sporting achievements. At GP SPORTS, we help you build a solid and attractive personal brand for sponsors. We analyze your profile and needs to create a tailored image strategy, increasing your recognition and opening doors to additional income opportunities. We seek out the ideal brands for you, manage your media relations, and boost your social media to connect with your fans. With us, your sporting success translates into unstoppable economic and image growth.',
        }
    };

    const galleryItems = [
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/Xtae7OBUKGg' },
        { type: 'image', src: luchagat, caption: 'Lucha Aymar' },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/Rl2YjjTH1pE' },
        { type: 'image', src: img1, },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/2allLNcNMCo' },
        { type: 'image', src: img2, },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/IgIeKtkECek' },
        { type: 'image', src: manGil, caption: 'Manu Ginóbili' },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/Q89QZlTl-IA'},
        { type: 'image', src: img3, },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/mp0SHWGWYEg' },
        { type: 'image', src: paretocol, caption: 'Pareto' },
      
    ];
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), 50);
                }
            });
        }, {
            threshold: 0.1
        });

        if (mktEventRef.current) observer.observe(mktEventRef.current);

        return () => observer.disconnect();
    }, []);

    const currentText = textos[language];

    return (
        <div ref={mktEventRef} className={`marketing-eventos ${isVisible ? 'fade-in-bottom' : ''}`}>
            <h2>{currentText.mktEventTitulo}</h2>
            <p className='marketing-eventos-content'>{currentText.mktEventContenido}</p>
            <Gallery items={galleryItems} />
        </div>
    );
};

export default MarketingEventos;
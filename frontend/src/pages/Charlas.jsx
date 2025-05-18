// Charlas.js
import React from 'react';
import useLanguage from '../hooks/useLanguage';
import './Charlas.css';
import Gallery from '../components/Gallery';

const Charlas = () => {
    const { language } = useLanguage();

    const textos = {
        es: {
            titulo: 'Conferencias',
            contenido: 'En GP Sports creemos que la experiencia compartida inspira, motiva y transforma. Por eso impulsamos y organizamos conferencias y encuentros con deportistas  y referentes del alto rendimiento. A través de estas dinámicas, acercamos historias reales de superación, liderazgo, trabajo en equipo y toma de decisiones, tanto dentro como fuera de la cancha. Son espacios de aprendizaje y conexión pensados para empresas y organizaciones que buscan enriquecer sus equipos desde la mirada del deporte y sus valores. Porque detrás de cada logro, hay un recorrido que merece ser contado.',
            galeriaTitulo: 'Galería de Conferencias'
        },
        en: {
            titulo: 'Conferences',
            contenido: 'At GP Sports, we believe that shared experience inspires, motivates, and transforms. That\'s why we promote and organize conferences and meetings with athletes and high-performance leaders. Through these dynamics, we share real stories of overcoming challenges, leadership, teamwork, and decision-making, both on and off the field. These are learning and connection spaces designed for companies and organizations seeking to enrich their teams from the perspective of sports and its values. Because behind every achievement, there is a journey that deserves to be told.',
            galeriaTitulo: 'Conferences Gallery'
        }
    };

    const galleryItems = [
        { type: 'image', src: 'https://via.placeholder.com/800x450/007bff/ffffff?Text=Conferencia+1' },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/2allLNcNMCo' },
        { type: 'image', src: 'https://via.placeholder.com/800x450/28a745/ffffff?Text=Evento+Destacado' },
        { type: 'image', src: 'https://via.placeholder.com/800x450/dc3545/ffffff?Text=Participantes' },
        { type: 'video', src: 'https://sample-videos.com/video123.mp4' }, // Otro tipo de video
        { type: 'image', src: 'https://via.placeholder.com/800x450/ffc107/000000?Text=Oradores' },
    ];

    return (
        <div className="charlas-container">
            <h1 className="charlas-title">{textos[language].titulo}</h1>
            <p className="charlas-content">{textos[language].contenido}</p>

            <section className="charlas-gallery-section">
                <h2 className="charlas-gallery-title">{textos[language].galeriaTitulo}</h2>
                <Gallery items={galleryItems} />
            </section>
        </div>
    );
};

export default Charlas;
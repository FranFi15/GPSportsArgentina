import React, { useState, useEffect, useRef } from 'react';
import useLanguage from '../hooks/useLanguage';
import './TeamGPSPORTS.css';
import manuImage from '../assets/manu.png';
import luchImage from "../assets/lucha.png";
import paretoImage from "../assets/pareto.png";
import laproImage from "../assets/lapro.png";

const TeamGPSPORT = () => {
    const { language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselWrapperRef = useRef(null);
    const titleRef = useRef(null);
    const slideRefs = useRef([]);
    const controlsRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(false);
    const [slidesVisible, setSlidesVisible] = useState([]);

    const textos = {
        es: {
           
            slides: [
                {
                    imagen: manuImage,
                    tituloSlide: 'Manu Ginobili',
                    texto: 'Un zurdo mágico que elevó el baloncesto argentino a la cima del mundo. Con una creatividad deslumbrante y un corazón guerrero, Manu no solo fue una leyenda de los San Antonio Spurs, sino el faro que guio a la selección argentina a gestas históricas. Su impacto trascendió fronteras, inspirando a generaciones y dejando una marca imborrable en la historia del deporte argentino y mundial.',
                },
                {
                    imagen: luchImage,
                    tituloSlide: 'Lucha Aymar',
                    texto: 'Ocho veces la mejor jugadora del mundo, su legado es sinónimo de pasión, entrega y excelencia en el hockey. Con una habilidad deslumbrante y un espíritu competitivo inigualable, Lucha no solo fue la leyenda de Las Leonas, sino la capitana que lideró a la selección argentina al oro.Su talento único trascendió fronteras, inspirando a generaciones de jugadoras y dejando una marca imborrable en la historia del deporte argentino y mundial.',
                },
                {
                    imagen: paretoImage,
                    tituloSlide: 'Pau Pareto',
                    texto: 'La "Peque" gigante del judo argentino, personifica la garra y la perseverancia. Su espíritu competitivo y su dedicación la llevaron a la cima, conquistando el oro olímpico y dejando una huella imborrable en la historia del deporte argentino. Su leyenda inspira a generaciones con su humildad y su inquebrantable lucha por sus sueños.',
                },
                {
                    imagen: laproImage,
                    tituloSlide: 'Nico Laprovíttola',
                    texto: 'Un base eléctrico y de talento desbordante que ilumina las canchas europeas. Con una muñeca prodigiosa y una visión aguda, "Lapro" despliega un juego vertical y valiente. Líder indiscutible de la selección argentina, su espíritu competitivo y su entrega incansable lo convierten en un faro para el baloncesto argentino. Su huella, vibrante y apasionada, sigue escribiendo capítulos dorados en la historia del deporte argentino.',
                },
            ],
        },
        en: {
          
            slides: [
                {
                    imagen: manuImage,
                    tituloSlide: 'Manu Ginobili',
                    texto: "A magical lefty who elevated Argentine basketball to the top of the world. With dazzling creativity and a warrior's heart, Manu was not only a legend for the San Antonio Spurs, but the beacon that guided the Argentine national team to historic achievements. His impact transcended borders, inspiring generations and leaving an indelible mark on the history of Argentine and world sport.",
                },
                {
                    imagen: luchImage,
                    tituloSlide: 'Lucha Aymar',
                    texto: 'Eight times the best player in the world, her legacy is synonymous with passion, dedication, and excellence in hockey. With dazzling skill and an unparalleled competitive spirit, Lucha was not only the legend of Las Leonas, but the captain who led the Argentine national team to gold. Her unique talent transcended borders, inspiring generations of players and leaving an indelible mark on the history of Argentine and world sport.',
                },
                {
                    imagen: paretoImage,
                    tituloSlide: 'Pau Pareto',
                    texto: 'The "Peque" giant of Argentine judo embodies grit and perseverance. Her competitive spirit and dedication carried her to the top, conquering Olympic gold and leaving an indelible mark on the history of Argentine sport. Her legend inspires generations with her humility and unwavering fight for her dreams.',
                },
                {
                    imagen: laproImage,
                    tituloSlide: 'Nico Laprovíttola',
                    texto: 'An electrifying point guard with overflowing talent who lights up European courts. With a prodigious wrist and sharp vision, "Lapro" displays a vertical and courageous game. The undisputed leader of the Argentinian national team, his competitive spirit and tireless dedication make him a beacon for Argentinian basketball. His vibrant and passionate mark continues to write golden chapters in the history of Argentinian sport.',
                },
            ],
        },
    };

    const { titulo, slides } = textos[language];
    const totalSlides = slides.length;

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setControlsVisible(true);
                    setSlidesVisible(Array(totalSlides).fill(true)); // Mostrar todos los slides al entrar
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3 // Ajusta según necesites
        });

        if (carouselWrapperRef.current) {
            observer.observe(carouselWrapperRef.current);
        }

        slideRefs.current = Array(totalSlides).fill(null); // Inicializa el array de refs

        return () => observer.disconnect();
    }, [totalSlides]);

    return (
        <div className={`full-screen-carousel-container ${isVisible ? 'fade-in' : ''}`}>
            
            <div ref={carouselWrapperRef} className="carousel-wrapper">
                <div
                    className="carousel"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / totalSlides)}%)`,
                        width: `${totalSlides * 100}%`
                    }}
                >
                    {slides.map((slide, index) => (
                        <div
                            ref={el => slideRefs.current[index] = el}
                            className={`slide ${slidesVisible[index] ? 'slide-in' : ''}`}
                            key={index}
                            style={{ width: `${100 / totalSlides}%` }}
                        >
                            <div className="slide-image-overlay">
                                <img src={slide.imagen} alt={`Equipo ${index + 1}`} />
                            </div>
                            <div className="slide-content">
                                <h2 className={slidesVisible[index] ? 'fade-in-up' : ''}>{slide.tituloSlide}</h2>
                                <p className={slidesVisible[index] ? 'fade-in-up' : ''}>{slide.texto}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={controlsRef} className={`carousel-controls ${controlsVisible ? 'fade-in' : ''}`}>
                    <button onClick={prevSlide}>{'<'}</button>
                    <button onClick={nextSlide}>{'>'}</button>
                </div>
            </div>
        </div>
    );
};

export default TeamGPSPORT;
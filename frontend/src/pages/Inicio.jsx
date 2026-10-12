// src/components/Inicio/Inicio.jsx

import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./Inicio.css";
import SocialButtons from '../components/SocialButtons';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import defaultCarouselImages from '../data/carouselDefaults';
import { frameStyle } from '../data/carouselFrame';


const Inicio = () => {
    const { language } = useLanguage();
    const descriptionRef = useRef(null);
    const contentRef = useRef(null);
    const content1Ref = useRef(null);
    const content2Ref = useRef(null);
    const carouselRef = useRef(null);

    const [descriptionVisible, setDescriptionVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [content1Visible, setContent1Visible] = useState(false);
    const [content2Visible, setContent2Visible] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [carouselImages, setCarouselImages] = useState(defaultCarouselImages);

    const textos = {
        es: {
            linea1b: "#TeamGPSports",
            contenido1: 'Nos une el deporte, pero sobre todo,una manera de vivirlo.',
            contenido2: "GP Sports es una agencia de representación y management de jugadores, entrenadores y atletas con mas de 30 años de experiencia en la gestión y negociación de contratos con clubes y empresas de todo el mundo. Acompañamos carreras en un concepto 360, desde la negociación de contratos hasta la implementación comercial de los atletas con un staff de profesionales capacitado para cada una de las áreas de gestión. El objetivo con nuestros clientes es continuar con los valores que caracterizan la empresa desde su fundación: planificación, conocimiento, pasión,innovación y compromiso.",
        },
        en: {
            linea1b: "#TeamGPSports",
           
            contenido1: 'We are united by sports, but above all,by a way of living it.',
            contenido2: "GP Sports is a representation and management agency for players, coaches, and athletes with over 30 years of experience in managing and negotiating contracts with clubs and companies worldwide. We support careers with a 360-degree concept, from contract negotiation to the commercial implementation of athletes, with a staff of professionals trained for each of the management areas. Our objective with our clients is to continue with the values that have characterized the company since its founding: planning, knowledge, passion, innovation, and commitment.",
        }
    };


    useEffect(() => {
        const warmupBackend = async () => {
            const backendWarmupUrl = `${API_BASE_URL}/api/warmup`; 

            try {
                const response = await fetch(backendWarmupUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log('Backend warm-up request successful!');
                } else {
                    // Advertencia si la respuesta no es 200 OK 
                    console.warn(`Backend warm-up failed with status: ${response.status}`);
                }
            } catch (error) {
                // Captura errores de red 
                console.error('Error during backend warm-up request:', error);
            }
        };

        warmupBackend();
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadCarousel = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/carousel`);
                if (!response.ok) return;
                const slides = await response.json();
                if (!cancelled && Array.isArray(slides) && slides.length) {
                    setCarouselImages(slides.map((slide) => ({
                        src: slide.url,
                        alt: slide.alt || 'GP Sports',
                        zoom: slide.zoom,
                        x: slide.x,
                        y: slide.y,
                    })));
                }
            } catch (error) {
                console.warn('No se pudo cargar el carrusel:', error);
            }
        };

        loadCarousel();
        return () => {
            cancelled = true;
        };
    }, [API_BASE_URL]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === descriptionRef.current) {
                        setTimeout(() => setDescriptionVisible(true), 500);
                    }
                    else if (entry.target === contentRef.current) {
                        setTimeout(() => setContentVisible(true), 500);
                        setTimeout(() => setContent1Visible(true), 700);
                        setTimeout(() => setContent2Visible(true), 900);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08
        });

        if (descriptionRef.current) observer.observe(descriptionRef.current);
        if (contentRef.current) observer.observe(contentRef.current);

        return () => {
            if (descriptionRef.current) observer.unobserve(descriptionRef.current);
            if (contentRef.current) observer.unobserve(contentRef.current);
        };
    }, [language]);

    useEffect(() => {
        setDescriptionVisible(false);
        setContentVisible(false);
        setContent1Visible(false);
        setContent2Visible(false);
    }, [language]);

    return (
        <div className='inicio'>
            {/* Carousel Section */}
            <div className="carousel-section">
                <Carousel
                    ref={carouselRef}
                    showArrows={false}
                    showIndicators={false}
                    infiniteLoop={true}
                    showThumbs={false}
                    showStatus={false}
                    autoPlay={true}
                    interval={4000}
                    transitionTime={0}
                    swipeable={true}
                >
                    {carouselImages.map((image, index) => (
                        <div key={index}>
                            <img src={image.src} alt={image.alt} style={frameStyle(image)} />
                        </div>
                    ))}
                </Carousel>

                <div className="carousel-overlay">
                    <p className="highlight">{textos[language].linea1b}</p>
                    <SocialButtons />
                </div>
            </div>
            <div ref={descriptionRef} className={`description ${descriptionVisible ? 'fade-in' : ''}`}>
                <div ref={contentRef} className={`content ${contentVisible ? 'slide-in' : ''}`}>
                    <p ref={content1Ref} className={`content1 ${content1Visible ? 'fade-in-left' : ''}`}>{textos[language].contenido1}</p>
                    <p ref={content2Ref} className={`content2 ${content2Visible ? 'fade-in-right' : ''}`}>{textos[language].contenido2}</p>
                </div>
            </div>

        </div>
    );
};

export default Inicio;
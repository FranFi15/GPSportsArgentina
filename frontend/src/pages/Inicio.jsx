// src/components/Inicio/Inicio.jsx

import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./Inicio.css";
import SocialButtons from '../components/SocialButtons';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import laproImg from '../assets/Inicio/LaproI.png';
import redivoImg from '../assets/Inicio/Redivo.png';
import garinoImg from '../assets/Inicio/Garino.png';
import deliaImg from '../assets/Inicio/Delia.png';
import scalaImg from '../assets/Inicio/scala.png';
import ramellaImg from '../assets/Inicio/ramella.png';
import lucasImg from '../assets/Inicio/lucas.png'


const Inicio = () => {
    const { language } = useLanguage();
    const descriptionRef = useRef(null);
    const contentRef = useRef(null);
    const content1Ref = useRef(null);
    const content2Ref = useRef(null);
    const carouselRef = useRef(null);

    const [descriptionVisible, setDescriptionVisible] = useState(false);
    // const [addressVisible, setAddressVisible] = useState(false); // No longer needed
    const [contentVisible, setContentVisible] = useState(false);
    const [content1Visible, setContent1Visible] = useState(false);
    const [content2Visible, setContent2Visible] = useState(false);

    const carouselImages = [
        { src: laproImg, alt: 'Laprovíttola' },
        { src: redivoImg, alt: 'Redivo' },
        { src: garinoImg, alt: 'Garino' },
        { src: scalaImg, alt: 'Scala' },
        { src: ramellaImg, alt: 'Ramella' },
        { src: lucasImg, alt: 'Lucas' },
        { src: deliaImg, alt: 'Delia' },
    ];

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
                            <img src={image.src} alt={image.alt} />
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
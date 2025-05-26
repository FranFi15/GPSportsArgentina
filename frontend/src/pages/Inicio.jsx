// src/components/Inicio/Inicio.jsx

import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./Inicio.css";
import SocialButtons from '../components/SocialButtons';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import laproImg from '../assets/LaproI.png';
import redivoImg from '../assets/Redivo.png';
import garinoImg from '../assets/Garino.png';
import deliaImg from '../assets/Delia.png';
import scalaImg from '../assets/scala.png';
import ramellaImg from '../assets/ramella.png';
import lucasImg from '../assets/lucas.png'


const Inicio = () => {
    const { language } = useLanguage();
    const descriptionRef = useRef(null);
    // const addressRef = useRef(null); // No longer needed
    const contentRef = useRef(null);
    const content1Ref = useRef(null);
    const content2Ref = useRef(null);
    const content3Ref = useRef(null);
    const carouselRef = useRef(null);

    const [descriptionVisible, setDescriptionVisible] = useState(false);
    // const [addressVisible, setAddressVisible] = useState(false); // No longer needed
    const [contentVisible, setContentVisible] = useState(false);
    const [content1Visible, setContent1Visible] = useState(false);
    const [content2Visible, setContent2Visible] = useState(false);
    const [content3Visible, setContent3Visible] = useState(false);

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
            description: 'El #TeamGPSports está formado por jugadores, entrenadores y deportistas de distintas disciplinas, unidos por una misma filosofía: compromiso, dedicación, trabajo en equipo y pasión por lo que hacen. Desde jóvenes promesas hasta referentes consagrados, acompañamos a cada integrante en su camino, brindando un respaldo cercano y profesional en cada etapa de su carrera. Nuestro equipo no se define solo por lo que logra dentro de la cancha, sino por los valores que representa fuera de ella.',
            // direccionTitulo: 'Nuestra Ubicación', // No longer needed
            // direccionCalle: 'Boyacá 152 6°E', // No longer needed
            // direccionCiudad: 'Ciudad Autónoma de Bs.As, Buenos Aires, Argentina', // No longer needed
            contenido1: 'Nos une el deporte, pero sobre todo, una manera de vivirlo.',
            contenido2: "GP Sports es una compañía de representación y management de jugadores, entrenadores y atletas con mas de 30 años de experiencia en la gestión y negociación de contratos con clubes y empresas de todo el mundo. Acompañamos carreras en un concepto 360, desde la negociación de contratos hasta la implementación comercial de los atletas con un staff de profesionales capacitado para cada una de las áreas de gestión. El objetivo con nuestros clientes es continuar con los valores que caracterizan la empresa desde su fundación: planificación, conocimiento, pasión,innovación y compromiso.",
        },
        en: {
            linea1b: "#TeamGPSports",
            description: 'The #TeamGPSports is made of players, coaches, and athletes from different disciplines, united by a common philosophy: commitment, dedication, teamwork, and passion for what they do. From young talents to established stars, we support each member on their journey, providing close and professional backing at every stage of their career. Our team is defined not only by what they achieve on the field but also by the values they represent off it.',
            // direccionTitulo: 'Our Location', // No longer needed
            // direccionCalle: 'Boyacá 152 6°E', // No longer needed
            // direccionCiudad: 'Ciudad Autónoma de Bs.As, Buenos Aires, Argentina', // No longer needed
            contenido1: 'We are united by sports, but above all, by a way of living it.',
            contenido2: "GP Sports is a representation and management company for players, coaches, and athletes with over 30 years of experience in managing and negotiating contracts with clubs and companies worldwide. We support careers with a 360-degree concept, from contract negotiation to the commercial implementation of athletes, with a staff of professionals trained for each of the management areas. Our objective with our clients is to continue with the values that have characterized the company since its founding: planning, knowledge, passion, innovation, and commitment.",
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === descriptionRef.current) {
                        setTimeout(() => setDescriptionVisible(true), 500);
                    }
                    // else if (entry.target === addressRef.current) { // No longer needed
                    //     setTimeout(() => setAddressVisible(true), 500);
                    // }
                    else if (entry.target === contentRef.current) {
                        setTimeout(() => setContentVisible(true), 500);
                        setTimeout(() => setContent1Visible(true), 700);
                        setTimeout(() => setContent2Visible(true), 900);
                        setTimeout(() => setContent3Visible(true), 1100);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        if (descriptionRef.current) observer.observe(descriptionRef.current);
        // if (addressRef.current) observer.observe(addressRef.current); // No longer needed
        if (contentRef.current) observer.observe(contentRef.current);

        return () => {
            if (descriptionRef.current) observer.unobserve(descriptionRef.current);
            // if (addressRef.current) observer.unobserve(addressRef.current); // No longer needed
            if (contentRef.current) observer.unobserve(contentRef.current);
        };
    }, [language]);

    useEffect(() => {
        setDescriptionVisible(false);
        // setAddressVisible(false); // No longer needed
        setContentVisible(false);
        setContent1Visible(false);
        setContent2Visible(false);
        setContent3Visible(false);
    }, [language]);

    return (
        <div className='inicio'>
            {/* Carousel Section */}
            <div className="carousel-section">
                <Carousel
                    ref={carouselRef}
                    showArrows={false}
                    showIndicators={true}
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

            {/* Description Section (retained) */}
            <div ref={descriptionRef} className={`description ${descriptionVisible ? 'fade-in' : ''}`}>
                <div ref={contentRef} className={`content ${contentVisible ? 'slide-in' : ''}`}>
                    <p ref={content1Ref} className={`content1 ${content1Visible ? 'fade-in-left' : ''}`}>{textos[language].contenido1}</p>
                    <p ref={content2Ref} className={`content2 ${content2Visible ? 'fade-in-right' : ''}`}>{textos[language].contenido2}</p>
                </div>
                <p ref={content3Ref} className={`content3 ${content3Visible ? 'fade-in-right' : ''}`}>{textos[language].description}</p>
            </div>

        </div>
    );
};

export default Inicio;
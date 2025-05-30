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
import lucasImg from '../assets/Inicio/lucas.png';

// Importar los componentes de la librería
import { InstagramEmbed, XEmbed } from 'react-social-media-embed';


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
    // Nuevo estado para las publicaciones sociales
    const [socialPosts, setSocialPosts] = useState([]);
    const [loadingSocialPosts, setLoadingSocialPosts] = useState(true);
    const [errorSocialPosts, setErrorSocialPosts] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


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

    // Hook para obtener las publicaciones de redes sociales
    useEffect(() => {
        const fetchSocialPosts = async () => {
            try {
                // **Asegúrate de que esta URL sea la correcta para tu backend**
                const response = await fetch(`${API_BASE_URL}/api/socialposts`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSocialPosts(data);
            } catch (error) {
                console.error("Failed to fetch social posts:", error);
                setErrorSocialPosts(error);
            } finally {
                setLoadingSocialPosts(false);
            }
        };

        fetchSocialPosts();
    }, []); // Se ejecuta una vez al montar el componente

    // Función auxiliar para renderizar la publicación social usando los componentes de la librería
    const renderSocialPost = (post) => {
        if (post.platform === 'instagram') {
            return (
                <InstagramEmbed
                    url={post.url}
                    width={328} // Ancho recomendado por la librería o ajustable
                    key={post._id}
                    // Puedes añadir props como `captioned`, `align`, `lazyLoad`
                    // Consulta la documentación de react-social-media-embed para más opciones
                />
            );
        } else if (post.platform === 'twitter') {
            return (
                <XEmbed // Para Twitter, ahora se usa XEmbed en vez de TwitterEmbed
                    url={post.url}
                    width={325} // Ancho recomendado o ajustable
                    key={post._id}
                    // Puedes añadir props como `twitterTweetEmbedProps` para opciones avanzadas del tweet
                    // Consulta la documentación de react-social-media-embed
                />
            );
        }
        return null; // En caso de plataforma no reconocida
    };

    return (
        <div className='inicio'>
            {/* Sección del Carrusel (sin cambios) */}
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

            {/* Nueva sección para Publicaciones de Redes Sociales */}
            <div className="social-posts-section">
                <h2>Nuestras Últimas Actualizaciones Sociales</h2>
                {loadingSocialPosts && <p>Cargando publicaciones...</p>}
                {errorSocialPosts && <p>Error al cargar publicaciones: {errorSocialPosts.message}</p>}
                {!loadingSocialPosts && !errorSocialPosts && socialPosts.length === 0 && (
                    <p>No hay publicaciones para mostrar aún.</p>
                )}
                <div className="social-posts-grid">
                    {socialPosts.map(post => (
                        <div key={post._id} className="social-post-item">
                            {renderSocialPost(post)}
                            {/* Puedes añadir un título o descripción si los guardas en tu DB y quieres mostrarlos */}
                            {post.title && <h3 style={{marginTop: '10px'}}>{post.title}</h3>}
                            {post.description && <p>{post.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Inicio;
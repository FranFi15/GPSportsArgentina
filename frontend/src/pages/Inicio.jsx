import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./Inicio.css";
import SocialButtons from '../components/SocialButtons';

const Inicio = () => {
    const { language } = useLanguage();
    const bienvenidaRef = useRef(null);
    const lineasRef = useRef([]);
    const descriptionRef = useRef(null);
    const addressRef = useRef(null);
    const contentRef = useRef(null); // Referencia para el div contenedor del contenido
    const content1Ref = useRef(null);
    const content2Ref = useRef(null);
    const content3Ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [lineasVisible, setLineasVisible] = useState([]);
    const [descriptionVisible, setDescriptionVisible] = useState(false);
    const [addressVisible, setAddressVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false); // Estado para la visibilidad del contenedor content
    const [content1Visible, setContent1Visible] = useState(false);
    const [content2Visible, setContent2Visible] = useState(false);
    const [content3Visible, setContent3Visible] = useState(false);

    const textos = {
        es: {
            linea1b: "#TeamGPSports",
            linea2: "Un grupo de profesionales apasionados",
            linea3: "comprometidos con la excelencia en",
            linea4: "representación deportiva",
            description: 'El #TeamGPSports está formado por jugadores, entrenadores y deportistas de distintas disciplinas, unidos por una misma filosofía: compromiso, dedicación, trabajo en equipo y pasión por lo que hacen. Desde jóvenes promesas hasta referentes consagrados, acompañamos a cada integrante en su camino, brindando un respaldo cercano y profesional en cada etapa de su carrera. Nuestro equipo no se define solo por lo que logra dentro de la cancha, sino por los valores que representa fuera de ella.',
            direccionTitulo: 'Nuestra Ubicación',
            direccionCalle: 'Boyacá 152 6°E',
            direccionCiudad: 'Ciudad Autónoma de Bs.As, Buenos Aires, Argentina',
            contenido1: 'Nos une el deporte, pero sobre todo, una manera de vivirlo.',
            contenido2: "GP Sports es una compañía de representación y management de jugadores, entrenadores y atletas con mas de 30 años de experiencia en la gestión y negociación de contratos con clubes y empresas de todo el mundo. Acompañamos carreras en un concepto 360, desde la negociación de contratos hasta la implementación comercial de los atletas con un staff de profesionales capacitado para cada una de las áreas de gestión. El objetivo con nuestros clientes es continuar con los valores que caracterizan la empresa desde su fundación: planificación, conocimiento, pasión,innovación y compromiso.",
        },
        en: {
            linea1b: "#TeamGPSports",
            linea2: "A group of passionate professionals",
            linea3: "committed to excellence in",
            linea4: "sports representation",
            description: 'The #TeamGPSports is made of players, coaches, and athletes from different disciplines, united by a common philosophy: commitment, dedication, teamwork, and passion for what they do. From young talents to established stars, we support each member on their journey, providing close and professional backing at every stage of their career. Our team is defined not only by what they achieve on the field but also by the values they represent off it.',
            direccionTitulo: 'Our Location',
            direccionCalle: 'Boyacá 152 6°E',
            direccionCiudad: 'Ciudad Autónoma de Bs.As, Buenos Aires, Argentina',
            contenido1: 'We are united by sports, but above all, by a way of living it.',
            contenido2: "GP Sports is a representation and management company for players, coaches, and athletes with over 30 years of experience in managing and negotiating contracts with clubs and companies worldwide. We support careers with a 360-degree concept, from contract negotiation to the commercial implementation of athletes, with a staff of professionals trained for each of the management areas. Our objective with our clients is to continue with the values that have characterized the company since its founding: planning, knowledge, passion, innovation, and commitment.",
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === bienvenidaRef.current) {
                        setTimeout(() => setIsVisible(true), 500);
                        lineasRef.current.forEach((linea, index) => {
                            setTimeout(() => {
                                setLineasVisible(prev => {
                                    const newState = [...prev];
                                    newState[index] = true;
                                    return newState;
                                });
                            }, 800 + index * 300);
                        });
                    } else if (entry.target === descriptionRef.current) {
                        setTimeout(() => setDescriptionVisible(true), 500);
                    } else if (entry.target === addressRef.current) {
                        setTimeout(() => setAddressVisible(true), 500);
                    } else if (entry.target === contentRef.current) {
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

        if (bienvenidaRef.current) observer.observe(bienvenidaRef.current);
        if (descriptionRef.current) observer.observe(descriptionRef.current);
        if (addressRef.current) observer.observe(addressRef.current);
        if (contentRef.current) observer.observe(contentRef.current);

        return () => {
            if (bienvenidaRef.current) observer.unobserve(bienvenidaRef.current);
            if (descriptionRef.current) observer.unobserve(descriptionRef.current);
            if (addressRef.current) observer.unobserve(addressRef.current);
            if (contentRef.current) observer.unobserve(contentRef.current);
        };
    }, [language]);

    useEffect(() => {
        setLineasVisible(Array(Object.keys(textos[language]).filter(key => key.startsWith('linea')).length).fill(false));
        setDescriptionVisible(false);
        setAddressVisible(false);
        setIsVisible(false);
        setContentVisible(false);
        setContent1Visible(false);
        setContent2Visible(false);
        setContent3Visible(false);
    }, [language]);

    const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.189904482318!2d-58.45030162341898!3d-34.5972082803011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb0cca8e31884474f%3A0x992589390011289a!2sBoyac%C3%A1%20152%2C%20C1405BWE%20CABA!5e0!3m2!1ses-419!2sar!4v1681928749354?q=${textos[language].direccionCalle?.replace(/ /g, '+')},+${textos[language].direccionCiudad?.replace(/ /g, '+')}&output=embed`;

    return (
        <div className='inicio'>
            <div ref={bienvenidaRef} className={`bienvenida ${isVisible ? 'fade-in' : ''}`}>
                <p ref={el => lineasRef.current[0] = el} className={`linea-bienvenida linea-titulo ${lineasVisible[0] ? 'slide-up' : ''}`}>
                    <strong className="highlight">{textos[language].linea1b}</strong>
                </p>
                <p ref={el => lineasRef.current[1] = el} className={`linea-bienvenida ${lineasVisible[1] ? 'slide-up' : ''}`}>{textos[language].linea2}</p>
                <p ref={el => lineasRef.current[2] = el} className={`linea-bienvenida ${lineasVisible[2] ? 'slide-up' : ''}`}>{textos[language].linea3}</p>
                <p ref={el => lineasRef.current[3] = el} className={`linea-bienvenida ${lineasVisible[3] ? 'slide-up' : ''}`}>{textos[language].linea4}</p>
                <SocialButtons />
            </div>
            <div ref={descriptionRef} className={`description ${descriptionVisible ? 'fade-in' : ''}`}>
                <div ref={contentRef} className={`content ${contentVisible ? 'slide-in' : ''}`}>
                    <p ref={content1Ref} className={`content1 ${content1Visible ? 'fade-in-left' : ''}`}>{textos[language].contenido1}</p>
                    <p ref={content2Ref} className={`content2 ${content2Visible ? 'fade-in-right' : ''}`}>{textos[language].contenido2}</p>
                </div>
                <p ref={content3Ref} className={`content3 ${content3Visible ? 'fade-in-right' : ''}`}>{textos[language].description}</p>
            </div>
            <div ref={addressRef} className={`direccion ${addressVisible ? 'fade-in-bottom' : ''}`}>
                <div className='datos-direccion'>
                    <h2>{textos[language].direccionTitulo}</h2>
                    <div className="direccion-detalles">
                        <p className="direccion-calle">{textos[language].direccionCalle}</p>
                        <p className="direccion-ciudad">{textos[language].direccionCiudad}</p>
                    </div>
                </div>
                <div className="map-container">
                    <iframe
                        src={googleMapsUrl}
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación de la empresa"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Inicio;
import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./LaEmpresa.css";
import PartnersImage from '../assets/mapa.png'; // Import your partners image
import nastaLogo from "../assets/NS.png";
import playersGroupLogo from "../assets/PGI.png"
import oneWorldLogo from "../assets/OW.png";
import duranLogo from "../assets/DM.png";
import bestBallerLogo from "../assets/BB.png";

// Importa las imágenes para el carrusel de Marketing y Eventos
import evento1 from '../assets/1.jpg';
import evento2 from '../assets/12.jpg';
import evento3 from '../assets/2.jpg';

const LaEmpresa = () => {
    const { language } = useLanguage();
    const imgRef = useRef(null);
    const descriptionRef = useRef(null);
    const description2Ref = useRef(null);
    const staffRef = useRef(null);
    const partnersRef = useRef(null);
    const addressRef = useRef(null);
    const mktEventRef = useRef(null);
    const [isVisible, setIsVisible] = useState({ img: false, description: false, description2: false, staff: false, partners: false, address: false, mktEvent: false });
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselInterval = useRef(null);

    const textos = {
        es: {
            titulo: 'La Empresa',
            contenido1: 'Conectamos talento con oportunidades globales.',
            contenido2: "GP SPORTS pone a disposición del jugador más de 30 años de experiencia en la negociación de contratos con Clubes de todo el mundo y el conocimiento de las reglamentaciones deportivas y de las normas que regulan los contratos profesionales en las diferentes competencias, niveles y países.",
            contenido3: "Cuidamos cada detalle de tu carrera, desde contratos hasta tu marca personal, con un equipo experto dedicado a superar tus expectativas. Representamos a más de cien atletas mundialmente, ofreciendo soluciones personalizadas y oportunidades para maximizar tu potencial. Deja que nuestra experiencia impulse tu leyenda. Contáctanos y lleva tu talento al siguiente nivel.",
            staff1: "Carlos Prunes",
            staff2: "Matias Novoa",
            staff3: "Ariel Eslava",
            staff1I: "Director General",
            staff2I: "Básquetbol y Marketing",
            staff3I: "Básquetbol",
            staff5: "Gonzalo Zamudio",
            staff6: "Edgardo Magnaghi",
            staff7: "Francisco Filippa",
            staff5I: "Contador",
            staff6I: "Abogado",
            staff7I: "Diseñador Digital",
            staff4: "Ricardo Prunes",
            staff4I: "Fútbol",
            direccionTitulo: 'Nuestra Dirección',
            direccionCalle: 'Boyacá 152 6°E',
            direccionCiudad: 'Ciudad Autónoma de Bs.As, Buenos Aires, Argentina',
            partnersTitulo: 'Nuestros Partners',
            partners: [
                { name: 'Players Group S.R.L.', address: 'P.zza Garibaldi, 54\n60044 Fabriano (AN)\nItalia', image: playersGroupLogo, link: 'https://www.instagram.com/playersgroupitalia/' },
                { name: 'One World', address: 'Río Danubio 395-B-Ote., Del Valle,\n66220 San Pedro Garza García, N.L.\nMonterrey, Mexico', image: oneWorldLogo, link: 'https://www.instagram.com/oneworldsportsgroup/' },
                { name: 'Duran International', address: 'Calle Alcobendas 25\n28914, Madrid, España', image: duranLogo, link: 'https://www.instagram.com/duranmanagement/' },
                { name: 'Best Baller', address: 'Torre Tepuy Piso 1 Ofic 1C, Sabana Grande, Caracas, Venezuela', image: bestBallerLogo, link: 'https://www.instagram.com/bestballeragency/' },
                { name: 'Nasta Sports', address: "Brasil" , image: nastaLogo, link: 'https://www.instagram.com/nastasports/' },
            ],
            mktEventTitulo: 'Marketing y Eventos',
            mktEventContenido: 'Queremos que tu imagen fuera de la cancha sea tan valiosa como tus logros deportivos. En GP SPORTS, te ayudamos a construir una marca personal sólida y atractiva para los patrocinadores. Analizamos tu perfil y necesidades para crear una estrategia de imagen a tu medida, incrementando tu reconocimiento y abriendo puertas a oportunidades de ingresos adicionales. Buscamos las marcas ideales para vos, gestionamos tu relación con los medios y potenciamos tus redes sociales para conectar con tus fans. Con nosotros, tu éxito deportivo se traduce en un crecimiento económico y de imagen imparable.',
        },
        en: {
            titulo: 'The Company',
            contenido1: 'Connecting talent with global opportunities.',
            contenido2: "GP SPORTS offers players over 30 years of experience in negotiating contracts with clubs worldwide, along with in-depth knowledge of sports regulations and the rules governing professional contracts across different competitions, levels, and countries.",
            contenido3: "We meticulously manage every detail of your career, from contracts to your personal brand, with an expert team dedicated to exceeding your expectations. Representing over a hundred athletes globally, we offer personalized solutions and opportunities to maximize your potential. Let our experience drive your legend. Contact us and take your talent to the next level.",
            staff1: "Carlos Prunes",
            staff2: "Matias Novoa",
            staff3: "Ariel Eslava",
            staff1I: "General Director",
            staff2I: "Basketball and Marketing",
            staff3I: "Basketball",
            staff5: "Gonzalo Zamudio",
            staff6: "Edgardo Magnaghi",
            staff7: "Francisco Filippa",
            staff5I: "Accountant",
            staff6I: "Lawyer",
            staff7I: "Digital Designer",
            staff4: "Ricardo Prunes",
            staff4I: "Football",
            direccionTitulo: 'Our Address',
            direccionCalle: 'Boyacá 152 6°E',
            direccionCiudad: 'Ciudad Autónoma de Bs.As, Buenos Aires, Argentina',
            partnersTitulo: 'Our Partners',
            partners: [
                { name: 'Players Group S.R.L.', address: 'P.zza Garibaldi, 54\n60044 Fabriano (AN)\nItaly', image: playersGroupLogo, link: 'https://www.instagram.com/playersgroupitalia/' },
                { name: 'One World', address: 'Río Danubio 395-B-Ote., Del Valle,\n66220 San Pedro Garza García, N.L.\nMonterrey, Mexico', image: oneWorldLogo, link: 'https://www.instagram.com/oneworldsportsgroup/' },
                { name: 'Duran International', address: 'Calle Alcobendas 25\n28914, Madrid, Spain', image: duranLogo, link: 'https://www.instagram.com/duranmanagement/' },
                { name: 'Best Baller', address: 'Torre Tepuy Piso 1 Ofic 1C, Sabana Grande, Caracas, Venezuela', image: bestBallerLogo, link:'https://www.instagram.com/bestballeragency/' },
                { name: 'Nasta Sports', address: "Brasil" , image: nastaLogo, link: 'https://www.instagram.com/nastasports/' },
            ],
            mktEventTitulo: 'Marketing & Events',
            mktEventContenido: 'We want your off-field image to be as valuable as your sporting achievements. At GP SPORTS, we help you build a solid and attractive personal brand for sponsors. We analyze your profile and needs to create a tailored image strategy, increasing your recognition and opening doors to additional income opportunities. We seek out the ideal brands for you, manage your media relations, and boost your social media to connect with your fans. With us, your sporting success translates into unstoppable economic and image growth.',
        }
    };

    const carouselImages = [evento1, evento2, evento3];

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === imgRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, img: true })), 100);
                    } else if (entry.target === descriptionRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, description: true })), 300);
                    } else if (entry.target === description2Ref.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, description2: true })), 500);
                    } else if (entry.target === staffRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, staff: true })), 700);
                    } else if (entry.target === partnersRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, partners: true })), 900);
                    } else if (entry.target === addressRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, address: true })), 1100);
                    } else if (entry.target === mktEventRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, mktEvent: true })), 1300);
                    }
                }
            });
        }, {
            threshold: 0.1
        });

        if (imgRef.current) observer.observe(imgRef.current);
        if (descriptionRef.current) observer.observe(descriptionRef.current);
        if (description2Ref.current) observer.observe(description2Ref.current);
        if (staffRef.current) observer.observe(staffRef.current);
        if (partnersRef.current) observer.observe(partnersRef.current);
        if (addressRef.current) observer.observe(addressRef.current);
        if (mktEventRef.current) observer.observe(mktEventRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        carouselInterval.current = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % carouselImages.length);
        }, 2000); // Cambia de imagen cada 3 segundos

        return () => clearInterval(carouselInterval.current); // Limpia el intervalo al desmontar
    }, [carouselImages.length]);

    const nextSlide = () => {
        setCurrentSlide(prevSlide => (prevSlide + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide(prevSlide => (prevSlide - 1 + carouselImages.length) % carouselImages.length);
    };

    const currentText = textos[language];
    const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.189904482318!2d-58.45030162341898!3d-34.5972082803011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb0cca8e31884474f%3A0x992589390011289a!2sBoyac%C3%A1%20152%2C%20C1405BWE%20CABA!5e0!3m2!1ses-419!2sar!4v1681928749354?q=${currentText.direccionCalle?.replace(/ /g, '+')},+${currentText.direccionCiudad?.replace(/ /g, '+')}&output=embed`;

    return (
        <div className="laempresa">
            <div ref={imgRef} className={`img ${isVisible.img ? 'fade-in' : ''}`}>
                <h2>{currentText.titulo}</h2>
            </div>
            <div ref={descriptionRef} className={`description ${isVisible.description ? 'slide-in' : ''}`}>
                <p className='content1'>{currentText.contenido1}</p>
                <p className='content2'>{currentText.contenido2}</p>
            </div>
            <div ref={description2Ref} className={`description2 ${isVisible.description2 ? 'fade-in' : ''}`}>
                <p className='content3'>{currentText.contenido3}</p>
            </div>
            <div ref={mktEventRef} className={`mkt-event ${isVisible.mktEvent ? 'fade-in-bottom' : ''}`}>
                <h2>{currentText.mktEventTitulo}</h2>
                <p className='mkt-event-content'>{currentText.mktEventContenido}</p>
                <div className='carousel-container'>
                    <button className='carousel-button prev' onClick={prevSlide}>&#10094;</button>
                    <div className='carousel-slide' style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {carouselImages.map((image, index) => (
                            <img key={index} src={image} alt={`Evento ${index + 1}`} className='carousel-image' />
                        ))}
                    </div>
                    <button className='carousel-button next' onClick={nextSlide}>&#10095;</button>
                    <div className='carousel-dots'>
                        {carouselImages.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
            <div ref={staffRef} className={`staff ${isVisible.staff ? 'fade-in-bottom' : ''}`}>
                <h2>STAFF</h2>
                <div className='staff-members'>
                    <div className='member'>
                        <div className='staff-img-m'></div>
                        <h3>{currentText.staff1}</h3>
                        <p>{currentText.staff1I}</p>
                    </div>
                    <div className='member'>
                        <div className='staff-img-p'></div>
                        <h3>{currentText.staff2}</h3>
                        <p>{currentText.staff2I}</p>
                    </div>
                    <div className='member'>
                        <div className='staff-img-e'></div>
                        <h3>{currentText.staff3}</h3>
                        <p>{currentText.staff3I}</p>
                    </div>
                    <div className='member'>
                        <div className='staff-img-e'></div>
                        <h3>{currentText.staff4}</h3>
                        <p>{currentText.staff4I}</p>
                    </div>
                    <div className='member'>
                        <div className='staff-img-e'></div>
                        <h3>{currentText.staff5}</h3>
                        <p>{currentText.staff5I}</p>
                    </div>
                    <div className='member'>
                        <div className='staff-img-e'></div>
                        <h3>{currentText.staff6}</h3>
                        <p>{currentText.staff6I}</p>
                    </div>
                    <div className='member'>
                        <div className='staff-img-e'></div>
                        <h3>{currentText.staff7}</h3>
                        <p>{currentText.staff7I}</p>
                    </div>
                </div>
            </div>
            <div ref={partnersRef} className={`partners ${isVisible.partners ? 'fade-in-bottom' : ''}`}>
                <h2>{currentText.partnersTitulo}</h2>
                <div className='partners-image'>
                    <img src={PartnersImage} alt="Nuestros Partners" />
                </div>
                <div className='partners-list'>
                    {currentText.partners.map((partner, index) => (
                        <a
                            key={index}
                            href={partner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='partner-link'
                        >
                            <div className='partner'>
                                {partner.image && <div className='partner-image'><img src={partner.image} alt={partner.name} /></div>}
                                <div className='partner-details'>
                                    <h3>{partner.name}</h3>
                                    <p className='partner-address'>{partner.address.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
            <div ref={addressRef} className={`direccion ${isVisible.address ? 'fade-in-bottom' : ''}`}>
                <div className='datos-direccion'>
                    <h2>{currentText.direccionTitulo}</h2>
                    <div className="direccion-detalles">
                        <p className="direccion-calle">{currentText.direccionCalle}</p>
                        <p className="direccion-ciudad">{currentText.direccionCiudad}</p>
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

export default LaEmpresa;
// src/components/LaEmpresa/LaEmpresa.jsx

import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./LaEmpresa.css";
import PartnersImage from '../assets/mapa.png'; // Import your partners image
import nastaLogo from "../assets/NS.png";
import playersGroupLogo from "../assets/PGI.png"
import oneWorldLogo from "../assets/OW.png";
import duranLogo from "../assets/DM.png";
import bestBallerLogo from "../assets/BB.png";


import carlosPrunesImg from '../assets/cprunes.png';
import matiasNovoaImg from '../assets/novoa.png';
import arielEslavaImg from '../assets/eslava.png';
import ricardoPrunesImg from '../assets/rprunes.png';
import gonzaloZamudioImg from '../assets/contador.png';
import edgardoMagnaghiImg from '../assets/abogado.png';
import franciscoFilippaImg from '../assets/diseñador.png';

const LaEmpresa = () => {
    const { language } = useLanguage();
    const imgRef = useRef(null);
    const descriptionRef = useRef(null);
    const description2Ref = useRef(null);
    const staffRef = useRef(null);
    const partnersRef = useRef(null);
    // const mktEventRef = useRef(null); // No longer needed
    const [isVisible, setIsVisible] = useState({ img: false, description: false, description2: false, staff: false, partners: false, address: false /*, mktEvent: false*/ }); // Remove mktEvent

    const textos = {
        es: {
            titulo: 'La Empresa',
            staffTitulo: 'Nuestro Equipo',
            staff: [
                {
                    name: "Carlos Prunes",
                    role: "Director General",
                    image: carlosPrunesImg
                },
                {
                    name: "Matias Novoa",
                    role: "Básquetbol y Marketing",
                    image: matiasNovoaImg
                },
                {
                    name: "Ariel Eslava",
                    role: "Básquetbol",
                    image: arielEslavaImg
                },
                {
                    name: "Ricardo Prunes",
                    role: "Fútbol",
                    image: ricardoPrunesImg
                },
                {
                    name: "Gonzalo Zamudio",
                    role: "Contador",
                    image: gonzaloZamudioImg
                },
                {
                    name: "Edgardo Magnaghi",
                    role: "Abogado",
                    image: edgardoMagnaghiImg
                },
                {
                    name: "Francisco Filippa",
                    role: "Diseñador Digital",
                    image: franciscoFilippaImg
                },
            ],
            partnersTitulo: 'Nuestros Partners',
            partners: [
                { name: 'Players Group S.R.L.', address: 'P.zza Garibaldi, 54\n60044 Fabriano (AN)\nItalia', image: playersGroupLogo, link: 'https://www.instagram.com/playersgroupitalia/' },
                { name: 'One World', address: 'Río Danubio 395-B-Ote., Del Valle,\n66220 San Pedro Garza García, N.L.\nMonterrey, Mexico', image: oneWorldLogo, link: 'https://www.instagram.com/oneworldsportsgroup/' },
                { name: 'Duran International', address: 'Calle Alcobendas 25\n28914, Madrid, España', image: duranLogo, link: 'https://www.instagram.com/duranmanagement/' },
                { name: 'Best Baller', address: 'Torre Tepuy Piso 1 Ofic 1C, Sabana Grande, Caracas, Venezuela', image: bestBallerLogo, link: 'https://www.instagram.com/bestballeragency/' },
                { name: 'Nasta Sports', address: "Brasil", image: nastaLogo, link: 'https://www.instagram.com/nastasports/' },
            ],

        },
        en: {
            titulo: 'The Company',
            staffTitulo: 'Our Team',
            staff: [
                {
                    name: "Carlos Prunes",
                    role: "General Director",
                    image: carlosPrunesImg
                },
                {
                    name: "Matias Novoa",
                    role: "Basketball and Marketing",
                    image: matiasNovoaImg
                },
                {
                    name: "Ariel Eslava",
                    role: "Basketball",
                    image: arielEslavaImg
                },
                {
                    name: "Ricardo Prunes",
                    role: "Football",
                    image: ricardoPrunesImg
                },
                {
                    name: "Gonzalo Zamudio",
                    role: "Accountant",
                    image: gonzaloZamudioImg
                },
                {
                    name: "Edgardo Magnaghi",
                    role: "Lawyer",
                    image: edgardoMagnaghiImg
                },
                {
                    name: "Francisco Filippa",
                    role: "Digital Designer",
                    image: franciscoFilippaImg
                },
            ],
            partnersTitulo: 'Our Partners',
            partners: [
                { name: 'Players Group S.R.L.', address: 'P.zza Garibaldi, 54\n60044 Fabriano (AN)\nItaly', image: playersGroupLogo, link: 'https://www.instagram.com/playersgroupitalia/' },
                { name: 'One World', address: 'Río Danubio 395-B-Ote., Del Valle,\n66220 San Pedro Garza García, N.L.\nMonterrey, Mexico', image: oneWorldLogo, link: 'https://www.instagram.com/oneworldsportsgroup/' },
                { name: 'Duran International', address: 'Calle Alcobendas 25\n28914, Madrid, Spain', image: duranLogo, link: 'https://www.instagram.com/duranmanagement/' },
                { name: 'Best Baller', address: 'Torre Tepuy Piso 1 Ofic 1C, Sabana Grande, Caracas, Venezuela', image: bestBallerLogo, link: 'https://www.instagram.com/bestballeragency/' },
                { name: 'Nasta Sports', address: "Brasil", image: nastaLogo, link: 'https://www.instagram.com/nastasports/' },
            ],
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === imgRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, img: true })), 50);
                    } else if (entry.target === descriptionRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, description: true })), 100);
                    } else if (entry.target === description2Ref.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, description2: true })), 150);
                    } else if (entry.target === staffRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, staff: true })), 200);
                    } else if (entry.target === partnersRef.current) {
                        setTimeout(() => setIsVisible(prev => ({ ...prev, partners: true })), 250);
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

        return () => observer.disconnect();
    }, []);

    const currentText = textos[language];

    return (
        <div className="laempresa">
            <div ref={imgRef} className={`img ${isVisible.img ? 'fade-in' : ''}`}>
                <h2>{currentText.titulo}</h2>
            </div>
            <div ref={staffRef} className={`staff ${isVisible.staff ? 'fade-in-bottom' : ''}`}>
                <div className='title-staff'><h2>{currentText.staffTitulo}</h2></div>
                <div className='staff-members'>
                    {currentText.staff.map((member, index) => (
                        <div className='member' key={index}>
                            <div className="member-content">
                                {member.image && (
                                    <div className='staff-img-container'>
                                        <img src={member.image} alt={member.name} className='staff-member-img' />
                                    </div>
                                )}
                                <div className="staff-details">
                                    <h3>{member.name}</h3>
                                    <p>{member.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
                            {/* Updated structure to use distinct partner classes */}
                            <div className="partner-content"> {/* New class for partner content */}
                                {partner.image && (
                                    <div className='partner-logo-container'> {/* New class for partner image container */}
                                        <img src={partner.image} alt={partner.name} className='partner-logo-img' /> {/* New class for partner image */}
                                    </div>
                                )}
                                <div className="partner-text-details"> {/* New class for partner text details */}
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
        </div>
    );
};

export default LaEmpresa;

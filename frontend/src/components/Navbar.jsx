import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import logo from '../assets/imagenes.png';
import './Navbar.css';
import esp from "../assets/esp.png";
import eng from "../assets/eeuu.png";

const Navbar = () => {
    const { language, toggleLanguage } = useLanguage();
    const [isDeportesDropdownOpen, setIsDeportesDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const textos = {
        es: { inicio: 'Inicio', laEmpresa: 'La Empresa', teamGPSport: '#TeamGPSports', charlas: 'Conferencias', mkt: 'MKT y Eventos', deportes: 'Deportes', basketball: 'Basketball', contact : 'Contacto', admin: 'Admin' },
        en: { inicio: 'Home', laEmpresa: 'The Company', teamGPSport: '#TeamGPSports', charlas: 'Conferences', mkt: 'MKT and Events', deportes: 'Sports', basketball: 'Basketball', contact: 'Contact', admin: 'Admin' }
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDeportesDropdownOpen(false);
    }, [location]);

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
        setIsDeportesDropdownOpen(false);
        window.scrollTo(0, 0); // Scroll to the top of the page
    }

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && showNavbar) {
                setShowNavbar(false);
            } else if (currentScrollY < lastScrollY && !showNavbar) {
                setShowNavbar(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY, showNavbar]);

    return (
        <nav className={`navbar-container ${!showNavbar ? 'navbar-hidden' : ''}`}>
            <Link to="/" className="navbar-logo-link" onClick={handleLinkClick}>
                <img src={logo} alt="Logo" className="navbar-logo-img" />
            </Link>

            <button
                className="navbar-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation"
                aria-expanded={isMobileMenuOpen}
            >
                <span className="hamburger-icon"></span>
                <span className="hamburger-icon"></span>
                <span className="hamburger-icon"></span>
            </button>

            <ul className={`navbar-nav-list ${isMobileMenuOpen ? 'navbar-nav-list--open' : ''}`}>
                <li className="navbar-nav-item">
                    <Link to="/" className="navbar-nav-link" onClick={handleLinkClick}>{textos[language].inicio}</Link>
                </li>
                <li className="navbar-nav-item">
                    <Link to="/la-empresa" className="navbar-nav-link" onClick={handleLinkClick}>{textos[language].laEmpresa}</Link>
                </li>
                <li className="navbar-nav-item">
                    <Link to="/team-gp-sport" className="navbar-nav-link" onClick={handleLinkClick}>{textos[language].teamGPSport}</Link>
                </li>
                <li className="navbar-nav-item">
                    <Link to="/basketball" className="navbar-nav-link" onClick={handleLinkClick}>{textos[language].basketball}</Link>
                </li>
                <li className="navbar-nav-item">
                    <Link to="/mkt-eventos" className="navbar-nav-link" onClick={handleLinkClick}>{textos[language].mkt}</Link>
                </li>
                <li className="navbar-nav-item">
                    <Link to="/charlas" className="navbar-nav-link" onClick={handleLinkClick}>{textos[language].charlas}</Link>
                </li>
                <li className="navbar-nav-item">
                    <Link to="/contacto" className="navbar-nav-link" onClick={handleLinkClick}>{textos[language].contact}</Link>
                </li>
                <li className="navbar-nav-item">
                    <Link to="/admin" className="navbar-nav-link" onClick={handleLinkClick}>{textos[language].admin}</Link>
                </li>
                <li className="navbar-nav-item navbar-language-buttons">
                    <button onClick={() => toggleLanguage('es')} className={`navbar-button lang-button ${language === 'es' ? 'active' : ''}`}>
                        <img src={eng} alt="Español" className="lang-icon" />
                    </button>
                    <button onClick={() => toggleLanguage('en')} className={`navbar-button lang-button ${language === 'en' ? 'active' : ''}`}>
                        <img src={esp} alt="English" className="lang-icon" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
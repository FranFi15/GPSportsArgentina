import React, { useState, useEffect } from 'react'; // Import useEffect
import './Footer.css'; // Import the CSS file for styles
import { useLanguage } from '../context/LanguageContext'; // Import the custom language hook
import { Link } from 'react-router-dom'; // Import Link for navigation
import SocialButtons from './SocialButtons';
import Modal from '../components/Modal'; // Import the Modal component

const FooterSimple = () => {
  const { language } = useLanguage(); // Obtiene el idioma
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [modalClassName, setModalClassName] = useState('');

  const textos = {
    es: {
      followUs: 'Síguenos',
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      termsText: `Las condiciones de acceso y uso del presente sitio web se rigen por la legalidad vigente y por el principio de buena fe comprometiéndose el usuario a realizar un buen uso de la web. No se permiten conductas que vayan contra la ley, los derechos o intereses de terceros.
Ser usuario de la web de www.gpsports.com.ar implica que reconoce haber leído y aceptado las condiciones legales y lo que las extienda la normativa legal aplicable en esta materia. Si por el motivo que fuere no está de acuerdo con estas condiciones no continúe usando esta web.`,
      designedBy: 'Diseñado por Francisco Filippa',
      rights: "Todos los derechos reservados.",
      addressLink: 'Ver en Google Maps'
    },
    en: {
      followUs: 'Follow Us',
      terms: 'Terms and Conditions',
      privacy: 'Privacy Policy',
      termsText: `The conditions of access and use of this website are governed by current legislation and the principle of good faith, with the user committing to make good use of the web. Conduct that goes against the law, the rights or interests of third parties is not allowed.
Being a user of the website www.gpsports.com.ar implies that you acknowledge having read and accepted the legal conditions and what extends the applicable legal regulations in this matter. If for any reason you do not agree with these conditions, do not continue using this website.`,
      designedBy: 'Designed by Francisco Filippa',
      rights: "All rights reserved.",
      addressLink: 'View on Google Maps'
    },
  };

  const currentText = textos[language];
  const googleMapsLink = "https://maps.app.goo.gl/vdYaNkRkRcPamEoV7";

  const openTermsModal = (e) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
    // Apply the 'open' class in the next tick of the event loop
    setTimeout(() => {
      setModalClassName('open');
    }, 0);
  };

  const closeTermsModal = () => {
    setModalClassName('');
    setTimeout(() => {
      setIsTermsModalOpen(false);
    }, 300);
  };

  return (
    <footer className="footer-simple">
      <div className="footer-content">
        <div className="social-links">
          <h3>{currentText.followUs}</h3>
          <SocialButtons />
        </div>

        <div className="address-link">
          <h3>{language === 'es' ? 'Dirección' : 'Address'}</h3>
          <Link to={googleMapsLink} target="_blank" rel="noopener noreferrer">
          Boyacá 152 6°E, Ciudad Autónoma de Bs.As, Buenos Aires, Argentina
          </Link>
        </div>

        <div className="legal-links">
          <h3>Legal</h3>
          <ul>
            <li>
              <Link to="/terminos-y-condiciones" onClick={openTermsModal}>
                {currentText.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GP SPORTS Argentina.{currentText.rights}</p>
        <p>{currentText.designedBy}</p>
      </div>

      <Modal onClose={closeTermsModal} className={modalClassName}>
        <h2>{currentText.terms}</h2>
        <p>{currentText.termsText}</p>
      </Modal>
    </footer>
  );
};

export default FooterSimple;
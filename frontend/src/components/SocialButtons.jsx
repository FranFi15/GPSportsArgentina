import React from 'react';
import { FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6'; // Importa los iconos de Font Awesome
import './SocialButtons.css'; // Importa el archivo de estilos

const SocialButtons = () => {
  return (
    <div className="social-buttons">
      <a
        href="https://www.instagram.com/gpsportsarg/" // Reemplaza con la URL real de tu Instagram
        target="_blank"
        rel="noopener noreferrer"
        className="social-button instagram"
      >
        <FaInstagram />
      </a>
      <a
        href="https://x.com/GPSportsArg" // Reemplaza con la URL real de tu X (Twitter)
        target="_blank"
        rel="noopener noreferrer"
        className="social-button twitter"
      >
        <FaXTwitter />
      </a>
      <a
        href="https://www.facebook.com/GpSportsArg" // Reemplaza con la URL real de tu Facebook
        target="_blank"
        rel="noopener noreferrer"
        className="social-button facebook"
      >
        <FaFacebookF />
      </a>
    </div>
  );
};

export default SocialButtons;
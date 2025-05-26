// src/components/Contacto/Contacto.jsx

import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./Contacto.css"; // Create this CSS file for styling

const Contacto = () => {
    const { language } = useLanguage();
    const addressRef = useRef(null);
    const formRef = useRef(null);
    const [addressVisible, setAddressVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);

    const textos = {
        es: {
            direccionTitulo: 'Nuestra Ubicación',
            direccionCalle: 'Boyacá 152 6°E',
            direccionCiudad: 'Ciudad Autónoma de Bs.As, Buenos Aires, Argentina',
            contactTitulo: 'Contáctanos',
            formName: 'Nombre',
            formEmail: 'Email',
            formMessage: 'Mensaje',
            formSend: 'Enviar Mensaje',
            formSuccess: '¡Mensaje enviado con éxito!',
            formError: 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.',
        },
        en: {
            direccionTitulo: 'Our Location',
            direccionCalle: 'Boyacá 152 6°E',
            direccionCiudad: 'Ciudad Autónoma de Bs.As, Buenos Aires, Argentina',
            contactTitulo: 'Contact Us',
            formName: 'Name',
            formEmail: 'Email',
            formMessage: 'Message',
            formSend: 'Send Message',
            formSuccess: 'Message sent successfully!',
            formError: 'There was an error sending your message. Please try again.',
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === addressRef.current) {
                        setTimeout(() => setAddressVisible(true), 500);
                    } else if (entry.target === formRef.current) {
                        setTimeout(() => setFormVisible(true), 700);
                    }
                    // No unobserve here, as we want the animation to trigger every time it comes into view
                } else {
                    // Reset visibility when out of view to re-trigger animation on scroll back
                    if (entry.target === addressRef.current) {
                        setAddressVisible(false);
                    } else if (entry.target === formRef.current) {
                        setFormVisible(false);
                    }
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        if (addressRef.current) observer.observe(addressRef.current);
        if (formRef.current) observer.observe(formRef.current);

        return () => {
            if (addressRef.current) observer.disconnect(); // Disconnect all observers on unmount
            if (formRef.current) observer.disconnect();
        };
    }, [language]); // Re-run effect if language changes

    // No need to reset visibility on language change if observer handles it
    // useEffect(() => {
    //     setAddressVisible(false);
    //     setFormVisible(false);
    // }, [language]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to a backend service
        // For demonstration, we'll just log it and show a success message
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data submitted:', data);

        // Using a custom modal or message box instead of alert()
        // For simplicity, I'll use a basic console log and a temporary message state.
        // In a real app, you'd have a dedicated modal component.
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-family: 'Roboto', sans-serif;
            text-align: center;
        `;
        messageBox.textContent = textos[language].formSuccess;
        document.body.appendChild(messageBox);

        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 3000); // Message disappears after 3 seconds

        e.target.reset(); // Clear the form
    };

    return (
        <div className='contacto'>
            <div className="contacto-content"> {/* New container for side-by-side layout */}
                {/* Address Section */}
                <div ref={addressRef} className={`direccion ${addressVisible ? 'fade-in-bottom' : ''}`}>
                    <div className='datos-direccion'>
                        <h2>{textos[language].direccionTitulo}</h2>
                        <div className="direccion-detalles">
                            <p className="direccion-calle">{textos[language].direccionCalle}</p>
                            <p className="direccion-ciudad">{textos[language].direccionCiudad}</p>
                        </div>
                    </div>
                    <div
                        className="map"
                        onClick={() => window.open("https://www.google.com.ar/maps/place/Av.+Boyac%C3%A1+152,+C1406+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.6251093,-58.4581388,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcca26b08b3441:0x139c0d1c399daa86!8m2!3d-34.6251093!4d-58.4581388!16s%2Fg%2F11c4gkbvpr?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D", "_blank")}
                    ></div>
                </div>

                {/* Contact Form Section */}
                <div ref={formRef} className={`contact-form-section ${formVisible ? 'fade-in-bottom' : ''}`}>
                    <h2>{textos[language].contactTitulo}</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">{textos[language].formName}:</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{textos[language].formEmail}:</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">{textos[language].formMessage}:</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit">{textos[language].formSend}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contacto;

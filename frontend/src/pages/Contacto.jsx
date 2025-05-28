// src/components/Contacto/Contacto.jsx

import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./Contacto.css"; // Create this CSS file for styling

const Contacto = () => {
    const { language } = useLanguage();
    const addressRef = useRef(null);
    const formRef = useRef(null); // Keep this ref for accessing form elements if needed, or remove if not used for direct form submission
    const [addressVisible, setAddressVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState(''); // State for success/error messages

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
            formSuccess: '¡Mensaje enviado con éxito! Te contactaremos pronto.',
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
            formSuccess: 'Message sent successfully! We will contact you soon.',
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
                } else {
                    if (entry.target === addressRef.current) {
                        setAddressVisible(false);
                    } else if (entry.target === formRef.current) {
                        setFormVisible(false);
                    }
                }
            });
        }, {
            threshold: 0.1
        });

        if (addressRef.current) observer.observe(addressRef.current);
        if (formRef.current) observer.observe(formRef.current);

        return () => {
            if (addressRef.current) observer.disconnect();
            if (formRef.current) observer.disconnect();
        };
    }, [language]);

    // For Formsubmit.co, you generally let the browser handle the form submission,
    // which causes a page reload. If you want a smoother UX without reload,
    // you'd use Formsubmit's AJAX feature (see note below).
    // For simplicity, we'll remove the custom handleSubmit for now,
    // and rely on Formsubmit's default redirection or built-in thank you page.

    // If you wish to handle the form submission with AJAX (no page reload)
    // and show a custom message, you'd use a structure like this:
    const handleAjaxSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission (page reload)

        const formData = new FormData(e.target);
        // Formsubmit requires the 'name' attributes on inputs for correct data parsing.
        // It also accepts _captcha, _next, etc. as hidden fields.

        try {
            // Formsubmit AJAX submission requires POST request to the action URL
            const response = await fetch(e.target.action, {
                method: 'POST',
                body: formData, // FormData directly
                // Formsubmit handles content-type for FormData automatically
            });

            if (response.ok) { // Formsubmit returns 200 OK for successful submissions
                setSubmissionMessage(textos[language].formSuccess);
                e.target.reset(); // Clear the form
            } else {
                setSubmissionMessage(textos[language].formError);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmissionMessage(textos[language].formError);
        } finally {
            // Clear message after a few seconds
            setTimeout(() => {
                setSubmissionMessage('');
            }, 5000);
        }
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
                    {/* Using Formsubmit.co with AJAX submission for better UX */}
                    <form
                        className="contact-form"
                        action="https://formsubmit.co/info@gpsports.com.ar" // Replace with your target email
                        method="POST"
                        onSubmit={handleAjaxSubmit} // Use the AJAX handler
                    >
                        <div className="form-group">
                            <label htmlFor="name">{textos[language].formName}:</label>
                            <input type="text" id="name" name="name" required /> {/* name attribute is crucial */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{textos[language].formEmail}:</label>
                            <input type="email" id="email" name="email" required /> {/* name attribute is crucial */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">{textos[language].formMessage}:</label>
                            <textarea id="message" name="message" rows="5" required></textarea> {/* name attribute is crucial */}
                        </div>

                        {/* Optional Formsubmit.co fields */}
                        {/* <input type="hidden" name="_captcha" value="false" /> Disable reCAPTCHA if you don't want it */}
                        {/* <input type="hidden" name="_next" value="https://yourwebsite.com/thank-you.html" /> Redirect to a specific URL after submission */}

                        <button type="submit">{textos[language].formSend}</button>

                        {submissionMessage && (
                            <p className={`form-submission-message ${submissionMessage.includes('éxito') || submissionMessage.includes('success') ? 'success' : 'error'}`}>
                                {submissionMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contacto;
// src/components/Admin/SocialPostList.jsx

import React, { useEffect, useState } from 'react';
import SocialPostForm from './SocialPostForm';
import './SocialPostList.css'; // Asegúrate de que este CSS esté actualizado

const SocialPostList = () => {
    const [socialPosts, setSocialPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Función para obtener las publicaciones sociales
    const fetchSocialPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/socialposts`);
            
            // Fetch API no lanza error para respuestas HTTP como 404 o 500.
            // Es crucial verificar response.ok para manejar errores del servidor.
            if (!response.ok) {
                // Intentar parsear el cuerpo de la respuesta para obtener un mensaje más detallado
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
                throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message}`);
            }

            const data = await response.json();
            setSocialPosts(data);
        } catch (err) {
            console.error("Error fetching social posts:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect para cargar las publicaciones al montar el componente
    useEffect(() => {
        fetchSocialPosts();
    }, []);

    // useEffect para cargar el script de incrustación de Instagram
    // Esto es crucial para que los embeds de Instagram se rendericen correctamente
    useEffect(() => {
        if (socialPosts.some(post => post.platform === 'instagram' && post.embedHtml)) {
            const script = document.createElement('script');
            script.async = true;
            script.src = "//www.instagram.com/embed.js";
            script.id = "instagram-embed-script"; // Añadir un ID para evitar duplicados

            // Solo añade el script si no existe ya en el DOM
            if (!document.getElementById('instagram-embed-script')) {
                document.body.appendChild(script);
            }
        }
    }, [socialPosts]); // Dependencia en socialPosts para re-evaluar si se necesita el script

    // NUEVO useEffect para cargar el script de incrustación de Twitter (X)
    useEffect(() => {
        // Verifica si hay posts de Twitter/X con embedHtml para cargar el script
        if (socialPosts.some(post => (post.platform === 'twitter' || post.platform === 'x') && post.embedHtml)) {
            const script = document.createElement('script');
            script.async = true;
            script.src = "https://platform.twitter.com/widgets.js"; // URL del script de widgets de X
            script.charset = "utf-8";
            script.id = "twitter-widgets-script"; // Añadir un ID para evitar duplicados

            // Solo añade el script si no existe ya en el DOM
            if (!document.getElementById('twitter-widgets-script')) {
                document.body.appendChild(script);
            } else {
                // Si el script ya existe, asegúrate de que los embeds se vuelvan a renderizar
                // Esto es importante si los posts cambian sin que la página se recargue
                if (window.twttr && window.twttr.widgets && typeof window.twttr.widgets.load === 'function') {
                    window.twttr.widgets.load();
                }
            }
        }
    }, [socialPosts]);


    // Maneja la edición de una publicación
    const handleEdit = (post) => {
        setSelectedPost(post);
        setShowForm(true);
    };

    // Maneja la eliminación de una publicación
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/socialposts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // Si tu API requiere autenticación (ej. token JWT), agrégalo aquí:
                        // 'Authorization': `Bearer ${tuTokenDeAutenticacion}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Error desconocido al eliminar' }));
                    throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message}`);
                }

                // No es necesario parsear JSON para un DELETE exitoso si no hay cuerpo de respuesta
                fetchSocialPosts(); // Refresca la lista después de la eliminación exitosa
            } catch (err) {
                console.error("Error deleting social post:", err);
                setError(err);
                alert(`Error al eliminar la publicación: ${err.message}`);
            }
        }
    };

    return (
        <div className="social-post-list-container">
            <h2>Publicaciones Sociales</h2>
            <button onClick={() => setShowForm(true)} className="add-post-button">
                Añadir Nueva Publicación
            </button>

            {loading && <p>Cargando publicaciones...</p>}
            {error && <p className="form-error">Error al cargar publicaciones: {error.message}</p>}

            {socialPosts.length === 0 && !loading && !error && (
                <p className="no-posts-message">No hay publicaciones sociales para mostrar aún.</p>
            )}

            <div className="social-posts-grid"> {/* Este div ahora funciona como un contenedor flex column */}
                {socialPosts.map(post => (
                    <div key={post._id} className="social-post-card"> {/* Cada post es una "tarjeta" en la lista */}
                        {/* Información principal del post */}
                        <h3>{post.title || `Publicación de ${post.platform}`}</h3>
                        <p><span className="platform">Plataforma:</span> {post.platform}</p>
                        
                        {/* Enlace a la publicación original */}
                        {post.url && (
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="social-post-url">
                                Ver publicación original
                            </a>
                        )}

                        {/* Renderizado condicional del embed HTML si es Instagram */}
                        {post.platform === 'instagram' && post.embedHtml && (
                            <div className="embed-container"> {/* Usa la clase genérica para embeds */}
                                {/* dangerouslySetInnerHTML es necesario para renderizar HTML crudo del embed */}
                                <div dangerouslySetInnerHTML={{ __html: post.embedHtml }} />
                            </div>
                        )}

                        {/* Renderizado condicional del embed HTML si es Twitter/X */}
                        {(post.platform === 'twitter' || post.platform === 'x') && post.embedHtml && (
                            <div className="embed-container"> {/* Usa la clase genérica para embeds */}
                                <div dangerouslySetInnerHTML={{ __html: post.embedHtml }} />
                            </div>
                        )}
                        {/* Puedes añadir más lógica aquí para otros tipos de embeds si los manejas con embedHtml */}

                        {/* Botones de acción */}
                        <div className="card-actions">
                            <button onClick={() => handleEdit(post)} className="edit-btn">
                                Editar
                            </button>
                            <button onClick={() => handleDelete(post._id)} className="delete-btn">
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Formulario de añadir/editar publicación */}
            {showForm && (
                <SocialPostForm
                    onClose={() => {
                        setShowForm(false);
                        setSelectedPost(null);
                        fetchSocialPosts(); // Refresca la lista después de añadir/editar
                    }}
                    post={selectedPost}
                />
            )}
        </div>
    );
};

export default SocialPostList;
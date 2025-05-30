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
            if (!response.ok) {
                // Lanza un error si la respuesta no es OK (ej. 404, 500)
                throw new Error(`HTTP error! Status: ${response.status}`);
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
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
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

            <div className="social-posts-grid">
                {socialPosts.map(post => (
                    <div key={post._id} className="social-post-card">
                        <h3>{post.title || `Publicación de ${post.platform}`}</h3>
                        <p><span className="platform">Plataforma:</span> {post.platform}</p>
                        {post.description && <p>{post.description}</p>}
                        
                        {/* Asegúrate de que post.url exista si vas a mostrar el enlace */}
                        {post.url && (
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="social-post-url">
                                Ver publicación original
                            </a>
                        )}

                        {/* Renderizado condicional del embed HTML si es Instagram */}
                        {post.platform === 'instagram' && post.embedHtml && (
                            <div className="instagram-embed-container">
                                {/* dangerouslySetInnerHTML es necesario para renderizar HTML crudo */}
                                <div dangerouslySetInnerHTML={{ __html: post.embedHtml }} />
                            </div>
                        )}
                        {/* Si tienes embeds HTML para otras plataformas (ej. Twitter/X) también se renderizarían aquí */}

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
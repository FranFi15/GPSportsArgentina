// src/components/Admin/SocialPostList.jsx

import React, { useEffect, useState } from 'react';
import SocialPostForm from './SocialPostForm';
import './SocialPostList.css'; // Asegúrate de que este CSS esté actualizado
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // Importar de @hello-pangea/dnd

const SocialPostList = () => {
    const [socialPosts, setSocialPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Assuming you have an AuthContext for token, similar to PersonList
    // If not, you'll need to pass or manage the token differently
    // const { token } = useAuth(); 

    // Función para obtener las publicaciones sociales, ahora ordenadas
    const fetchSocialPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            // Asegúrate de que tu backend ordene las publicaciones por el campo 'order'
            const response = await fetch(`${API_BASE_URL}/api/socialposts`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Si tu API requiere autenticación
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
                throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message}`);
            }

            const data = await response.json();
            // Ordena los posts por el campo 'order' si lo tienen
            const sortedData = data.sort((a, b) => a.order - b.order);
            setSocialPosts(sortedData);
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
    }, []); // Dependencia vacía para que se ejecute solo al montar

    // useEffect para cargar el script de incrustación de Instagram
    useEffect(() => {
        if (socialPosts.some(post => post.platform === 'instagram' && post.embedHtml)) {
            const script = document.createElement('script');
            script.async = true;
            script.src = "//www.instagram.com/embed.js";
            script.id = "instagram-embed-script";

            if (!document.getElementById('instagram-embed-script')) {
                document.body.appendChild(script);
            }
        }
    }, [socialPosts]);

    // NUEVO useEffect para cargar el script de incrustación de Twitter (X)
    useEffect(() => {
        if (socialPosts.some(post => (post.platform === 'twitter' || post.platform === 'x') && post.embedHtml)) {
            const script = document.createElement('script');
            script.async = true;
            script.src = "https://platform.twitter.com/widgets.js";
            script.charset = "utf-8";
            script.id = "twitter-widgets-script";

            if (!document.getElementById('twitter-widgets-script')) {
                document.body.appendChild(script);
            } else {
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
                        // 'Authorization': `Bearer ${token}` // Si tu API requiere autenticación
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Error desconocido al eliminar' }));
                    throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message}`);
                }

                fetchSocialPosts(); // Refresca la lista después de la eliminación exitosa
            } catch (err) {
                console.error("Error deleting social post:", err);
                setError(err);
                alert(`Error al eliminar la publicación: ${err.message}`);
            }
        }
    };

    // Función para manejar el final del arrastre
    const onDragEnd = async (result) => {
        // Si no se soltó en un lugar válido o no se movió de posición
        if (!result.destination || result.destination.index === result.source.index) {
            return;
        }

        const reorderedPosts = Array.from(socialPosts);
        const [removed] = reorderedPosts.splice(result.source.index, 1);
        reorderedPosts.splice(result.destination.index, 0, removed);

        // Actualiza el estado local inmediatamente para una buena UX
        setSocialPosts(reorderedPosts);

        // Prepara los datos para enviar al backend
        const updatedOrder = reorderedPosts.map((post, index) => ({
            id: post._id,
            order: index, // El nuevo índice como su orden
        }));

        try {
            const response = await fetch(`${API_BASE_URL}/api/socialposts/reorder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Si tu API requiere autenticación
                },
                body: JSON.stringify({ order: updatedOrder }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el orden de las publicaciones.');
            }
            // Si la actualización fue exitosa, no se necesita hacer nada más ya que el estado local ya está actualizado.
        } catch (err) {
            console.error("Error al guardar el nuevo orden de publicaciones:", err);
            setError("No se pudo guardar el nuevo orden. Por favor, inténtalo de nuevo.");
            // Opcional: Revertir el estado si el guardado falla
            // fetchSocialPosts(); // Para recuperar el estado original del backend
        }
    };


    return (
        <div className="social-post-list-container">
            <h2>Publicaciones Sociales</h2>
            <button onClick={() => { setShowForm(true); setSelectedPost(null); }} className="add-post-button">
                Añadir Nueva Publicación
            </button>

            {loading && <p>Cargando publicaciones...</p>}
            {error && <p className="form-error">Error al cargar publicaciones: {error.message}</p>}

            {socialPosts.length === 0 && !loading && !error && (
                <p className="no-posts-message">No hay publicaciones sociales para mostrar aún.</p>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="social-posts-droppable">
                    {(provided) => (
                        <div
                            className="social-posts-grid" // Reutiliza o adapta esta clase CSS para el contenedor del Droppable
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {socialPosts.map((post, index) => (
                                <Draggable key={post._id} draggableId={post._id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="social-post-card" // Cada post es una "tarjeta" en la lista
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps} // Esto permite arrastrar desde cualquier parte de la tarjeta
                                        >
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
                                                <div className="embed-container">
                                                    <div dangerouslySetInnerHTML={{ __html: post.embedHtml }} />
                                                </div>
                                            )}

                                            {/* Renderizado condicional del embed HTML si es Twitter/X */}
                                            {(post.platform === 'twitter' || post.platform === 'x') && post.embedHtml && (
                                                <div className="embed-container">
                                                    <div dangerouslySetInnerHTML={{ __html: post.embedHtml }} />
                                                </div>
                                            )}

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
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

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
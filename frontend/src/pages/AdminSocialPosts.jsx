// src/pages/AdminSocialPosts.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SocialPostList from '../components/Admin/SocialPostList';
import SocialPostForm from '../components/Admin/SocialPostForm';
import './AdminSocialPosts.css'; // Asegúrate de que este archivo CSS existe

const AdminSocialPosts = () => {
    const [socialPosts, setSocialPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const { token } = useAuth();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Función para obtener todas las publicaciones de redes sociales usando fetch
    const fetchSocialPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/socialposts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar las publicaciones.');
            }

            const data = await response.json();
            setSocialPosts(data);
        } catch (err) {
            console.error("Error al cargar las publicaciones de redes sociales:", err);
            setError("Error al cargar las publicaciones de redes sociales: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchSocialPosts();
        }
    }, [token]);

    // Función para añadir una nueva publicación usando fetch
    const handleAddPost = async (postData) => {
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/socialposts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al añadir la publicación.');
            }

            await fetchSocialPosts();
            setEditingPost(null);
        } catch (err) {
            console.error("Error al añadir la publicación:", err);
            setError("Error al añadir la publicación: " + err.message);
        }
    };

    // Función para actualizar una publicación existente usando fetch
    const handleUpdatePost = async (id, postData) => {
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/socialposts/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la publicación.');
            }

            await fetchSocialPosts();
            setEditingPost(null);
        } catch (err) {
            console.error("Error al actualizar la publicación:", err);
            setError("Error al actualizar la publicación: " + err.message);
        }
    };

    // Función para eliminar una publicación usando fetch
    const handleDeletePost = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
            try {
                setError(null);
                const response = await fetch(`${API_BASE_URL}/api/socialposts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await await response.json();
                    throw new Error(errorData.message || 'Error al eliminar la publicación.');
                }

                await fetchSocialPosts();
            } catch (err) {
                console.error("Error al eliminar la publicación:", err);
                setError("Error al eliminar la publicación: " + err.message);
            }
        }
    };

    const startEditing = (post) => {
        setEditingPost(post);
    };

    const cancelEditing = () => {
        setEditingPost(null);
    };

    return (
        <div className="admin-social-posts-container">
            {error && <p className="error-message">{error}</p>}
            <div className="social-form-section">
            </div>
            <div className="social-list-section">
                <h2 className="section-title">Publicaciones Actuales</h2>
                {loading ? (
                    <p>Cargando publicaciones...</p>
                ) : (
                    <SocialPostList
                        posts={socialPosts}
                        onEdit={startEditing}
                        onDelete={handleDeletePost}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminSocialPosts;
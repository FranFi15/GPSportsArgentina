// src/components/Admin/SocialPostForm.jsx
import React, { useState, useEffect } from 'react';
import './SocialPostForm.css'; // Estilos para el formulario

const SocialPostForm = ({ initialData, onSubmit, onCancel }) => {
    const [platform, setPlatform] = useState('');
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setPlatform(initialData.platform);
            setUrl(initialData.url);
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
        } else {
            setPlatform('');
            setUrl('');
            setTitle('');
            setDescription('');
        }
        setError('');
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!platform || !url) {
            setError('La plataforma y la URL son obligatorias.');
            return;
        }

        const postToSave = { platform, url, title, description };

        if (initialData && initialData._id) {
            onSubmit(initialData._id, postToSave);
        } else {
            onSubmit(postToSave);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="social-post-form">
            {error && <p className="form-error">{error}</p>}
            <div className="form-group">
                <label htmlFor="platform">Plataforma:</label>
                <select
                    id="platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    required
                >
                    <option value="">Selecciona una plataforma</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="url">URL de la Publicación:</label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Ej: https://www.instagram.com/p/XXXXXX/"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="title">Título:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título breve para la publicación"
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Codigo:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción más detallada"
                ></textarea>
            </div>
            <div className="form-actions">
                <button type="submit" className="submit-btn">
                    {initialData ? 'Guardar Cambios' : 'Añadir Publicación'}
                </button>
                {initialData && (
                    <button type="button" onClick={onCancel} className="cancel-btn">
                        Cancelar Edición
                    </button>
                )}
            </div>
        </form>
    );
};

export default SocialPostForm;
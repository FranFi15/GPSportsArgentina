// src/components/Admin/SocialPostList.jsx
import React from 'react';
import './SocialPostList.css'; // Estilos para la tabla

const SocialPostList = ({ posts, onEdit, onDelete }) => {
    return (
        <div className="social-post-list-wrapper">
            {posts.length === 0 ? (
                <p className="no-posts-message">No hay publicaciones de redes sociales para mostrar.</p>
            ) : (
                <table className="social-posts-table">
                    <thead>
                        <tr>
                            <th>Plataforma</th>
                            <th>URL</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post._id}>
                                <td>{post.platform}</td>
                                <td><a href={post.url} target="_blank" rel="noopener noreferrer">{post.url}</a></td>
                                <td>{post.title || '-'}</td>
                                <td>{post.description || '-'}</td>
                                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <button onClick={() => onEdit(post)} className="edit-btn">Editar</button>
                                    <button onClick={() => onDelete(post._id)} className="delete-btn">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SocialPostList;
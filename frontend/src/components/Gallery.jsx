// components/Gallery.js
import React from 'react';
import './Gallery.css';

const Gallery = ({ items }) => {
    return (
        <div className="gallery-container">
            {items.map((item, index) => (
                <div key={index} className="gallery-item">
                    {item.type === 'image' && (
                        <img src={item.src} alt={`Galería Item ${index + 1}`} className="gallery-image" />
                    )}
                    {item.type === 'video' && item.source === 'youtube' && (
                        <div className="video-container">
                            <iframe
                                width="560" // Puedes ajustar el ancho
                                height="315" // Puedes ajustar la altura
                                src={`${item.videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    {item.type === 'video' && item.source !== 'youtube' && (
                        <video src={item.src} controls className="gallery-video"></video>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Gallery;
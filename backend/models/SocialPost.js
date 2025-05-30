// models/SocialPost.js

import mongoose from 'mongoose'; // Usamos import para consistencia con tu proyecto

const SocialPostSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['instagram', 'twitter'], // Para diferenciar la plataforma
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true, 
  },
  title: { 
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Actualiza el campo 'updatedAt' antes de guardar o actualizar
SocialPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

SocialPostSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

const SocialPost = mongoose.model('SocialPost', SocialPostSchema);

export default SocialPost; 
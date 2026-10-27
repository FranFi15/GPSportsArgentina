import mongoose from 'mongoose';

const AlbumPhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
}, { _id: false });

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  caption: { type: String, default: '', trim: true },
  photos: { type: [AlbumPhotoSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Album', AlbumSchema);

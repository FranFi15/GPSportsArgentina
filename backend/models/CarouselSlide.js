import mongoose from 'mongoose';

const CarouselSlideSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

export default mongoose.model('CarouselSlide', CarouselSlideSchema);

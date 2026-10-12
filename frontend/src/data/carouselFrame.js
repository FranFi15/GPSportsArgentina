export const defaultFrame = { zoom: 1, x: 50, y: 0 };

export const clampFrame = (frame = {}) => ({
  zoom: Math.min(2.5, Math.max(1, Number(frame.zoom) || 1)),
  x: Math.min(100, Math.max(0, Number.isFinite(Number(frame.x)) ? Number(frame.x) : 50)),
  y: Math.min(100, Math.max(0, Number.isFinite(Number(frame.y)) ? Number(frame.y) : 0)),
});

export const frameStyle = (frame = {}) => {
  const { zoom, x, y } = clampFrame(frame);
  const origin = `${x}% ${y}%`;
  return {
    objectPosition: origin,
    transform: `scale(${zoom})`,
    transformOrigin: origin,
  };
};

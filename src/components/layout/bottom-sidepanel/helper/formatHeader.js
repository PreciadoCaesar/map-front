export const formatHeader = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .replace(/_/g, ' ')          // Guiones bajos a espacios
    .replace(/-/g, ' ')          // Guiones medios a espacios
    .replace(/\b\w/g, char => char.toUpperCase())  // Capitalizar
    .trim();
};
export const capitalizeWords = (str) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatGenre = (genreStr) => {
  if (!genreStr) return genreStr;
  return genreStr
    .split(", ")
    .map((genre) => genre.charAt(0).toUpperCase() + genre.slice(1))
    .join(", ");
};

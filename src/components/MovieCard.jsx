import { Link } from "react-router-dom";

function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
}) {
  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://placehold.co/500x750/111827/ffffff?text=No+Poster";

  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          src={poster}
          alt={`${movie.Title} poster`}
          loading="lazy"
        />

        <span className="rating">🎬 {movie.Type}</span>

        <button
          type="button"
          className={
            isFavorite
              ? "favorite-button favorite-active"
              : "favorite-button"
          }
          onClick={() => onToggleFavorite(movie)}
          aria-label={
            isFavorite
              ? `Remove ${movie.Title} from favorites`
              : `Add ${movie.Title} to favorites`
          }
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="movie-info">
        <h3>{movie.Title}</h3>

        <div className="movie-meta">
          <span>{movie.Year}</span>
          <span>{movie.Type}</span>
        </div>

        <Link
          className="details-link"
          to={`/movie/${movie.imdbID}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default MovieCard;
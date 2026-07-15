import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieDetails } from "../services/api";

function MovieDetails({
  favorites,
  onToggleFavorite,
}) {
  const { imdbID } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError("");

        const data = await getMovieDetails(imdbID);

        if (data?.Response === "True") {
          setMovie(data);
        } else {
          setMovie(null);
          setError(data?.Error || "Movie details nahi mili.");
        }
      } catch (error) {
        console.error(error);
        setError("Movie details load nahi ho paayi.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [imdbID]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="status-message">
          <div className="loader"></div>
          <p>Movie details load ho rahi hain...</p>
        </div>
      </section>
    );
  }

  if (error || !movie) {
    return (
      <section className="page-section">
        <div className="status-message error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <Link className="details-link" to="/">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://placehold.co/500x750/111827/ffffff?text=No+Poster";

  const isFavorite = favorites.some(
    (favorite) => favorite.imdbID === movie.imdbID
  );

  return (
    <section className="details-page">
      <div className="details-poster">
        <img src={poster} alt={`${movie.Title} poster`} />
      </div>

      <div className="details-content">
        <p className="section-label">{movie.Genre}</p>

        <h1>{movie.Title}</h1>

        <div className="details-meta">
          <span>⭐ {movie.imdbRating}</span>
          <span>{movie.Year}</span>
          <span>{movie.Runtime}</span>
          <span>{movie.Rated}</span>
        </div>

        <p className="overview">{movie.Plot}</p>

        <div className="details-list">
          <p>
            <strong>Director:</strong> {movie.Director}
          </p>

          <p>
            <strong>Actors:</strong> {movie.Actors}
          </p>

          <p>
            <strong>Language:</strong> {movie.Language}
          </p>

          <p>
            <strong>Awards:</strong> {movie.Awards}
          </p>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => onToggleFavorite(movie)}
          >
            {isFavorite
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </button>

          <Link className="details-link" to="/">
            ← Back to Movies
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MovieDetails;
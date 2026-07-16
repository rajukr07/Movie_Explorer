import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieDetails } from "../services/api";

const FALLBACK_POSTER =
  "https://placehold.co/500x750/111827/ffffff?text=Poster+Unavailable";

function MovieDetails({ favorites = [], onToggleFavorite }) {
  const { imdbID } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError("");

        const data = await getMovieDetails(imdbID);

        if (!isMounted) return;

        if (data?.Response === "True") {
          setMovie(data);
        } else {
          setMovie(null);
          setError(
            data?.Error || "The requested movie details could not be found."
          );
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);

        if (isMounted) {
          setMovie(null);
          setError(
            "Unable to load movie details. Please check your connection and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMovieDetails();

    return () => {
      isMounted = false;
    };
  }, [imdbID]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="status-message">
          <div className="loader" aria-hidden="true"></div>
          <p>Loading movie details...</p>
        </div>
      </section>
    );
  }

  if (error || !movie) {
    return (
      <section className="page-section">
        <div className="status-message error-state">
          <h2>Unable to Load Movie</h2>
          <p>{error}</p>

          <Link className="details-link" to="/">
            Return to Movies
          </Link>
        </div>
      </section>
    );
  }

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : FALLBACK_POSTER;

  const isFavorite = favorites.some(
    (favorite) => favorite.imdbID === movie.imdbID
  );

  function handlePosterError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_POSTER;
  }

  function handleFavoriteClick() {
    if (typeof onToggleFavorite === "function") {
      onToggleFavorite(movie);
    }
  }

  return (
    <section className="details-page">
      <div className="details-poster">
        <img
          src={poster}
          alt={`${movie.Title} poster`}
          onError={handlePosterError}
        />
      </div>

      <div className="details-content">
        <p className="section-label">
          {movie.Genre && movie.Genre !== "N/A"
            ? movie.Genre
            : "Movie"}
        </p>

        <h1>{movie.Title}</h1>

        <div className="details-meta">
          <span>
            ⭐{" "}
            {movie.imdbRating && movie.imdbRating !== "N/A"
              ? movie.imdbRating
              : "Not rated"}
          </span>

          <span>{movie.Year || "Year unavailable"}</span>

          <span>
            {movie.Runtime && movie.Runtime !== "N/A"
              ? movie.Runtime
              : "Runtime unavailable"}
          </span>

          <span>
            {movie.Rated && movie.Rated !== "N/A"
              ? movie.Rated
              : "Not rated"}
          </span>
        </div>

        <p className="overview">
          {movie.Plot && movie.Plot !== "N/A"
            ? movie.Plot
            : "No plot summary is currently available for this title."}
        </p>

        <div className="details-list">
          <p>
            <strong>Director:</strong>{" "}
            {movie.Director && movie.Director !== "N/A"
              ? movie.Director
              : "Not available"}
          </p>

          <p>
            <strong>Actors:</strong>{" "}
            {movie.Actors && movie.Actors !== "N/A"
              ? movie.Actors
              : "Not available"}
          </p>

          <p>
            <strong>Language:</strong>{" "}
            {movie.Language && movie.Language !== "N/A"
              ? movie.Language
              : "Not available"}
          </p>

          <p>
            <strong>Awards:</strong>{" "}
            {movie.Awards && movie.Awards !== "N/A"
              ? movie.Awards
              : "Not available"}
          </p>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="primary-button"
            onClick={handleFavoriteClick}
          >
            {isFavorite
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </button>

          <Link className="details-link" to="/">
            ← Browse Movies
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MovieDetails;
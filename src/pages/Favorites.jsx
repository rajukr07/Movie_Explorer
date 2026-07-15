import MovieCard from "../components/MovieCard";

function Favorites({
  favorites,
  onToggleFavorite,
}) {
  return (
    <section className="favorites-page">
      <div className="section-header">
        <div>
          <p className="section-label">YOUR COLLECTION</p>
          <h1>Favorite Movies</h1>
        </div>

        <p className="movie-count">
          {favorites.length} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h2>No Favorites Yet ❤️</h2>

          <p>
            Search movies and click the heart icon to save them here.
          </p>
        </div>
      ) : (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isFavorite
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
import "./App.css";

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites =
        localStorage.getItem("movieFavorites");

      return savedFavorites
        ? JSON.parse(savedFavorites)
        : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "movieFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  function toggleFavorite(movie) {
    const alreadyFavorite = favorites.some(
      (favorite) => favorite.imdbID === movie.imdbID
    );

    if (alreadyFavorite) {
      setFavorites((previousFavorites) =>
        previousFavorites.filter(
          (favorite) =>
            favorite.imdbID !== movie.imdbID
        )
      );

      setToast(`${movie.Title} removed from favorites`);
      return;
    }

    const favoriteMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Type: movie.Type || "movie",
      Poster: movie.Poster,
    };

    setFavorites((previousFavorites) => [
      ...previousFavorites,
      favoriteMovie,
    ]);

    setToast(`${movie.Title} added to favorites`);
  }

  return (
    <div className="app">
      <Navbar favoritesCount={favorites.length} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />

          <Route
            path="/movie/:imdbID"
            element={
              <MovieDetails
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />

          <Route
            path="/favorites"
            element={
              <Favorites
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />

          <Route
            path="*"
            element={
              <section className="page-section">
                <div className="empty-state">
                  <h1>404 — Page Not Found</h1>
                </div>
              </section>
            }
          />
        </Routes>
      </main>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
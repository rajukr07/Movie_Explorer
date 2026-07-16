import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
import "./App.css";

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem("movieFavorites");

      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error("Failed to load favorites:", error);
      return [];
    }
  });

  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        "movieFavorites",
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }, [favorites]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  function toggleFavorite(movie) {
    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite.imdbID === movie.imdbID
    );

    if (isAlreadyFavorite) {
      setFavorites((previousFavorites) =>
        previousFavorites.filter(
          (favorite) => favorite.imdbID !== movie.imdbID
        )
      );

      setToast(`${movie.Title} removed from favorites.`);
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

    setToast(`${movie.Title} added to favorites.`);
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
                  <p>The page you are looking for does not exist.</p>
                </div>
              </section>
            }
          />
        </Routes>
      </main>

      <Footer />

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
import { useEffect, useRef, useState } from "react";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/api";

const DEFAULT_SEARCH = "Avengers";

function Home({ favorites, onToggleFavorite }) {
  const [searchText, setSearchText] = useState(DEFAULT_SEARCH);
  const [activeSearch, setActiveSearch] = useState(DEFAULT_SEARCH);
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const latestRequest = useRef(0);
  const searchBoxRef = useRef(null);

  async function fetchMovies(searchTerm, pageNumber = 1) {
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;

    try {
      setLoading(true);
      setError("");
      setShowSuggestions(false);

      const data = await searchMovies(searchTerm, pageNumber);

      if (requestId !== latestRequest.current) return;

      if (data?.Response === "True") {
        setMovies(data.Search);
        setTotalResults(Number(data.totalResults));
        setActiveSearch(searchTerm);
        setPage(pageNumber);
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(data?.Error || "No movies found.");
      }
    } catch (error) {
      console.error(error);

      if (requestId === latestRequest.current) {
        setMovies([]);
        setTotalResults(0);
        setError("unable to fetch search results");
      }
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchMovies(DEFAULT_SEARCH, 1);
  }, []);

  useEffect(() => {
    const cleanSearch = searchText.trim();

    if (cleanSearch.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (cleanSearch.toLowerCase() === activeSearch.toLowerCase()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSuggestionLoading(true);

        const data = await searchMovies(cleanSearch, 1);

        if (data?.Response === "True") {
          setSuggestions(data.Search.slice(0, 5));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error(error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSuggestionLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, activeSearch]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    const cleanSearch = searchText.trim();

    if (cleanSearch.length < 3) {
      setError("please enter more then 3 charecters");
      return;
    }

    fetchMovies(cleanSearch, 1);
  }

  function handleSuggestionClick(movie) {
    setSearchText(movie.Title);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchMovies(movie.Title, 1);
  }

  function goToPreviousPage() {
    if (page <= 1 || loading) return;

    fetchMovies(activeSearch, page - 1);
    scrollToMovies();
  }

  function goToNextPage() {
    if (page >= totalPages || loading) return;

    fetchMovies(activeSearch, page + 1);
    scrollToMovies();
  }

  function scrollToMovies() {
    setTimeout(() => {
      document
        .querySelector(".movies-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">
            DISCOVER YOUR NEXT FAVORITE MOVIE
          </p>

          <h1>
            Explore movies from
            <span> around the world</span>
          </h1>

          <p className="hero-description">
            Search movies, view details and save your favorite titles.
          </p>

          <div className="search-wrapper" ref={searchBoxRef}>
            <form className="search-box" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search movies..."
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setError("");
                }}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {showSuggestions && (
              <div className="suggestions-box">
                {suggestionLoading ? (
                  <p className="suggestion-message">
                    Suggestions load ho rahi hain...
                  </p>
                ) : (
                  suggestions.map((movie) => (
                    <button
                      type="button"
                      className="suggestion-item"
                      key={movie.imdbID}
                      onClick={() => handleSuggestionClick(movie)}
                    >
                      <img
                        src={
                          movie.Poster !== "N/A"
                            ? movie.Poster
                            : "https://placehold.co/80x110/111827/ffffff?text=No+Poster"
                        }
                        alt={movie.Title}
                      />

                      <span>
                        <strong>{movie.Title}</strong>
                        <small>
                          {movie.Year} • {movie.Type}
                        </small>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <p className="search-hint">
            please enter 3 word or more
          </p>
        </div>
      </section>

      <section className="movies-section">
        <div className="section-header">
          <div>
            <p className="section-label">SEARCH RESULTS</p>

            <h2>Results for "{activeSearch}"</h2>
          </div>

          {!loading && !error && (
            <p className="movie-count">{totalResults} results</p>
          )}
        </div>

        {loading && (
          <div className="skeleton-grid">
            {Array.from({ length: 10 }).map((_, index) => (
              <article className="skeleton-card" key={index}>
                <div className="skeleton-poster"></div>

                <div className="skeleton-info">
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line skeleton-small"></div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="status-message error-state">
            <h3>Search message</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  isFavorite={favorites.some(
                    (favorite) => favorite.imdbID === movie.imdbID
                  )}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>

            <div className="pagination">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={page === 1 || loading}
              >
                ← Previous
              </button>

              <div className="page-information">
                <strong>Page {page}</strong>
                <span>of {totalPages}</span>
              </div>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={page === totalPages || loading}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Home;
import {
  useEffect,
  useRef,
  useState,
} from "react";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/api";

const DEFAULT_SEARCH = "Avengers";

function Home({
  favorites,
  onToggleFavorite,
}) {
  const [searchText, setSearchText] =
    useState(DEFAULT_SEARCH);

  const [activeSearch, setActiveSearch] =
    useState(DEFAULT_SEARCH);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const latestRequest = useRef(0);

  async function fetchMovies(searchTerm, pageNumber = 1) {
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;

    try {
      setLoading(true);
      setError("");

      const data = await searchMovies(
        searchTerm,
        pageNumber
      );

      if (requestId !== latestRequest.current) {
        return;
      }

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
        setError(
          "Movies load nahi ho paayi. Internet aur API key check karo."
        );
      }
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const cleanSearch = searchText.trim();

    if (cleanSearch.length === 0) {
      setMovies([]);
      setTotalResults(0);
      setError("Movie search karne ke liye naam likho.");
      setLoading(false);
      return;
    }

    if (cleanSearch.length < 3) {
      setMovies([]);
      setTotalResults(0);
      setError("Kam se kam 3 characters enter karo.");
      setLoading(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchMovies(cleanSearch, 1);
    }, 600);

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  function handleSearch(event) {
    event.preventDefault();

    const cleanSearch = searchText.trim();

    if (cleanSearch.length < 3) {
      setError("Kam se kam 3 characters enter karo.");
      return;
    }

    fetchMovies(cleanSearch, 1);
  }

  function goToPreviousPage() {
    if (page <= 1 || loading) return;

    fetchMovies(activeSearch, page - 1);
    scrollToMovies();
  }

  function goToNextPage() {
    if (
      page >= totalPages ||
      loading
    ) {
      return;
    }

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
            Search real movies, explore their details and
            save your favorite titles.
          </p>

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <input
              type="search"
              placeholder="Search movies..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <p className="search-hint">
            Search automatically starts after you stop
            typing.
          </p>
        </div>
      </section>

      <section className="movies-section">
        <div className="section-header">
          <div>
            <p className="section-label">
              SEARCH RESULTS
            </p>

            <h2>
              {activeSearch
                ? `Results for "${activeSearch}"`
                : "Movies"}
            </h2>
          </div>

          {!loading && !error && (
            <p className="movie-count">
              {totalResults} results
            </p>
          )}
        </div>

        {loading && (
          <div className="skeleton-grid">
            {Array.from({ length: 10 }).map(
              (_, index) => (
                <article
                  className="skeleton-card"
                  key={index}
                >
                  <div className="skeleton-poster"></div>

                  <div className="skeleton-info">
                    <div className="skeleton-line skeleton-title"></div>
                    <div className="skeleton-line skeleton-small"></div>
                  </div>
                </article>
              )
            )}
          </div>
        )}

        {!loading && error && (
          <div className="status-message error-state">
            <h3>Search message</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          movies.length > 0 && (
            <>
              <div className="movie-grid">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={favorites.some(
                      (favorite) =>
                        favorite.imdbID ===
                        movie.imdbID
                    )}
                    onToggleFavorite={
                      onToggleFavorite
                    }
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
                  disabled={
                    page === totalPages || loading
                  }
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
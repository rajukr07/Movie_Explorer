import axios from "axios";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

const omdbApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export async function searchMovies(searchTerm, page = 1) {
  const response = await omdbApi.get("", {
    params: {
      apikey: API_KEY,
      s: searchTerm,
      page,
      type: "movie",
    },
  });

  return response.data;
}

export async function getMovieDetails(imdbID) {
  const response = await omdbApi.get("", {
    params: {
      apikey: API_KEY,
      i: imdbID,
      plot: "full",
    },
  });

  return response.data;
}
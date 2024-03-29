import http from "./httpService";
import config from "../config.json";

const apiEndpoint = `${config.apiUrl}/movies`;

function movieURL(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getMovies() {
  const { data: movies } = await http.get(apiEndpoint);
  return movies;
}

export function deleteMovie(movieId) {
  return http.delete(movieURL(movieId));
}

export async function getMovie(id) {
  const { data: movie } = await http.get(movieURL(id));

  return movie;
}

export async function saveMovie(movie) {
  const { _id, ...movieNoId } = movie;
  var exists = true;
  try {
    await http.get(movieURL(_id));
  } catch (ex) {
    if (ex.response && ex.response.status === 404) exists = false;
  }

  if (exists) {
    try {
      // Try updating the movie
      await http.put(movieURL(_id), movieNoId);
    } catch (ex) {
      // Handle other errors for the PUT request
      console.error("Error updating movie:", ex);
    }
  } else {
    try {
      await http.post(apiEndpoint, movieNoId);
    } catch (ex) {
      console.error("Error adding new movie:", ex);
    }
  }
}

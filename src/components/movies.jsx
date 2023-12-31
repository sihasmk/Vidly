import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import { getGenres } from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    selectedGenre: "All Genres",
    sortColumn: { path: "title", order: "asc" },
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];

    this.setState({ movies: getMovies(), genres });
  }

  handleDelete = (movie, moviesOnCurrentPage) => {
    const movies = [...this.state.movies].filter((m) => m !== movie);

    if (moviesOnCurrentPage.length === 1)
      this.setState({ movies, currentPage: this.state.currentPage - 1 });
    else this.setState({ movies });
  };

  handleLikeClick = (movie) => {
    const movies = [...this.state.movies];
    const indexOfMovieTBToggled = movies.indexOf(movie);
    movies[indexOfMovieTBToggled] = { ...movie };
    movies[indexOfMovieTBToggled].liked = !movies[indexOfMovieTBToggled].liked;

    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genreName) => {
    this.setState({ selectedGenre: genreName, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      sortColumn,
    } = this.state;

    let filtered_movies = [...allMovies];

    if (selectedGenre !== "All Genres") {
      filtered_movies = filtered_movies.filter(
        (m) => m.genre.name === selectedGenre
      );
    }

    let totalCount = filtered_movies.length;

    const sorted_movies = _.orderBy(
      filtered_movies,
      [sortColumn.path],
      [sortColumn.order]
    );

    let movies = paginate(sorted_movies, currentPage, pageSize);

    return { totalCount, data: movies };
  };

  render() {
    const { pageSize, currentPage, sortColumn } = this.state;

    const { totalCount, data: movies } = this.getPagedData();

    if (totalCount === 0)
      return (
        <div className="row">
          <div className="col-3">
            <ListGroup
              items={this.state.genres}
              onItemSelect={this.handleGenreSelect}
              selectedItem={this.state.selectedGenre}
            ></ListGroup>
          </div>
          <div className="col">
            <h3>There are no movies in the database</h3>
          </div>
        </div>
      );

    return (
      <div className="row">
        <div className="col-2">
          <ListGroup
            items={this.state.genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={this.state.selectedGenre}
          ></ListGroup>
        </div>
        <div className="col">
          <h3>
            Showing {totalCount} movie{totalCount === 1 ? "" : "s"} in the
            database:{" "}
          </h3>
          <MoviesTable
            movies={movies}
            onLikeClick={this.handleLikeClick}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          ></MoviesTable>
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          ></Pagination>
        </div>
      </div>
    );
  }
}

export default Movies;

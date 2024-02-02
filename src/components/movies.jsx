import React, { Component } from "react";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import { paginate } from "../utils/paginate";
import * as auth from "../services/authService";
import { deleteMovie, getMovies } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { Link } from "react-router-dom";
import { withHooks } from "./common/withHooks";
import { toast } from "react-toastify";
import _ from "lodash";
import SearchBox from "./common/searchBox";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    selectedGenre: "All Genres",
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
  };

  async componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...(await getGenres())];

    this.setState({ movies: await getMovies(), genres });
  }

  handleDelete = async (movie, moviesOnCurrentPage) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movie._id);

    if (moviesOnCurrentPage.length === 1)
      this.setState({ movies, currentPage: this.state.currentPage - 1 });
    else this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted");

      this.setState({ movies: originalMovies });
    }
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
    this.setState({
      selectedGenre: genreName,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      selectedGenre: "All Genres",
      currentPage: 1,
    });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  generateMovieCountMessage(count) {
    const { searchQuery } = this.state;
    if (count === 0 && !searchQuery)
      return <h3>There are no movies in the database</h3>;
    else if (count === 0 && searchQuery) return <h3>No results found</h3>;
    else {
      return (
        <h3>
          Showing {count} movie{count === 1 ? "" : "s"} in the database:{" "}
        </h3>
      );
    }
  }

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      sortColumn,
      searchQuery,
    } = this.state;

    let filtered_movies = [...allMovies];

    if (selectedGenre !== "All Genres") {
      filtered_movies = filtered_movies.filter(
        (m) => m.genre.name === selectedGenre
      );
    }

    if (searchQuery) {
      filtered_movies = filtered_movies.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
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
    const user = auth.getCurrentUser();

    const { totalCount, data: movies } = this.getPagedData();

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
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 10 }}
            >
              New Movie
            </Link>
          )}
          {this.generateMovieCountMessage(totalCount)}
          <SearchBox onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            onLikeClick={this.handleLikeClick}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            sortColumn={sortColumn}
            user={this.props.user}
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

export default withHooks(Movies);

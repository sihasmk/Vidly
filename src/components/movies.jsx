import React, { Component } from "react";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import { paginate } from "../utils/paginate";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import { useNavigate, Link } from "react-router-dom";
import _ from "lodash";
import Input from "./common/input";
import SearchBox from "./common/searchBox";

function withHooks(WrappedComponent) {
  return function (props) {
    const navigate = useNavigate();
    return <WrappedComponent {...props} navigate={navigate} />;
  };
}

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
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
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
          <Link
            to="/movies/new"
            className="btn btn-primary"
            style={{ marginBottom: 10 }}
          >
            New Movie
          </Link>
          {this.generateMovieCountMessage(totalCount)}
          <SearchBox onChange={this.handleSearch} />
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

export default withHooks(Movies);

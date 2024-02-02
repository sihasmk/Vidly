import React, { Component } from "react";
import { Link } from "react-router-dom";
import Like from "./common/like";
import Table from "./common/table";
import * as auth from "../services/authService";

class MoviesTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: (movie) => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      ),
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (movie) => (
        <Like
          onLikeClick={() => this.props.onLikeClick(movie)}
          liked={movie.liked}
          movie={movie}
        ></Like>
      ),
    },
    {
      key: "delete",
      content: (movie) => (
        <button
          onClick={() => this.props.onDelete(movie, this.props.movies)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    },
  ];

  render() {
    const { movies, onSort, sortColumn } = this.props;
    const user = auth.getCurrentUser();

    let columnsToRender = this.columns;

    if (user) {
      if (!user.isAdmin) {
        columnsToRender = this.columns.slice(0, -1);
      }
    } else {
      columnsToRender = this.columns.slice(0, -2);
    }

    return (
      <Table
        columns={columnsToRender}
        data={movies}
        onSort={onSort}
        sortColumn={sortColumn}
      ></Table>
    );
  }
}

export default MoviesTable;

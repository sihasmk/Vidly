import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import { getMovie, saveMovie } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";

function withHooks(WrappedComponent) {
  return function (props) {
    const navigate = useNavigate();
    const params = useParams();
    return (
      <WrappedComponent {...props} navigate={navigate} match={{ params }} />
    );
  };
}

class MovieForm extends Form {
  state = {
    data: {
      _id: null,
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string().optional(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .required()
      .label("Number in Stock"),
    dailyRentalRate: Joi.number().min(0).max(10).required().label("Rate"),
  };

  componentDidMount() {
    const { navigate } = this.props;
    const genres = getGenres();
    this.setState({ genres });

    const movieID = this.props.match.params.id;
    if (movieID === "new") {
      const newData = { ...this.state.data, _id: movieID };
      this.setState({ data: newData });
      return;
    }

    const movie = getMovie(movieID);
    if (!movie) return navigate("/not-found", { replace: true });

    this.setState({ data: this.mapToViewModel(movie) });
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  doSubmit = () => {
    const { navigate } = this.props;

    saveMovie(this.state.data);
    navigate("/movies");
  };

  render() {
    return (
      <div>
        <h1>Movie Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number in Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate", "number")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withHooks(MovieForm);

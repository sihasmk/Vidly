import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Movies from "./components/movies";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import "./App.css";

function App() {
  const MovieFormWrapper = (props) => {
    const params = useParams();
    return <MovieForm {...{ ...props, match: { params } }} />;
  };

  return (
    <React.Fragment>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
          <Route path="/movies/:id" element={<MovieFormWrapper />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;

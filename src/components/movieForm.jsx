import React from "react";
import { useNavigate } from "react-router-dom";

function withHooks(WrappedComponent) {
  return function (props) {
    const navigate = useNavigate();
    return <WrappedComponent {...props} navigate={navigate} />;
  };
}

const MovieForm = ({ match, navigate }) => {
  return (
    <div>
      <h1>Movie Form {match.params.id}</h1>
      <button className="btn btn-primary" onClick={() => navigate("/movies")}>
        Save
      </button>
    </div>
  );
};

export default withHooks(MovieForm);

import { useLocation, useNavigate, useParams } from "react-router-dom";
import React from "react";

export function withHooks(WrappedComponent) {
  return function (props) {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    return (
      <WrappedComponent
        {...props}
        navigate={navigate}
        match={{ params }}
        location={location}
      />
    );
  };
}

import React from "react";
import Joi from "joi-browser";
import { Navigate } from "react-router-dom";
import Form from "./common/form";
import { withHooks } from "./common/withHooks";
import * as auth from "../services/authService";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    password: Joi.string().required().min(8).label("Password"),
    username: Joi.string().email().required().label("Username"),
  };

  doSubmit = async () => {
    try {
      const { username, password } = this.state.data;
      await auth.login(username, password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return auth.getCurrentUser() ? (
      <Navigate to="/" />
    ) : (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default withHooks(LoginForm);

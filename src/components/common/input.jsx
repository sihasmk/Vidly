import React from "react";

const Input = ({ name, onChange, value, autoFocus, errors, label }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        value={value}
        id={name}
        name={name}
        onChange={onChange}
        autoFocus={autoFocus}
        type="text"
        className="form-control"
      />
      {errors && <div className="alert alert-danger">{errors}</div>}
    </div>
  );
};

export default Input;

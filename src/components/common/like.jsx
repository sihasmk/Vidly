import React from "react";

const Like = ({ liked, onLikeClick }) => {
  let classes = "fa fa-heart";
  classes += liked ? "" : "-o";
  return (
    <i
      className={classes}
      style={{ cursor: "pointer" }}
      onClick={onLikeClick}
      aria-hidden="true"
    ></i>
  );
};

export default Like;

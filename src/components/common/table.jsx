import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({ columns, onSort, sortColumn, data }) => {
  return (
    <table className="table">
      <TableHeader
        sortColumn={sortColumn}
        columns={columns}
        onSort={onSort}
      ></TableHeader>
      <TableBody data={data} columns={columns}></TableBody>
    </table>
  );
};

export default Table;

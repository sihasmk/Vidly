import React, { Component } from "react";
import _ from "lodash";
import { element } from "prop-types";
// columns

class TableBody extends Component {
  renderCell = (element, column) => {
    if (column.content) return column.content(element);

    return _.get(element, column.path);
  };

  createKey = (element, column) => {
    const key = element[this.props.valueProperty] + (column.path || column.key);
    return key;
  };

  render() {
    const { data, valueProperty, columns } = this.props;
    return (
      <tbody>
        {data.map((element) => (
          <tr key={element[valueProperty]}>
            {columns.map((column) => (
              <td key={this.createKey(element, column)}>
                {this.renderCell(element, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

TableBody.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default TableBody;

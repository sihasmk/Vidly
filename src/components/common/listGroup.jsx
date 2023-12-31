import React from "react";

const ListGroup = ({
  onItemSelect,
  selectedItem,
  items,
  textProperty,
  valueProperty,
}) => {
  return (
    <ul className="list-group">
      {items.map((item) => (
        <li
          key={item[valueProperty]}
          className={
            selectedItem === item.name
              ? "list-group-item active"
              : "list-group-item"
          }
          onClick={() => onItemSelect(item.name)}
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;

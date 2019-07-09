import React from "react";
import { func, number, oneOf } from "prop-types";
import { select } from "d3-selection";

const propTypes = {
  grid: func,
  gridType: oneOf(["x", "y"]),
  height: number
};

const Grid = ({ grid, gridType, height }) => (
  <g
    ref={node => select(node).call(grid)}
    className={`${gridType}-grid`}
    transform={gridType === "x" ? `translate(0, ${height})` : null}
  />
);

Grid.propTypes = propTypes;

export default Grid;

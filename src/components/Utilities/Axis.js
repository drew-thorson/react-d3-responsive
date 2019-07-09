import React from "react";
import { func, number, oneOf } from "prop-types";
import { select } from "d3-selection";

const propTypes = {
  axis: func,
  axisType: oneOf(["x", "y"]),
  height: number
};

const Axis = ({ axis, axisType, height }) => (
  <g
    ref={node => select(node).call(axis)}
    className="axis rd3-fill-none"
    transform={axisType === "x" ? "translate(0," + height + ")" : ""}
  />
);

Axis.propTypes = propTypes;

export default Axis;

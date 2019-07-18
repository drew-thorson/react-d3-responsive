import React from "react";
import { number, oneOf, string } from "prop-types";

const AxisLabel = ({ width, height, axisLabel, axisType, padding }) => {
  const translateLabelX = "translate(" + width / 2 + "," + (height + 40) + ")";
  const translateLabelY =
    "translate(" + (-40 - padding) + "," + height / 2 + ") rotate(270)";

  return (
    <text
      className={axisType + "-axis-label"}
      textAnchor="middle"
      transform={axisType === "y" ? translateLabelY : translateLabelX}
    >
      {axisLabel}
    </text>
  );
};

AxisLabel.propTypes = {
  axisLabel: string,
  axisType: oneOf(["x", "y"]),
  height: number,
  padding: number,
  width: number
};

AxisLabel.defaultProps = {
  padding: 0
};

export default AxisLabel;

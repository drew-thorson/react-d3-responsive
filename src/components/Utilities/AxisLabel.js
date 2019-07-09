import React from "react";
import { number, oneOf, string } from "prop-types";

const AxisLabel = ({ w, h, axisLabel, axisType, padding }) => {
  const translateLabelX = "translate(" + w / 2 + "," + (h + 40) + ")";
  const translateLabelY =
    "translate(" + (-40 - padding) + "," + h / 2 + ") rotate(270)";

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
  h: number,
  padding: number,
  w: number
};

AxisLabel.defaultProps = {
  padding: 0
};

export default AxisLabel;

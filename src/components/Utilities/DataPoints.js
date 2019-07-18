import React from "react";
import { array, bool, func, number, string } from "prop-types";
import { timeFormat } from "d3-time-format";

const propTypes = {
  data: array,
  dateFormat: string,
  fill: string,
  radius: number,
  removeFirstAndLast: bool,
  stroke: string,
  strokeWidth: number,
  x: func,
  xDataKey: string.isRequired,
  y: func,
  yDataKey: string.isRequired
};

const defaultProps = {
  fill: "#b1bfb7",
  strokeWidth: 2,
  radius: 5,
  dateFormat: "%e %b %Y"
};

const Dots = ({
  data,
  dateFormat,
  fill,
  hideToolTip,
  showToolTip,
  radius,
  removeFirstAndLast,
  stroke,
  strokeWidth,
  xDataKey,
  yDataKey,
  x,
  y
}) => {
  let circles = data.map((d, i) => {
    const xDataKeys =
      d[xDataKey] instanceof Date
        ? timeFormat(dateFormat)(d[xDataKey])
        : d[xDataKey];

    return (
      <circle
        key={d.id || i}
        className="rd3r-data-point"
        r={radius}
        cx={x(d[xDataKey])}
        cy={y(d[yDataKey])}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onMouseOver={showToolTip}
        onMouseOut={hideToolTip}
        data-key={xDataKeys}
        data-value={d[yDataKey]}
      />
    );
  });

  removeFirstAndLast && (circles = circles.slice(1, -1));

  return <g>{circles}</g>;
};

Dots.propTypes = propTypes;
Dots.defaultProps = defaultProps;

export default Dots;

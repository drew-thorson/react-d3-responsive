import React from "react";
import { array, bool, func, number, string } from "prop-types";
import d3 from "d3";

const Dots = ({
  data,
  dateFormat,
  fill,
  hideToolTip,
  r,
  removeFirstAndLast,
  showToolTip,
  stroke,
  strokeWidth,
  xDataKey,
  yDataKey,
  x,
  y
}) => {
  removeFirstAndLast && (data = data.slice(1, -1));

  const circles = data.map((d, i) => {
    let xDataKeys = d[xDataKey];

    if (xDataKeys instanceof Date) {
      xDataKeys = d3.time.format(dateFormat)(d[xDataKey]);
    }

    return (
      <circle
        key={d.id || i}
        className="data-plot-point"
        r={r}
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

  return <g>{circles}</g>;
};

Dots.propTypes = {
  data: array,
  dateFormat: string,
  fill: string,
  r: number,
  removeFirstAndLast: bool,
  stroke: string,
  strokeWidth: number,
  x: func,
  xDataKey: string.isRequired,
  y: func,
  yDataKey: string.isRequired
};

Dots.defaultProps = {
  fill: "#b1bfb7",
  strokeWidth: 2,
  r: 5,
  dateFormat: "%e %b %Y"
};

export default Dots;

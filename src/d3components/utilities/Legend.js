import React from "react";
import { array, func, string } from "prop-types";

const ChartLegend = ({ data, labelKey, colors }) => {
  const legend = [];
  const legendItems = [];

  data.forEach(d => {
    if (legend.indexOf(d[labelKey]) < 0) {
      legendItems.push(
        <span key={d[labelKey]} style={{ display: "inline-block" }}>
          <span style={{ color: colors(legend.length), paddingRight: "5px" }}>
            &#9679;
          </span>
          <span style={{ paddingRight: "15px" }}>{d[labelKey]}</span>
        </span>
      );
      legend.push(d[labelKey]);
    }
  });

  return <div className="chart-legend">{legendItems}</div>;
};

ChartLegend.propTypes = {
  colors: func,
  data: array,
  labelKey: string
};

ChartLegend.defaultProps = {
  labelKey: "label"
};

export default ChartLegend;

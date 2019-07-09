import React from "react";
import { array, func, string } from "prop-types";

const propTypes = {
  colors: func,
  data: array,
  labelKey: string
};

const defaultProps = {
  labelKey: "label"
};

const ChartLegend = ({ data, labelKey, colors }) => {
  const legend = [];

  return (
    <div className="chart-legend">
      {data.map(d => {
        if (legend.indexOf(d[labelKey]) < 0) {
          legend.push(d[labelKey]);
          return (
            <div key={d[labelKey]} style={{ display: "inline-block" }}>
              <span
                style={{
                  color: colors(legend.length - 1),
                  paddingRight: "5px"
                }}
              >
                &#9679;
              </span>
              <span style={{ paddingRight: "15px" }}>{d[labelKey]}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

ChartLegend.propTypes = propTypes;
ChartLegend.defaultProps = defaultProps;

export default ChartLegend;

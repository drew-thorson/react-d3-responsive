import React from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import Axis from '../utilities/Axis';
import DataPoints from '../utilities/DataPoints';

const ScatterPlot = ({ width, height, data, xKey, yKey, radius, margin, ...props }) => {
  const xScale = scaleLinear()
    .domain(extent(data, (d) => d[yKey]))
    .range([margin.left, width - (margin.left + margin.right)]);

  const yScale = scaleLinear()
    .domain(extent(data, (d) => d[xKey]))
    .range([height - (margin.top + margin.bottom), margin.top]);

  const scales = { xScale, yScale };

  return (
    <svg width={width} height={height}>
      <g transform={'translate(' + margin.left + ',' + margin.top + ')'}>
        <DataPoints data={data} xKey={xKey} yKey={yKey} radius={radius} {...scales} />
        <Axis xScale={xScale} width={width} height={height} />
        <Axis yScale={yScale} width={width} height={height} />
        {/*<XYAxis {...props} {...scales} />*/}
      </g>
    </svg>
  );
}

ScatterPlot.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.object,
  radius: PropTypes.number,
  xKey: PropTypes.string,
  yKey: PropTypes.string
};

ScatterPlot.defaultProps = {
  margin: {
    top: 10,
    right: 40,
    bottom: 30,
    left: 40
  },
  radius: 5,
  xKey: "x",
  yKey: "y"
};

export default ScatterPlot;

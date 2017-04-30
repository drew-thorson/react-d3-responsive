import React from 'react';
import PropTypes from 'prop-types';
import { area } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';
import { axisBottom } from 'd3-axis';

const AreaGraph = ({ fill, stroke, width, data }) => {
  const xScale = scaleLinear()
    .domain(extent(data, (d) => d.x))
    .range([0, width]);

  // const xScale = scaleTime()
  //   .domain(extent(data, (d) => d.x))
  //   .range([0, width]);

  const yScale = scaleLinear()
    .domain(
    extent(data, (d) => d.y)
    )
    .range([width, 0]);

  const xAxis = axisBottom()
    .scale(xScale)
    .ticks(Math.floor(width / 100));

  const areaGenerator = area()
    .x(d => xScale(d.x))
    .y1(d => yScale(d.y))
    .y0(width);

  return (
    <g transform='translate(0,0)'>
      <path stroke={stroke} fill={fill} d={areaGenerator(data)} />
    </g>
  );
}

AreaGraph.propTypes = {
  data: PropTypes.array,
  stroke: PropTypes.string,
  fill: PropTypes.string
};

AreaGraph.defaultProps = {
  stroke: "steelblue",
  fill: "green"
};

export default AreaGraph;

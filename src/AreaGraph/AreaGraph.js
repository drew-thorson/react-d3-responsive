import React from 'react';
import PropTypes from 'prop-types';
import { area } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';
import { axisBottom } from 'd3-axis';
import Axis from '../utilities/Axis';

const AreaGraph = ({ data, width, height, fill, stroke }) => {
  const xScale = scaleLinear()
    .domain(extent(data, (d) => d.x))
    .range([0, width]);

  // const xScale = scaleTime()
  //   .domain(extent(data, (d) => d.x))
  //   .range([0, width]);

  const yScale = scaleLinear()
    .domain(extent(data, (d) => d.y))
    .range([height - 30, 0]);

  // const xAxis = axisBottom()
  //   .scale(xScale)
  //   .ticks(Math.floor(width / 100));

  const areaGenerator = area()
    .x(d => xScale(d.x))
    .y1(d => yScale(d.y))
    .y0(height);

  // const scales = { xScale: xScale(props), yScale: yScale(props) };

  return (
    <svg width={width} height={height}>
      <g transform='translate(30,0)'>
        <path stroke={stroke} fill={fill} d={areaGenerator(data)} />
        <Axis xScale={xScale} width={width} height={height} />
        <Axis yScale={yScale} width={width} height={height} />
        {/*<XYAxis {...props} {...scales} />*/}
      </g>
    </svg>
  );
}

AreaGraph.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  stroke: PropTypes.string,
  fill: PropTypes.string
};

AreaGraph.defaultProps = {
  stroke: "steelblue",
  fill: "green"
};

export default AreaGraph;

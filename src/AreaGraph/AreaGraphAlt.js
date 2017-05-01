import React from 'react';
import PropTypes from 'prop-types';
import { area } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import Axis from '../utilities/Axis';

const AreaGraphAlt = ({ width, height, fill, stroke, ...props }) => {
  const xScale = scaleLinear()
    .domain(extent(props.data, (d) => d[0]))
    .range([0, width]);

  const yScale = scaleLinear()
    .domain(extent(props.data, (d) => d[1]))
    .range([height, 0]);

  const areaGenerator = area()
    .x(d => xScale(d[0]))
    .y1(d => yScale(d[1]))
    .y0(height);

  // const scales = { xScale: xScale(props), yScale: yScale(props) };

  return (
    <svg width={width + 30} height={height + 30}>
      <g transform='translate(30,0)'>
        <path stroke={stroke} fill={fill} d={areaGenerator(props.data)} />
        <Axis xScale={xScale} width={width} height={height} />
        <Axis yScale={yScale} width={width} height={height} />
        {/*<XYAxis {...props} {...scales} />*/}
      </g>
    </svg>
  );
}

AreaGraphAlt.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  stroke: PropTypes.string,
  fill: PropTypes.string
};

AreaGraphAlt.defaultProps = {
  stroke: "steelblue",
  fill: "green"
};

export default AreaGraphAlt;

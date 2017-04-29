import React from 'react';
import PropTypes from 'prop-types';
import { radialLine, curveCardinalClosed } from 'd3-shape';

const RadialLine = ({ fill, stroke, data }) => {
  const lineGenerator = radialLine()
    .curve(curveCardinalClosed)
    .angle(d => d.x)
    .radius(d => d.y);

  return <path stroke={stroke} fill={fill} d={lineGenerator(data)}/>;
}

RadialLine.propTypes = {
  stroke: PropTypes.string,
  fill: PropTypes.string
};

RadialLine.defaultProps = {
  stroke: "steelblue",
  fill: "none"
};

export default RadialLine;

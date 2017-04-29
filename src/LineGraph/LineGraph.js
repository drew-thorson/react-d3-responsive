import React from 'react';
import PropTypes from 'prop-types';
import { line, curveBasisClosed } from 'd3-shape';

const LineGraph = ({ fill, stroke, data }) => {
  const lineGenerator = line()
    .curve(curveBasisClosed)
    .x(d => d.x)
    .y(d => d.y);

  return (
    <path stroke={stroke} fill={fill} d={lineGenerator(data)} />
  );
}

LineGraph.propTypes = {
  stroke: PropTypes.string,
  fill: PropTypes.string
};

LineGraph.defaultProps = {
  stroke: "blue",
  fill: "none"
};

export default LineGraph;

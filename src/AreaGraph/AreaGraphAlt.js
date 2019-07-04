import React from 'react';
import PropTypes from 'prop-types';
import { area } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import Axis from '../utilities/Axis';
import AxisLabel from '../utilities/AxisLabel';

const AreaGraphAlt = ({ width, height, fill, stroke, ...props }) => {
  const h = height - (props.margin.bottom + props.margin.top);
  const w = width - (props.margin.left + props.margin.right);

  const xScale = scaleLinear()
    .domain(extent(props.data, (d) => d[0]))
    .range([0, w]);

  const yScale = scaleLinear()
    .domain(extent(props.data, (d) => d[1]))
    .range([h, 0]);

  const areaGenerator = area()
    .x(d => xScale(d[0]))
    .y1(d => yScale(d[1]))
    .y0(h);

  // const scales = { xScale: xScale(props), yScale: yScale(props) };

  return (
    <svg width={width} height={height}>
      <g transform={'translate(' + props.margin.left + ', ' + props.margin.top + ')'}>
        <path stroke={stroke} fill={fill} d={areaGenerator(props.data)} />
        <Axis xScale={xScale} width={w} height={h} />
        <Axis yScale={yScale} width={w} height={h} />
        <AxisLabel width={w} height={h} axisLabel="testX" />
        <AxisLabel width={w} height={h} axisLabel="testY" axisType="y" />
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

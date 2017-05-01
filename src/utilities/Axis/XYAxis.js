import React from 'react';
import PropTypes from 'prop-types';
import AxisAlt from './AxisAlt';

const XYAxis = ({ height, ...props }) => {
  console.log(props.xScale);
  const xSettings = {
    translate: 'translate(0, ' + height + ');',
    scale: props.xScale,
    orient: 'bottom'
  };

  const ySettings = {
    translate: `translate(0, 0)`,
    scale: props.yScale,
    orient: 'left'
  };

  return (
    <g className="xy-axis">
      {/*<AxisAlt {...xSettings} />
      <AxisAlt {...ySettings} />*/}
    </g>
  );
}

XYAxis.propTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  height: PropTypes.number
};

XYAxis.defaultProps = {
};

export default XYAxis;

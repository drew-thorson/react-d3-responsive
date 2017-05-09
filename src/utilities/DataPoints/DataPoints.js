import React from 'react';

const renderCircles = (props) => {
  return (coords, index) => {
    const circleProps = {
      cx: props.xScale(coords[props.xKey]),
      cy: props.yScale(coords[props.yKey]),
      r: props.radius,
      key: index
    };
    return <circle {...circleProps} />;
  };
};

const DataPoints = (props) => {
  return <g transform='translate(0,0)'>{ props.data.map(renderCircles(props)) }</g>
}

export default DataPoints;

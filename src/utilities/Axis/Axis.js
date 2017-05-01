import React from 'react';
import PropTypes from 'prop-types';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';

class Axis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0
    };
  }

  componentDidMount() {
    const { xScale, height } = this.props;
    if (xScale) {
      this.setState({ height: height });
    }
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const { xScale, yScale, width, height } = this.props;
    const node = this.refs.axis;
    let Axis;
    if (xScale) {
      Axis = axisBottom()
        .scale(xScale)
        .ticks(Math.floor(width / 100));
    } else if (yScale) {
      Axis = axisLeft()
        .scale(yScale)
        .ticks(Math.floor(height / 50));
    }
    select(node)
      .call(Axis);
  }

  render() {
    const { height } = this.state;
    return <g className="axis" ref="axis" transform={'translate(0, ' + height + ')'} />
  }
}

Axis.propTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number
};

Axis.defaultProps = {
};

export default Axis;

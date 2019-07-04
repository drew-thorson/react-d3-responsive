import React, { Component } from "react";
import { func, number, oneOf } from "prop-types";
import ReactDOM from "react-dom";
import d3 from "d3";

class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const node = ReactDOM.findDOMNode(this);
    d3.select(node).call(this.props.axis);
  }

  render() {
    const { axisType, h } = this.props;
    const translate = "translate(0," + h + ")";

    return (
      <g
        className="axis rd3-fill-none"
        transform={axisType === "x" ? translate : ""}
      />
    );
  }
}

Axis.propTypes = {
  axis: func,
  axisType: oneOf(["x", "y"]),
  h: number
};

export default Axis;

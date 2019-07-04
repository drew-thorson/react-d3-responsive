import React, { Component } from "react";
import { func, number, oneOf, string } from "prop-types";
import ReactDOM from "react-dom";
import d3 from "d3";

class Grid extends Component {
  static propTypes = {
    grid: func,
    gridType: oneOf(["x", "y"]),
    h: number,
    lineColor: string,
    strokeWidth: number
  };

  static defaultProps = {
    lineColor: "#ccc",
    strokeWidth: 1
  };

  componentDidMount() {
    this.renderGrid();
  }

  componentDidUpdate() {
    this.renderGrid();
  }

  renderGrid() {
    const node = ReactDOM.findDOMNode(this);
    d3.select(node).call(this.props.grid);
  }

  render() {
    const { gridType, h, lineColor, strokeWidth } = this.props;
    const translate = gridType === "x" ? `translate(0, ${h})` : null;

    return (
      <g
        className={`${gridType}-grid`}
        stroke={lineColor}
        strokeWidth={strokeWidth}
        transform={translate}
      />
    );
  }
}

export default Grid;

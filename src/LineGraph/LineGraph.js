import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";

class LineGraph extends Component {
  createChart = (_self) => {
    this.xScale = d3.scaleLinear()
      .domain([
        d3.min(this.props.data, function (d) {
          return d[_self.props.xDataKey];
        }),
        d3.max(this.props.data, function (d) {
          return d[_self.props.xDataKey];
        })
      ])
      .rangeRound([0, this.w]);
  }

  render() {
    const { title } = this.props;
    this.createChart(this);

    return (
      <svg className="rd3r-chart rd3r-line-graph" id="ID" width={1000} height={200}>
        <text className="axis-label" textAnchor="middle" transform="translate(50,50)">{title}</text>
      </svg>
    );
  }
}

LineGraph.propTypes = {
  title: PropTypes.string,
};

LineGraph.defaultProps = {
  title: "title test"
};

export default LineGraph;

import React, { Component } from "react";
import { array, func, number, oneOf, string } from "prop-types";
import * as d3 from "d3";
import Margin from "../Utilities/propTypes";

class TrendLine extends Component {
  createChart() {
    const { data, x, y } = this.props;

    // Create line
    this.line = d3
      .line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    this.dataNest = d3
      .nest()
      .key(d => d.label)
      .entries(this.getEndPoints(data));
  }

  // returns slope, yIntercept and r-square of the line
  leastSquares(xSeries, ySeries) {
    const ls = {};
    let xSeriesCopy = xSeries.slice(0);

    const reduceSumFunc = (prev, cur) => prev + cur;

    if (typeof xSeriesCopy[0] === "object")
      xSeriesCopy = xSeriesCopy.map(date => new Date(date).getTime());

    const xBar = (xSeriesCopy.reduce(reduceSumFunc) * 1.0) / xSeriesCopy.length;
    const yBar = (ySeries.reduce(reduceSumFunc) * 1.0) / ySeries.length;

    const ssXX = xSeriesCopy
      .map(d => Math.pow(d - xBar, 2))
      .reduce(reduceSumFunc);

    const ssYY = ySeries.map(d => Math.pow(d - yBar, 2)).reduce(reduceSumFunc);

    const ssXY = xSeriesCopy
      .map((d, i) => (d - xBar) * (ySeries[i] - yBar))
      .reduce(reduceSumFunc);

    ls["slope"] = ssXY / ssXX;
    ls["yIntercept"] = yBar - xBar * ls.slope;
    ls["rSquare"] = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return ls;
  }

  // extends trend line the full width of the graph
  minMaxing = () => {
    const { xDataKey, lineExtend } = this.props;
    const minMax = {};

    minMax["xMin"] = d3.min(
      lineExtend.map(d =>
        typeof d[xDataKey] === "object" ? d[xDataKey].getTime() : d[xDataKey]
      )
    );
    minMax["xMax"] = d3.max(
      lineExtend.map(d =>
        typeof d[xDataKey] === "object" ? d[xDataKey].getTime() : d[xDataKey]
      )
    );

    return minMax;
  };

  // Makes the two points needed for the trend line to graph
  getEndPoints = () => {
    const { lineNumbers, lineExtend, xDataKey, yDataKey, data } = this.props;
    let dataToCalcTrend;

    lineNumbers === "single"
      ? (dataToCalcTrend = lineExtend)
      : (dataToCalcTrend = data);

    const xSeries = dataToCalcTrend.map(d => d[xDataKey]);
    const ySeries = dataToCalcTrend.map(d => d[yDataKey]);

    const leastSquaresCoeff = this.leastSquares(xSeries, ySeries);
    const trendExtend = this.minMaxing();

    const x1 = trendExtend.xMin;
    const y1 = leastSquaresCoeff.slope * x1 + leastSquaresCoeff.yIntercept;
    const x2 = trendExtend.xMax;
    const y2 = leastSquaresCoeff.slope * x2 + leastSquaresCoeff.yIntercept;

    return [
      {
        label: "Trend Line",
        x: x1,
        y: y1
      },
      {
        label: "Trend Line",
        x: x2,
        y: y2
      }
    ];
  };

  render() {
    const { lineStroke } = this.props;

    this.createChart();

    const line = this.dataNest.map(d => {
      const linePath = this.line(d.values);
      return (
        <path
          key={linePath}
          className="trend-line"
          d={linePath}
          stroke={lineStroke}
          opacity=".4"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
      );
    });

    return <g>{line}</g>;
  }
}

TrendLine.propTypes = {
  data: array,
  lineExtend: array,
  lineNumbers: oneOf(["single", "multi"]),
  lineStroke: string,
  margin: Margin,
  x: func,
  xDataKey: string.isRequired,
  y: func,
  yDataKey: string.isRequired,
  yMaxBuffer: number
};

TrendLine.defaultProps = {
  lineNumbers: "multi",
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 40
  },
  yMaxBuffer: 100
};

export default TrendLine;

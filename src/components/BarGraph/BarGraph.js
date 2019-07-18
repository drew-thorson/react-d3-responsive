import React from "react";
import { array, bool, number, oneOf, string } from "prop-types";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Axis from "../Utilities/Axis";
import AxisLabel from "../Utilities/AxisLabel";
import Grid from "../Utilities/Grid";
import ToolTip from "../Utilities/Tooltip";
import Legend from "../Utilities/Legend";
import { Margin } from "../Utilities/propTypes";

/** Bar Chart */
class BarGraph extends React.Component {
  static propTypes = {
    /** Chart type of `stack` to have stacked data or `side` for side by side data. */
    barChartType: oneOf(["stack", "side"]),

    /** Adds additional class name(s). */
    className: string,

    /** Override colors for rectangle fill e.g. `["#084b62", "yellow", "#ab264b"]`. The number of colors should match the number of data series. */
    colors: array,

    /** Data to be graphed. */
    data: array.isRequired,

    /** Display horizontal grid lines when set to true. */
    displayHorizontalGridLines: bool,

    /** Display legend when set to true. */
    displayLegend: bool,

    /** Display Y Axis as percentage. */
    displayYAxisAsPercent: bool,

    /** Space between groups of bars based on percentage of width of the chart. Values between 1 and 0.  */
    groupSpacing: number,

    /** Graph height. */
    height: number,

    /** Globally unique and descriptive HTML ID. Used by QA for automated testing. */
    htmlId: string,

    /** Space between individual bars based on percentage of width of the grouping. Values between 1 and 0.  */
    individualSpacing: number,

    /** Keys for key-value pair of values to be graphed. */
    keys: array.isRequired,

    /** Override values for legend. It will display in order of array. If not set the key-value from the key-value pair will be used. */
    legendValues: array,

    /** Graph area margin. Example: `{top: 5, left: 5, bottom: 5, right: 5}` */
    margin: Margin,

    /** Graph title. */
    title: string,

    /** Tooltip background color. */
    tooltipBgColor: string,

    /** Graph max-width. */
    width: number,

    /** X Axis label. */
    xAxisLabel: string,

    /** X Axis column group label to appear below individual column. */
    xDataKey: string.isRequired,

    /** X Axis tooltip label. */
    xToolTipLabel: string,

    /** Y Axis label. */
    yAxisLabel: string,

    /** Set Y maximum value to be displayed. */
    yMax: number,

    /** Y Axis tooltip label. */
    yToolTipLabel: string
  };

  static defaultProps = {
    width: 1920,
    height: 400,
    barChartType: "stack",
    groupSpacing: 0.3,
    individualSpacing: 0.5,
    xToolTipLabel: "",
    yToolTipLabel: "",
    legendValues: [],
    displayYAxisAsPercent: false,
    displayLegend: true,
    displayHorizontalGridLines: true,
    margin: {
      top: 10,
      right: 40,
      bottom: 30,
      left: 40
    }
  };

  state = {
    tooltip: {
      display: false,
      data: {
        key: "",
        value: ""
      },
      pos: {
        x: 0,
        y: 0
      }
    },
    width: this.props.width,
    height: this.props.height
  };

  componentDidMount() {
    this.repaintComponent();
    window.addEventListener("resize", this.updateSize, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSize, false);
  }

  updateSize = () => {
    const nodeWidth = ReactDOM.findDOMNode(this).offsetWidth;
    this.setState({ width: Math.min(nodeWidth, this.props.width) });
  };

  // When initially loading the page if the chart is wider than its container it will display beyond it.
  // The repaint triggers a function to get the width of the container and if it is smaller it will adjust the charts size to fit in that container.
  repaintComponent() {
    const forceResize = this.updateSize;
    function onRepaint(callback) {
      setTimeout(function() {
        window.requestAnimationFrame(callback);
      }, 0);
    }
    onRepaint(forceResize);
  }

  stackType() {
    const { yMax, barChartType } = this.props;
    const tempArray = [];
    if (typeof yMax === "number") {
      tempArray.push(yMax);
    } else {
      const d = this.stacked;
      for (const i in d) {
        for (const j in d[i]) {
          barChartType === "side"
            ? tempArray.push(d[i][j].y)
            : tempArray.push(d[i][j].y + d[i][j].y0);
        }
      }
    }
    return tempArray;
  }

  createChart = () => {
    const {
      colors,
      xAxisLabel,
      yAxisLabel,
      margin,
      displayYAxisAsPercent,
      keys,
      xDataKey,
      data,
      groupSpacing,
      individualSpacing,
      height
    } = this.props;
    const { width } = this.state;

    colors
      ? (this.color = d3.scaleOrdinal().range(colors))
      : (this.color = d3.scaleOrdinal(d3.schemeCategory10));

    const xLabelHeightOffset = xAxisLabel ? 30 : 0;
    let yLabelWidthOffset = yAxisLabel ? 20 : 0;
    yLabelWidthOffset = displayYAxisAsPercent
      ? yLabelWidthOffset + 20
      : yLabelWidthOffset;

    // Width of graph
    this.w = width - (margin.left + margin.right + yLabelWidthOffset);

    // Height of graph
    this.h = height - (margin.top + margin.bottom + xLabelHeightOffset);

    this.stacked = d3.stack().keys(keys);

    // X0 axis scale
    this.x0Scale = d3
      .scaleOrdinal()
      .range([0, this.w], groupSpacing)
      .domain(
        // keys.map(d => {
        //   console.log(d);
        //   return d;
        // })
        data.map(d => {
          // console.log(d[xDataKey]);
          return d[xDataKey];
        })
      );

    // X1 axis scale
    this.x1Scale = d3
      .scaleOrdinal()
      .range([0, this.x0Scale.range()], individualSpacing)
      .domain(
        keys.map(d => {
          return d;
        })
      );

    // Y axis scale
    this.yScale = d3
      .scaleLinear()
      .rangeRound([this.h, 0])
      .domain([0, d3.max(this.stackType())])
      .nice();

    if (displayYAxisAsPercent) {
      this.yAxis = d3
        .axisLeft(this.yScale)
        .tickFormat(x => {
          return x + "%";
        })
        .ticks(5);
    } else {
      this.yAxis = d3.axisLeft(this.yScale).ticks(5);
    }

    this.xAxis = d3.axisBottom(this.x0Scale).ticks(data.length);

    this.yGrid = d3
      .axisLeft(this.yScale)
      .ticks(5)
      .tickSize(-this.w, 0, 0)
      .tickFormat("");

    this.transform =
      "translate(" + (margin.left + yLabelWidthOffset) + "," + margin.top + ")";
  };

  showToolTip = e => {
    const pointColor = e.target.getAttribute("fill");
    e.target.setAttribute("fill", "#6f8679");
    this.setState({
      tooltip: {
        display: true,
        orientation: "horizontal",
        data: {
          key: e.target.getAttribute("data-key"),
          value: e.target.getAttribute("data-value")
        },
        pos: {
          x: parseInt(e.target.getAttribute("x"), 10),
          y: parseInt(e.target.getAttribute("y"), 10),
          width: parseInt(e.target.getAttribute("width"), 10)
        }
      },
      dataPointColor: pointColor
    });
  };

  hideToolTip = e => {
    e.target.setAttribute("fill", this.state.dataPointColor);
    this.setState({
      tooltip: {
        display: false,
        data: {
          key: "",
          value: ""
        },
        pos: {
          x: 0,
          y: 0
        }
      },
      dataPointColor: ""
    });
  };

  render() {
    const {
      barChartType,
      legendValues,
      className,
      keys,
      displayHorizontalGridLines,
      displayLegend,
      title,
      htmlId,
      height,
      xAxisLabel,
      yAxisLabel,
      displayYAxisAsPercent,
      tooltipBgColor,
      margin,
      xToolTipLabel,
      yToolTipLabel,
      individualSpacing
    } = this.props;
    const { width, tooltip } = this.state;

    this.createChart();

    const legendType = legendValues.length ? legendValues : keys;

    const legend = legendType.map(legend => ({ label: legend }));

    // console.log(this.stacked(this.props.data));

    const bars = this.stacked(this.props.data).map((data, i) => {
      let rects;
      const groupWidth = this.x0Scale;
      const itemsPerGroup = this.stacked.length;
      if (barChartType === "side") {
        rects = data.map(d => {
          console.log(
            d3
              .area()
              .x(d => this.xScale(d[0]))
              .y1(d => this.xScale(d[1]))
          );
          return (
            <rect
              key={d.data.month + d[0] + d[1]}
              x={
                ((groupWidth / itemsPerGroup) * individualSpacing) / 2 +
                this.x0Scale(d.data.month) +
                i * (groupWidth / itemsPerGroup)
              }
              y={this.h - (this.yScale(d[1]) - this.yScale(d[0] + d[1]))}
              fill={this.color(i)}
              onMouseOver={this.showToolTip}
              onMouseOut={this.hideToolTip}
              height={this.yScale(d[1]) - this.yScale(d[0] + d[1])}
              width={this.x1Scale}
              data-key={legendType[i]}
              data-value={d[0]}
            />
          );
        });
      } else {
        rects = data.map(d => {
          // console.log(d.data.month, d[0], d[1]);
          return (
            <g key={d.data.month + d[0] + d[1]}>
              <rect
                x={this.x0Scale(d.data.month)}
                y={this.yScale(d[0] + d[1])}
                fill={this.color(i)}
                onMouseOver={this.showToolTip}
                onMouseOut={this.hideToolTip}
                height={this.yScale(d[1]) - this.yScale(d[0] + d[1])}
                width={groupWidth}
                data-key={legendType[i]}
                data-value={d[0]}
              />
            </g>
          );
        });
      }

      return <g key={keys[i]}>{rects}</g>;
    });

    let customClassName = "";

    if (className) {
      customClassName = " " + className;
    }

    return (
      <div>
        {title && <h3>{title}</h3>}
        <svg
          className={"rd3r-chart rd3r-bar-graph" + customClassName}
          id={htmlId}
          width={width}
          height={height}
        >
          <g transform={this.transform}>
            {displayHorizontalGridLines && (
              <Grid h={this.h} grid={this.yGrid} gridType="y" />
            )}
            <Axis height={this.h} axis={this.yAxis} axisType="y" />
            <Axis height={this.h} axis={this.xAxis} axisType="x" />
            {xAxisLabel && (
              <AxisLabel
                height={this.h}
                width={this.w}
                axisLabel={xAxisLabel}
                axisType="x"
              />
            )}
            {yAxisLabel && (
              <AxisLabel
                height={this.h}
                width={this.w}
                axisLabel={yAxisLabel}
                axisType="y"
                padding={displayYAxisAsPercent ? 15 : 0}
              />
            )}
            {bars}
            <ToolTip
              tooltip={tooltip}
              bgColor={tooltipBgColor}
              chartWidth={width}
              chartHeight={this.state.height}
              margin={margin}
              xAxis={xAxisLabel ? true : false}
              xValue={xToolTipLabel}
              yValue={yToolTipLabel}
            />
          </g>
        </svg>
        {displayLegend && <Legend data={legend} colors={this.color} />}
      </div>
    );
  }
}

export default BarGraph;
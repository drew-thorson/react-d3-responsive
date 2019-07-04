import React from "react";
import { array, bool, number, oneOf, string } from "prop-types";
import ReactDOM from "react-dom";
import d3 from "d3";
import Axis from "../utilities/Axis";
import AxisLabel from "../utilities/AxisLabel";
import Grid from "../utilities/Grid";
import Dots from "../utilities/DataPoints";
import ToolTip from "../utilities/Tooltip";
import TrendLine from "../utilities/TrendLine";
import Legend from "../utilities/Legend";
import Margin from "../utilities/propTypes";
import { normalizeDate } from "../utilities/chartUtils";

/** Scatterplot Chart. */
class ScatterPlot extends React.Component {
  static propTypes = {
    /** Adds additional class name(s). */
    className: string,

    /** Override colors for data points e.g. `["#084b62", "yellow", "#ab264b"]`. The number of colors should match the number of data series. */
    colors: array,

    /** Data to be graphed. */
    data: array.isRequired,

    /** If set to either x or y, that axis will be displayed with a % at the end of the axis numbers. */
    dataPercent: string,

    /** Tooltip date format display [d3.js v3 time api](https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Formatting.md#format). */
    dataPointDateFormat: string,

    /** Data type date, percent, or number. This will format the number the right way for d3. */
    dataType: string,

    /** Date format being passed via data [d3.js v3 time api](https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Formatting.md#format). */
    dateFormat: string,

    /** Display horizontal grid lines when set to true. */
    displayHorizontalGridLines: bool,

    /** Display legend when set to true. */
    displayLegend: bool,

    /** Display trend line. */
    displayTrendLine: bool,

    /** Display vertical grid lines when set to true. */
    displayVerticalGridLines: bool,

    /** Graph height. */
    height: number,

    /** Globally unique and descriptive HTML ID. Used by QA for automated testing. */
    htmlId: string,

    /** Label key-value pair key value in data. */
    labelKey: string,

    /** Trend line type of `single` for a single trend for all data or `multi` for multiple trend lines per data set. */
    lineNumbers: oneOf(["single", "multi"]),

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

    /** X axis key-value pair key value. */
    xDataKey: string.isRequired,

    /** X Axis date label format if dataType is a date. [d3.js v3 time api](https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Formatting.md#format). */
    xFormat: string,

    /** X Axis tooltip label. */
    xToolTipLabel: string,

    /** Y Axis label. */
    yAxisLabel: string,

    /** Y axis key-value pair key value. */
    yDataKey: string.isRequired,

    /** Set Y maximum value to be displayed. */
    yMax: number,

    /** Set Y padding for min and max value. */
    yMaxBuffer: number,

    /** Set Y minimum value to be displayed. */
    yMin: number,

    /** Y Axis tooltip label. */
    yToolTipLabel: string
  };

  static defaultProps = {
    width: 1920,
    height: 400,
    labelKey: "label",
    dateFormat: "%m-%d-%Y",
    dataType: "date",
    xFormat: "%a %e",
    xToolTipLabel: "x",
    yToolTipLabel: "y",
    displayLegend: true,
    displayTrendLine: false,
    displayVerticalGridLines: false,
    displayHorizontalGridLines: true,
    margin: {
      top: 10,
      right: 40,
      bottom: 30,
      left: 40
    },
    yMaxBuffer: 100
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
    dataPointColor: "",
    width: this.props.width
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

  createChart = () => {
    const {
      colors,
      xAxisLabel,
      yAxisLabel,
      margin,
      dataType,
      xDataKey,
      yDataKey,
      yMaxBuffer,
      dataPercent,
      xFormat,
      yMin,
      yMax,
      labelKey,
      height
    } = this.props;
    const { width } = this.state;

    colors
      ? (this.color = d3.scale.ordinal().range(colors))
      : (this.color = d3.scale.category10());

    const xLabelHeightOffset = xAxisLabel ? 30 : 0;
    const yLabelWidthOffset = yAxisLabel ? 20 : 0;

    // Width of graph
    this.w = width - (margin.left + margin.right + yLabelWidthOffset);

    // Height of graph
    this.h = height - (margin.top + margin.bottom + xLabelHeightOffset);

    const normalizeDateFormat = normalizeDate(this.props);

    // X axis scale
    if (dataType !== "date") {
      this.xScale = d3.scale
        .linear()
        .domain([
          d3.min(normalizeDateFormat, d => {
            return d[xDataKey];
          }),
          d3.max(normalizeDateFormat, d => {
            return d[xDataKey];
          })
        ])
        .range([0, this.w]);

      if (dataPercent === "x") {
        this.xAxis = d3.svg
          .axis()
          .scale(this.xScale)
          .orient("bottom")
          .tickFormat(x => {
            return x + "%";
          });
      } else {
        this.xAxis = d3.svg
          .axis()
          .scale(this.xScale)
          .orient("bottom")
          .ticks(Math.floor(this.w / 100));
      }
    } else {
      this.xScale = d3.time
        .scale()
        .domain(
          // Find min and max axis value
          d3.extent(normalizeDateFormat, d => {
            return d[xDataKey];
          })
        )
        // Set range from 0 to width of container
        .rangeRound([0, this.w]);

      this.xAxis = d3.svg
        .axis()
        .scale(this.xScale)
        .orient("bottom")
        .ticks(Math.floor(this.w / 100))
        .tickFormat(d3.time.format(xFormat));
    }

    // Y axis scale
    this.yScale = d3.scale
      .linear()
      .domain([
        // Find min axis value and subtract buffer
        d3.min(normalizeDateFormat, d => {
          return typeof yMin === "number" ? yMin : d[yDataKey] - yMaxBuffer;
        }),
        // Find max axis value and add buffer
        d3.max(normalizeDateFormat, d => {
          return typeof yMax === "number" ? yMax : d[yDataKey] + yMaxBuffer;
        })
      ])
      // Set range from height of container to 0
      .range([this.h, 0]);

    this.dataNest = d3
      .nest()
      .key(d => {
        return d[labelKey];
      })
      .entries(normalizeDateFormat);

    if (dataPercent === "y") {
      this.yAxis = d3.svg
        .axis()
        .scale(this.yScale)
        .orient("left")
        .ticks(5)
        .tickFormat(x => {
          return x + "%";
        });
    } else {
      this.yAxis = d3.svg
        .axis()
        .scale(this.yScale)
        .orient("left")
        .ticks(5);
    }

    this.yGrid = d3.svg
      .axis()
      .scale(this.yScale)
      .orient("left")
      .ticks(5)
      .tickSize(-this.w, 0, 0)
      .tickFormat("");

    this.xGrid = d3.svg
      .axis()
      .scale(this.xScale)
      .orient("bottom")
      .ticks(Math.floor(this.w / 100))
      .tickSize(-this.h, 0, 0)
      .tickFormat("");

    this.transform =
      "translate(" + (margin.left + yLabelWidthOffset) + "," + margin.top + ")";
  };

  showToolTip = e => {
    this.setState({
      tooltip: {
        display: true,
        data: {
          key: e.target.getAttribute("data-key"),
          value: e.target.getAttribute("data-value")
        },
        originalColor: e.target.getAttribute("fill"),
        pos: {
          x: parseInt(e.target.getAttribute("cx"), 10),
          y: parseInt(e.target.getAttribute("cy"), 10)
        }
      }
    });
    e.target.setAttribute("fill", "#6f8679");
  };

  hideToolTip = e => {
    e.target.setAttribute("fill", this.state.tooltip.originalColor);
    this.setState({
      tooltip: {
        display: false,
        data: {
          key: "",
          value: ""
        },
        originalColor: "",
        pos: {
          x: 0,
          y: 0
        }
      }
    });
  };

  render() {
    const {
      displayTrendLine,
      lineNumbers,
      xDataKey,
      yDataKey,
      data,
      dataPointDateFormat,
      tooltipBgColor,
      margin,
      xAxisLabel,
      xToolTipLabel,
      yToolTipLabel,
      className,
      title,
      htmlId,
      yAxisLabel,
      displayLegend,
      labelKey,
      displayVerticalGridLines,
      displayHorizontalGridLines,
      height
    } = this.props;
    const { width, tooltip } = this.state;

    this.createChart();

    const dataPoints = this.dataNest.map((d, i) => {
      return (
        <g key={d.key.replace(/\s/g, "_")}>
          {displayTrendLine && (
            <TrendLine
              data={d.values}
              width={width}
              x={this.xScale}
              y={this.yScale}
              lineStroke={this.color(i)}
              lineExtend={normalizeDate(this.props)}
              lineNumbers={lineNumbers}
              xDataKey={xDataKey}
              yDataKey={yDataKey}
            />
          )}
          <Dots
            data={d.values}
            x={this.xScale}
            y={this.yScale}
            fill={this.color(i)}
            showToolTip={this.showToolTip}
            hideToolTip={this.hideToolTip}
            dateFormat={dataPointDateFormat}
            xDataKey={xDataKey}
            yDataKey={yDataKey}
          />
          <ToolTip
            tooltip={tooltip}
            bgColor={tooltipBgColor}
            chartWidth={width}
            margin={margin}
            xAxis={xAxisLabel ? true : false}
            xValue={xToolTipLabel}
            yValue={yToolTipLabel}
          />
        </g>
      );
    });

    let customClassName = "";

    if (className) {
      customClassName = " " + className;
    }

    return (
      <div>
        {title && <h3>{title}</h3>}
        <svg
          className={"rd3r-chart rd3r-scatter-plot" + customClassName}
          id={htmlId}
          width={width}
          height={height}
        >
          <g transform={this.transform}>
            {displayHorizontalGridLines && (
              <Grid h={this.h} grid={this.yGrid} gridType="y" />
            )}
            {displayVerticalGridLines && (
              <Grid h={this.h} grid={this.xGrid} gridType="x" />
            )}
            <Axis h={this.h} axis={this.yAxis} axisType="y" />
            <Axis h={this.h} axis={this.xAxis} axisType="x" />
            {xAxisLabel && (
              <AxisLabel
                h={this.h}
                w={this.w}
                axisLabel={xAxisLabel}
                axisType="x"
              />
            )}
            {yAxisLabel && (
              <AxisLabel
                h={this.h}
                w={this.w}
                axisLabel={yAxisLabel}
                axisType="y"
              />
            )}
            {dataPoints}
          </g>
        </svg>
        {displayLegend && (
          <Legend data={data} labelKey={labelKey} colors={this.color} />
        )}
      </div>
    );
  }
}

export default ScatterPlot;
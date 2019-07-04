import React from "react";
import { array, bool, number, string } from "prop-types";
import ReactDOM from "react-dom";
import d3 from "d3";
import Legend from "../Utilities/Legend";

/** Pie Chart */
class PieChart extends React.Component {
  static propTypes = {
    /** Adds additional class name(s). */
    className: string,

    /** Override colors for slices e.g. `["#084b62", "yellow", "#ab264b"]`. The number of colors should match the number of data series. */
    colors: array,

    /** Data to be graphed. */
    data: array.isRequired,

    /** Display legend when set to true. */
    displayLegend: bool,

    /** Sort data slices from largest to smallest when true. Will display data slices in the order received when false. */
    enablePieSort: bool,

    /** Ending angle (out of 360°). */
    endAngle: number,

    /** Graph height. */
    height: number,

    /** Globally unique and descriptive HTML ID. Used by QA for automated testing. */
    htmlId: string,

    /** Inner radius as a percent of the outer radius. Values between 0 and 1. */
    innerRadiusRatio: number,

    /** Data label key of key-value pair. */
    labelKey: string,

    /** Label offset from center with 0 being the absolute center of the pie and 1 being middle of slice. */
    labelOffset: number,

    /** Show slice value. */
    showLabel: bool,

    /** Starting angle (out of 360°). */
    startAngle: number,

    /** Graph title. */
    title: string,

    /** Data value key of key-value pair. */
    valueKey: string,

    /** Graph max-width. */
    width: number
  };

  static defaultProps = {
    width: 300,
    height: 300,
    valueKey: "value",
    labelKey: "label",
    showLabel: true,
    enablePieSort: true,
    labelOffset: 1,
    startAngle: 0,
    endAngle: 360,
    innerRadiusRatio: 0,
    displayLegend: true
  };

  state = {
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
    const { width, height } = this.props;
    const nodeWidth = ReactDOM.findDOMNode(this).offsetWidth;
    this.setState({
      width: Math.min(nodeWidth, width),
      height: Math.min(nodeWidth, height)
    });
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
      valueKey,
      width,
      startAngle,
      endAngle,
      innerRadiusRatio,
      enablePieSort
    } = this.props;

    colors
      ? (this.color = d3.scale.ordinal().range(colors))
      : (this.color = d3.scale.category10());

    let pieHeight = this.state.height;
    let pieWidth;
    if (width < this.state.width) {
      pieWidth = width;
    } else {
      pieWidth = this.state.width;
      pieHeight = width;
    }

    let diameter;
    pieHeight < pieWidth ? (diameter = pieHeight) : (diameter = pieWidth);
    const radius = diameter / 2;

    this.arc = d3.svg
      .arc()
      .outerRadius(radius)
      .innerRadius(radius * innerRadiusRatio);

    this.pie = d3.layout
      .pie()
      .startAngle(this.degreesToRadians(startAngle))
      .endAngle(this.degreesToRadians(endAngle))
      .value(d => {
        return d[valueKey];
      });

    if (!enablePieSort) {
      this.pie.sort(null);
    }

    this.transform = "translate(" + radius + "," + radius + ")";
  };

  degreesToRadians(value) {
    return (Math.PI / 180) * value;
  }

  render() {
    const {
      data,
      labelOffset,
      showLabel,
      valueKey,
      className,
      title,
      htmlId,
      displayLegend,
      labelKey
    } = this.props;

    this.createChart();

    const wedge = this.pie(data).map((d, i) => {
      const fill = this.color(i);
      const centroid = this.arc.centroid(d);
      const label =
        "translate(" +
        centroid[0] * labelOffset +
        "," +
        centroid[1] * labelOffset +
        ")";

      return (
        <g key={d.data[labelKey].replace(/\s/g, "_")}>
          <path fill={fill} d={this.arc(d)} />
          {showLabel ? (
            <text transform={label} textAnchor="middle">
              {d.data[valueKey]}
            </text>
          ) : null}
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
          className={"rd3r-chart rd3r-pie-chart" + customClassName}
          id={htmlId}
          width={this.state.width}
          height={this.state.height}
        >
          <g transform={this.transform}>{wedge}</g>
        </svg>
        {displayLegend && (
          <Legend data={data} labelKey={labelKey} colors={this.color} />
        )}
      </div>
    );
  }
}

export default PieChart;

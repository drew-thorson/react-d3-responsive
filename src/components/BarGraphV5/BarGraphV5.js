import React from "react";
import { array, bool, number, oneOf, string } from "prop-types";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { stack } from "d3-shape";
import { schemeCategory10 } from "d3-scale-chromatic";
import { max } from "d3-array";
import { axisBottom, axisLeft, axisRight } from "d3-axis";
import ResponsiveWrapper from "../Utilities/ResponsiveWrapper";
import Axis from "../Utilities/Axis";
import AxisLabel from "../Utilities/AxisLabel";
import Grid from "../Utilities/Grid";
import Legend from "../Utilities/Legend";
import Margin from "../Utilities/propTypes";

class BarGraphV5 extends React.Component {
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

    /** Label key-value pair key value in data. */
    labelKey: string,

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
    barChartType: "side",
    displayHorizontalGridLines: true,
    displayLegend: true,
    height: 500,
    margin: {
      top: 10,
      right: 40,
      bottom: 30,
      left: 40
    },
    parentMinWidth: 300
  };

  render() {
    const {
      colors,
      barChartType,
      data,
      displayHorizontalGridLines,
      displayLegend,
      legendValues,
      keys,
      height,
      margin,
      parentWidth,
      parentMinWidth,
      xDataKey,
      xAxisLabel,
      yAxisLabel
    } = this.props;

    const ticks = 10;

    const svgDimensions = {
      width: Math.max(parentWidth, parentMinWidth),
      height: height
    };

    const xLabelHeightOffset = xAxisLabel ? 30 : 0;
    const yLabelWidthOffset = yAxisLabel ? 20 : 0;

    const colorScheme = colors
      ? scaleOrdinal().range(colors)
      : scaleOrdinal(schemeCategory10);

    const calcWidth = svgDimensions.width - margin.left - margin.right;
    const calcHeight =
      svgDimensions.height - margin.top - margin.bottom - xLabelHeightOffset;

    const series = stack().keys(keys)(data);

    const legend = legendValues
      ? legendValues.map(value => ({ label: value }))
      : series.map(legend => ({ label: legend.key }));

    const x0Scale = scaleBand()
      .domain(data.map(d => d[xDataKey]))
      .rangeRound([0, calcWidth])
      .paddingInner(0.1)
      .paddingOuter(0.05);
    const x1Scale = scaleBand()
      .domain(keys)
      .rangeRound([0, x0Scale.bandwidth()])
      .paddingInner(0.05)
      .paddingOuter(0.05);

    const yScale = scaleLinear().rangeRound([calcHeight, 0]);
    barChartType === "side"
      ? yScale.domain([0, max(data, d => max(keys, key => d[key]))]).nice()
      : yScale.domain([0, max(series, d => max(d, d => d[1]))]).nice();

    const yGrid = axisRight(yScale)
      .ticks(ticks)
      .tickSize(calcWidth)
      .tickFormat("");

    return (
      <>
        <svg width={svgDimensions.width} height={svgDimensions.height}>
          <g
            transform={`translate(${margin.left + yLabelWidthOffset}, ${
              margin.top
            })`}
          >
            <Axis
              className="axis axis--x"
              height={calcHeight}
              axis={axisBottom(x0Scale)}
              axisType="x"
            />
            {xAxisLabel && (
              <AxisLabel
                h={calcHeight}
                w={calcWidth}
                axisLabel={xAxisLabel}
                axisType="x"
              />
            )}
            <g className="axis axis--y">
              <Axis
                height={calcHeight}
                axis={axisLeft(yScale).ticks(ticks)}
                axisType="y"
              />
              {/* Note: In the actual example 'Frequency' is a child of the above 'g' and it doesn't render.
               * Changing it to a sibiling allows it to render and having the axis as an empty 'g' means that it will also play nicer with react:
               * "The easiest way to avoid conflicts is to prevent the React component from updating.
               * You can do this by rendering elements that React has no reason to update, like an empty <div />."
               * https://reactjs.org/docs/integrating-with-other-libraries.html
               */}
              {displayHorizontalGridLines && (
                <Grid height={calcHeight} grid={yGrid} gridType="y" />
              )}
            </g>
            {yAxisLabel && (
              <AxisLabel
                h={calcHeight}
                w={calcWidth}
                axisLabel={yAxisLabel}
                axisType="y"
              />
            )}
            {barChartType === "side"
              ? data.map(d => (
                  <g
                    key={`${d[xDataKey]}`}
                    transform={`translate(${x0Scale(d[xDataKey])},0)`}
                  >
                    {keys.map((key, index) => (
                      <rect
                        key={`${d[xDataKey]}-${key}`}
                        className="bar"
                        x={x1Scale(key)}
                        y={yScale(d[key])}
                        width={x1Scale.bandwidth()}
                        height={calcHeight - yScale(d[key])}
                        fill={colorScheme(index)}
                      />
                    ))}
                  </g>
                ))
              : series.map((d, i) => (
                  <g key={`${d.key}-group`}>
                    {d.map(d2 => (
                      <rect
                        key={`${d.key}-${d2.data[xDataKey]}-rect`}
                        className="bar"
                        x={x0Scale(d2.data[xDataKey])}
                        y={yScale(d2[1])}
                        width={x0Scale.bandwidth()}
                        height={yScale(d2[0]) - yScale(d2[1])}
                        fill={colorScheme(i)}
                      />
                    ))}
                  </g>
                ))}
          </g>
        </svg>
        {displayLegend && <Legend data={legend} colors={colorScheme} />}
      </>
    );
  }
}

export default ResponsiveWrapper(BarGraphV5);

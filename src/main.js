import React from "react";
import {
  AreaGraph,
  BarGraph,
  LineGraph,
  PieChart,
  ScatterPlot
} from "./d3components";
import ChartData from "./d3components/TestData/data.js";
// import rd3r from '../../lib-compiled';
// import rd3r from '../../script-compiled';

const Main = () => (
  <div>
    <LineGraph
      title="Line Graph - 700px max width"
      width={700}
      height={500}
      chartId="custom-ID"
      chartClassName="custom-CLASS"
      xAxisLabel="X Axis Label"
      yAxisLabel="Y Axis Label"
      xDataKey="day"
      yDataKey="count"
      dateFormat="%m-%d-%Y"
      xToolTipLabel="X-TT"
      yToolTipLabel="Y-TT"
      lineType="linear"
      yMaxBuffer={50}
      data={ChartData.lineGraphData}
    />

    <LineGraph
      title="Line Graph - d3 cardinal line"
      xAxisLabel="X Axis Label"
      yAxisLabel="Y Axis Label"
      xDataKey="day"
      yDataKey="count"
      lineType="cardinal"
      data={ChartData.lineGraphData}
    />
    <LineGraph
      title="Multiple Line Graph - Date X axis"
      xDataKey="day"
      yDataKey="count"
      lineType="cardinal"
      strokeColor="#67ff67"
      xFormat="%a"
      data={ChartData.lineGraphData2}
    />
    <LineGraph
      title="Line Graph - Number X axis"
      xDataKey="x"
      yDataKey="y"
      lineType="linear"
      dataType="data"
      data={ChartData.lineGraphData3}
    />

    <AreaGraph
      title="Area Graph - 700px max width"
      width={700}
      height={500}
      chartId="custom-ID"
      className="custom-CLASS"
      xAxisLabel="X Axis Label"
      yAxisLabel="Y Axis Label"
      xDataKey="day"
      yDataKey="count"
      dateFormat="%m-%d-%Y"
      xToolTipLabel="X-TT"
      yToolTipLabel="Y-TT"
      lineType="linear"
      yMaxBuffer={50}
      data={ChartData.areaGraphData}
    />
    <AreaGraph
      title="Area Graph"
      xDataKey="day"
      yDataKey="count"
      lineType="linear"
      fillColor="#53c79f"
      strokeColor="#67ff67"
      data={ChartData.areaGraphData}
    />
    <AreaGraph
      title="Area Graph - d3 cardinal line"
      xDataKey="day"
      yDataKey="count"
      lineType="cardinal"
      fillColor="#53c79f"
      strokeColor="#67ff67"
      data={ChartData.areaGraphData}
    />
    <AreaGraph
      title="Multiple Area Graph - d3 cardinal lines"
      xDataKey="day"
      yDataKey="count"
      lineType="cardinal"
      xFormat="%a"
      data={ChartData.areaGraphData2}
    />

    <ScatterPlot
      title="Scatter Plot - Date X axis"
      xDataKey="day"
      yDataKey="count"
      dataType="date"
      displayTrendLine
      data={ChartData.scatterPlotData}
    />
    <ScatterPlot
      title="Scatter Plot - data X axis, single trend line"
      xDataKey="x"
      yDataKey="y"
      xAxisLabel="X Axis Label"
      yAxisLabel="Y Axis Label"
      displayTrendLine
      lineNumbers="single"
      data={ChartData.scatterPlotData3}
      dataType="data"
    />
    <ScatterPlot
      title="Scatter Plot - data X axis, multiple trend line"
      xDataKey="x"
      yDataKey="y"
      xAxisLabel="X Axis Label"
      yAxisLabel="Y Axis Label"
      displayTrendLine
      lineNumbers="multi"
      data={ChartData.scatterPlotData3}
      dataType="data"
    />

    <BarGraph
      title="Bar Graph"
      xDataKey="month"
      keys={["new", "old", "third", "four"]}
      data={ChartData.barGraphTestData}
    />
    <BarGraph
      title="Bar Graph - With Axis Labels"
      xDataKey="month"
      xAxisLabel="X Axis Label"
      yAxisLabel="Y Axis Label"
      keys={["new", "old", "third", "four"]}
      data={ChartData.barGraphTestData}
    />

    <PieChart
      title="Pie Chart"
      chartId="piechart"
      data={ChartData.pieTestData}
      innerRadiusRatio={0}
      labelOffset={1}
      startAngle={0}
      endAngle={360}
    />
    <PieChart
      title="Pie Chart - Different Start and End Angles"
      chartId="piechart"
      data={ChartData.pieTestData}
      innerRadiusRatio={0.8}
      labelOffset={1}
      showLabel={false}
      legend={false}
      startAngle={-50}
      endAngle={154}
    />
  </div>
);

export default Main;

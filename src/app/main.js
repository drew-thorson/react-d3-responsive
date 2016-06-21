import React from 'react';
import d3r from './vinchart';

const LineGraph = d3r.LineGraph;
const AreaGraph = d3r.AreaGraph;
const BarGraph = d3r.BarGraph;
const PieChart = d3r.PieChart;
const ScatterPlot = d3r.ScatterPlot;

import ChartData from './vinchart/testData/data.json';

class Main extends React.Component {
  render() {
    return (
      <div>
        <LineGraph
          title="Line Graph D3 Component Chart"
          lineType="linear"
          data={ChartData.lineGraphData} />
        <LineGraph
          title="Line Graph D3 Component Chart"
          lineType="cardinal"
          strokeColor="#67ff67"
          xFormat="%a"
          data={ChartData.lineGraphData2} />
        <AreaGraph
          title="Line Graph D3 Component Chart"
          lineType="linear"
          fillColor="#53c79f"
          strokeColor="#67ff67"
          data={ChartData.areaGraphData2} />
        <AreaGraph
          lineType="cardinal"
          data={ChartData.areaGraphData} />
        <ScatterPlot
          title="Scatter Plot D3 Component Chart"
          lineType="cardinal"
          data={ChartData.scatterPlotData} />
        <BarGraph
          lineType="linear"
          keys={['new','old','third','four']} />
        <PieChart
          chartId="piechart"
          title="PieChart D3 Component Chart"
          data={ChartData.pieTestData}
          innerRadiusRatio={2}
          labelOffset={1}
          startAngle={0}
          endAngle={360} />
      </div>
    );
  }
}

export default Main;

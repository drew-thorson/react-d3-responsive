import React from 'react';
import LineGraph from './vinchart/linegraph/LineGraph';
import AreaGraph from './vinchart/areagraph/AreaGraph';
import BarGraph from './vinchart/bargraph/BarGraph';
import PieChart from './vinchart/piechart/PieChart';
import ScatterPlot from './vinchart/scatterplot/ScatterPlot';
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

import React from 'react';

import LineGraph from './LineGraph';
import ScatterPlot from './ScatterPlot';
import AreaGraph from './AreaGraph';
import AreaGraphAlt from './AreaGraph/AreaGraphAlt';
import RadialLine from './RadialLine';
import ForceGraph from './ForceGraph';
import { nodes, lineData, radialLineData, areaGraphNodes } from './GraphingData';

// The number of data points for the chart.
const numDataPoints = 50;

// A function that returns a random number from 0 to 1000
const randomNum = () => Math.floor(Math.random() * 1000);

// A function that creates an array of 50 elements of (x, y) coordinates.
const randomDataSet = () => {
  return Array.apply(null, { length: numDataPoints }).map((d, i) => [i, randomNum()]);
}

const randomDataSetScatter = () => {
  let data = [];
  for (var i = 0; i < numDataPoints; i++) {
    data.push({ x: randomNum(), y: randomNum() });
  }
  return data;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: randomDataSet(),
      scatterData: randomDataSetScatter()
    };
  }

  randomizeData = () => {
    this.setState({
      data: randomDataSet(),
      scatterData: randomDataSetScatter()
    });
  }

  render() {
    const calcCenter = () => 150 + Math.random() * 200;
    const { scatterData, data } = this.state;
    return (
      <div>
        <div>
          {/*<ForceGraph data={nodes} forceStrength={-10} />*/}
        </div>
        <svg width={500} height={500}>
          <LineGraph data={lineData} />
          <g transform={'translate(' + calcCenter() + ', ' + calcCenter() + ')'}>
            <RadialLine data={radialLineData} />
          </g>
        </svg>
        <div>
          <AreaGraphAlt width={500} height={200} margin={{top: 50, right: 50, bottom: 50, left: 50}} {...this.state} />
        </div>
        <div>
          <AreaGraph width={500} height={200} data={areaGraphNodes} />
        </div>
        <div>
          <ScatterPlot width={500} height={200} data={scatterData} />
        </div>
        <div className="controls">
          <button className="btn randomize" onClick={() => this.randomizeData()}>
            Randomize Data
          </button>
        </div>
      </div>
    );
  }
}

export default App;

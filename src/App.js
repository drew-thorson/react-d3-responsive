import React from 'react';

import LineGraph from './LineGraph';
import RadialLine from './RadialLine';
import ForceGraph from './ForceGraph';
import { nodes, data, radialLineData } from './GraphingData';

class App extends React.Component {
  render() {
    const calcCenter = () => 150 + Math.random() * 200;

    return (
      <div>
        <div>
          <ForceGraph data={nodes} forceStrength={-10} />
        </div>
        <svg width={500} height={500}>
          <LineGraph data={data} />
          <g transform={'translate(' + calcCenter() + ', ' + calcCenter() + ')'}>
            <RadialLine data={radialLineData} />
          </g>
        </svg>
      </div>
    );
  }
}

export default App;

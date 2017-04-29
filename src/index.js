import React from 'react';
import ReactDOM from 'react-dom';

import LineGraph from './LineGraph';
import ForceGraph from './ForceGraph';
import { nodes, data } from './GraphingData';

import './index.css';

ReactDOM.render(
  <div>
    <div>
      <ForceGraph data={nodes} forceStrength={-10} />
    </div>
    <LineGraph data={data} />
  </div>,
  document.getElementById('root')
);

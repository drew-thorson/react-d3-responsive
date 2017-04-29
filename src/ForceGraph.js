import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";

class ForceGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: this.props.data
    };
  }

  componentDidMount() {
    const { height, width, forceStrength } = this.props;
    const { nodes } = this.state;

    this.force = d3.forceSimulation(nodes)
      .force("charge",
      d3.forceManyBody()
        .strength(forceStrength)
      )
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2));

    this.force.on('tick', () => this.setState({ nodes: nodes }));
  }

  componentWillUnmount() {
    this.force.stop();
  }

  render() {
    const { height, width, fill } = this.props;
    const { nodes } = this.state;

    return (
      <svg width={width} height={height}>
        {nodes.map((node, index) => (
          <circle r={node.r} cx={node.x} cy={node.y} fill={fill} key={index} />
        ))}
      </svg>
    );
  }
}

ForceGraph.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  forceStrength: PropTypes.number
};

ForceGraph.defaultProps = {
  width: 300,
  height: 300,
  fill: "green",
  forceStrength: -10
};

export default ForceGraph;

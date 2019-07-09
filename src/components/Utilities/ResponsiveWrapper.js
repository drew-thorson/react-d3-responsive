import React, { Component } from "react";

export default ChartComponent =>
  class ResponsiveChart extends Component {
    state = {
      containerWidth: null
    };

    componentDidMount() {
      this.fitParentContainer();
      window.addEventListener("resize", this.fitParentContainer);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.fitParentContainer);
    }

    fitParentContainer = () => {
      const { containerWidth } = this.state;
      const currentContainerWidth = this.chartContainer.getBoundingClientRect()
        .width;

      const shouldResize = containerWidth !== currentContainerWidth;

      if (shouldResize) {
        this.setState({
          containerWidth: currentContainerWidth
        });
      }
    };

    renderChart() {
      const parentWidth = this.state.containerWidth;

      return <ChartComponent {...this.props} parentWidth={parentWidth} />;
    }

    render() {
      const { containerWidth } = this.state;
      const shouldRenderChart = containerWidth !== null;

      return (
        <div
          ref={element => {
            this.chartContainer = element;
          }}
          className="rd3r-responsive-wrapper"
        >
          {shouldRenderChart && this.renderChart()}
        </div>
      );
    }
  };

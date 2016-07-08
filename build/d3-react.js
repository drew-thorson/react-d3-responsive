/*eslint-disable react/no-set-state */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _axis = require('../utilities/axis');

var _axis2 = _interopRequireDefault(_axis);

var _axisLabel = require('../utilities/axisLabel');

var _axisLabel2 = _interopRequireDefault(_axisLabel);

var _grid = require('../utilities/grid');

var _grid2 = _interopRequireDefault(_grid);

var _dataPoints = require('../utilities/dataPoints');

var _dataPoints2 = _interopRequireDefault(_dataPoints);

var _tooltip = require('../utilities/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AreaGraph = (function (_React$Component) {
  _inherits(AreaGraph, _React$Component);

  function AreaGraph(props) {
    _classCallCheck(this, AreaGraph);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AreaGraph).call(this, props));

    _this.showToolTip = _this.showToolTip.bind(_this);
    _this.hideToolTip = _this.hideToolTip.bind(_this);
    _this.state = {
      tooltip: {
        display: false,
        data: {
          key: '',
          value: ''
        },
        pos: {
          x: 0,
          y: 0
        }
      },
      width: _this.props.width,
      data: []
    };
    return _this;
  }

  _createClass(AreaGraph, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _self = this;
      window.addEventListener('resize', function (e) {
        _self.updateSize();
      }, true);
      _self.setState({ width: _self.props.width });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateSize();
      this.reloadBarData();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.serverRequest.abort();
      window.removeEventListener('resize');
    }
  }, {
    key: 'createChart',
    value: function createChart(_self) {

      this.color = _d2.default.scale.category10();

      // Width of graph
      this.w = this.state.width - (this.props.margin.left + this.props.margin.right);
      // Height of graph
      this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom);

      // Width of svg
      this.xWidth = this.state.width;
      // Height of svg
      this.yHeight = this.props.height;

      // X axis scale
      this.xScale = _d2.default.time.scale().domain(
      // Find min and max axis value
      _d2.default.extent(this.state.data, function (d) {
        return d.day;
      }))
      // Set range from 0 to width of container
      .rangeRound([0, this.w]);

      // Y axis scale
      this.yScale = _d2.default.scale.linear().domain([
      // Find min axis value and subtract buffer
      _d2.default.min(this.state.data, function (d) {
        return d[_self.props.yData] - _self.props.yMaxBuffer;
      }),
      // Find max axis value and add buffer
      _d2.default.max(this.state.data, function (d) {
        return d[_self.props.yData] + _self.props.yMaxBuffer;
      })])
      // Set range from height of container to 0
      .range([this.h, 0]);

      // Create area
      this.area = _d2.default.svg.area().x(function (d) {
        return this.xScale(d[_self.props.xData]);
      }).y0(this.h).y1(function (d) {
        return this.yScale(d[_self.props.yData]);
      }).interpolate(this.props.lineType);

      this.dataNest = _d2.default.nest().key(function (d) {
        return d.type;
      }).entries(this.state.data);

      this.yAxis = _d2.default.svg.axis().scale(this.yScale).orient('left').ticks(5);

      this.xAxis = _d2.default.svg.axis().scale(this.xScale).orient('bottom').ticks(Math.floor(this.w / 100)).tickFormat(_d2.default.time.format(this.props.xFormat));

      this.yGrid = _d2.default.svg.axis().scale(this.yScale).orient('left').ticks(5).tickSize(-this.w, 0, 0).tickFormat("");

      this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    }
  }, {
    key: 'reloadBarData',
    value: function reloadBarData() {

      var data = this.props.data;

      // Format date for d3 to use
      var parseDate = _d2.default.time.format(this.props.dateFormat).parse;

      for (var i = 0; i < data.length; ++i) {

        var d = data[i];
        d.day = parseDate(d.day);
        d.count = Math.floor(Math.random() * 500);
        data[i] = d;
      }

      this.setState({ data: data });
    }
  }, {
    key: 'updateSize',
    value: function updateSize() {
      var node = _reactDom2.default.findDOMNode(this);
      var parentWidth = node.offsetWidth;
      if (parentWidth < this.props.width) {
        this.setState({ width: parentWidth });
      } else {
        this.setState({ width: this.props.width });
      }
    }
  }, {
    key: 'showToolTip',
    value: function showToolTip(e) {
      e.target.setAttribute('fill', '#6f8679');
      this.setState({
        tooltip: {
          display: true,
          data: {
            key: e.target.getAttribute('data-key'),
            value: e.target.getAttribute('data-value')
          },
          pos: {
            x: e.target.getAttribute('cx'),
            y: e.target.getAttribute('cy')
          }
        }
      });
    }
  }, {
    key: 'hideToolTip',
    value: function hideToolTip(e) {
      e.target.setAttribute('fill', '#b1bfb7');
      this.setState({
        tooltip: {
          display: false,
          data: {
            key: '',
            value: ''
          },
          pos: {
            x: 0,
            y: 0
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {

      this.createChart(this);

      var _self = this;
      var data = this.state.data;
      var lines = undefined,
          title = undefined;

      lines = this.dataNest.map(function (d, i) {
        return _react2.default.createElement(
          'g',
          { key: i },
          _react2.default.createElement('path', {
            d: _self.area(d.values),
            fill: _self.color(i),
            stroke: _self.props.strokeColor,
            opacity: '.9',
            strokeWidth: '2px' }),
          _react2.default.createElement(_dataPoints2.default, {
            data: d.values,
            x: _self.xScale,
            y: _self.yScale,
            stroke: '#ffffff',
            showToolTip: _self.showToolTip,
            hideToolTip: _self.hideToolTip,
            removeFirstAndLast: true,
            xData: _self.props.xData,
            yData: _self.props.yData }),
          _react2.default.createElement(_tooltip2.default, {
            tooltip: _self.state.tooltip,
            xValue: 'Date',
            yValue: 'Visitors' })
        );
      });

      if (this.props.title) {
        title = _react2.default.createElement(
          'h3',
          null,
          this.props.title
        );
      } else {
        title = "";
      }

      return _react2.default.createElement(
        'div',
        null,
        title,
        _react2.default.createElement(
          'svg',
          { id: this.props.chartId, width: this.state.width, height: this.props.height },
          _react2.default.createElement(
            'g',
            { transform: this.transform },
            _react2.default.createElement(_grid2.default, { h: this.h, grid: this.yGrid, gridType: 'y' }),
            _react2.default.createElement(_axis2.default, { h: this.h, axis: this.yAxis, axisType: 'y' }),
            _react2.default.createElement(_axis2.default, { h: this.h, axis: this.xAxis, axisType: 'x' }),
            _react2.default.createElement(_axisLabel2.default, { h: this.h, axisLabel: 'Visitors', axisType: 'y' }),
            lines
          )
        )
      );
    }
  }]);

  return AreaGraph;
})(_react2.default.Component);

AreaGraph.propTypes = {
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  chartId: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  dateFormat: _react2.default.PropTypes.string,
  xFormat: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.array.isRequired,
  xData: _react2.default.PropTypes.string.isRequired,
  yData: _react2.default.PropTypes.string.isRequired,
  lineType: _react2.default.PropTypes.string,
  strokeColor: _react2.default.PropTypes.string,
  fillColor: _react2.default.PropTypes.string,
  margin: _react2.default.PropTypes.object,
  yMaxBuffer: _react2.default.PropTypes.number
};

AreaGraph.defaultProps = {
  width: 1920,
  height: 300,
  chartId: 'chart_id',
  dateFormat: '%m-%d-%Y',
  xFormat: '%a %e',
  xData: 'day',
  yData: 'count',
  lineType: 'linear',
  strokeColor: '#ffffff',
  fillColor: '#0082a1',
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 60
  },
  yMaxBuffer: 100
};

exports.default = AreaGraph;
'use strict';

exports.AreaGraph = require('./AreaGraph').default;
/*eslint-disable react/no-set-state */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _axis = require('../utilities/axis');

var _axis2 = _interopRequireDefault(_axis);

var _axisLabel = require('../utilities/axisLabel');

var _axisLabel2 = _interopRequireDefault(_axisLabel);

var _grid = require('../utilities/grid');

var _grid2 = _interopRequireDefault(_grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarGraph = (function (_React$Component) {
  _inherits(BarGraph, _React$Component);

  function BarGraph(props) {
    _classCallCheck(this, BarGraph);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BarGraph).call(this, props));

    _this.state = {
      width: _this.props.width,
      data: []
    };
    return _this;
  }

  _createClass(BarGraph, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _self = this;
      window.addEventListener('resize', function (e) {
        _self.updateSize();
        // _self.reloadBarData();
      }, true);
      _self.setState({ width: _self.props.width });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateSize();
      this.reloadBarData();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.serverRequest.abort();
      window.removeEventListener('resize');
    }
  }, {
    key: 'createChart',
    value: function createChart(_self) {

      this.color = _d2.default.scale.category20();

      // Width of graph
      this.w = this.state.width - (this.props.margin.left + this.props.margin.right);
      // Height of graph
      this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom);

      // Width of svg
      this.xWidth = this.state.width;
      // Height of svg
      this.yHeight = this.props.height;

      this.stacked = _d2.default.layout.stack()(_self.props.keys.map(function (key, i) {
        return _self.state.data.map(function (d, j) {
          return { x: d[_self.props.xData], y: d[key] };
        });
      }));

      // X axis scale
      this.xScale = _d2.default.scale.ordinal().rangeRoundBands([0, this.w], .3).domain(this.stacked[0].map(function (d) {
        return d.x;
      }));

      // Y axis scale
      this.yScale = _d2.default.scale.linear().rangeRound([this.h, 0]).domain([0, _d2.default.max(this.stacked[this.stacked.length - 1], function (d) {
        return d.y0 + d.y;
      })]).nice();

      this.yAxis = _d2.default.svg.axis().scale(this.yScale).orient('left').ticks(5);

      this.xAxis = _d2.default.svg.axis().scale(this.xScale).orient('bottom').ticks(this.state.data.length);

      this.yGrid = _d2.default.svg.axis().scale(this.yScale).orient('left').ticks(5).tickSize(-this.w, 0, 0).tickFormat("");

      this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    }
  }, {
    key: 'reloadBarData',
    value: function reloadBarData() {

      var data = [{ month: 'Jan', new: 20, old: 30, third: 30, four: 20 }, { month: 'Feb', new: 29, old: 83, third: 30, four: 20 }, { month: 'Mar', new: 86, old: 75, third: 30, four: 20 }, { month: 'Apr', new: 13, old: 57, third: 30, four: 20 }, { month: 'May', new: 30, old: 23, third: 30, four: 20 }, { month: 'Jun', new: 30, old: 23, third: 30, four: 20 }, { month: 'Jul', new: 50, old: 27, third: 30, four: 20 }];

      for (var i = 0; i < data.length; ++i) {
        var d = data[i];
        d.new = Math.floor(Math.random() * 200);
        d.old = Math.floor(Math.random() * 200);
        d.third = Math.floor(Math.random() * 200);
        d.four = Math.floor(Math.random() * 200);
        data[i] = d;
      }

      this.setState({ data: data });
    }
  }, {
    key: 'updateSize',
    value: function updateSize() {
      var node = _reactDom2.default.findDOMNode(this);
      var parentWidth = node.offsetWidth;
      if (parentWidth < this.props.width) {
        this.setState({ width: parentWidth });
      } else {
        this.setState({ width: this.props.width });
      }
    }
  }, {
    key: 'render',
    value: function render() {

      this.createChart(this);

      var _self = this;
      var data = this.state.data;

      var bars = _self.stacked.map(function (data, i) {
        var rects = data.map(function (d, j) {

          var fill = _self.color(i);

          // if (i > 0) {
          //   fill = "#e8e8e9";
          // }

          return _react2.default.createElement('rect', {
            x: _self.xScale(d.x),
            y: _self.yScale(d.y + d.y0),
            fill: fill,
            height: _self.yScale(d.y0) - _self.yScale(d.y + d.y0),
            width: _self.xScale.rangeBand(),
            key: j });
        });

        return _react2.default.createElement(
          'g',
          { key: i },
          rects
        );
      });

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'svg',
          { id: this.props.chartId, width: this.state.width, height: this.props.height },
          _react2.default.createElement(
            'g',
            { transform: this.transform },
            _react2.default.createElement(_grid2.default, { h: this.h, grid: this.yGrid, gridType: 'y' }),
            _react2.default.createElement(_axis2.default, { h: this.h, axis: this.yAxis, axisType: 'y' }),
            _react2.default.createElement(_axis2.default, { h: this.h, axis: this.xAxis, axisType: 'x' }),
            bars,
            _react2.default.createElement(_axisLabel2.default, { h: this.h, axisLabel: 'Visitors', axisType: 'y' })
          )
        )
      );
    }
  }]);

  return BarGraph;
})(_react2.default.Component);

BarGraph.propTypes = {
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  chartId: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.array.isRequired,
  xData: _react2.default.PropTypes.string.isRequired,
  keys: _react2.default.PropTypes.array.isRequired,
  fillColor: _react2.default.PropTypes.string,
  margin: _react2.default.PropTypes.object
};

BarGraph.defaultProps = {
  width: 1920,
  height: 300,
  chartId: 'chart_id',
  data: [],
  xData: 'month',
  fillColor: 'transparent',
  margin: {
    top: 10,
    right: 10,
    bottom: 20,
    left: 60
  }
};

exports.default = BarGraph;
'use strict';

exports.BarGraph = require('./BarGraph').default;
'use strict';

exports.LineGraph = require('./linegraph').LineGraph;
exports.AreaGraph = require('./areagraph').AreaGraph;
exports.BarGraph = require('./bargraph').BarGraph;
exports.PieChart = require('./piechart').PieChart;
exports.ScatterPlot = require('./scatterplot').ScatterPlot;
'use strict';

exports.LineGraph = require('./LineGraph').default;
/*eslint-disable react/no-set-state */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _axis = require('../utilities/axis');

var _axis2 = _interopRequireDefault(_axis);

var _axisLabel = require('../utilities/axisLabel');

var _axisLabel2 = _interopRequireDefault(_axisLabel);

var _grid = require('../utilities/grid');

var _grid2 = _interopRequireDefault(_grid);

var _dataPoints = require('../utilities/dataPoints');

var _dataPoints2 = _interopRequireDefault(_dataPoints);

var _tooltip = require('../utilities/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineGraph = (function (_React$Component) {
  _inherits(LineGraph, _React$Component);

  function LineGraph(props) {
    _classCallCheck(this, LineGraph);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LineGraph).call(this, props));

    _this.showToolTip = _this.showToolTip.bind(_this);
    _this.hideToolTip = _this.hideToolTip.bind(_this);
    _this.state = {
      tooltip: {
        display: false,
        data: {
          key: '',
          value: ''
        },
        pos: {
          x: 0,
          y: 0
        }
      },
      width: _this.props.width,
      data: []
    };
    return _this;
  }

  _createClass(LineGraph, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _self = this;
      window.addEventListener('resize', function (e) {
        _self.updateSize();
      }, true);
      _self.setState({ width: _self.props.width });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateSize();
      this.reloadBarData();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.serverRequest.abort();
      window.removeEventListener('resize');
    }
  }, {
    key: 'createChart',
    value: function createChart(_self) {

      this.color = _d2.default.scale.category10();

      // Width of graph
      this.w = this.state.width - (this.props.margin.left + this.props.margin.right);
      // Height of graph
      this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom);

      // Width of svg
      this.xWidth = this.state.width;
      // Height of svg
      this.yHeight = this.props.height;

      // X axis scale
      this.xScale = _d2.default.time.scale().domain(
      // Find min and max axis value
      _d2.default.extent(this.state.data, function (d) {
        return d.day;
      }))
      // Set range from 0 to width of container
      .rangeRound([0, this.w]);

      // Y axis scale
      this.yScale = _d2.default.scale.linear().domain([
      // Find min axis value and subtract buffer
      _d2.default.min(this.state.data, function (d) {
        return d[_self.props.yData] - _self.props.yMaxBuffer;
      }),
      // Find max axis value and add buffer
      _d2.default.max(this.state.data, function (d) {
        return d[_self.props.yData] + _self.props.yMaxBuffer;
      })])
      // Set range from height of container to 0
      .range([this.h, 0]);

      // Create line
      this.line = _d2.default.svg.line().x(function (d) {
        return this.xScale(d[_self.props.xData]);
      }).y(function (d) {
        return this.yScale(d[_self.props.yData]);
      }).interpolate(this.props.lineType);

      this.dataNest = _d2.default.nest().key(function (d) {
        return d.type;
      }).entries(this.state.data);

      this.yAxis = _d2.default.svg.axis().scale(this.yScale).orient('left').ticks(5);

      this.xAxis = _d2.default.svg.axis().scale(this.xScale).orient('bottom').ticks(Math.floor(this.w / 100)).tickFormat(_d2.default.time.format(this.props.xFormat));

      this.yGrid = _d2.default.svg.axis().scale(this.yScale).orient('left').ticks(5).tickSize(-this.w, 0, 0).tickFormat("");

      this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    }
  }, {
    key: 'reloadBarData',
    value: function reloadBarData() {

      var data = this.props.data;

      // Format date for d3 to use
      var parseDate = _d2.default.time.format(this.props.dateFormat).parse;

      for (var i = 0; i < data.length; ++i) {
        var d = data[i];
        d.day = parseDate(d.day);
        d.count = Math.floor(Math.random() * 500);
        data[i] = d;
      }

      this.setState({ data: data });
    }
  }, {
    key: 'updateSize',
    value: function updateSize() {
      var node = _reactDom2.default.findDOMNode(this);
      var parentWidth = node.offsetWidth;
      if (parentWidth < this.props.width) {
        this.setState({ width: parentWidth });
      } else {
        this.setState({ width: this.props.width });
      }
    }
  }, {
    key: 'showToolTip',
    value: function showToolTip(e) {
      e.target.setAttribute('fill', '#6f8679');
      this.setState({
        tooltip: {
          display: true,
          data: {
            key: e.target.getAttribute('data-key'),
            value: e.target.getAttribute('data-value')
          },
          pos: {
            x: e.target.getAttribute('cx'),
            y: e.target.getAttribute('cy')
          }
        }
      });
    }
  }, {
    key: 'hideToolTip',
    value: function hideToolTip(e) {
      e.target.setAttribute('fill', '#b1bfb7');
      this.setState({
        tooltip: {
          display: false,
          data: {
            key: '',
            value: ''
          },
          pos: {
            x: 0,
            y: 0
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {

      this.createChart(this);

      var _self = this;
      var data = this.state.data;
      var lines = undefined,
          title = undefined;

      lines = this.dataNest.map(function (d, i) {
        return _react2.default.createElement(
          'g',
          { key: i },
          _react2.default.createElement('path', {
            d: _self.line(d.values),
            fill: _self.props.fillColor,
            stroke: _self.color(i),
            opacity: '.9',
            strokeWidth: 3,
            strokeLinecap: 'round' }),
          _react2.default.createElement(_dataPoints2.default, {
            data: d.values,
            x: _self.xScale,
            y: _self.yScale,
            stroke: '#ffffff',
            showToolTip: _self.showToolTip,
            hideToolTip: _self.hideToolTip,
            removeFirstAndLast: true,
            xData: 'day',
            yData: 'count',
            r: 5 }),
          _react2.default.createElement(_tooltip2.default, {
            tooltip: _self.state.tooltip,
            xValue: 'Date',
            yValue: 'Visitors' })
        );
      });

      if (this.props.title) {
        title = _react2.default.createElement(
          'h3',
          null,
          this.props.title
        );
      } else {
        title = "";
      }

      return _react2.default.createElement(
        'div',
        null,
        title,
        _react2.default.createElement(
          'svg',
          { id: this.props.chartId, width: this.state.width, height: this.props.height },
          _react2.default.createElement(
            'g',
            { transform: this.transform },
            _react2.default.createElement(_grid2.default, { h: this.h, grid: this.yGrid, gridType: 'y' }),
            _react2.default.createElement(_axis2.default, { h: this.h, axis: this.yAxis, axisType: 'y' }),
            _react2.default.createElement(_axis2.default, { h: this.h, axis: this.xAxis, axisType: 'x' }),
            _react2.default.createElement(_axisLabel2.default, { h: this.h, axisLabel: 'Visitors', axisType: 'y' }),
            lines
          )
        )
      );
    }
  }]);

  return LineGraph;
})(_react2.default.Component);

LineGraph.propTypes = {
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  chartId: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  dateFormat: _react2.default.PropTypes.string,
  xFormat: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.array.isRequired,
  xData: _react2.default.PropTypes.string.isRequired,
  yData: _react2.default.PropTypes.string.isRequired,
  lineType: _react2.default.PropTypes.string,
  strokeColor: _react2.default.PropTypes.string,
  fillColor: _react2.default.PropTypes.string,
  margin: _react2.default.PropTypes.object,
  yMaxBuffer: _react2.default.PropTypes.number
};

LineGraph.defaultProps = {
  width: 1920,
  height: 300,
  chartId: 'chart_id',
  dateFormat: '%m-%d-%Y',
  xFormat: '%a %e',
  xData: 'day',
  yData: 'count',
  lineType: 'linear',
  strokeColor: '#0082a1',
  fillColor: 'transparent',
  margin: {
    top: 10,
    right: 40,
    bottom: 20,
    left: 60
  },
  yMaxBuffer: 100
};

exports.default = LineGraph;
'use strict';

exports.PieChart = require('./PieChart').default;
/*eslint-disable react/no-set-state */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PieChart = (function (_React$Component) {
  _inherits(PieChart, _React$Component);

  function PieChart(props) {
    _classCallCheck(this, PieChart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PieChart).call(this, props));

    _this.state = {
      width: _this.props.width,
      data: []
    };
    return _this;
  }

  _createClass(PieChart, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _self = this;
      window.addEventListener('resize', function (e) {
        _self.updateSize();
      }, true);
      _self.setState({ width: _self.props.width });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateSize();
      this.reloadBarData();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.serverRequest.abort();
      window.removeEventListener('resize');
    }
  }, {
    key: 'createChart',
    value: function createChart(_self) {

      this.color = _d2.default.scale.category20();

      var pieHeight = _self.state.height;
      var pieWidth = undefined;
      if (_self.props.width < _self.state.width) {
        pieWidth = _self.props.width;
      } else {
        pieWidth = _self.state.width;
      }

      var diameter = undefined;
      if (pieHeight < pieWidth) {
        diameter = pieHeight;
      } else {
        diameter = pieWidth;
      }
      var radius = diameter / 2;

      var outerRadius = radius;
      var innerRadius = _self.props.innerRadiusRatio ? radius / _self.props.innerRadiusRatio : 0;
      var startAngle = _self.degreesToRadians(_self.props.startAngle);
      var endAngle = _self.degreesToRadians(_self.props.endAngle);

      this.arc = _d2.default.svg.arc().outerRadius(outerRadius).innerRadius(innerRadius);

      this.pie = _d2.default.layout.pie().startAngle(startAngle).endAngle(endAngle).value(function (d) {
        return d;
      });

      this.transform = 'translate(' + radius + ',' + radius + ')';
    }
  }, {
    key: 'degreesToRadians',
    value: function degreesToRadians(d) {
      return Math.PI / 180 * d;
    }
  }, {
    key: 'reloadBarData',
    value: function reloadBarData() {

      var data = this.props.data;

      // Random Data
      // let dataWedges = Math.ceil((Math.random() * 5) + 2);

      // for(let i=0;i<dataWedges;++i){
      //   let d = Math.floor((Math.random() * 200));
      //   data[i] = d;
      // }

      this.setState({ data: data });
    }
  }, {
    key: 'updateSize',
    value: function updateSize() {
      var node = _reactDom2.default.findDOMNode(this);
      var parentWidth = node.offsetWidth;
      if (parentWidth < this.props.width) {
        this.setState({ width: parentWidth });
      } else {
        this.setState({ width: this.props.width });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.createChart(this);

      var _self = this;
      var data = this.state.data;

      var wedge = _self.pie(data).map(function (d, i) {
        var fill = _self.color(i);
        var centroid = _self.arc.centroid(d);
        var labelOffset = _self.props.labelOffset;
        var label = "translate(" + centroid[0] * labelOffset + "," + centroid[1] * labelOffset + ")";

        return _react2.default.createElement(
          'g',
          { key: i },
          _react2.default.createElement('path', {
            fill: fill,
            d: _self.arc(d) }),
          _react2.default.createElement(
            'text',
            {
              transform: label,
              textAnchor: 'middle' },
            d.data
          )
        );
      });

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h3',
          null,
          this.props.title
        ),
        _react2.default.createElement(
          'svg',
          { id: this.props.chartId, width: this.state.width, height: this.props.height },
          _react2.default.createElement(
            'g',
            { transform: this.transform },
            wedge
          )
        )
      );
    }
  }]);

  return PieChart;
})(_react2.default.Component);

PieChart.propTypes = {
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  chartId: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.array,
  labelOffset: _react2.default.PropTypes.number,
  startAngle: _react2.default.PropTypes.number,
  endAngle: _react2.default.PropTypes.number,
  innerRadiusRatio: _react2.default.PropTypes.number
};

PieChart.defaultProps = {
  width: 300,
  height: 300,
  data: [],
  labelOffset: 1,
  startAngle: 0,
  endAngle: 360,
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  }
};

exports.default = PieChart;
'use strict';

exports.ScatterPlot = require('./ScatterPlot').default;
/*eslint-disable react/no-set-state */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _axis = require('../utilities/axis');

var _axis2 = _interopRequireDefault(_axis);

var _grid = require('../utilities/grid');

var _grid2 = _interopRequireDefault(_grid);

var _dataPoints = require('../utilities/dataPoints');

var _dataPoints2 = _interopRequireDefault(_dataPoints);

var _tooltip = require('../utilities/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlot = (function (_React$Component) {
  _inherits(ScatterPlot, _React$Component);

  function ScatterPlot(props) {
    _classCallCheck(this, ScatterPlot);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterPlot).call(this, props));

    _this.showToolTip = _this.showToolTip.bind(_this);
    _this.hideToolTip = _this.hideToolTip.bind(_this);
    _this.state = {
      tooltip: {
        display: false,
        data: {
          key: '',
          value: ''
        },
        pos: {
          x: 0,
          y: 0
        }
      },
      width: _this.props.width,
      data: []
    };
    return _this;
  }

  _createClass(ScatterPlot, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _self = this;
      window.addEventListener('resize', function (e) {
        _self.updateSize();
      }, true);
      _self.setState({ width: _self.props.width });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateSize();
      this.reloadBarData();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.serverRequest.abort();
      window.removeEventListener('resize');
    }
  }, {
    key: 'createChart',
    value: function createChart(_self) {

      this.color = _d2.default.scale.category10();

      // Width of graph
      this.w = this.state.width - (this.props.margin.left + this.props.margin.right);
      // Height of graph
      this.h = this.props.height - (this.props.margin.top + this.props.margin.bottom);

      // X axis scale
      this.xScale = _d2.default.time.scale().domain(
      // Find min and max axis value
      _d2.default.extent(this.state.data, function (d) {
        return d.day;
      }))
      // Set range from 0 to width of container
      .rangeRound([0, this.w]);

      // Y axis scale
      this.yScale = _d2.default.scale.linear().domain([
      // Find min axis value and subtract buffer
      _d2.default.min(this.state.data, function (d) {
        return d[_self.props.yData] - _self.props.yMaxBuffer;
      }),
      // Find max axis value and add buffer
      _d2.default.max(this.state.data, function (d) {
        return d[_self.props.yData] + _self.props.yMaxBuffer;
      })])
      // Set range from height of container to 0
      .range([this.h, 0]);

      // Create line
      this.line = _d2.default.svg.line().x(function (d) {
        return this.xScale(d[_self.props.xData]);
      }).y(function (d) {
        return this.yScale(d[_self.props.yData]);
      }).interpolate(this.props.lineType);

      this.dataNest = _d2.default.nest().key(function (d) {
        return d.type;
      }).entries(this.state.data);

      this.yAxis = _d2.default.svg.axis().scale(this.yScale).orient('left').ticks(5);

      this.xAxis = _d2.default.svg.axis().scale(this.xScale).orient('bottom').ticks(Math.floor(this.w / 100)).tickFormat(_d2.default.time.format(this.props.xFormat));

      this.yGrid = _d2.default.svg.axis().scale(this.yScale).orient('left').ticks(5).tickSize(-this.w, 0, 0).tickFormat("");

      this.transform = 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')';
    }
  }, {
    key: 'reloadBarData',
    value: function reloadBarData() {

      var data = this.props.data;

      // Format date for d3 to use
      var parseDate = _d2.default.time.format(this.props.dateFormat).parse;

      for (var i = 0; i < data.length; ++i) {
        var d = data[i];
        d.day = parseDate(d.day);
        d.count = Math.floor(Math.random() * 500);
        data[i] = d;
      }

      this.setState({ data: data });
    }
  }, {
    key: 'updateSize',
    value: function updateSize() {
      var node = _reactDom2.default.findDOMNode(this);
      var parentWidth = node.offsetWidth;
      if (parentWidth < this.props.width) {
        this.setState({ width: parentWidth });
      } else {
        this.setState({ width: this.props.width });
      }
    }
  }, {
    key: 'showToolTip',
    value: function showToolTip(e) {
      e.target.setAttribute('fill', '#6f8679');
      this.setState({
        tooltip: {
          display: true,
          data: {
            key: e.target.getAttribute('data-key'),
            value: e.target.getAttribute('data-value')
          },
          pos: {
            x: e.target.getAttribute('cx'),
            y: e.target.getAttribute('cy')
          }
        }
      });
    }
  }, {
    key: 'hideToolTip',
    value: function hideToolTip(e) {
      e.target.setAttribute('fill', '#b1bfb7');
      this.setState({
        tooltip: {
          display: false,
          data: {
            key: '',
            value: ''
          },
          pos: {
            x: 0,
            y: 0
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {

      this.createChart(this);

      var _self = this;
      var data = this.state.data;
      var lines = undefined;

      lines = this.dataNest.map(function (d, i) {
        return _react2.default.createElement(
          'g',
          { key: i },
          _react2.default.createElement(_dataPoints2.default, {
            data: d.values,
            x: _self.xScale,
            y: _self.yScale,
            fill: _self.color(i),
            showToolTip: _self.showToolTip,
            hideToolTip: _self.hideToolTip,
            removeFirstAndLast: false,
            xData: 'day',
            yData: 'count',
            r: 5 }),
          _react2.default.createElement(_tooltip2.default, {
            tooltip: _self.state.tooltip,
            xValue: 'Xtest',
            yValue: 'Ytest' })
        );
      });

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h3',
          null,
          this.props.title
        ),
        _react2.default.createElement(
          'svg',
          { id: this.props.chartId, width: this.state.width, height: this.props.height },
          _react2.default.createElement(
            'g',
            { transform: this.transform },
            _react2.default.createElement(_grid2.default, { h: this.h, grid: this.yGrid, gridType: 'y' }),
            _react2.default.createElement(_axis2.default, { h: this.h, axis: this.yAxis, axisType: 'y' }),
            _react2.default.createElement(_axis2.default, { h: this.h, axis: this.xAxis, axisType: 'x' }),
            lines
          )
        )
      );
    }
  }]);

  return ScatterPlot;
})(_react2.default.Component);

ScatterPlot.propTypes = {
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  chartId: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.string,
  dateFormat: _react2.default.PropTypes.string,
  xFormat: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.array.isRequired,
  xData: _react2.default.PropTypes.string.isRequired,
  yData: _react2.default.PropTypes.string.isRequired,
  lineType: _react2.default.PropTypes.string,
  strokeColor: _react2.default.PropTypes.string,
  margin: _react2.default.PropTypes.object,
  yMaxBuffer: _react2.default.PropTypes.number
};

ScatterPlot.defaultProps = {
  width: 1200,
  height: 300,
  chartId: 'chart_id',
  dateFormat: '%m-%d-%Y',
  xFormat: '%a %e',
  xData: 'day',
  yData: 'count',
  lineType: 'linear',
  strokeColor: '#0082a1',
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  yMaxBuffer: 100
};

exports.default = ScatterPlot;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Axis = (function (_React$Component) {
  _inherits(Axis, _React$Component);

  function Axis(props) {
    _classCallCheck(this, Axis);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Axis).call(this, props));
  }

  _createClass(Axis, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.renderAxis();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.renderAxis();
    }
  }, {
    key: 'renderAxis',
    value: function renderAxis() {
      var node = _reactDom2.default.findDOMNode(this);
      _d2.default.select(node).call(this.props.axis);
    }
  }, {
    key: 'render',
    value: function render() {
      var translate = "translate(0," + this.props.h + ")";
      return _react2.default.createElement('g', { className: 'axis', transform: this.props.axisType === 'x' ? translate : "" });
    }
  }]);

  return Axis;
})(_react2.default.Component);

Axis.propTypes = {
  h: _react2.default.PropTypes.number,
  axis: _react2.default.PropTypes.func,
  axisType: _react2.default.PropTypes.oneOf(['x', 'y'])
};

exports.default = Axis;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AxisLabel = (function (_React$Component) {
  _inherits(AxisLabel, _React$Component);

  function AxisLabel(props) {
    _classCallCheck(this, AxisLabel);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AxisLabel).call(this, props));
  }

  _createClass(AxisLabel, [{
    key: 'render',
    value: function render() {
      var translateLabelX = "translate(" + this.props.w / 2 + "," + (this.props.h - 20) + ")";
      var translateLabelY = "translate(-40," + this.props.h / 2 + ") rotate(270)";
      return _react2.default.createElement(
        'text',
        { className: 'axis-label', textAnchor: 'middle', transform: this.props.axisType === 'y' ? translateLabelY : translateLabelX },
        this.props.axisLabel
      );
    }
  }]);

  return AxisLabel;
})(_react2.default.Component);

AxisLabel.propTypes = {
  xm: _react2.default.PropTypes.number,
  w: _react2.default.PropTypes.number,
  h: _react2.default.PropTypes.number,
  axisLabel: _react2.default.PropTypes.string,
  axisType: _react2.default.PropTypes.oneOf(['x', 'y'])
};

exports.default = AxisLabel;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dots = (function (_React$Component) {
  _inherits(Dots, _React$Component);

  function Dots(props) {
    _classCallCheck(this, Dots);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dots).call(this, props));

    _this.state = {
      stroke: _this.props.stroke
    };
    return _this;
  }

  _createClass(Dots, [{
    key: 'render',
    value: function render() {

      var _self = this;

      var data = [];

      if (this.props.removeFirstAndLast) {
        for (var i = 1; i < _self.props.data.length - 1; ++i) {
          data[i - 1] = _self.props.data[i];
        }
      } else {
        data = _self.props.data;
      }

      var circles = data.map(function (d, i) {

        return _react2.default.createElement('circle', {
          className: 'dot',
          r: _self.props.r,
          cx: _self.props.x(d.day),
          cy: _self.props.y(d.count),
          fill: _self.props.fill,
          stroke: _self.props.stroke,
          strokeWidth: _self.props.strokeWidth,
          key: i,
          onMouseOver: _self.props.showToolTip,
          onMouseOut: _self.props.hideToolTip,
          'data-key': _d2.default.time.format(_self.props.format)(d[_self.props.xData]),
          'data-value': d[_self.props.yData] });
      });

      return _react2.default.createElement(
        'g',
        null,
        circles
      );
    }
  }]);

  return Dots;
})(_react2.default.Component);

Dots.propTypes = {
  data: _react2.default.PropTypes.array,
  x: _react2.default.PropTypes.func,
  y: _react2.default.PropTypes.func,
  fill: _react2.default.PropTypes.string,
  stroke: _react2.default.PropTypes.string,
  strokeWidth: _react2.default.PropTypes.number,
  r: _react2.default.PropTypes.number,
  xData: _react2.default.PropTypes.string.isRequired,
  yData: _react2.default.PropTypes.string.isRequired,
  format: _react2.default.PropTypes.string,
  removeFirstAndLast: _react2.default.PropTypes.bool
};

Dots.defaultProps = {
  fill: "#b1bfb7",
  strokeWidth: 2,
  r: 5,
  format: '%b %e'
};

exports.default = Dots;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Grid = (function (_React$Component) {
  _inherits(Grid, _React$Component);

  function Grid(props) {
    _classCallCheck(this, Grid);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Grid).call(this, props));
  }

  _createClass(Grid, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.renderGrid();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.renderGrid();
    }
  }, {
    key: 'renderGrid',
    value: function renderGrid() {
      var node = _reactDom2.default.findDOMNode(this);
      _d2.default.select(node).call(this.props.grid);
    }
  }, {
    key: 'render',
    value: function render() {
      var translate = "translate(0," + this.props.h + ")";
      return _react2.default.createElement('g', { className: 'y-grid', stroke: this.props.lineColor, strokeWidth: this.props.strokeWidth, transform: this.props.gridType === 'x' ? translate : "" });
    }
  }]);

  return Grid;
})(_react2.default.Component);

Grid.propTypes = {
  lineColor: _react2.default.PropTypes.string,
  strokeWidth: _react2.default.PropTypes.number,
  h: _react2.default.PropTypes.number,
  grid: _react2.default.PropTypes.func,
  gridType: _react2.default.PropTypes.oneOf(['x', 'y'])
};

Grid.defaultProps = {
  lineColor: '#ccc',
  strokeWidth: 1
};

exports.default = Grid;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToolTip = (function (_React$Component) {
  _inherits(ToolTip, _React$Component);

  function ToolTip(props) {
    _classCallCheck(this, ToolTip);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ToolTip).call(this, props));
  }

  _createClass(ToolTip, [{
    key: 'render',
    value: function render() {

      var visibility = "hidden";
      var transform = "";
      var x = 0;
      var y = 0;
      var width = 150;
      var height = 70;
      var transformText = 'translate(' + width / 2 + ',' + (height / 2 - 5) + ')';
      var transformArrow = "";

      if (this.props.tooltip.display === true) {
        var position = this.props.tooltip.pos;

        x = position.x;
        y = position.y;
        visibility = "visible";

        if (y > height) {
          transform = 'translate(' + (x - width / 2) + ',' + (y - height - 20) + ')';
          transformArrow = 'translate(' + (width / 2 - 20) + ',' + (height - 1) + ')';
        } else if (y < height) {
          transform = 'translate(' + (x - width / 2) + ',' + (Math.round(y) + 20) + ')';
          transformArrow = 'translate(' + (width / 2 - 20) + ',' + 0 + ') rotate(180,20,0)';
        }
      } else {
        visibility = "hidden";
      }

      return _react2.default.createElement(
        'g',
        { transform: transform, visibility: visibility },
        _react2.default.createElement('rect', { className: 'shadow', width: width, height: height, rx: '5', ry: '5', fill: '#6391da', opacity: '.9' }),
        _react2.default.createElement('polygon', { className: 'shadow', points: '10,0  30,0  20,10', transform: transformArrow, fill: '#6391da', opacity: '.9' }),
        _react2.default.createElement(
          'text',
          { transform: transformText },
          _react2.default.createElement(
            'tspan',
            { x: '0', textAnchor: 'middle', fontSize: '15px', fill: '#ffffff' },
            this.props.xValue + ' : ' + this.props.tooltip.data.key
          ),
          _react2.default.createElement(
            'tspan',
            { x: '0', textAnchor: 'middle', dy: '25', fontSize: '20px', fill: '#a9f3ff' },
            this.props.yValue + ' : ' + this.props.tooltip.data.value
          )
        )
      );
    }
  }]);

  return ToolTip;
})(_react2.default.Component);

ToolTip.propTypes = {
  tooltip: _react2.default.PropTypes.object,
  bgStyle: _react2.default.PropTypes.string,
  textStyle1: _react2.default.PropTypes.string,
  textStyle2: _react2.default.PropTypes.string,
  xValue: _react2.default.PropTypes.string,
  yValue: _react2.default.PropTypes.string
};

exports.default = ToolTip;

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PAD_VALUES = {
  hours: 1,
  minutes: 2,
  seconds: 2,
  milliseconds: 3
};

var TimeView = function (_Component) {
  _inherits(TimeView, _Component);

  function TimeView(props) {
    _classCallCheck(this, TimeView);

    var _this = _possibleConstructorReturn(this, (TimeView.__proto__ || Object.getPrototypeOf(TimeView)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = _this.calculateState(_this.props);
    return _this;
  }

  _createClass(TimeView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var me = this;
      this.timeConstraints = {
        hours: {
          min: 0,
          max: 23,
          step: 1
        },
        minutes: {
          min: 0,
          max: 59,
          step: 1
        },
        seconds: {
          min: 0,
          max: 59,
          step: 1
        },
        milliseconds: {
          min: 0,
          max: 999,
          step: 1
        }
      };
      ['hours', 'minutes', 'seconds', 'milliseconds'].forEach(function (type) {
        (0, _objectAssign2.default)(me.timeConstraints[type], me.props.timeConstraints[type]);
      });
      this.setState(this.calculateState(this.props));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState(this.calculateState(nextProps));
    }
  }, {
    key: 'render',
    value: function render() {
      var me = this;
      var counters = [];

      this.state.counters.forEach(function (c) {
        if (counters.length) counters.push(_react2.default.createElement('div', {
          key: 'sep' + counters.length,
          className: 'rdtCounterSeparator'
        }, ':'));
        counters.push(me.renderCounter(c));
      });

      if (this.state.daypart !== false) {
        counters.push(me.renderDayPart());
      }

      if (this.state.counters.length === 3 && this.props.timeFormat.indexOf('S') !== -1) {
        counters.push(_react2.default.createElement('div', { className: 'rdtCounterSeparator', key: 'sep5' }, ':'));
        counters.push(_react2.default.createElement('div', { className: 'rdtCounter rdtMilli', key: 'm' }, _react2.default.createElement('input', { value: this.state.milliseconds, type: 'text', onChange: this.updateMilli })));
      }

      return _react2.default.createElement(
        'div',
        { className: 'rdtTime' },
        _react2.default.createElement(
          'div',
          { className: 'rdtCounters' },
          counters
        ),
        _react2.default.createElement(
          'button',
          {
            type: 'button',
            onClick: this.props.closeCalendar,
            className: 'btn btn-primary'
          },
          'Apply'
        )
      );
    }
  }]);

  return TimeView;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.calculateState = function (props) {
    var date = props.selectedDate || props.viewDate,
        format = props.timeFormat,
        counters = [];

    if (format.toLowerCase().indexOf('h') !== -1) {
      counters.push('hours');
      if (format.indexOf('m') !== -1) {
        counters.push('minutes');
        if (format.indexOf('s') !== -1) {
          counters.push('seconds');
        }
      }
    }

    var hours = date.format('H');

    var daypart = false;
    if (_this2.state !== null && _this2.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
      if (_this2.props.timeFormat.indexOf(' A') !== -1) {
        daypart = hours >= 12 ? 'PM' : 'AM';
      } else {
        daypart = hours >= 12 ? 'pm' : 'am';
      }
    }

    return {
      hours: hours,
      minutes: date.format('mm'),
      seconds: date.format('ss'),
      milliseconds: date.format('SSS'),
      daypart: daypart,
      counters: counters
    };
  };

  this.renderCounter = function (type) {
    if (type !== 'daypart') {
      var value = _this2.state[type];

      if (type === 'hours' && _this2.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
        value = (value - 1) % 12 + 1;

        if (value === 0) {
          value = 12;
        }
      }
      return _react2.default.createElement('div', { key: type, className: 'rdtCounter' }, [_react2.default.createElement('span', {
        key: 'up',
        className: 'rdtBtn',
        onTouchStart: _this2.onStartClicking('increase', type),
        onMouseDown: _this2.onStartClicking('increase', type),
        onContextMenu: _this2.disableContextMenu
      }, _react2.default.createElement('i', { className: 'fa fa-angle-up' })), _react2.default.createElement('div', { key: 'c', className: 'rdtCount' }, value), _react2.default.createElement('span', {
        key: 'do',
        className: 'rdtBtn',
        onTouchStart: _this2.onStartClicking('decrease', type),
        onMouseDown: _this2.onStartClicking('decrease', type),
        onContextMenu: _this2.disableContextMenu
      }, _react2.default.createElement('i', { className: 'fa fa-angle-down' }))]);
    }
    return '';
  };

  this.renderDayPart = function () {
    return _react2.default.createElement('div', { key: 'dayPart', className: 'rdtCounter' }, [_react2.default.createElement('span', {
      key: 'up',
      className: 'rdtBtn',
      onTouchStart: _this2.onStartClicking('toggleDayPart', 'hours'),
      onMouseDown: _this2.onStartClicking('toggleDayPart', 'hours'),
      onContextMenu: _this2.disableContextMenu
    }, _react2.default.createElement('i', { className: 'fa fa-angle-up' })), _react2.default.createElement('div', { key: _this2.state.daypart, className: 'rdtCount' }, _this2.state.daypart), _react2.default.createElement('span', {
      key: 'do',
      className: 'rdtBtn',
      onTouchStart: _this2.onStartClicking('toggleDayPart', 'hours'),
      onMouseDown: _this2.onStartClicking('toggleDayPart', 'hours'),
      onContextMenu: _this2.disableContextMenu
    }, _react2.default.createElement('i', { className: 'fa fa-angle-down' }))]);
  };

  this.updateMilli = function (e) {
    var milli = parseInt(e.target.value, 10);

    if (milli === e.target.value && milli >= 0 && milli < 1000) {
      _this2.props.setTime('milliseconds', milli);
      _this2.setState({ milliseconds: milli });
    }
  };

  this.onStartClicking = function (action, type) {
    var me = _this2;

    return function () {
      var update = {};
      update[type] = me[action](type);
      me.setState(update);

      me.timer = setTimeout(function () {
        me.increaseTimer = setInterval(function () {
          update[type] = me[action](type);
          me.setState(update);
        }, 70);
      }, 500);

      me.mouseUpListener = function () {
        clearTimeout(me.timer);
        clearInterval(me.increaseTimer);
        me.props.setTime(type, me.state[type]);
        document.body.removeEventListener('mouseup', me.mouseUpListener);
        document.body.removeEventListener('touchend', me.mouseUpListener);
      };

      document.body.addEventListener('mouseup', me.mouseUpListener);
      document.body.addEventListener('touchend', me.mouseUpListener);
    };
  };

  this.disableContextMenu = function (event) {
    event.preventDefault();
    return false;
  };

  this.toggleDayPart = function (type) {
    // type is always 'hours'
    var value = parseInt(_this2.state[type], 10) + 12;

    if (value > _this2.timeConstraints[type].max) {
      value = _this2.timeConstraints[type].min + (value - (_this2.timeConstraints[type].max + 1));
    }

    return _this2.pad(type, value);
  };

  this.increase = function (type) {
    var value = parseInt(_this2.state[type], 10) + _this2.timeConstraints[type].step;

    if (value > _this2.timeConstraints[type].max) {
      value = _this2.timeConstraints[type].min + (value - (_this2.timeConstraints[type].max + 1));
    }

    return _this2.pad(type, value);
  };

  this.decrease = function (type) {
    var value = parseInt(_this2.state[type], 10) - _this2.timeConstraints[type].step;

    if (value < _this2.timeConstraints[type].min) {
      value = _this2.timeConstraints[type].max + 1 - (_this2.timeConstraints[type].min - value);
    }

    return _this2.pad(type, value);
  };

  this.pad = function (type, value) {
    var str = value + '';

    while (str.length < PAD_VALUES[type]) {
      str = '0' + str;
    }

    return str;
  };

  this.handleClickOutside = function () {
    _this2.props.handleClickOutside();
  };
};

exports.default = TimeView;
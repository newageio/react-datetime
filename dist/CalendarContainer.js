'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MonthsView = require('./MonthsView');

var _MonthsView2 = _interopRequireDefault(_MonthsView);

var _YearsView = require('./YearsView');

var _YearsView2 = _interopRequireDefault(_YearsView);

var _DaysView = require('./DaysView');

var _DaysView2 = _interopRequireDefault(_DaysView);

var _TimeView = require('./TimeView');

var _TimeView2 = _interopRequireDefault(_TimeView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CalendarContainer = function (_Component) {
  _inherits(CalendarContainer, _Component);

  function CalendarContainer() {
    _classCallCheck(this, CalendarContainer);

    return _possibleConstructorReturn(this, (CalendarContainer.__proto__ || Object.getPrototypeOf(CalendarContainer)).apply(this, arguments));
  }

  _createClass(CalendarContainer, [{
    key: 'render',
    value: function render() {
      switch (this.props.view) {
        case 'days':
          return _react2.default.createElement(
            _react.Fragment,
            null,
            _react2.default.createElement(_DaysView2.default, this.props.viewProps),
            this.props.viewProps.withTime && _react2.default.createElement(_TimeView2.default, this.props.viewProps)
          );
        case 'months':
          return _react2.default.createElement(_MonthsView2.default, this.props.viewProps);
        case 'years':
          return _react2.default.createElement(_YearsView2.default, this.props.viewProps);
        default:
          return null;
      }
    }
  }]);

  return CalendarContainer;
}(_react.Component);

exports.default = CalendarContainer;
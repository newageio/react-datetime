'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DaysView = function (_Component) {
  _inherits(DaysView, _Component);

  function DaysView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DaysView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DaysView.__proto__ || Object.getPrototypeOf(DaysView)).call.apply(_ref, [this].concat(args))), _this), _this.getDaysOfWeek = function (locale) {
      var days = locale._weekdaysMin;
      var first = locale.firstDayOfWeek();
      var dow = [];
      var i = 0;

      days.forEach(function (day) {
        dow[(7 + i++ - first) % 7] = day;
      });

      return dow;
    }, _this.renderDays = function () {
      var date = _this.props.viewDate;

      var selected = _this.props.selectedDate && _this.props.selectedDate.clone(),
          prevMonth = date.clone().subtract(1, 'months'),
          currentYear = date.year(),
          currentMonth = date.month(),
          weeks = [],
          days = [],
          renderer = _this.props.renderDay || _this.renderDay,
          isValid = _this.props.isValidDate || _this.alwaysValidDate,
          classes = void 0,
          isDisabled = void 0,
          dayProps = void 0,
          currentDate = void 0;

      // Go to the last week of the previous month
      prevMonth.date(prevMonth.daysInMonth()).startOf('week');
      var lastDay = prevMonth.clone().add(42, 'd');

      while (prevMonth.isBefore(lastDay)) {
        classes = 'rdtDay';
        currentDate = prevMonth.clone();

        if (prevMonth.year() === currentYear && prevMonth.month() < currentMonth || prevMonth.year() < currentYear) classes = classes + ' rdtOld';else if (prevMonth.year() === currentYear && prevMonth.month() > currentMonth || prevMonth.year() > currentYear) classes = classes + ' rdtNew';

        if (selected && prevMonth.isSame(selected, 'day')) classes = classes + ' rdtActive';

        if (prevMonth.isSame((0, _moment2.default)(), 'day')) classes = classes + ' rdtToday';

        isDisabled = !isValid(currentDate, selected);
        if (isDisabled) {
          classes = classes + ' rdtDisabled';
        }

        dayProps = {
          key: prevMonth.format('M_D'),
          'data-value': prevMonth.date(),
          className: classes
        };

        if (!isDisabled) {
          dayProps.onClick = _this.updateSelectedDate;
        }

        days.push(renderer(dayProps, currentDate, selected));

        if (days.length === 7) {
          weeks.push(_react2.default.createElement('tr', { key: prevMonth.format('M_D') }, days));
          days = [];
        }

        prevMonth.add(1, 'd');
      }

      return weeks;
    }, _this.updateSelectedDate = function (event) {
      return _this.props.updateSelectedDate(event, true);
    }, _this.renderDay = function (props, currentDate) {
      return _react2.default.createElement('td', props, currentDate.date());
    }, _this.alwaysValidDate = function () {
      return 1;
    }, _this.handleClickOutside = function () {
      return _this.props.handleClickOutside();
    }, _this.handleSetTime = function (value) {
      return function () {
        _this.props.setTime(['hours', 'minutes'], [value, 0]);
      };
    }, _this.renderTimePresets = function () {
      var isValid = _this.props.isValidDate || _this.alwaysValidDate;
      var selected = _this.props.selectedDate && _this.props.selectedDate.clone();

      if (!_this.props.timePresets) {
        return null;
      }

      var currentHour = false;

      if (selected instanceof _moment2.default) {
        currentHour = selected ? selected.get('hour') : null;
      }

      return _react2.default.createElement(
        'div',
        { className: 'rdtTimes' },
        _react2.default.createElement(
          'div',
          { className: 'rdtTimes__title' },
          'Time Picker'
        ),
        _react2.default.createElement(
          'ul',
          null,
          [].concat(_toConsumableArray(Array(24).keys())).map(function (hour) {
            var time = selected && selected.clone().set({ hour: hour, minute: 0, second: 0 });
            var props = {
              className: ''
            };

            if (currentHour && currentHour === hour && selected.get('minute') === 0) {
              props.className = 'active';
            }

            var isDisabled = time ? !isValid(time, selected) : false;
            if (isDisabled) {
              props.className = props.className + ' rdtDisabled';
            } else {
              props.onClick = _this.handleSetTime(hour);
            }

            return _react2.default.createElement(
              'li',
              _extends({}, props, { key: hour }),
              hour + ':00'
            );
          })
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DaysView, [{
    key: 'render',
    value: function render() {
      var date = this.props.viewDate;
      var locale = date.localeData();

      var tableChildren = [_react2.default.createElement(
        'thead',
        { key: 'th' },
        _react2.default.createElement(
          'tr',
          { key: 'h' },
          _react2.default.createElement(
            'th',
            { key: 'p', className: 'rdtPrev', onClick: this.props.subtractTime(1, 'months') },
            _react2.default.createElement('i', { className: 'fa fa-angle-left' })
          ),
          _react2.default.createElement(
            'th',
            {
              key: 's',
              className: 'rdtSwitch',
              onClick: this.props.showView('months'),
              colSpan: 5,
              'data-value': this.props.viewDate.month()
            },
            locale.months(date) + ' ' + date.year()
          ),
          _react2.default.createElement(
            'th',
            {
              key: 'n',
              className: 'rdtNext',
              onClick: this.props.addTime(1, 'months')
            },
            _react2.default.createElement('i', { className: 'fa fa-angle-right' })
          )
        ),
        _react2.default.createElement(
          'tr',
          { key: 'd' },
          this.getDaysOfWeek(locale).map(function (day) {
            return _react2.default.createElement(
              'th',
              { key: day, className: 'dow' },
              day
            );
          })
        )
      ), _react2.default.createElement(
        'tbody',
        { key: 'tb' },
        this.renderDays()
      )];

      return _react2.default.createElement(
        'div',
        { className: 'dayTimeContainer' },
        _react2.default.createElement(
          'div',
          { className: 'rdtDays' },
          _react2.default.createElement(
            'table',
            null,
            tableChildren
          )
        ),
        this.renderTimePresets()
      );
    }
  }]);

  return DaysView;
}(_react.Component);

exports.default = DaysView;
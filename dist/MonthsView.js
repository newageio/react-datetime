'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var MonthsView = function (_Component) {
  _inherits(MonthsView, _Component);

  function MonthsView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MonthsView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MonthsView.__proto__ || Object.getPrototypeOf(MonthsView)).call.apply(_ref, [this].concat(args))), _this), _this.renderMonths = function () {
      var date = _this.props.selectedDate,
          month = _this.props.viewDate.month(),
          year = _this.props.viewDate.year(),
          rows = [],
          i = 0,
          months = [],
          renderer = _this.props.renderMonth || _this.renderMonth,
          isValid = _this.props.isValidDate || _this.alwaysValidDate,
          classes,
          props,
          currentMonth,
          isDisabled,
          noOfDaysInMonth,
          daysInMonth,
          validDay,

      // Date is irrelevant because we're only interested in month
      irrelevantDate = 1;

      while (i < 12) {
        classes = 'rdtMonth';
        currentMonth = _this.props.viewDate.clone().set({ year: year, month: i, date: irrelevantDate });

        noOfDaysInMonth = currentMonth.endOf('month').format('D');
        daysInMonth = Array.from({ length: noOfDaysInMonth }, function (e, i) {
          return i + 1;
        });

        validDay = daysInMonth.find(function (d) {
          var day = currentMonth.clone().set('date', d);
          return isValid(day);
        });

        isDisabled = validDay === undefined;

        if (isDisabled) classes += ' rdtDisabled';

        if (date && i === date.month() && year === date.year()) classes += ' rdtActive';

        props = {
          key: i,
          'data-value': i,
          className: classes
        };

        if (!isDisabled) props.onClick = _this.props.updateOn === 'months' ? _this.updateSelectedMonth : _this.props.setDate('month');

        months.push(renderer(props, i, year, date && date.clone()));

        if (months.length === 4) {
          rows.push(_react2.default.createElement('tr', { key: month + '_' + rows.length }, months));
          months = [];
        }

        i++;
      }

      return rows;
    }, _this.updateSelectedMonth = function (event) {
      _this.props.updateSelectedDate(event);
    }, _this.renderMonth = function (props, month) {
      var localMoment = _this.props.viewDate;
      var monthStr = localMoment.localeData().monthsShort(localMoment.month(month));
      var strLength = 3;
      // Because some months are up to 5 characters long, we want to
      // use a fixed string length for consistency
      var monthStrFixedLength = monthStr.substring(0, strLength);

      return _react2.default.createElement(
        'td',
        props,
        capitalize(monthStrFixedLength)
      );
    }, _this.alwaysValidDate = function () {
      return 1;
    }, _this.handleClickOutside = function () {
      return _this.props.handleClickOutside();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MonthsView, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'rdtMonths' },
        _react2.default.createElement(
          'table',
          null,
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'th',
                { className: 'rdtPrev', onClick: this.props.subtractTime(1, 'years') },
                _react2.default.createElement('i', { className: 'fa fa-angle-left' })
              ),
              _react2.default.createElement(
                'th',
                {
                  className: 'rdtSwitch',
                  onClick: this.props.showView('years'),
                  'data-value': this.props.viewDate.year()
                },
                this.props.viewDate.year()
              ),
              _react2.default.createElement(
                'th',
                { className: 'rdtNext', onClick: this.props.addTime(1, 'years') },
                _react2.default.createElement('i', { className: 'fa fa-angle-right' })
              )
            )
          )
        ),
        _react2.default.createElement(
          'table',
          null,
          _react2.default.createElement(
            'tbody',
            null,
            this.renderMonths()
          )
        )
      );
    }
  }]);

  return MonthsView;
}(_react.Component);

exports.default = MonthsView;
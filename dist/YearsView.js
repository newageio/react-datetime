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

var YearsView = function (_Component) {
  _inherits(YearsView, _Component);

  function YearsView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, YearsView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = YearsView.__proto__ || Object.getPrototypeOf(YearsView)).call.apply(_ref, [this].concat(args))), _this), _this.renderYears = function (year) {
      var years = [],
          i = -1,
          rows = [],
          renderer = _this.props.renderYear || _this.renderYear,
          selectedDate = _this.props.selectedDate,
          isValid = _this.props.isValidDate || _this.alwaysValidDate,
          classes,
          props,
          currentYear,
          isDisabled,
          noOfDaysInYear,
          daysInYear,
          validDay,

      // Month and date are irrelevant here because
      // we're only interested in the year
      irrelevantMonth = 0,
          irrelevantDate = 1;

      year--;
      while (i < 11) {
        classes = 'rdtYear';
        currentYear = _this.props.viewDate.clone().set({ year: year, month: irrelevantMonth, date: irrelevantDate });

        // Not sure what 'rdtOld' is for, commenting out for now as it's not working properly
        // if ( i === -1 | i === 10 )
        // classes += ' rdtOld';

        noOfDaysInYear = currentYear.endOf('year').format('DDD');
        daysInYear = Array.from({ length: noOfDaysInYear }, function (e, i) {
          return i + 1;
        });

        validDay = daysInYear.find(function (d) {
          var day = currentYear.clone().dayOfYear(d);
          return isValid(day);
        });

        isDisabled = validDay === undefined;

        if (isDisabled) classes += ' rdtDisabled';

        if (selectedDate && selectedDate.year() === year) classes += ' rdtActive';

        props = {
          key: year,
          'data-value': year,
          className: classes
        };

        if (!isDisabled) props.onClick = _this.props.updateOn === 'years' ? _this.updateSelectedYear : _this.props.setDate('year');

        years.push(renderer(props, year, selectedDate && selectedDate.clone()));

        if (years.length === 4) {
          rows.push(_react2.default.createElement('tr', { key: i }, years));
          years = [];
        }

        year++;
        i++;
      }

      return rows;
    }, _this.updateSelectedYear = function (event) {
      return _this.props.updateSelectedDate(event);
    }, _this.renderYear = function (props, year) {
      return _react2.default.createElement('td', props, year);
    }, _this.alwaysValidDate = function () {
      return 1;
    }, _this.handleClickOutside = function () {
      _this.props.handleClickOutside();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(YearsView, [{
    key: 'render',
    value: function render() {
      var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

      return _react2.default.createElement(
        'div',
        { className: 'rdtYears' },
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
                { className: 'rdtPrev', onClick: this.props.subtractTime(10, 'years') },
                _react2.default.createElement('i', { className: 'fa fa-angle-left' })
              ),
              _react2.default.createElement(
                'th',
                { className: 'rdtSwitch', onClick: this.props.showView('years') },
                year + '-' + (year + 9)
              ),
              _react2.default.createElement(
                'th',
                { className: 'rdtNext', onClick: this.props.addTime(10, 'years') },
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
            this.renderYears(year)
          )
        )
      );
    }
  }]);

  return YearsView;
}(_react.Component);

exports.default = YearsView;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _CalendarContainer = require('./CalendarContainer');

var _CalendarContainer2 = _interopRequireDefault(_CalendarContainer);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ALLOWED_SET_TIME = ['hours', 'minutes', 'seconds', 'milliseconds'];

var viewModes = Object.freeze({
  YEARS: 'years',
  MONTHS: 'months',
  DAYS: 'days',
  TIME: 'time'
});

var DateTime = function (_Component) {
  _inherits(DateTime, _Component);

  function DateTime(props) {
    _classCallCheck(this, DateTime);

    var _this = _possibleConstructorReturn(this, (DateTime.__proto__ || Object.getPrototypeOf(DateTime)).call(this, props));

    _initialiseProps.call(_this);

    var state = _this.getStateFromProps(_this.props);

    if (state.open === undefined) {
      state.open = !_this.props.input;
    }

    state.currentView = _this.props.dateFormat ? _this.props.viewMode || state.updateOn || viewModes.DAYS : viewModes.TIME;

    _this.state = state;
    return _this;
  }

  _createClass(DateTime, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var formats = this.getFormats(nextProps);
      var updatedState = {};

      if (nextProps.value !== this.props.value || formats.datetime !== this.getFormats(this.props).datetime) {
        updatedState = this.getStateFromProps(nextProps);
      }

      if (updatedState.open === undefined) {
        if (typeof nextProps.open !== 'undefined') {
          updatedState.open = nextProps.open;
        } else if (this.props.closeOnSelect && this.state.currentView !== viewModes.TIME) {
          updatedState.open = false;
        } else {
          updatedState.open = this.state.open;
        }
      }

      if (nextProps.viewMode !== this.props.viewMode) {
        updatedState.currentView = nextProps.viewMode;
      }

      if (nextProps.locale !== this.props.locale) {
        if (this.state.viewDate) {
          updatedState.viewDate = this.state.viewDate.clone().locale(nextProps.locale);
        }
        if (this.state.selectedDate) {
          var updatedSelectedDate = this.state.selectedDate.clone().locale(nextProps.locale);
          updatedState.selectedDate = updatedSelectedDate;
          updatedState.inputValue = updatedSelectedDate.format(formats.datetime);
        }
      }

      if (nextProps.utc !== this.props.utc) {
        if (nextProps.utc) {
          if (this.state.viewDate) updatedState.viewDate = this.state.viewDate.clone().utc();
          if (this.state.selectedDate) {
            updatedState.selectedDate = this.state.selectedDate.clone().utc();
            updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
          }
        } else {
          if (this.state.viewDate) updatedState.viewDate = this.state.viewDate.clone().local();
          if (this.state.selectedDate) {
            updatedState.selectedDate = this.state.selectedDate.clone().local();
            updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
          }
        }
      }

      if (nextProps.viewDate !== this.props.viewDate) {
        updatedState.viewDate = (0, _moment2.default)(nextProps.viewDate);
      }

      this.setState(updatedState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          input = _props.input,
          inputProps = _props.inputProps,
          renderInput = _props.renderInput,
          timePresets = _props.timePresets,
          withTime = _props.withTime;
      var _state = this.state,
          inputValue = _state.inputValue,
          open = _state.open,
          currentView = _state.currentView;


      var className = 'rdt' + (this.props.className ? Array.isArray(this.props.className) ? ' ' + this.props.className.join(' ') : ' ' + this.props.className : ''),
          children = [];

      if (input) {
        var finalInputProps = (0, _objectAssign2.default)({
          type: 'text',
          className: 'form-control',
          onClick: this.openCalendar,
          onFocus: this.openCalendar,
          onChange: this.onInputChange,
          onKeyDown: this.onInputKey,
          value: inputValue
        }, inputProps);
        if (renderInput) {
          children = [_react2.default.createElement('div', { key: 'i' }, this.props.renderInput(finalInputProps, this.openCalendar, this.closeCalendar))];
        } else {
          children = [_react2.default.createElement('input', (0, _objectAssign2.default)({ key: 'i' }, finalInputProps))];
        }
      } else {
        className = className + ' rdtStatic';
      }

      if (open) {
        className = className + ' rdtOpen';
      }

      return _react2.default.createElement(
        'div',
        { className: className },
        children.concat(_react2.default.createElement(
          'div',
          {
            key: 'dt',
            className: (0, _classnames2.default)('rdtPicker', {
              rdtDays_with_presets: timePresets && currentView === 'days',
              rdtDays_with_times: withTime,
              month_or_year: currentView === 'months' || currentView === 'years'
            })
          },
          _react2.default.createElement(_CalendarContainer2.default, {
            view: currentView,
            viewProps: this.getComponentProps(),
            onClickOutside: this.handleClickOutside
          })
        ))
      );
    }
  }]);

  return DateTime;
}(_react.Component);

DateTime.propTypes = {
  onFocus: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onViewModeChange: _propTypes2.default.func,
  locale: _propTypes2.default.string,
  utc: _propTypes2.default.bool,
  input: _propTypes2.default.bool,
  inputProps: _propTypes2.default.object,
  timeConstraints: _propTypes2.default.object,
  viewMode: _propTypes2.default.oneOf([viewModes.YEARS, viewModes.MONTHS, viewModes.DAYS, viewModes.TIME]),
  isValidDate: _propTypes2.default.func,
  open: _propTypes2.default.bool,
  strictParsing: _propTypes2.default.bool,
  closeOnSelect: _propTypes2.default.bool,
  closeOnTab: _propTypes2.default.bool,
  timePresets: _propTypes2.default.bool,
  withTime: _propTypes2.default.bool,
  onNavigateBack: _propTypes2.default.func,
  onNavigateForward: _propTypes2.default.func,
  enableOnClickOutside: _propTypes2.default.func,
  disableOnClickOutside: _propTypes2.default.func
};
DateTime.defaultProps = {
  className: '',
  defaultValue: '',
  inputProps: {},
  input: true,
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onChange: function onChange() {},
  onViewModeChange: function onViewModeChange() {},
  onNavigateBack: function onNavigateBack() {},
  onNavigateForward: function onNavigateForward() {},
  timeFormat: true,
  timeConstraints: {},
  dateFormat: true,
  strictParsing: true,
  closeOnSelect: false,
  closeOnTab: true,
  utc: false,
  timePresets: false,
  withTime: false,
  enableOnClickOutside: null,
  disableOnClickOutside: null,
  onClickOutsideDisabled: false
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.parseDate = function (date, formats) {
    var parsedDate = void 0;

    if (date && typeof date === 'string') parsedDate = _this2.localMoment(date, formats.datetime);else if (date) parsedDate = _this2.localMoment(date);

    if (parsedDate && !parsedDate.isValid()) parsedDate = null;

    return parsedDate;
  };

  this.getStateFromProps = function (props) {
    var formats = _this2.getFormats(props);
    var date = props.value || props.defaultValue;
    var selectedDate = void 0,
        viewDate = void 0,
        updateOn = void 0,
        inputValue = void 0;

    selectedDate = _this2.parseDate(date, formats);

    viewDate = _this2.parseDate(props.viewDate, formats);

    viewDate = selectedDate ? selectedDate.clone().startOf('month') : viewDate ? viewDate.clone().startOf('month') : _this2.localMoment().startOf('month');

    updateOn = _this2.getUpdateOn(formats);

    if (selectedDate) {
      inputValue = selectedDate.format(formats.datetime);
    } else if (date.isValid && !date.isValid()) {
      inputValue = '';
    } else {
      inputValue = date || '';
    }

    return {
      updateOn: updateOn,
      inputFormat: formats.datetime,
      viewDate: viewDate,
      selectedDate: selectedDate,
      inputValue: inputValue,
      open: props.open
    };
  };

  this.localMoment = function (date, format, props) {
    props = props || _this2.props;
    var momentFn = props.utc ? _moment2.default.utc : _moment2.default;
    var m = momentFn(date, format, props.strictParsing);
    if (props.locale) {
      m.locale(props.locale);
    }
    return m;
  };

  this.getFormats = function (props) {
    var formats = {
      date: props.dateFormat || '',
      time: props.timeFormat || ''
    };
    var locale = _this2.localMoment(props.date, null, props).localeData();

    if (formats.date === true) {
      formats.date = locale.longDateFormat('L');
    } else if (_this2.getUpdateOn(formats) !== viewModes.DAYS) {
      formats.time = '';
    }

    if (formats.time === true) {
      formats.time = locale.longDateFormat('LT');
    }

    formats.datetime = formats.date && formats.time ? formats.date + ' ' + formats.time : formats.date || formats.time;

    return formats;
  };

  this.getUpdateOn = function (formats) {
    if (formats.date.match(/[lLD]/)) {
      return viewModes.DAYS;
    } else if (formats.date.indexOf('M') !== -1) {
      return viewModes.MONTHS;
    } else if (formats.date.indexOf('Y') !== -1) {
      return viewModes.YEARS;
    }

    return viewModes.DAYS;
  };

  this.onInputChange = function (e) {
    var value = e.target === null ? e : e.target.value;
    var localMoment = _this2.localMoment(value, _this2.state.inputFormat);
    var update = { inputValue: value };

    if (localMoment.isValid() && !_this2.props.value) {
      update.selectedDate = localMoment;
      update.viewDate = localMoment.clone().startOf('month');
    } else {
      update.selectedDate = null;
    }

    _this2.setState(update, function () {
      _this2.props.onChange(localMoment.isValid() ? localMoment : _this2.state.inputValue);
    });
  };

  this.onInputKey = function (e) {
    if (e.which === 9 && _this2.props.closeOnTab) {
      _this2.closeCalendar();
    }
  };

  this.showView = function (view) {
    return function () {
      _this2.state.currentView !== view && _this2.props.onViewModeChange(view);
      _this2.setState({ currentView: view });
    };
  };

  this.setDate = function (type) {
    return function (e) {
      var nextViews = {
        month: viewModes.DAYS,
        year: viewModes.MONTHS
      };

      _this2.setState({
        viewDate: _this2.state.viewDate.clone()[type](parseInt(e.target.getAttribute('data-value'), 10)).startOf(type),
        currentView: nextViews[type]
      });
      _this2.props.onViewModeChange(nextViews[type]);
    };
  };

  this.subtractTime = function (amount, type, toSelected) {
    var me = _this2;

    return function () {
      me.props.onNavigateBack(amount, type);
      me.updateTime('subtract', amount, type, toSelected);
    };
  };

  this.addTime = function (amount, type, toSelected) {
    var me = _this2;

    return function () {
      me.props.onNavigateForward(amount, type);
      me.updateTime('add', amount, type, toSelected);
    };
  };

  this.updateTime = function (op, amount, type, toSelected) {
    var update = {};
    var date = toSelected ? 'selectedDate' : 'viewDate';

    update[date] = _this2.state[date].clone()[op](amount, type);

    _this2.setState(update);
  };

  this.setTime = function (type, value) {
    var _state2 = _this2.state,
        selectedDate = _state2.selectedDate,
        viewDate = _state2.viewDate,
        inputFormat = _state2.inputFormat;

    var date = (selectedDate || viewDate).clone();
    var timeSetter = function timeSetter(type, value) {
      var nextType = null;
      var index = ALLOWED_SET_TIME.indexOf(type) + 1;

      // It is needed to set all the time properties
      // to not to reset the time
      date[type](value);
      for (; index < ALLOWED_SET_TIME.length; index++) {
        nextType = ALLOWED_SET_TIME[index];
        date[nextType](date[nextType]());
      }
    };
    if (Array.isArray(type) && Array.isArray(value)) {
      type.forEach(function (typeItem, index) {
        return timeSetter(typeItem, value[index]);
      });
    } else {
      timeSetter(type, value);
    }

    if (!_this2.props.value) {
      _this2.setState({
        selectedDate: date,
        inputValue: date.format(inputFormat)
      });
    }
    _this2.props.onChange(date);
  };

  this.updateSelectedDate = function (e, close) {
    var target = e.target;
    var viewDate = _this2.state.viewDate;
    var currentDate = _this2.state.selectedDate || viewDate;
    var date = null;
    var modifier = 0;

    if (target.className.indexOf('rdtDay') !== -1) {
      if (target.className.indexOf('rdtNew') !== -1) modifier = 1;else if (target.className.indexOf('rdtOld') !== -1) modifier = -1;

      date = viewDate.clone().month(viewDate.month() + modifier).date(parseInt(target.getAttribute('data-value'), 10));
    } else if (target.className.indexOf('rdtMonth') !== -1) {
      date = viewDate.clone().month(parseInt(target.getAttribute('data-value'), 10)).date(currentDate.date());
    } else if (target.className.indexOf('rdtYear') !== -1) {
      date = viewDate.clone().month(currentDate.month()).date(currentDate.date()).year(parseInt(target.getAttribute('data-value'), 10));
    }

    date.hours(currentDate.hours()).minutes(currentDate.minutes()).seconds(currentDate.seconds()).milliseconds(currentDate.milliseconds());

    if (!_this2.props.value) {
      var open = !(_this2.props.closeOnSelect && close);
      if (!open) {
        _this2.props.onBlur(date);
      }

      _this2.setState({
        selectedDate: date,
        viewDate: date.clone().startOf('month'),
        inputValue: date.format(_this2.state.inputFormat),
        open: open
      });
    } else {
      if (_this2.props.closeOnSelect && close) {
        _this2.closeCalendar();
      }
    }

    _this2.props.onChange(date);
  };

  this.openCalendar = function (e) {
    if (!_this2.state.open) {
      _this2.setState({ open: true }, function () {
        if (this.props.onClickOutsideDisabled && typeof this.props.enableOnClickOutside === 'function') {
          this.props.enableOnClickOutside();
        }

        this.props.onFocus(e);
      });
    }
  };

  this.closeCalendar = function () {
    _this2.setState({ open: false }, function () {
      if (!this.props.onClickOutsideDisabled && typeof this.props.disableOnClickOutside === 'function') {
        this.props.disableOnClickOutside();
      }

      this.props.onBlur(this.state.selectedDate || this.state.inputValue);
    });
  };

  this.handleClickOutside = function () {
    if (_this2.props.input && _this2.state.open && !_this2.props.open && !_this2.props.onClickOutsideDisabled) {
      _this2.setState({ open: false }, function () {
        this.props.onBlur(this.state.selectedDate || this.state.inputValue);
      });
    }
  };

  this.componentProps = {
    fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
    fromState: ['viewDate', 'selectedDate', 'updateOn'],
    fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'handleClickOutside']
  };

  this.getComponentProps = function () {
    var me = _this2;
    var props = _this2.props;
    var state = _this2.state;

    var formats = _this2.getFormats(_this2.props);
    var resultProps = {
      dateFormat: formats.date,
      timeFormat: formats.time,
      timePresets: props.timePresets,
      withTime: props.withTime,
      closeCalendar: _this2.closeCalendar
    };

    _this2.componentProps.fromProps.forEach(function (name) {
      resultProps[name] = props[name];
    });
    _this2.componentProps.fromState.forEach(function (name) {
      resultProps[name] = state[name];
    });
    _this2.componentProps.fromThis.forEach(function (name) {
      resultProps[name] = me[name];
    });

    return resultProps;
  };
};

exports.default = (0, _reactOnclickoutside2.default)(DateTime);
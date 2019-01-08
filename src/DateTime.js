import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import moment from 'moment';
import assign from 'object-assign';
import CalendarContainer from './CalendarContainer';
import classNames from 'classnames';

const ALLOWED_SET_TIME = ['hours', 'minutes', 'seconds', 'milliseconds'];

const viewModes = Object.freeze({
  YEARS: 'years',
  MONTHS: 'months',
  DAYS: 'days',
  TIME: 'time',
});

class DateTime extends Component {
  static propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onViewModeChange: PropTypes.func,
    locale: PropTypes.string,
    utc: PropTypes.bool,
    input: PropTypes.bool,
    inputProps: PropTypes.object,
    timeConstraints: PropTypes.object,
    viewMode: PropTypes.oneOf([viewModes.YEARS, viewModes.MONTHS, viewModes.DAYS, viewModes.TIME]),
    isValidDate: PropTypes.func,
    open: PropTypes.bool,
    strictParsing: PropTypes.bool,
    closeOnSelect: PropTypes.bool,
    closeOnTab: PropTypes.bool,
    timePresets: PropTypes.bool,
    withTime: PropTypes.bool,
    onNavigateBack: PropTypes.func,
    onNavigateForward: PropTypes.func,
    enableOnClickOutside: PropTypes.func,
    disableOnClickOutside: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    defaultValue: '',
    inputProps: {},
    input: true,
    onFocus: () => {
    },
    onBlur: () => {
    },
    onChange: () => {
    },
    onViewModeChange: () => {
    },
    onNavigateBack: () => {
    },
    onNavigateForward: () => {
    },
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
    onClickOutsideDisabled: false,
  };

  constructor(props) {
    super(props);

    const state = this.getStateFromProps(this.props);

    if (state.open === undefined) {
      state.open = !this.props.input;
    }

    state.currentView = this.props.dateFormat ?
      (this.props.viewMode || state.updateOn || viewModes.DAYS) : viewModes.TIME;

    this.state = state;
  }

  parseDate = (date, formats) => {
    let parsedDate;

    if (date && typeof date === 'string')
      parsedDate = this.localMoment(date, formats.datetime);
    else if (date)
      parsedDate = this.localMoment(date);

    if (parsedDate && !parsedDate.isValid())
      parsedDate = null;

    return parsedDate;
  };

  getStateFromProps = (props) => {
    const formats = this.getFormats(props);
    const date = props.value || props.defaultValue;
    let selectedDate, viewDate, updateOn, inputValue;

    selectedDate = this.parseDate(date, formats);

    viewDate = this.parseDate(props.viewDate, formats);

    viewDate = selectedDate
      ? selectedDate.clone().startOf('month')
      : viewDate ? viewDate.clone().startOf('month') : this.localMoment().startOf('month');

    updateOn = this.getUpdateOn(formats);

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

  localMoment = (date, format, props) => {
    props = props || this.props;
    const momentFn = props.utc ? moment.utc : moment;
    let m = momentFn(date, format, props.strictParsing);
    if (props.locale) {
      m.locale(props.locale);
    }
    return m;
  };

  getFormats = (props) => {
    const formats = {
      date: props.dateFormat || '',
      time: props.timeFormat || ''
    };
    const locale = this.localMoment(props.date, null, props).localeData();

    if (formats.date === true) {
      formats.date = locale.longDateFormat('L');
    } else if (this.getUpdateOn(formats) !== viewModes.DAYS) {
      formats.time = '';
    }

    if (formats.time === true) {
      formats.time = locale.longDateFormat('LT');
    }

    formats.datetime = formats.date && formats.time ? formats.date + ' ' + formats.time : formats.date || formats.time;

    return formats;
  };

  getUpdateOn = (formats) => {
    if (formats.date.match(/[lLD]/)) {
      return viewModes.DAYS;
    } else if (formats.date.indexOf('M') !== -1) {
      return viewModes.MONTHS;
    } else if (formats.date.indexOf('Y') !== -1) {
      return viewModes.YEARS;
    }

    return viewModes.DAYS;
  };

  componentWillReceiveProps(nextProps) {
    const formats = this.getFormats(nextProps);
    let updatedState = {};

    if (nextProps.value !== this.props.value ||
      formats.datetime !== this.getFormats(this.props).datetime) {
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
        const updatedSelectedDate = this.state.selectedDate.clone().locale(nextProps.locale);
        updatedState.selectedDate = updatedSelectedDate;
        updatedState.inputValue = updatedSelectedDate.format(formats.datetime);
      }
    }

    if (nextProps.utc !== this.props.utc) {
      if (nextProps.utc) {
        if (this.state.viewDate)
          updatedState.viewDate = this.state.viewDate.clone().utc();
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().utc();
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
        }
      } else {
        if (this.state.viewDate)
          updatedState.viewDate = this.state.viewDate.clone().local();
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().local();
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
        }
      }
    }

    if (nextProps.viewDate !== this.props.viewDate) {
      updatedState.viewDate = moment(nextProps.viewDate);
    }

    this.setState(updatedState);
  }

  onInputChange = (e) => {
    const value = e.target === null ? e : e.target.value;
    const localMoment = this.localMoment(value, this.state.inputFormat);
    const update = { inputValue: value };

    if (localMoment.isValid() && !this.props.value) {
      update.selectedDate = localMoment;
      update.viewDate = localMoment.clone().startOf('month');
    } else {
      update.selectedDate = null;
    }

    this.setState(update, () => {
      this.props.onChange(localMoment.isValid() ? localMoment : this.state.inputValue);
    });
  };

  onInputKey = (e) => {
    if (e.which === 9 && this.props.closeOnTab) {
      this.closeCalendar();
    }
  };

  showView = (view) => () => {
    this.state.currentView !== view && this.props.onViewModeChange(view);
    this.setState({ currentView: view });
  };

  setDate = (type) => (e) => {
    const nextViews = {
      month: viewModes.DAYS,
      year: viewModes.MONTHS,
    };

    this.setState({
      viewDate: this.state.viewDate.clone()[type](parseInt(e.target.getAttribute('data-value'), 10)).startOf(type),
      currentView: nextViews[type]
    });
    this.props.onViewModeChange(nextViews[type]);
  };

  subtractTime = (amount, type, toSelected) => {
    const me = this;

    return function () {
      me.props.onNavigateBack(amount, type);
      me.updateTime('subtract', amount, type, toSelected);
    };
  };

  addTime = (amount, type, toSelected) => {
    const me = this;

    return function () {
      me.props.onNavigateForward(amount, type);
      me.updateTime('add', amount, type, toSelected);
    };
  };

  updateTime = (op, amount, type, toSelected) => {
    const update = {};
    const date = toSelected ? 'selectedDate' : 'viewDate';

    update[date] = this.state[date].clone()[op](amount, type);

    this.setState(update);
  };

  setTime = (type, value) => {
    const { selectedDate, viewDate, inputFormat } = this.state;
    let date = (selectedDate || viewDate).clone();
    const timeSetter = (type, value) => {
      let nextType = null;
      let index = ALLOWED_SET_TIME.indexOf(type) + 1;

      // It is needed to set all the time properties
      // to not to reset the time
      date[type](value);
      for (; index < ALLOWED_SET_TIME.length; index++) {
        nextType = ALLOWED_SET_TIME[index];
        date[nextType](date[nextType]());
      }
    }
    if (Array.isArray(type) && Array.isArray(value)) {
      type.forEach((typeItem, index) => timeSetter(typeItem, value[index]));
    } else {
      timeSetter(type, value);
    }

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date.format(inputFormat)
      });
    }
    this.props.onChange(date);
  };

  updateSelectedDate = (e, close) => {
    const target = e.target;
    const viewDate = this.state.viewDate;
    const currentDate = this.state.selectedDate || viewDate;
    let date = null;
    let modifier = 0;

    if (target.className.indexOf('rdtDay') !== -1) {
      if (target.className.indexOf('rdtNew') !== -1)
        modifier = 1;
      else if (target.className.indexOf('rdtOld') !== -1)
        modifier = -1;

      date = viewDate.clone()
        .month(viewDate.month() + modifier)
        .date(parseInt(target.getAttribute('data-value'), 10));
    } else if (target.className.indexOf('rdtMonth') !== -1) {
      date = viewDate.clone()
        .month(parseInt(target.getAttribute('data-value'), 10))
        .date(currentDate.date());
    } else if (target.className.indexOf('rdtYear') !== -1) {
      date = viewDate.clone()
        .month(currentDate.month())
        .date(currentDate.date())
        .year(parseInt(target.getAttribute('data-value'), 10));
    }

    date.hours(currentDate.hours())
      .minutes(currentDate.minutes())
      .seconds(currentDate.seconds())
      .milliseconds(currentDate.milliseconds());

    if (!this.props.value) {
      const open = !(this.props.closeOnSelect && close);
      if (!open) {
        this.props.onBlur(date);
      }

      this.setState({
        selectedDate: date,
        viewDate: date.clone().startOf('month'),
        inputValue: date.format(this.state.inputFormat),
        open,
      });
    } else {
      if (this.props.closeOnSelect && close) {
        this.closeCalendar();
      }
    }

    this.props.onChange(date);
  };

  openCalendar = (e) => {
    if (!this.state.open) {
      this.setState({ open: true }, function () {
        if (this.props.onClickOutsideDisabled && typeof this.props.enableOnClickOutside === 'function') {
          this.props.enableOnClickOutside();
        }

        this.props.onFocus(e);
      });
    }
  };

  closeCalendar = () => {
    this.setState({ open: false }, function () {
      if (!this.props.onClickOutsideDisabled && typeof this.props.disableOnClickOutside === 'function') {
        this.props.disableOnClickOutside();
      }

      this.props.onBlur(this.state.selectedDate || this.state.inputValue);
    });
  };

  handleClickOutside = () => {
    if (this.props.input && this.state.open && !this.props.open && !this.props.onClickOutsideDisabled) {
      this.setState({ open: false }, function () {
        this.props.onBlur(this.state.selectedDate || this.state.inputValue);
      });
    }
  };

  componentProps = {
    fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
    fromState: ['viewDate', 'selectedDate', 'updateOn'],
    fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'handleClickOutside']
  };

  getComponentProps = () => {
    const me = this;
    const props = this.props;
    const state = this.state;

    const formats = this.getFormats(this.props);
    let resultProps = {
      dateFormat: formats.date,
      timeFormat: formats.time,
      timePresets: props.timePresets,
      withTime: props.withTime,
      closeCalendar: this.closeCalendar,
    };

    this.componentProps.fromProps.forEach(function (name) {
      resultProps[name] = props[name];
    });
    this.componentProps.fromState.forEach(function (name) {
      resultProps[name] = state[name];
    });
    this.componentProps.fromThis.forEach(function (name) {
      resultProps[name] = me[name];
    });

    return resultProps;
  };

  render() {
    const { input, inputProps, renderInput, timePresets, withTime } = this.props;
    const { inputValue, open, currentView } = this.state;

    let className = 'rdt' + (this.props.className ? (Array.isArray(this.props.className) ? ' ' + this.props.className.join(' ') : ' ' + this.props.className) : ''),
      children = [];

    if (input) {
      const finalInputProps = assign({
        type: 'text',
        className: 'form-control',
        onClick: this.openCalendar,
        onFocus: this.openCalendar,
        onChange: this.onInputChange,
        onKeyDown: this.onInputKey,
        value: inputValue,
      }, inputProps);
      if (renderInput) {
        children = [React.createElement('div', { key: 'i' }, this.props.renderInput(finalInputProps, this.openCalendar, this.closeCalendar))];
      } else {
        children = [React.createElement('input', assign({ key: 'i' }, finalInputProps))];
      }
    } else {
      className = `${className} rdtStatic`;
    }

    if (open) {
      className = `${className} rdtOpen`;
    }

    return (
      <div className={className}>
        {
          children.concat(
            <div
              key="dt"
              className={classNames('rdtPicker', {
                rdtDays_with_presets: timePresets && currentView === 'days',
                rdtDays_with_times: withTime,
                month_or_year: currentView === 'months' || currentView === 'years'
              })}
            >
              <CalendarContainer
                view={currentView}
                viewProps={this.getComponentProps()}
                onClickOutside={this.handleClickOutside}
              />
            </div>
          )
        }
      </div>
    );
  }
}

export default onClickOutside(DateTime);

import React, { Component } from 'react';
import moment from 'moment';

class DaysView extends Component {
  getDaysOfWeek = (locale) => {
    const days = locale._weekdaysMin;
    const first = locale.firstDayOfWeek();
    let dow = [];
    let i = 0;

    days.forEach(function (day) {
      dow[(7 + (i++) - first) % 7] = day;
    });

    return dow;
  };

  renderDays = () => {
    const date = this.props.viewDate;

    let selected = this.props.selectedDate && this.props.selectedDate.clone(),
      prevMonth = date.clone().subtract(1, 'months'),
      currentYear = date.year(),
      currentMonth = date.month(),
      weeks = [],
      days = [],
      renderer = this.props.renderDay || this.renderDay,
      isValid = this.props.isValidDate || this.alwaysValidDate,
      classes, isDisabled, dayProps, currentDate;

    // Go to the last week of the previous month
    prevMonth.date(prevMonth.daysInMonth()).startOf('week');
    const lastDay = prevMonth.clone().add(42, 'd');

    while (prevMonth.isBefore(lastDay)) {
      classes = 'rdtDay';
      currentDate = prevMonth.clone();

      if ((prevMonth.year() === currentYear && prevMonth.month() < currentMonth) || (prevMonth.year() < currentYear))
        classes = `${classes} rdtOld`;
      else if ((prevMonth.year() === currentYear && prevMonth.month() > currentMonth) || (prevMonth.year() > currentYear))
        classes = `${classes} rdtNew`;

      if (selected && prevMonth.isSame(selected, 'day'))
        classes = `${classes} rdtActive`;

      if (prevMonth.isSame(moment(), 'day'))
        classes = `${classes} rdtToday`;

      isDisabled = !isValid(currentDate, selected);
      if (isDisabled) {
        classes = `${classes} rdtDisabled`;
      }

      dayProps = {
        key: prevMonth.format('M_D'),
        'data-value': prevMonth.date(),
        className: classes
      };

      if (!isDisabled) {
        dayProps.onClick = this.updateSelectedDate;
      }

      days.push(renderer(dayProps, currentDate, selected));

      if (days.length === 7) {
        weeks.push(React.createElement('tr', { key: prevMonth.format('M_D') }, days));
        days = [];
      }

      prevMonth.add(1, 'd');
    }

    return weeks;
  };

  updateSelectedDate = event => this.props.updateSelectedDate(event, true);

  renderDay = (props, currentDate) => {
    return React.createElement('td', props, currentDate.date());
  };

  alwaysValidDate = () => {
    return 1;
  };

  handleClickOutside = () => this.props.handleClickOutside();

  handleSetTime = (value) => () => {    
    this.props.setTime(['hours', 'minutes'], [value, 0]);
  };

  renderTimePresets = () => {
    const isValid = this.props.isValidDate || this.alwaysValidDate;
    const selected = this.props.selectedDate && this.props.selectedDate.clone();

    if (!this.props.timePresets) {
      return null;
    }

    let currentHour = false;

    if (selected instanceof moment) {
      currentHour = selected ? selected.get('hour') : null;
    }

    return (
      <div className="rdtTimes">
        <div className="rdtTimes__title">Time Picker</div>
        <ul>
          {
            [...Array(24).keys()].map(hour => {
              const time = selected && selected.clone().set({ hour, minute: 0, second: 0 });
              const props = {
                className: '',
              };

              if (currentHour && currentHour === hour && selected.get('minute') === 0) {
                props.className = 'active';
              }

              const isDisabled = time ? !isValid(time, selected) : false;
              if (isDisabled) {
                props.className = `${props.className} rdtDisabled`;
              } else {
                props.onClick = this.handleSetTime(hour);
              }

              return (
                <li {...props} key={hour}>
                  {`${hour}:00`}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  };

  render() {
    const date = this.props.viewDate;
    const locale = date.localeData();

    let tableChildren = [
      <thead key="th">
      <tr key="h">
        <th key="p" className="rdtPrev" onClick={this.props.subtractTime(1, 'months')}>
          <i className="fa fa-angle-left" />
        </th>
        <th
          key="s"
          className="rdtSwitch"
          onClick={this.props.showView('months')}
          colSpan={5}
          data-value={this.props.viewDate.month()}
        >
          {locale.months(date) + ' ' + date.year()}
        </th>
        <th
          key="n"
          className="rdtNext"
          onClick={this.props.addTime(1, 'months')}
        >
          <i className="fa fa-angle-right" />
        </th>
      </tr>
      <tr key="d">
        {this.getDaysOfWeek(locale).map(day => (
          <th key={day} className="dow">
            {day}
          </th>
        ))}
      </tr>
      </thead>,
      <tbody key="tb">{this.renderDays()}</tbody>
    ];

    return (
      <div className="dayTimeContainer">
        <div className="rdtDays">
          <table>
            {tableChildren}
          </table>
        </div>
        {this.renderTimePresets()}
      </div>
    );
  }
}

export default DaysView;

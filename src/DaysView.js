import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';

class DaysView extends Component {
  getDaysOfWeek = (locale) => {
    const days = locale._weekdaysMin;
    const first = locale.firstDayOfWeek();
    let dow = [];
    let i = 0;

    days.forEach(function (day) {
      dow[(7 + ( i++ ) - first) % 7] = day;
    });

    return dow;
  };

  renderDays = () => {
    const date = this.props.viewDate;

    var selected = this.props.selectedDate && this.props.selectedDate.clone(),
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

      if (( prevMonth.year() === currentYear && prevMonth.month() < currentMonth ) || ( prevMonth.year() < currentYear ))
        classes += ' rdtOld';
      else if (( prevMonth.year() === currentYear && prevMonth.month() > currentMonth ) || ( prevMonth.year() > currentYear ))
        classes += ' rdtNew';

      if (selected && prevMonth.isSame(selected, 'day'))
        classes += ' rdtActive';

      if (prevMonth.isSame(moment(), 'day'))
        classes += ' rdtToday';

      isDisabled = !isValid(currentDate, selected);
      if (isDisabled) {
        classes += ' rdtDisabled';
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
    this.props.setTime('hours', value);
  };

  renderTimePresets = () => {
    if (!this.props.timePresets) {
      return null;
    }

    let currentHour = false;
    const { selectedDate } = this.props;

    if (selectedDate instanceof moment) {
      currentHour = selectedDate ? selectedDate.get('hour') : null;
    }

    return (
      <div className="rdtTimes">
        <ul>
          <li>Time Picker</li>
          {
            [...Array(25).keys()].map(h => {
              const isActive = currentHour && currentHour === h && selectedDate.get('minute') === 0;

              return (
                <li
                  className={classNames({ active: isActive })}
                  onClick={this.handleSetTime(h)} colSpan={7} key={h}
                >
                  {`${h}:00`}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  };

  render () {
    const date = this.props.viewDate;
    const locale = date.localeData();

    let tableChildren = [
      <thead key="th">
      <tr key="h">
        <th key="p" className="rdtPrev" onClick={this.props.subtractTime(1, 'months')}>
          <span>‹</span>
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
          <span>›</span>
        </th>
      </tr>
      <tr key="d">
        {
          this.getDaysOfWeek(locale).map((day, index) => (
            <th key={day + index} className="dow">
              {day}
            </th>
          ))
        }
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

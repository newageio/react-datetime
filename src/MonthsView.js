import React, { Component } from 'react';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

class MonthsView extends Component {
  renderMonths = () => {
    var date = this.props.selectedDate,
      month = this.props.viewDate.month(),
      year = this.props.viewDate.year(),
      rows = [],
      i = 0,
      months = [],
      renderer = this.props.renderMonth || this.renderMonth,
      isValid = this.props.isValidDate || this.alwaysValidDate,
      classes, props, currentMonth, isDisabled, noOfDaysInMonth, daysInMonth, validDay,
      // Date is irrelevant because we're only interested in month
      irrelevantDate = 1;

    while (i < 12) {
      classes = 'rdtMonth';
      currentMonth =
        this.props.viewDate.clone().set({ year: year, month: i, date: irrelevantDate });

      noOfDaysInMonth = currentMonth.endOf('month').format('D');
      daysInMonth = Array.from({ length: noOfDaysInMonth }, function (e, i) {
        return i + 1;
      });

      validDay = daysInMonth.find(function (d) {
        var day = currentMonth.clone().set('date', d);
        return isValid(day);
      });

      isDisabled = ( validDay === undefined );

      if (isDisabled)
        classes += ' rdtDisabled';

      if (date && i === date.month() && year === date.year())
        classes += ' rdtActive';

      props = {
        key: i,
        'data-value': i,
        className: classes
      };

      if (!isDisabled)
        props.onClick = ( this.props.updateOn === 'months' ? this.updateSelectedMonth : this.props.setDate('month') );

      months.push(renderer(props, i, year, date && date.clone()));

      if (months.length === 4) {
        rows.push(React.createElement('tr', { key: month + '_' + rows.length }, months));
        months = [];
      }

      i++;
    }

    return rows;
  };

  updateSelectedMonth = (event) => {
    this.props.updateSelectedDate(event);
  };

  renderMonth = (props, month) => {
    const localMoment = this.props.viewDate;
    const monthStr = localMoment.localeData().monthsShort(localMoment.month(month));
    const strLength = 3;
    // Because some months are up to 5 characters long, we want to
    // use a fixed string length for consistency
    const monthStrFixedLength = monthStr.substring(0, strLength);

    return (<td {...props}>{capitalize(monthStrFixedLength)}</td>);
  };

  alwaysValidDate = () => 1;

  handleClickOutside = () => this.props.handleClickOutside();

  render () {
    return (
      <div className="rdtMonths">
        <table>
          <thead>
          <tr>
            <th className="rdtPrev" onClick={this.props.subtractTime(1, 'years')}>
              <i className="fa fa-angle-left" />
            </th>
            <th
              className="rdtSwitch"
              onClick={this.props.showView('years')}
              data-value={this.props.viewDate.year()}
            >
              {this.props.viewDate.year()}
            </th>
            <th className="rdtNext" onClick={this.props.addTime(1, 'years')}>
              <i className="fa fa-angle-right" />
            </th>
          </tr>
          </thead>
        </table>
        <table>
          <tbody>
          {this.renderMonths()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MonthsView;

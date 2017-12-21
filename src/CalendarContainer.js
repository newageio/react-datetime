import React, { Component } from 'react';
import MonthsView from './MonthsView';
import YearsView from './YearsView';
import DaysView from './DaysView';
import TimeView from './TimeView';

class CalendarContainer extends Component {
  render () {
    switch (this.props.view) {
      case 'days':
        return (
          <div>
            <DaysView {...this.props.viewProps} />
            {
              this.props.viewProps.withTime &&
              <TimeView {...this.props.viewProps} />
            }
          </div>
        );
      case 'months':
        return <MonthsView {...this.props.viewProps} />;
      case 'years':
        return <YearsView {...this.props.viewProps} />;
      default:
        return null;
    }
  }
}

export default CalendarContainer;

import React, { Component } from 'react';
import assign from 'object-assign';

const PAD_VALUES = {
  hours: 1,
  minutes: 2,
  seconds: 2,
  milliseconds: 3
};

class TimeView extends Component {
  constructor(props) {
    super(props);

    this.state = this.calculateState(this.props);
  }

  calculateState = (props) => {
    const date = props.selectedDate || props.viewDate,
      format = props.timeFormat,
      counters = []
    ;

    if (format.toLowerCase().indexOf('h') !== -1) {
      counters.push('hours');
      if (format.indexOf('m') !== -1) {
        counters.push('minutes');
        if (format.indexOf('s') !== -1) {
          counters.push('seconds');
        }
      }
    }

    const hours = date.format('H');

    let daypart = false;
    if (this.state !== null && this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
      if (this.props.timeFormat.indexOf(' A') !== -1) {
        daypart = (hours >= 12) ? 'PM' : 'AM';
      } else {
        daypart = (hours >= 12) ? 'pm' : 'am';
      }
    }

    return {
      hours: hours,
      minutes: date.format('mm'),
      seconds: date.format('ss'),
      milliseconds: date.format('SSS'),
      daypart: daypart,
      counters: counters
    };
  };

  renderCounter = (type) => {
    if (type !== 'daypart') {
      let value = this.state[type];

      if (type === 'hours' && this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
        value = (value - 1) % 12 + 1;

        if (value === 0) {
          value = 12;
        }
      }
      return React.createElement('div', { key: type, className: 'rdtCounter' }, [
        React.createElement('span', {
          key: 'up',
          className: 'rdtBtn',
          onTouchStart: this.onStartClicking('increase', type),
          onMouseDown: this.onStartClicking('increase', type),
          onContextMenu: this.disableContextMenu
        }, <i className="fa fa-angle-up" />),
        React.createElement('div', { key: 'c', className: 'rdtCount' }, value),
        React.createElement('span', {
          key: 'do',
          className: 'rdtBtn',
          onTouchStart: this.onStartClicking('decrease', type),
          onMouseDown: this.onStartClicking('decrease', type),
          onContextMenu: this.disableContextMenu
        }, <i className="fa fa-angle-down" />)
      ]);
    }
    return '';
  };

  renderDayPart = () => {
    return React.createElement('div', { key: 'dayPart', className: 'rdtCounter' }, [
      React.createElement('span', {
        key: 'up',
        className: 'rdtBtn',
        onTouchStart: this.onStartClicking('toggleDayPart', 'hours'),
        onMouseDown: this.onStartClicking('toggleDayPart', 'hours'),
        onContextMenu: this.disableContextMenu
      }, <i className="fa fa-angle-up" />),
      React.createElement('div', { key: this.state.daypart, className: 'rdtCount' }, this.state.daypart),
      React.createElement('span', {
        key: 'do',
        className: 'rdtBtn',
        onTouchStart: this.onStartClicking('toggleDayPart', 'hours'),
        onMouseDown: this.onStartClicking('toggleDayPart', 'hours'),
        onContextMenu: this.disableContextMenu
      }, <i className="fa fa-angle-down" />)
    ]);
  };

  componentWillMount() {
    const me = this;
    this.timeConstraints = {
      hours: {
        min: 0,
        max: 23,
        step: 1
      },
      minutes: {
        min: 0,
        max: 59,
        step: 1
      },
      seconds: {
        min: 0,
        max: 59,
        step: 1
      },
      milliseconds: {
        min: 0,
        max: 999,
        step: 1
      }
    };
    ['hours', 'minutes', 'seconds', 'milliseconds'].forEach(function (type) {
      assign(me.timeConstraints[type], me.props.timeConstraints[type]);
    });
    this.setState(this.calculateState(this.props));
  };

  componentWillReceiveProps(nextProps) {
    this.setState(this.calculateState(nextProps));
  }

  updateMilli = (e) => {
    const milli = parseInt(e.target.value, 10);

    if (milli === e.target.value && milli >= 0 && milli < 1000) {
      this.props.setTime('milliseconds', milli);
      this.setState({ milliseconds: milli });
    }
  };

  onStartClicking = (action, type) => {
    const me = this;

    return function () {
      const update = {};
      update[type] = me[action](type);
      me.setState(update);

      me.timer = setTimeout(function () {
        me.increaseTimer = setInterval(function () {
          update[type] = me[action](type);
          me.setState(update);
        }, 70);
      }, 500);

      me.mouseUpListener = function () {
        clearTimeout(me.timer);
        clearInterval(me.increaseTimer);
        me.props.setTime(type, me.state[type]);
        document.body.removeEventListener('mouseup', me.mouseUpListener);
        document.body.removeEventListener('touchend', me.mouseUpListener);
      };

      document.body.addEventListener('mouseup', me.mouseUpListener);
      document.body.addEventListener('touchend', me.mouseUpListener);
    };
  };

  disableContextMenu = (event) => {
    event.preventDefault();
    return false;
  };

  toggleDayPart = (type) => { // type is always 'hours'
    let value = parseInt(this.state[type], 10) + 12;

    if (value > this.timeConstraints[type].max) {
      value = this.timeConstraints[type].min + (value - (this.timeConstraints[type].max + 1));
    }

    return this.pad(type, value);
  };

  increase = (type) => {
    let value = parseInt(this.state[type], 10) + this.timeConstraints[type].step;

    if (value > this.timeConstraints[type].max) {
      value = this.timeConstraints[type].min + (value - (this.timeConstraints[type].max + 1));
    }

    return this.pad(type, value);
  };

  decrease = (type) => {
    let value = parseInt(this.state[type], 10) - this.timeConstraints[type].step;

    if (value < this.timeConstraints[type].min) {
      value = this.timeConstraints[type].max + 1 - (this.timeConstraints[type].min - value);
    }

    return this.pad(type, value);
  };

  pad = (type, value) => {
    let str = value + '';

    while (str.length < PAD_VALUES[type]) {
      str = `0${str}`;
    }

    return str;
  };

  handleClickOutside = () => {
    this.props.handleClickOutside();
  };

  render() {
    const me = this;
    const counters = [];

    this.state.counters.forEach(function (c) {
      if (counters.length)
        counters.push(React.createElement('div', {
          key: 'sep' + counters.length,
          className: 'rdtCounterSeparator'
        }, ':'));
      counters.push(me.renderCounter(c));
    });

    if (this.state.daypart !== false) {
      counters.push(me.renderDayPart());
    }

    if (this.state.counters.length === 3 && this.props.timeFormat.indexOf('S') !== -1) {
      counters.push(React.createElement('div', { className: 'rdtCounterSeparator', key: 'sep5' }, ':'));
      counters.push(
        React.createElement('div', { className: 'rdtCounter rdtMilli', key: 'm' },
          React.createElement('input', { value: this.state.milliseconds, type: 'text', onChange: this.updateMilli })
        )
      );
    }

    return (
      <div className="rdtTime">
        <div className="rdtCounters">
          {counters}
        </div>
        <button
          type="button"
          onClick={this.props.closeCalendar}
          className="btn btn-primary"
        >
          Apply
        </button>
      </div>
    );
  }
}

export default TimeView;

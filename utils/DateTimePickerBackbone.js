export default class DateTimePickerBackbone {
  constructor(component, timePointProvider, dayColumnProvider, hourColumnProvider, hourColumnFilter, minuteColumnProvider, minuteColumnFilter) {
    this.component = component;
    this.timePointProvider = timePointProvider;
    this.dayColumnProvider = dayColumnProvider;
    this.hourColumnProvider = hourColumnProvider;
    this.hourColumnFilter = hourColumnFilter;
    this.minuteColumnProvider = minuteColumnProvider;
    this.minuteColumnFilter = minuteColumnFilter;
  }
  newColumns() {
    let dayColumn = this.dayColumnProvider();
    let hourColumn = this.hourColumnFilter(this.hourColumnProvider());
    let minuteColumn = this.minuteColumnFilter(this.minuteColumnProvider());
    if (minuteColumn.length === 0) {
      hourColumn.shift();
      minuteColumn = this.minuteColumnProvider();
    }
    if (hourColumn.length === 0) {
      dayColumn.shift();
      hourColumn = this.hourColumnProvider();
    }
    return [
      { values: dayColumn },
      { values: hourColumn },
      { values: minuteColumn }
    ];
  }
  instanceEffect(event) {
    const value = event.detail.value;
    const pickedDate = value[0].date;
    const pickedHour = value[1].hour;
    const timePoint = this.timePointProvider();
    const isHourColumnNeedFilter = timePoint.getDate() === pickedDate;
    const isMinuteColumnNeedFilter = isHourColumnNeedFilter && timePoint.getHours() === pickedHour;
    return {
      dayColumn: null,
      dayIndex: -1,
      hourColumn: null,
      hourIndex: -1,
      minuteColumn: null,
      minuteIndex: -1,
      timePoint,
      isHourColumnNeedFilter,
      isMinuteColumnNeedFilter
    };
  }
  instancePickerState(event) {
    const value = event.detail.value;
    const pickedMonth = value[0].month;
    const pickedDate = value[0].date;
    const pickedHour = value[1].hour;
    const pickedMinute = value[2].minute;
    return {
      pickedMonth,
      pickedDate,
      pickedHour,
      pickedMinute
    };
  }
  hanldePickerChange(event) {
    const pickerState = this.instancePickerState(event);
    const effect = this.instanceEffect(event);
    this.handleDayColumnMutation(pickerState, effect);
    this.handleHourColumnMutation(pickerState, effect);
    this.handleMinuteColumnMutation(pickerState, effect);
    this.checkEffectMinuteColumn(pickerState, effect);
    this.checkEffectHourColumn(pickerState, effect);
    this.checkEffectDayColumn(pickerState, effect);
    this.applyEffect(effect);
  }
  handleDayColumnMutation(pickerState, effect) {
    const { timePoint } = effect;
    const { pickedDate, pickedHour } = pickerState;
    const currentDayColumn = this.component.getColumnValues(0);
    const newDayColumn = this.dayColumnProvider();
    const srcIndex = currentDayColumn.findIndex((e) => e.date === pickedDate);
    const destIndex = newDayColumn.findIndex((e) => e.date === pickedDate);
    if (destIndex === -1) {
      effect.dayColumn = newDayColumn;
      effect.dayIndex = 0;
      if (newDayColumn[0].date === timePoint.getDate()) {
        effect.isHourColumnNeedFilter = true;
        effect.isMinuteColumnNeedFilter = timePoint.getHours() === pickedHour;
      } else {
        effect.isHourColumnNeedFilter = false;
        effect.isMinuteColumnNeedFilter = false;
      }
    } else if (srcIndex !== destIndex) {
      effect.dayColumn = newDayColumn;
      effect.dayIndex = destIndex;
    } else {
    }
  }
  handleHourColumnMutation(pickerState, effect) {
    const { timePoint, isHourColumnNeedFilter } = effect;
    const { pickedHour } = pickerState;
    const currentHourColumn = this.component.getColumnValues(1);
    const newHourColumn = isHourColumnNeedFilter ? 
      this.hourColumnFilter(this.hourColumnProvider()) :
      this.hourColumnProvider();
    const srcIndex = currentHourColumn.findIndex((e) => e.hour === pickedHour);
    const destIndex = newHourColumn.findIndex((e) => e.hour === pickedHour);
    if (destIndex === -1) {
      effect.hourColumn = newHourColumn;
      effect.hourIndex = 0;
      effect.isMinuteColumnNeedFilter = true;
      if (newHourColumn[0].hour === timePoint.getHours()) {
        effect.isMinuteColumnNeedFilter = true;
      } else {
        effect.isMinuteColumnNeedFilter = false;
      }
    } else if (srcIndex !== destIndex) {
      effect.hourColumn = newHourColumn;
      effect.hourIndex = destIndex;
    } else {
    }
  }
  handleMinuteColumnMutation(pickerState, effect) {
    const { isMinuteColumnNeedFilter } = effect;
    const { pickedMinute } = pickerState;
    const currentMinuteColumn = this.component.getColumnValues(2);
    const newMinuteColumn = isMinuteColumnNeedFilter ? 
      this.minuteColumnFilter(this.minuteColumnProvider()) :
      this.minuteColumnProvider();
    const srcIndex = currentMinuteColumn.findIndex((e) => e.minute === pickedMinute);
    const destIndex = newMinuteColumn.findIndex((e) => e.minute === pickedMinute);
    if (destIndex === -1) {
      effect.minuteColumn = newMinuteColumn;
      effect.minuteIndex = 0;
    } else if (srcIndex !== destIndex) {
      effect.minuteColumn = newMinuteColumn;
      effect.minuteIndex = destIndex;
    } else {
    }
  }
  checkEffectMinuteColumn(pickerState, effect) {
    const { pickedHour } = pickerState;
    if (effect.minuteColumn && effect.minuteColumn.length === 0) {
      effect.minuteColumn = this.minuteColumnProvider();
      effect.minuteIndex = 0;
      if (effect.hourColumn) {
        effect.hourColumn.shift();
        effect.hourIndex = Math.max(effect.hourIndex - 1, 0);
      } else {
        const currentHourColumn = this.component.getColumnValues(1);
        effect.hourColumn = currentHourColumn.map((e) => e).shift();
        const srcIndex = currentHourColumn.findIndex((e) => e.hour === pickedHour);
        effect.hourIndex = Math.max(srcIndex - 1, 0);
      }
    }
  }
  checkEffectHourColumn(pickerState, effect) {
    const { timePoint } = effect;
    const { pickedDate } = pickerState;
    if (effect.hourColumn && effect.hourColumn.length === 0) {
      if (effetc.dayColumn) {
        effect.dayColumn.shift();
        effect.dayIndex = Math.max(effect.dayIndex - 1, 0);
      } else {
        const currentDayColumn = this.component.getColumnValues(0);
        effect.dayColumn = currentDayColumn.map((e) => e).shift();
        const srcIndex = currentDayColumn.findIndex((e) => e.date === pickedDate);
        effect.dayIndex = Math.max(srcIndex - 1, 0);
      }
    }
    if (effect.hourColumn) {
      if (pickedDate === timePoint.getDate() && timePoint.getMinutes() > 50) {
        while (effect.hourColumn.length > 0) {
          if (effect.hourColumn[0].hour < timePoint.getHours() + 1) {
            effect.hourColumn.shift();
            effect.hourIndex = Math.max(effect.hourIndex - 1, 0);
          } else {
            break;
          }
        }
      }
    }
  }
  checkEffectDayColumn(pickerState, effect) {
    const { timePoint } = effect;
    if (effect.dayColumn) {
      if (timePoint.getHours() > 20) {
        while (effect.dayColumn.length > 0) {
          if (effect.dayColumn[0].date < timePoint.getDate() + 1) {
            effect.dayColumn.shift();
            effect.dayColumn = Math.max(effect.dayColumn - 1, 0);
          } else {
            break;
          }
        }
      }
    }
  }
  applyEffect(effect) {
    const component = this.component;
    if (effect.dayColumn) {
      component.setColumnValues(0, effect.dayColumn, false);
      component.setColumnIndex(0, effect.dayIndex);
    }
    if (effect.hourColumn) {
      component.setColumnValues(1, effect.hourColumn, false);
      component.setColumnIndex(1, effect.hourIndex);
    }
    if (effect.minuteColumn) {
      component.setColumnValues(2, effect.minuteColumn, false);
      component.setColumnIndex(2, effect.minuteIndex);
    }
  }
}
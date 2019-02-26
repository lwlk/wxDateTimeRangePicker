import DateTimePickerBackbone from './DateTimePickerBackbone';

const paddingZero = (digit) => {
  const digitString = digit.toString();
  if (digitString.length === 1) {
    return "0" + digitString;
  } else {
    return digitString;
  }
};

const dayColumnProvider = function () {
  const now = new Date();
  const timePoint = this.timePointProvider();
  const mapper = (_, i) => {
    const date = new Date(timePoint);
    date.setDate(timePoint.getDate() + i);
    let text = `${date.getMonth() + 1}月${date.getDate()}日`;
    if (date.getDate() === now.getDate()) {
      text += ' 今天';
    } else if (date.getDate() === now.getDate() + 1) {
      text += ' 明天';
    } else if (date.getDate() === now.getDate() + 2) {
      text += ' 后天';
    }
    const form = `${date.getFullYear()}-${paddingZero(date.getMonth() + 1)}-${paddingZero(date.getDate())}`;
    return {
      text, 
      month: date.getMonth(), 
      date: date.getDate(), 
      form 
    };
  };
  return Array(7).fill(0).map(mapper);
};

const hourColumnProvider = function () {
  const mapper = (_, i) => {
    return {
      text: `${i}时`,
      hour: i,
      form: paddingZero(i)
    };
  };
  const predicate = (e) => 6 <= e.hour && e.hour <= 20;
  return Array(24).fill(0).map(mapper).filter(predicate);
};

const hourColumnFilter = function (column) {
  const timePoint = this.timePointProvider();
  return column.filter((e) => e.hour >= timePoint.getHours());
};

const minuteColumnProvider = function () {
  const mapper = (_, i) => {
    return {
      text: `${i * 10}分`, 
      minute: i * 10,
      form: paddingZero(i * 10)
    };
  };
  return Array(6).fill(0).map(mapper);
};

const minuteColumnFilter = function (column) {
  const timePoint = this.timePointProvider();
  return column.filter((e) => e.minute >= timePoint.getMinutes());
};

export default class DateTimePicker extends DateTimePickerBackbone {
  constructor(component, timePointProvider) {
    super(component, timePointProvider, dayColumnProvider, hourColumnProvider, hourColumnFilter, minuteColumnProvider, minuteColumnFilter);
  }
}
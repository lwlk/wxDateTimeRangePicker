import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import DateTimePicker from '../../utils/DateTimePicker';

let beginDateTimePicker = null, endDateTimePicker = null;

Page({
  data: {
    view: {
      showBeginDateTimePicker: false,
      beginDateTimePickerItems: null,
      showEndDateTimePicker: false,
      endDateTimePickerItems: null,
      beginDateTime: '',
      endDateTime: ''
    },
    form: {
      beginDateTime: '',
      endDateTime: ''
    },
  },

  // 打开日期范围选择器

  handleDateTimeRangePickerClick() {
    if (!this.data.view.beginDateTimePickerItems) {
      this.setData({
        'view.beginDateTimePickerItems': beginDateTimePicker.newColumns()
      });
    }
    this.setData({
      'view.showBeginDateTimePicker': true
    });
  },

  // 回调 开始时间

  handleBeginDateTimePickerChange(event) {
    beginDateTimePicker.hanldePickerChange(event, this);
  },
  handleBeginDateTimePickerConfirm(event) {
    const { value } = event.detail;
    const [ columnValue1, columnValue2, columnValue3 ] = value;
    this.setData({
      'view.beginDateTime': `${columnValue1.text} ${columnValue2.text}${columnValue3.text}`,
      'form.beginDateTime': `${columnValue1.form} ${columnValue2.form}:${columnValue3.form}:00`,
    });
    this.setData({
      'view.endDateTimePickerItems': endDateTimePicker.newColumns(),
      'view.showBeginDateTimePicker': false,
      'view.showEndDateTimePicker': true
    });
  },
  handleBeginDateTimePickerCancel() {
    this.setData({
      'view.showBeginDateTimePicker': false,
      'view.beginDateTime': '',
      'form.beginDateTime': ''
    });
  },

  // 回调 结束时间

  handleEndDateTimePickerChange(event) {
    endDateTimePicker.hanldePickerChange(event);
  },
  handleEndDateTimePickerConfirm(event) {
    const { value } = event.detail;
    const [ columnValue1, columnValue2, columnValue3 ] = value;
    this.setData({
      'view.endDateTime': `${columnValue1.text} ${columnValue2.text}${columnValue3.text}`,
      'form.endDateTime': `${columnValue1.form} ${columnValue2.form}:${columnValue3.form}:00`,
    });
    this.setData({
      'view.showEndDateTimePicker': false
    });
  },
  handleEndDateTimePickerCancel() {
    this.setData({
      'view.endDateTime': '',
      'form.endDateTime': '',
      'view.showBeginDateTimePicker': true,
      'view.showEndDateTimePicker': false
    });
  },

  // 数据校验

  validate() {
    const form = this.data.form;
    if (!form.beginDateTime) {
      return false;
    }
    if (!form.beginDateTime) {
      return false;
    }
    return true;
  },

  // 提交数据

  handleSubmit() {
    const form = this.data.form;
    if (!this.validate()) {
      Dialog.alert({
        title: '校验失败',
        message: '开始时间和结束时间不能为空'
      });
      return;
    }
    const now = new Date(), beginDateTime = new Date(form.beginDateTime), endDateDateTime = new Date(form.endDateTime);
    if (beginDateTime < now) {
      Dialog.alert({
        title: '校验失败',
        message: '开始时间不能早于现在时间'
      });
      return;
    }
    if (endDateDateTime < now) {
      Dialog.alert({
        title: '校验失败',
        message: '结束时间不能早于现在时间'
      });
      return;  
    }
    if (beginDateTime >= endDateDateTime) {
      Dialog.alert({
        title: '校验失败',
        message: '结束时间不能小于开始时间'
      });
      return;
    }
    if (endDateDateTime - beginDateTime < 1000 * 60 * 30) {
      Dialog.alert({
        title: '校验失败',
        message: '开始时间和结束时间要相差至少半小时'
      });
      return;
    }
    Dialog.alert({
      title: '校验成功',
      message: '成功设置时间区间'
    });
  },

  // 初始化

  initializeDateTimeRangePicker() {
    beginDateTimePicker = new DateTimePicker(this.selectComponent('#begin-date-time-picker'), () => {
      return new Date();
    });
    endDateTimePicker = new DateTimePicker(this.selectComponent('#end-date-time-picker'), () => {
      const form = this.data.form;
      const date = new Date(form.beginDateTime);
      date.setMinutes(date.getMinutes() + 30);
      return date;
    });
  },
  onLoad() {
    this.initializeDateTimeRangePicker();
  }
});
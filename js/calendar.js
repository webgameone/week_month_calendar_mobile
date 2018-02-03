(function(){
  var is_calendar = null;
  var day = [6,0,1,2,3,4,5];

  var Calendar = function(config){
    this.init(config);
  }

  //当前月份的测试数据
  var currentMonth = [];
  //一周的数组
  var currentWeek = [];


  //日历入口
  Calendar.prototype.init = function(config){
    //一个月多少天
    this.tian = 0;
    this.monthList=[];

    this.date = new Date();//获取当前时间对象
    this.year = this.date.getFullYear();//获取年
    this.month = this.date.getMonth()+1;//获取月
    this.d = this.date.getDate();//获取当天是几号
    this.nowDayOfWeek = this.date.getDay(); //今天本周的第几天
    this.days = [31,28+is_leap(this.date.getFullYear()),31,30,31,30,31,31,30,31,30,31];//天数列表


    this.newDate = new Date(this.year+'/'+this.month+'/'+1);//获取新的日期对象

    this.kun = day[this.newDate.getDay()];//获取星期几
    this.tian = this.days[this.newDate.getMonth()];//获取一个月多少天数


    //获取本周第一天是几号
    this.weekStartDate = new Date(this.year, this.month, this.d-this.nowDayOfWeek+1);


    //当月的开始日期和结束日期
    this.startYear = this.year.toString();
    this.startMonth = this.month>=10?this.month.toString():'0'+this.month;


    this.endDay = this.tian.toString();
    this.startTime = this.startYear+this.startMonth+'01';
    this.endTime = this.startYear+this.startMonth+this.endDay;


    this.box = config.id;
    this.class = config.class || '';


    this.Dom = "<div class='calendar'> "+
               "<div class='calendar-header' style='display:none'> "+
               "<span class='cale-left'><</span><span class='cale-right'>></span>"+
               "<p class='datetitle'></p>"+
               "</div>"+
               "<div class='cale-nav clearfix'>"+
               "<span>一</span>"+
               "<span>二</span>"+
               "<span>三</span>"+
               "<span>四</span>"+
               "<span>五</span>"+
               "<span class="+this.class+">六</span>"+
               "<span class="+this.class+">日</span>"+
               "</div>"+
            "<div class='calendar-ri' style='display:none'></div>"+
            "<div class='calendar-ri2'></div>"+
          "</div>";

    this.show(config.currentMonth,config.callback);
  }


  //点击月日历上的活动日期后周日历的数据变化
  Calendar.prototype.clickActiveDayFn = function(year,month,day){
    //重置周数组
    currentWeek = [];
    //当前点击时间的字符串
    month = month<10?'0'+month:month;
    day = day<10?'0'+day:day;

    //这个格式是正确的
    this.mDate = new Date(year+'/'+month+'/'+day);
    //今天本周的第几天
    this.nowDayOfWeek = this.mDate.getDay();

    if(this.nowDayOfWeek==0)
    {
      this.nowDayOfWeek=7;
    }

    //求出本周的日期数组
    for(var i=1;i<=7;i++)
    {
      var mday = day-this.nowDayOfWeek+i;
      mday = mday<10?'0'+mday:mday;

      var data = year+'/'+ month+'/'+mday;
      var weekStart = new Date(data);

      var tempYear = weekStart.getFullYear().toString();

      var tempMonth = (weekStart.getMonth()+1)>=10?(weekStart.getMonth()+1).toString():'0'+(weekStart.getMonth()+1);

      var tempday = weekStart.getDate()>=10?weekStart.getDate().toString():'0'+weekStart.getDate();

      //将一周的日期放进周数组
      var temp_mweekMonth,temp_mweekDay;
      currentWeek.push(tempYear+''+tempMonth+''+tempday);
    }

    //获取点击当前日期的周一是几号
    var weekStartDate = new Date(year, month, day-this.nowDayOfWeek+1);
    //获取点击当前日期的周日是几号
    var weekEndDate = new Date(year, month, day-this.nowDayOfWeek+7);
    //获取星期几
    var kun = day[this.mDate.getDay()];


    // 重新显示一周的日期
    // 删掉calendar-ri2的全部子类
    $('.calendar-ri2').children('span').remove();
    //重新计算一周的日期显示
    var spanKun2 = str_repeat2('<span></span>',weekStartDate.getFullYear(),weekStartDate.getMonth(),7,weekStartDate.getDate(),this.class);
    //显示点击周的数据
    $('.calendar-ri2').append(spanKun2).children('span').eq(day+kun-1);

    //显示点击周的活动日期
    for(var j=0;j<currentMonth.length;j++)
    {
      //获取到日期字符串
      var num = currentMonth[j];

      //判断是不是这周的
      if(currentWeek.indexOf(num)!=-1)
      {
        console.log(num)
        //算出是一周的哪天
        //只获取最后2个数字
        var day = parseInt(num.slice(6));
        var datanum = getPreWeekNum(year,month,day);

        $('.calendar-ri2').children('span').eq(datanum).attr('class','active2');
      }
    }

  }

  //根据日期求出是当周的第几天
  function getWeekNum(year,month,day){
    console.log(month)
    var mdate = new Date(year,month,day);
    var nowDayOfWeek = mdate.getDay()-1; //今天本周的第几天
    return nowDayOfWeek;
  }

  function getPreWeekNum(year,month,day){
    var mdate = new Date(year,--month,day);

    console.log(mdate)
    var nowDayOfWeek = mdate.getDay()-1; //今天本周的第几天
    console.log(nowDayOfWeek)
    return nowDayOfWeek;
  }

  //返回上月份的数据
  Calendar.prototype.getLastMonthList = function(m_currentMonth){
    --this.month;
    if(this.month==0){
      this.year--;
      this.month=12;
    }

    var tempMonth = this.month;
    var tempMonthStr;
    tempMonthStr = tempMonth<10?'0'+tempMonth:tempMonth;

    var _this = this;

    //使用字符串去设置日期
    currentMonth = m_currentMonth;

    this.upDate(this.year,tempMonth);

    this.startYear = this.year.toString();
    this.startMonth = this.month>=10?this.month.toString():'0'+this.month;
    this.endDay = this.tian.toString();
    this.startTime = this.startYear+this.startMonth+'01';
    this.endTime = this.startYear+this.startMonth+this.endDay;

    //展示上个月的活动数据
    for(var j=0;j<currentMonth.length;j++)
    {
      var day = parseInt(currentMonth[j].slice(6));
      $('.calendar-ri').children('span').eq(day+_this.kun-1).attr('class','active');
    }

  }

  //返回下月份的数据
  Calendar.prototype.getNextMonthList = function(m_currentMonth){
    ++this.month;
    if(this.month==13){
        this.year++;
        this.month=1;
    }
    var tempMonth = this.month;
    var tempMonthStr;
    tempMonthStr = tempMonth<10?'0'+tempMonth:tempMonth;

    //使用字符串去设置日期
    currentMonth = m_currentMonth;

    var _this = this;

    this.upDate(this.year,tempMonth);

    //请求下月的预约课程数据
    this.startYear = this.year.toString();
    this.startMonth = this.month>=10?this.month.toString():'0'+this.month;
    this.endDay = this.tian.toString();
    this.startTime = this.startYear+this.startMonth+'01';
    this.endTime = this.startYear+this.startMonth+this.endDay;

    //展示下个月的活动数据
    for(var j=0;j<currentMonth.length;j++)
    {
      //只获取最后2个数字
      var day = parseInt(currentMonth[j].slice(6));
      $('.calendar-ri').children('span').eq(day+_this.kun-1).attr('class','active');
    }
  }

  //格式化日期显示
  Calendar.prototype.formatDate=function(date){//格局化日期：yyyy-MM-dd
    var myyear = date.getFullYear();
    var mymonth = date.getMonth()+1;
    var myweekday = date.getDate();
    //alert("formatDate"+myyear+":"+mymonth+":"+myweekday)
    if(mymonth < 10){
        mymonth = "0" + mymonth;
    }
    if(myweekday < 10){
        myweekday = "0" + myweekday;
    }
    return (myyear+"-"+mymonth + "-" + myweekday);
  }


  //日历初始化的显示
  Calendar.prototype.show = function(m_currentMonth,callback){
    //模拟后台返回的当月活动日期数据-使用字符串的方式,便于对比
    currentMonth = m_currentMonth;

    var _this = this;
    if(is_calendar)return;
    //重置周数组
    currentWeek = [];

    $(this.box).css({position:'relative'}).append(this.Dom);

    is_calendar = this;

    $('.calendar').css({position:'fixed',left:0,top:0.59+'rem'});
    //全部日历的展示
    var spanKun = str_repeat('<span></span>',this.kun,this.tian,this.class);

    //一周日历的展示
    var spanKun2 = str_repeat2('<span></span>',this.weekStartDate.getFullYear(),this.weekStartDate.getMonth(),this.tian,this.weekStartDate.getDate(),this.class);

    $('.datetitle').text(this.year+'年'+this.month+'月');
    //显示本月的数据
    $('.calendar-ri').append(spanKun).children('span').eq(this.d+this.kun-1);
    //显示本周的数据
    $('.calendar-ri2').append(spanKun2).children('span').eq(this.d+this.kun-1);

    //显示当月的活动日期数据
    for(var j=0;j<currentMonth.length;j++)
    {
      //只获取最后2个数字
      var day = parseInt(currentMonth[j].slice(6));
      $('.calendar-ri').children('span').eq(day+_this.kun-1).attr('class','active');
    }

    //获取本周开始的月份有多少天数
    var mdays = [31,28+is_leap(this.weekStartDate.getFullYear()),31,30,31,30,31,31,30,31,30,31];//天数列表
    var mtian = mdays[this.weekStartDate.getMonth()];//获取一个月多少天数

    var mweekYear = this.weekStartDate.getFullYear();
    var mweekMonth = this.weekStartDate.getMonth();
    var mweekDay = this.weekStartDate.getDate();


    //求出本周结束的最后一天
    for(var i=1;i<7;i++)
    {
      mweekDay++;
      if(mweekDay>mtian)
      {
        //将天数置为1
        mweekDay = 1;
        //将月份+1
        ++mweekMonth;
        //如果月份大于12月  年份+1  月份置为1
        if(mweekMonth > 12)
        {
          ++mweekYear;
          mweekMonth = 1;
        }
      }

      //将一周的日期放进周数组
      var temp_mweekMonth,temp_mweekDay;
      temp_mweekMonth=mweekMonth<10?'0'+mweekMonth:mweekMonth;
      temp_mweekDay=mweekDay<10?'0'+mweekDay:mweekDay;
      currentWeek.push(mweekYear+''+temp_mweekMonth+''+temp_mweekDay);
    }

    //修改本周当天的样式
    //要找到今天是本周的第几天
    $('.calendar-ri2').children('span').eq(_this.nowDayOfWeek-1).attr('class','active3');

    //模拟本周的日期活动数据
    for(var j=0;j<currentMonth.length;j++)
    {
      //获取到日期
      var num = currentMonth[j];
      //判断是不是这周的
      if(currentWeek.indexOf(num)!=-1)
      {
        //算出是一周的哪天
        //只获取最后2个数字
        var day = parseInt(num.slice(6));
        var datanum = getWeekNum(mweekYear,mweekMonth,day);

        $('.calendar-ri2').children('span').eq(datanum).attr('class','active2');
      }

    }

    //日历创建成功的回调
    callback('ok')
  }

  //生成一周的字符串
  function str_repeat2(str,year,month,tian,weekStartDate,c){
    var strs='';
    //这里不要使用全局的this
    var days = [31,28+is_leap(year),31,30,31,30,31,31,30,31,30,31];//天数列表
    var tian = days[month];//获取一个月多少天数
    //遍历一天的数据
    for(var i=0;i<7;i++)
    {
      if(weekStartDate>tian)
      {
        weekStartDate = 1;
      }
      strs+='<span class='+c+'>'+weekStartDate+'</span>';
      weekStartDate++;
    }
    return strs;
  }

  Calendar.prototype.hide = function(){
    $('.calendar').remove();
    is_calendar=null;
  }

  //更新时间显示
  Calendar.prototype.upDate = function(year,month){
    $('.calendar-ri').html('');
    this.days = [31,28+is_leap(this.year),31,30,31,30,31,31,30,31,30,31];
    this.newDate = new Date(year+'/'+month+'/'+1);
    this.kun = day[this.newDate.getDay()];
    this.tian = this.days[this.newDate.getMonth()];//获取一个月多少天数
    var spanKun = str_repeat('<span></span>',this.kun,this.tian,this.class);

    $('.datetitle').text(year+'年'+month+'月');

    $('.calendar-ri').append(spanKun).children('span').eq(this.kun);
  }


  var golbal = this || (0, eval)('this');
  golbal.Calendar = Calendar;
  // 判断是否为闰年
  function is_leap(year){
    return (year%100==0?res=(year%400==0?1:0):res=(year%4==0?1:0));
  }
  //根据天数判断星期几判断
  function xinqi(n,i){
    return (n+i)%7
  }
  // 重复生成字符串
  function str_repeat(str,n,t,c){
    var strs='';
    var m = 7-(n+t)%7;
    for(var i=0;i<n+t+m;i++){
      if(i<n){
        strs+=str;
      }else if(i<n+t){
        strs+='<span class='+((c&&((xinqi(n,i-n+1)==0)||(xinqi(n,i-n+1)==6)))?c:"")+'>'+(i-n+1)+'</span>';
      }else if(i<n+t+m){
        strs+=str;
      }
    }
    return strs;
  }

})()
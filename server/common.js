/** 后台公用函数 */
// 获取当前日期时间，格式“yyyy-MM-dd HH:MM:SS”
exports.getNowFormatDate = function() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  if(month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if(strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if(hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if(minute >= 0 && minute <= 9) {
    minute = "0" + minute;
  }
  if(second >= 0 && second <= 9) {
    second = "0" + second;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + minute + seperator2 + second;
  return currentdate;
};

// 获取一个极大的随机数
exports.getRandomNum = function() {
  return Math.round(Math.random() * 2147483647);
};

// 获取处理过的图片名
exports.getImageName = function(name, id) {
  console.log(name);
  let nameArray = name.split(".");

  let filerealname = '';
  for(let i = 0; i < nameArray.length - 1; i++) {
    filerealname += nameArray[i];
    if(i === nameArray.length - 2) {
      filerealname += id;
    }
    filerealname += '.';
  }
  return filerealname + nameArray[nameArray.length - 1];
}
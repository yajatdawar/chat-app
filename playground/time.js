var moment = require('moment');

var date = moment();

date.add(4,'year')
console.log(date.format('Do MMMM YYYY'));

console.log(date.format('dddd'));

console.log(date.format('h:mm a'));

console.log("Hey there");

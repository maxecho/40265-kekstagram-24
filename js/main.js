var plus = document.querySelector('.plus'),
    minus = document.querySelector('.minus'),
    multiply = document.querySelector('.multiply'),
    divide = document.querySelector('.divide'),
    operators = [plus, minus, multiply, divide];

var nums = [];

var operator = '',
    operatorPressed = false;

var calculate = document.querySelector('.submit'),
    clearButton = document.querySelector('.clear');

var outpt = document.querySelector('.output');

var value1 = '',
    value2 = '';

for(var i = 0; i < 10; i++) {
  nums[i] = document.querySelector('.num' + i);
  nums[i].addEventListener('click', function(){
    if (operatorPressed == false) {
    	value1 = value1 + this.innerHTML;
    	output.innerHTML = value1;
    }
    else if (operatorPressed) {
      value2 = value2 + this.innerHTML;
 			output.innerHTML = value1 + operator + value2;

  });
}

for(var i = 0; i < operators.length; i++) {
  operators[i].addEventListener('click', function(){
    if(value1 == '') {
      return
    }
    else {
      if(this.innerHTML == '×') {
        operator = '*';
      }
      else if(this.innerHTML == '÷') {
        operator = '/';
      }
      else {
        operator = this.innerHTML
      }
      operatorPressed = true;
      output.innerHTML = output.innerHTML +  operator;
    }
  })
}

calculate.addEventListener('click', function(){
  if(value2 == '') {
    return
  }
  else {
    output.innerHTML = eval(parseInt(value1) + operator + parseInt(value2));
    console.log(value1, operator, value2);
    value1 = output.innerHTML;
  	value2 = '';
  	operator = '';
  	operatorPressed = false;
  }
});

clearButton.addEventListener('click', function() {
  value1 = '';
  value2 = '';
  operator = '';
  operatorPressed = false;
  output.innerHTML = '';
});

/* Выводит рандомное целое число из диапазона */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
random(0,1000);

/* Функция для проверки максимальной длины строки. */
const maxComment = function(Comment,maxCommentSize){
  if (Comment<=maxCommentSize){return 'true';}
  else {return 'false';}
};

maxComment(5,10);

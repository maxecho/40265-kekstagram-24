const GET_URL = 'https://24.javascript.pages.academy/kekstagram/data';
const POST_URL = 'https://24.javascript.pages.academy/kekstagram';

//Загрузка данных
const getData = async (onSuccess, onFail) => {
  const response = await fetch(GET_URL);
  try {
    const data = await response.json();
    onSuccess(data);
  }
  catch (e) {
    onFail();
  }
};

//Отправка данных
const sendData = async (onSuccess, onFail, body) => {
  const response = await fetch(
    POST_URL,
    {
      method: 'POST',
      body,
    },
  );
  if (response.ok) {
    onSuccess();
  } else {
    onFail();
  }
};

export { getData, sendData };

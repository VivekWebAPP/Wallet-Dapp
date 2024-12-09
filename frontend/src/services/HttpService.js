import AuthHeader from './AuthHeader';

const postWithoutAuth = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

const getWithAuth = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...AuthHeader(),
    },
  });
  const data = await response.json();
  return data;
};

const postWithAuth = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...AuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

const putWithAuth = async (url, body) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      ...AuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

const deleteWithAuth = async (url) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...AuthHeader(),
    },
  });
  const data = await response.json();
  return data;
};

const HttpService = {
  postWithoutAuth,
  getWithAuth,
  postWithAuth,
  putWithAuth,
  deleteWithAuth,
};

export default HttpService;

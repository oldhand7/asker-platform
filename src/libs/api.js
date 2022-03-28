import { fetcher } from 'libs/helper';

export const sendContactMessage = values => {
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  }

  return fetcher(`/api/contact-form`, options);
}

export const getRoutes = (server = '/') => {
  const options = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }

  return fetcher(`${server}api/routes`, options);
}

export const createPairSession = (uid, idToken) => {
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      uid,
      idToken
    })
  }

  return fetcher(`/api/auth/pair`, options);
}

export const logoutUser = () => {
  const options = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }

  return fetcher(`/api/auth/logout`, options);
}

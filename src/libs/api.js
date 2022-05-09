import { fetcher } from 'libs/helper';

export const sendContactMessage = values => {
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  }

  return fetcher(`${NEXT_PUBLIC_LANGING_PAGE_URL}api/contact-form`, options);
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

export const createFirebaseUser = (email, password) => {
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  }

  return fetcher(`/api/firebase-proxy/users/create`, options);
}

export const updateFirebaseUserEmailAndPassword = (uid, email, password) => {
  const options = {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      uid,
      email,
      password
    })
  }

  return fetcher(`/api/firebase-proxy/users/password`, options);
}

export const sendPasswordResetLink = email => {
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  }

  return fetcher(`/api/auth/password-reset/`, options);
}

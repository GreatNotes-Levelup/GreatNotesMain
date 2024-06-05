export const getApiURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8080";
  } else {
    return "https://great-notes.projects.bbdgrad.com"
  }
}

/* Deprecated: id_token does contain the data I expect now */
/*
export const getUserInfo = async (token) => {
  let options = {
    headers : {
      "Authorization": "Bearer " + token
    }
  }
  return await fetch('https://greatnotes-security-levelup.auth.eu-west-1.amazoncognito.com/oauth2/userInfo', options).then(async (res) => {
    if(res.ok) {
      return await res.json().then(async (data) => {
        console.log(data);
        return data;
      })
    } else {
      console.log(res);
    }
  }).catch((err) => {
    console.err("oooops", err);
  });
}
*/

// https://stackoverflow.com/a/38552302
export function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export async function getLoginURL() {
  let url =
    'https://greatnotes-security-levelup.auth.eu-west-1.amazoncognito.com/login?response_type=code&';
  url +=
    'redirect_uri=' +
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://great-notes.projects.bbdgrad.com') +
    '/login';
  let getClientIdUrl = getApiURL() + '/api/auth/client_id';
  console.log('getClientIdUrl', getClientIdUrl);
  url = await fetch(getClientIdUrl)
    .then(async (res) => {
      if (!res.ok) {
        res.json().then((data) => {
          alert(data);
        });
        return;
      } else {
        return await res.json().then(async (data) => {
          url += '&client_id=' + data;
          return url;
        });
      }
    })
    .catch((err) => {
      alert('API down!', err);
      return;
    });
  return url;
}
export const getApiURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8080";
  } else {
    return "https://great-notes.projects.bbdgrad.com"
  }
}

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
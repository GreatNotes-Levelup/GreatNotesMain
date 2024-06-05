export const getApiURL = () => {
  if (process.env.ENV === "development") {
    return `http://localhost:${process.env.API_PORT ?? 8080}`;
  } else {
    return process.env.DOMAIN
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
    `${process.env.COGNITO_DOMAIN}/login?response_type=code&`;
  url +=
    'redirect_uri=' +
    (process.env.ENV === 'development'
      ? `http://localhost:${process.env.WEB_PORT ?? 3000}`
      : process.env.DOMAIN) +
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
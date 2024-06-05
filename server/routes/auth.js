import { Router } from "express";
import { createUser } from "../services/createUser.js";


const router = Router();
const port = process.env.PORT || 8080;

router.get('/', (req, res) => {

  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    }
  };

  let redirect_uri = process.env.ENV === "development" ? `http://localhost:${port}/login` : `${process.env.DOMAIN}/login`;

  if (redirect_uri === undefined) {
    console.error("Redirect URI wasn't set");
  }

  let params = {
    "grant_type": "authorization_code",
    "code": req.query.code,
    "redirect_uri": redirect_uri,
    "client_id": process.env.AWS_CLIENT_ID,
    "client_secret": process.env.AWS_CLIENT_SECRET
  };

  fetch("https://greatnotes-security-levelup.auth.eu-west-1.amazoncognito.com/oauth2/token?" + new URLSearchParams(params), options).then((oauth_res) => {
    if(oauth_res.ok) {
      oauth_res.json().then((data) => {
        try {
          createUser(data.id_token);
       } catch (error) {
         console.error(error);
         res.status(500).json("Error creating user");
       }
        res.json(data);
      })
      .catch(() => {
        res.status(500).json("Authentication succeeded but getting the json data failed");
      });
    } else {
      res.status(400).json("Seems to have failed the request. Maybe you reused the code :)");
    }

  })
  .catch((err) => {
    console.error(err);
    res.status(500).json("Auth failed!");
  })

});

router.get('/client_id', (req, res) => {
  if (!process.env.AWS_CLIENT_ID) {
    res.status(500).json("Client ID not found on the server");
  } else {
    res.json(process.env.AWS_CLIENT_ID);
  }
});


export default router;
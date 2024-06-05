import { Router } from "express";
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', (req, res) => {

  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    }
  };

  let redirect_uri = process.env.NODE_ENV === "development" ? "http://localhost:3000/login" : "https://great-notes.projects.bbdgrad.com/login";

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
    console.log(oauth_res);
    if(oauth_res.ok) {
      oauth_res.json().then((data) => {
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
    console.log(err);
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
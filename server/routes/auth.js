import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {

  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    }
  };

  let params = {
    "grant_type": "authorization_code",
    "code": req.query.code,
    "redirect_uri": "http://localhost:3000/oauth_code",
    "client_id": process.env.AWS_CLIENT_ID,
    "client_secret": process.env.AWS_CLIENT_SECRET
  };

  fetch("https://greatnotes-security-levelup.auth.eu-west-1.amazoncognito.com/oauth2/token?" + new URLSearchParams(params), options).then((oauth_res) => {
    console.log(oauth_res);
    if(oauth_res.ok) {
      res.json(oauth_res.body);
    } else {
      res.status(400).json("Seems to have failed the request");
    }

  })
  .catch((err) => {
    console.log(err);
    res.status(500).json("Auth failed!");
  })

});


export default router;
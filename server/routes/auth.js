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


export default router;
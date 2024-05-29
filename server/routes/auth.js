import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {

  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      "Authorization": Buffer.from(`${process.env.AWS_CLIENT_ID}:${process.env.AWS_CLIENT_SECRET}`),
      "User-Agent": "Node.js"
    },
    body: JSON.stringify({
      "grant_type": "authorization_code",
      "code": req.query.code
    })
  };
  fetch("https://greatnotes-security-levelup.auth.eu-west-1.amazoncognito.com/oauth2/token", options).then((oauth_res) => {
    console.log(oauth_res);
    oauth_res.json((data) => {
      res.json(data);
    })
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json("Auth failed!");
  })

});


export default router;
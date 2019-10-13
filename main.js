const express = require("express");
const request = require("request");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const dotenv = require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Do not go gentle into that good night");
});

///Route for the Data which is to be displayed...!
app.get("/scale", verifyToken, (req, res) => {
  jwt.verify(req.token, authkey, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      request(
        {
          //`https://wall.alphacoders.com/api2.0/get.php?auth=${process.env.key}&method`
          url: `curl -v -H 'Authorization: Bearer ${req.token}' "https://api.music.apple.com/v1/catalog/us/songs/203709340"`
        },
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            res.status(500).json({ type: "error", msg: err.message });
          }
          const data = JSON.parse(body);
          res.json({
            data: data,
            auth: authData
          });
        }
      );
    }
  });
});

///Protecting the above Route
const authkey = fs.readFileSync("AuthKey_DX3S9726SR.p8").toString();
app.post("/scale/token", (req, res) => {
  jwt.sign(
    {},
    authkey,
    {
      algorithm: "ES256",
      expiresIn: "180d",
      issuer: process.env.issuer,
      header: {
        alg: "ES256",
        kid: process.env.kid
      }
    },
    // { kid: process.env.kid },
    (err, token) => {
      if (err) {
        res.json({ err: err.message });
      }
      res.json({ token });
    }
  );
});

///Verifying the token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearertoken = bearer[1];
    req.token = bearertoken;
    next();
  } else {
    res.sendStatus(403);
  }
}

const port = process.env.PORT || 4321;
app.listen(port, () => console.log(`server is running on port ${port}`));

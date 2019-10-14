const express = require("express");
const request = require("request");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv").config();
const app = express();

const authkey = fs.readFileSync("AuthKey_DX3S9726SR.p8").toString();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Do not go gentle into that good night");
});

///Route for the Data which is to be displayed...!
app.post("/scale", verifyToken, (req, res) => {
  jwt.verify(req.token, authkey, (err, authData) => {
    request(
      {
        url:
          //" https://wall.alphacoders.com/api2.0/get.php?auth=02600714b6a89846733ece084dbc7e23&method"
          "https://api.music.apple.com/v1/catalog/us/songs/203709340"
        //"https://api.music.apple.com/v1/test"
      },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.status(500).json({ type: "error", message: err.message });
        }
        const data = JSON.parse(body);
        res.json(data);
      }
    );
  });
});

///Protecting the above Route
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
        typ: "JWT",
        kid: process.env.kid
      }
    },
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

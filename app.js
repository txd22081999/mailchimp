const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Signup route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  const options = {
    url: "https://us7.api.mailchimp.com/3.0/lists/60f86ef60e",
    method: "POST",
    headers: {
      Authorization: "auth 298dc0521203f4ed77e6e4bc0aee500e-us7",
    },
    body: postData,
  };
  console.log(postData);
  console.log(options);

  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        console.log(response);
        res.redirect("/success.html");
      } else {
        res.redirect("/fail.html");
      }
    }
  });
});

app.listen(PORT, console.log(`Server started on ${PORT}`));

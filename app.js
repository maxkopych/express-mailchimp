const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

//BodyParser Middleware
app.use(bodyParser.urlencoded({extended: true}));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on ${port}`));


app.post("/signup", (req, res) => {
  const {firstName, lastName, email} = req.body;

  //Validation
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us19.api.mailchimp.com/3.0/lists/a55ca20623',
    method: 'POST',
    headers: {
      Authorization: 'auth <YOURKEY>'
    },
    body: postData
  };

  request(options, (err, response, body) => {
      if (err) {
        res.redirect("/fail.html");
      } else {
        if(response.statusCode === 200){
          res.redirect('/success.html');
        }else{
          res.redirect("/fail.html");
        }
      }
    }
  );
});
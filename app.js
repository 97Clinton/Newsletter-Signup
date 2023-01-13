// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");
const { response } = require("express");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// to load our static files like styles.css and images to the liveserver.
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const mail = req.body.email;

    // console.log(firstName, lastName, mail);
    var data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/48c57cb7b6";

    const options = {
        method: "POST",
        auth: "clinton7:e5c4d83b4c03e83329d1a02ddd109db7-us14"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        };

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    

    request.write(jsonData);
    request.end();

    app.post("/failure", function(req, res){
        res.redirect("/");
    });

})


// CHANGING the port because HEROKU decides which port to deploy on,
//  adding 3000 port to run locally and on heroku.
app.listen(process.env.PORT || 3000, function(){
    console.log("Server now running on port 3000.");
});













// MAILCHIMP API KEY
// e5c4d83b4c03e83329d1a02ddd109db7-us14

// List ID 
// 48c57cb7b6
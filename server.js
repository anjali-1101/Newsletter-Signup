const express= require("express");
const app= express();
const bodyParser= require("body-parser");
const https= require("https");
app.use(bodyParser.urlencoded({extended:true}));
app.listen( process.env.PORT || 3000, function(){     //instead of local port , heroku chosen random port
  console.log("Server is running on port 3000");
});

app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){

var fname= req.body.fname;
var lname= req.body.lname;
var email=req.body.email;

const data= {
  members:[{                  //only one member in array because we're gonna subscribe one person at a time
    email_address:email,
    status:"subscribed",
    merge_fields: {
      FNAME:fname,
      LNAME:lname
    }

  }]
};
const json_data=JSON.stringify(data); //this will be sent to mailchimp server
const url="https://us10.api.mailchimp.com/3.0/lists/a1375b7d01";
const options={
  method:"POST",
  auth:"anjali13:392c706649ad49d5f3b37548474b74aa-us10"
}
const request= https.request(url,options,function(response){
  if(response.statusCode===200){
    res.sendFile(__dirname+"/success.html");
  }
  else{
    res.sendFile(__dirname+"/failure.html");
  }
  response.on("data", function(data){
    console.log(JSON.parse(data));
  })
});

request.write(json_data);
request.end();

});


app.get("/try_again",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

// app.get("/new_signup",function(req,res){
//   res.sendFile(__dirname+"/signup.html");
// })

//api key: 392c706649ad49d5f3b37548474b74aa-us10
//list id: a1375b7d01
// git remote add origin "url github"
// git push -u origin master
//git clone url
//git branch "branchname"
//git checkout branchname (switch to specified branch)

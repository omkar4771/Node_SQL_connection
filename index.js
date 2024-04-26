// CJS
const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express"); // require express
const app = express();
const port = 8080;
const path= require("path");

// for ejs pages
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password : "omkar4771",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
};

//new data inserting
// let query = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)"; // for single user
// let query = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data=[];
// for(let i=1; i<100; i++)
// {
//   data.push(getRandomUser()); // 100 fake users
// };

// try{
//   connection.query(query,[data],(err,result,)=>{
//     // if(err) throw err;
//     console.log(result);
//   });
// }
// catch(err){
//   console.log(err);
// }
// connection.end();

// Home route
app.get("/",(req,res)=>{
  let query = "SELECT count(*) FROM user";
  try{
      connection.query(query,(err,result)=>{
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", {count});
      });
    }
    catch(err){
      console.log(err);
      res.send("some error in databses");
    }
});

//show routes
app.get("/user",(req,res)=>{
  let query = "SELECT * FROM user";
  try{
    connection.query(query,(err,result)=>{
      if(err) throw err;
      res.render("user.ejs",{result});
      // res.send(result);
    });
  }
  catch(err){
    res.send("some error in DB");
  }
});

//edit route
app.get('/user/:id/edit' , (req , res)=>{
  let {id} = req.params;
  let query = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(query,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs",{user});
      // res.send(result);
    });
  }
  catch(err){
    res.send("some error in DB");
  }

})

app.listen(port,()=>{
  console.log(`server is listening on port ${port}`);
});
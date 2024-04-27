// CJS
const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express"); // require express
const app = express();
const port = 8080;
const path= require("path");
const methodOverride = require("method-override"); // for method override
const { error } = require('console');

app.use(express.static(path.join(__dirname,"/public"))); // link css file 
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
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

// Home route
app.get("/",(req,res)=>{
  let query = "SELECT count(*) FROM user";
  try{
      connection.query(query,(err,result)=>{
        // if(err) throw err;
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
      // if(err) throw err;
      res.render("user.ejs",{result});
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
      // if(err) throw err;
      // console.log(result);
      let user = result[0];
      res.render("edit.ejs",{user});
    });
  }
  catch(err){
    res.send("some error in DB");
  }
});

//update (DB) route
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password : formPassword, username : formUsername} = req.body;
  let query = `SELECT * FROM user WHERE id='${id}'`;

  try{
    connection.query(query,(err,result)=>{
      if(err) throw err
      let user = result[0];
      if(formPassword != user.password){
        res.send("Wrong Password");
        
      }
      else{
        let query2 = `UPDATE user SET username='${formUsername}' WHERE id='${id}'`;
        connection.query(query2,(err,result)=>{
          if(err) throw err
          res.redirect("/user");
        });
      }
      // res.render("edit.ejs",{user});
    });
  }
  catch(err){
    res.send("some error in DB");
  }
}); 

//new
app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
});
app.listen(port,()=>{
  console.log(`server is listening on port ${port}`);
});

//add user
app.post("/user/new", (req,res)=>{
    let {id : id, email:email, username : username, password: password } =req.body;

    let query = `INSERT INTO user (id, username, email, password) VALUES (${id},'${username}', '${email}', '${password}')`;
    try{
      connection.query(query,(err,result)=>{
        if(err) throw err
          res.redirect("/user");
      });
    }
    catch(err){
      res.send("some error in DB");
    }
});
// delete 
app.delete("/user/:id",(req,res)=>
{
  let {id} = req.params;
  let {email:email, password: password } =req.body;
  let query = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(query,(err,result)=>
    {
      if(err) throw err
      let user = result[0];
      if(user.password != password)
      {
        res.send("Wrong Password");
      }
      else
      {
        let query2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(query2,(err,result)=>
        {
          if(err) throw err
          res.redirect("/user");
        });
      }
    })
    }
  catch(err)
  {
    res.send(err);
  }
});
  


// delete form 
app.get("/user/:id/delete",(req,res)=>{
  let {id} = req.params;
  let query = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(query,(err,result)=>{
      // if(err) throw err;
      let user = result[0];
      res.render("delete.ejs",{user});
    });
  }
  catch(err){
    res.send("some error in DB");
  }
});
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
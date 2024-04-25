// CJS
const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");

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
let query = "INSERT INTO user (id, username, email, password) VALUES ?";
let data=[];
for(let i=1; i<100; i++)
{
  data.push(getRandomUser()); // 100 fake users
};

try{
  connection.query(query,[data],(err,result,)=>{
    // if(err) throw err;
    console.log(result);
  });
}
catch(err){
  console.log(err);
}
connection.end();
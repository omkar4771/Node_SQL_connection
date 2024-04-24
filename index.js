// CJS
const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
// Get the client
// import mysql from 'mysql2/promise';

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password : "omkar4771"
});

try{
  connection.query("SHOW * from Temp",(err,result,)=>{
    console.log(result);
  })
}
catch(err){
  console.log(err);
}

let getRandomUser = () => {
    return {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  }
  console.log(getRandomUser());
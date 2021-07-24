const express = require('express');
const fetch = require("node-fetch");
const pool = require("./dbPool.js");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', async (req, res) => {
  let apiUrl = "https://api.unsplash.com/photos/random/?client_id=6RnFO-icdTftBKx2Dfc7Hkw1ks4yL0Hn-BpHF_hbqZU&featured=true&orientation=landscape";
  let response = await fetch(apiUrl);
  let data = await response.json();
  res.render('index', {"imageUrl": data.urls.small});
});

app.get('/search', async (req, res) => {
  let keyword = "";
  if (req.query.keyword) {
    keyword = req.query.keyword;
  }

  let apiUrl = `https://api.unsplash.com/photos/random/?count=9&client_id=6RnFO-icdTftBKx2Dfc7Hkw1ks4yL0Hn-BpHF_hbqZU&featured=true&orientation=landscape&query=$(keyword)`;
  let response = await fetch(apiUrl);
  let data = await response.json();

  let imageUrlArray = [];
  for(let i=0; i < data.length; i++) {
    imageUrlArray.push(data[i].urls.small)
  }

  res.render('results', {"imageUrl": data[0].urls.small, "imageUrlArray": imageUrlArray});
});

app.get("/api/updateFavorites", async(req, res) => {
 let sql;
 let sqlParams;
 switch (req.query.action) {
   case "add": sql = "INSERT INTO favorites (imageUrl, keyword) VALUES (?,?)";
               sqlParams = [req.query.imageUrl, req.query.keyword];
               break;
   case "delete": sql = "DELETE FROM favorites WHERE imageUrl = ?";
               sqlParams = [req.query.imageUrl];
               break;
 }//switch
 let rows = await executeSQL(sql, sqlParams);
 console.log(rows);
 res.send(rows.affectedRows.toString());   
});//api/updateFavorites

app.get("/getKeywords",  async(req, res) => {
  let sql = "SELECT DISTINCT keyword FROM favorites ORDER BY keyword";
  let imageUrl = ["img/favorite.png"];
  let rows = await executeSQL(sql);
  console.log(rows);
  res.render("favorites", {"imageUrl": imageUrl, "rows":rows});  
});//getKeywords

app.get("/api/getFavorites", function(req, res){
  let sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
  let sqlParams = [req.query.keyword];  
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });
});//api/getFavorites

 
//functions
async function executeSQL(sql, params){
 return new Promise (function (resolve, reject) {
   pool.query(sql, params, function (err, rows, fields) {
     if (err) throw err;
     resolve(rows);
    });
 });
}




app.listen(3000, () => {
  console.log('server started');
});
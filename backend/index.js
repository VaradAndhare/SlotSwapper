const express = require("express");
const app = express();

app.get("/" , (req , res) => {
    res.send("Welcome")
});


app.listen(8080 , (req , res) => {
    console.log("listening to 8080")
})
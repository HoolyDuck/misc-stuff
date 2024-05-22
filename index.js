const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const handler = require("./schema/schema");

const app = express();
const port = 3000;
const db_url = "mongodb+srv://nazar260804:Lia70iePXPUNqyIq@lab05.ho3jf6k.mongodb.net/?retryWrites=true&w=majority&appName=lab05"

mongoose
    .connect(db_url)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error: ", err);
    });

const router = require("./router");

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


app.all('/graphql', handler);

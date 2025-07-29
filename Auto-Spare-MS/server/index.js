const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")

dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(cors());


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./dbConfig/db');
const categoryRoutes = require('./routes/Categories');
const sparePartRoutes = require('./routes/sparePart');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/spare-parts', sparePartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./dbConfig/db');
const categoryRoutes = require('./routes/Categories');
const sparePartRoutes = require('./routes/sparePart');

dotenv.config();
connectDB(); // 👈 Connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/spare-parts', sparePartRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const mongoose = require("mongoose")


const sparePartSchema = new mongoose.Schema(
    {
        part_no: { type: String, trim: true },
        code: { type: String, trim: true },
        brand: { type: String, trim: true },
        description: { type: String, required: true },
        qty: { type: Number, default: 0 },
        unit: { type: String, default: 'PCS' },
        buying_price: { type: Number, required: true },
        selling_price: { type: Number, required: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        compatible_models: [{ type: String }], // optional: ["TUKTUK", "GLE", "BMW"]
    },
    { timestamps: true }
);

export default mongoose.model("SparePart", sparePartSchema)
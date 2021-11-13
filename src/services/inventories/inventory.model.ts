import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  quantity: { type: Number, required: true },
}, { timestamps: true });

const Inventory = mongoose.model('inventories', inventorySchema);

export default Inventory;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const saleSchema = new Schema({
  inventory: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  prices: { type: Number, required: true },
  quantity: { type: Number, required: true },
  ticket: { type: Number, required: true },
}, { timestamps: true });

const Sale = mongoose.model('sales', saleSchema);

export default Sale;
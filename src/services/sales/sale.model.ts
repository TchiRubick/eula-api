import mongoose from 'mongoose';

const { Schema } = mongoose;

const saleSchema = new Schema({
  inventories: [{
    inventory: { type: Schema.Types.ObjectId, ref: 'inventories' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  }],
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  ticket: {
    type: Number,
    required: true,
    unique: true,
    dropDups: true,
  },
  status: { type: String, default: 'saled' },
  payed: { type: Number, required: true },
  backed: { type: Number, required: true },
}, { timestamps: true });

const Sale = mongoose.model('sales', saleSchema);

export const session = mongoose.startSession();

export default Sale;

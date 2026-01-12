import mongoose, { Schema, Document } from 'mongoose';

export interface IBid extends Document {
    gigId: mongoose.Schema.Types.ObjectId;
    freelancerId: mongoose.Schema.Types.ObjectId;
    message: string;
    price: number;
    status: 'Pending' | 'Hired' | 'Rejected';
}

const BidSchema: Schema = new Schema({
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Hired', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

BidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model<IBid>('Bid', BidSchema);
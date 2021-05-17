import { Document, Schema, model, Model } from 'mongoose';

export interface ParkingLot extends Document {
  name: string;
}

export const ParkingLotSchema = new Schema<
  ParkingLot,
  Model<ParkingLot, ParkingLot>
>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

ParkingLotSchema.methods.toJSON = function (): Thruway.ParkingLot {
  return {
    name: this.name,
  };
};

const ParkingLotModel = model<ParkingLot>('ParkingLot', ParkingLotSchema);

export default ParkingLotModel;

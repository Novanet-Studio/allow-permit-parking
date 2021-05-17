import ParkingLotModel from '../models/parking-lot';

import type { ParkingLot } from '../models/parking-lot';

export type CreateParkingLotDTO = {
  name: string;
};

export interface IParkingLotService {
  create(dto: CreateParkingLotDTO): Promise<ParkingLot>;
}

export default class ParkingLotService implements IParkingLotService {
  async create(dto: CreateParkingLotDTO): Promise<ParkingLot> {
    const parkingLot = new ParkingLotModel(dto);

    await parkingLot.save();

    return parkingLot;
  }
}

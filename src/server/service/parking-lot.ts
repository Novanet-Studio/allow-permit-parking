import ParkingLotModel from '../models/parking-lot';
import { ParkingLotNotFound } from '../error/parking-lot.service';

import type { ParkingLot } from '../models/parking-lot';

export type CreateParkingLotDTO = {
  name: string;
};

export type UpdateParkingLotDTO = {
  id: string;
  name?: string;
};

export interface IParkingLotService {
  create(dto: CreateParkingLotDTO): Promise<ParkingLot>;
  update(dto: UpdateParkingLotDTO): Promise<void>;
  remove(id: string): Promise<void>;
}

export default class ParkingLotService implements IParkingLotService {
  async create(dto: CreateParkingLotDTO): Promise<ParkingLot> {
    const parkingLot = new ParkingLotModel(dto);

    await parkingLot.save();

    return parkingLot;
  }

  async update(dto: UpdateParkingLotDTO): Promise<void> {
    const parkingLot = await ParkingLotModel.findById(dto.id);

    if (!parkingLot) {
      throw new ParkingLotNotFound('id', dto.id);
    }

    await parkingLot.update(dto);

    return;
  }

  async remove(id: string): Promise<void> {
    const parkingLot = await ParkingLotModel.findById(id);

    if (!parkingLot) {
      throw new ParkingLotNotFound('id', id);
    }

    await parkingLot.remove();

    return;
  }
}

import { getRepository } from 'typeorm';

import ParkingSlot, { ParkingType } from '../models/parking-slot';
import { ParkingSlotWithIDNotFound } from '../error/parking-slot.service';

import type { IParkingLotService } from './parking-lot';

export type CreateParkingSlotDTO = {
  name: string;
  parkingType: string;
  parkingLotId: string;
};

export type UpdatedParkingSlotDTO = {
  id: string;
  parkingLotId: string;
  name?: string;
};

export interface IParkingSlotService {
  getAll(): Promise<ParkingSlot[]>;
  create(parkingLotId: string, dto: CreateParkingSlotDTO): Promise<ParkingSlot>;
  update(dto: UpdatedParkingSlotDTO): Promise<ParkingSlot>;
  remove(id: string): Promise<ParkingSlot>;
  findById(id: string): Promise<ParkingSlot | null>;
}

export default class ParkingSlotService implements IParkingSlotService {
  private parkingLotService: IParkingLotService;

  constructor(parkingSlotService: IParkingLotService) {
    this.parkingLotService = parkingSlotService;
  }

  async getAll(): Promise<ParkingSlot[]> {
    const parkingSlotRepository = getRepository(ParkingSlot);
    const allParkingSlots = await parkingSlotRepository.find();

    return allParkingSlots;
  }

  async create(
    parkingLotId: string,
    dto: CreateParkingSlotDTO,
  ): Promise<ParkingSlot> {
    const parkingSlotRepository = getRepository(ParkingSlot);
    const parkingLot = await this.parkingLotService.findById(parkingLotId);
    const parkingSlot = new ParkingSlot();

    parkingSlot.name = dto.name;
    parkingSlot.parkingType = dto.parkingType as ParkingType;
    parkingSlot.parkingLotId = parkingLot.id;

    const createdParkingSlot = await parkingSlotRepository.save(parkingSlot);

    return createdParkingSlot;
  }

  async update(dto: UpdatedParkingSlotDTO): Promise<ParkingSlot> {
    const parkingSlotRepository = getRepository(ParkingSlot);
    const parkingLot = await this.parkingLotService.findById(dto.parkingLotId);
    const parkingSlot = await this.findById(dto.id);

    parkingSlot.name = dto.name;
    parkingSlot.parkingLotId = parkingLot.id;

    await parkingSlotRepository.update(dto.id, parkingSlot);

    return parkingSlot;
  }

  async remove(id: string): Promise<ParkingSlot> {
    const parkingSlotRepository = getRepository(ParkingSlot);
    const parkingSlot = await this.findById(id);
    await parkingSlotRepository.delete({ id });

    return parkingSlot;
  }

  async findById(id: string): Promise<ParkingSlot> {
    const parkingSlotRepository = getRepository(ParkingSlot);
    const parkingSlot = await parkingSlotRepository.findOne({
      id,
    });

    if (!parkingSlot) {
      throw new ParkingSlotWithIDNotFound(id);
    }

    return parkingSlot;
  }
}

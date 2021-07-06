import { getRepository } from 'typeorm';

import ParkingSlot, { ParkingType } from '../models/parking-slot';
import { ParkingSlotWithIDNotFound } from '../error/parking-slot.service';
import { IResidenceService } from './residence';

export type CreateParkingSlotDTO = {
  name: string;
  parkingType: string;
  isAvailable: boolean;
  residenceId: string;
};

export type UpdatedParkingSlotDTO = {
  id: string;
  name?: string;
  isAvailable?: boolean;
};

export interface IParkingSlotService {
  getAll(): Promise<ParkingSlot[]>;
  create(residenceId: string, dto: CreateParkingSlotDTO): Promise<ParkingSlot>;
  update(dto: UpdatedParkingSlotDTO): Promise<ParkingSlot>;
  remove(id: string): Promise<ParkingSlot>;
  findById(id: string): Promise<ParkingSlot | null>;
}

export default class ParkingSlotService implements IParkingSlotService {
  private residenceService: IResidenceService;

  constructor(residenceService: IResidenceService) {
    this.residenceService = residenceService;
  }

  async getAll(): Promise<ParkingSlot[]> {
    const parkingSlotRepository = getRepository(ParkingSlot);
    const allParkingSlots = await parkingSlotRepository.find();

    return allParkingSlots;
  }

  async create(
    residenceId: string,
    dto: CreateParkingSlotDTO,
  ): Promise<ParkingSlot> {
    const parkingSlotRepository = getRepository(ParkingSlot);
    const residence = await this.residenceService.findById(residenceId);
    const parkingSlot = new ParkingSlot();

    parkingSlot.name = dto.name;
    parkingSlot.parkingType = dto.parkingType as ParkingType;
    parkingSlot.isAvailable = dto.isAvailable;
    parkingSlot.residenceId = residence.id;

    const createdParkingSlot = await parkingSlotRepository.save(parkingSlot);

    return createdParkingSlot;
  }

  async update(dto: UpdatedParkingSlotDTO): Promise<ParkingSlot> {
    const parkingSlotRepository = getRepository(ParkingSlot);
    const parkingSlot = await this.findById(dto.id);

    parkingSlot.name = dto.name;
    parkingSlot.isAvailable = dto.isAvailable;

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

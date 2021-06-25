import { getRepository } from 'typeorm';

import ParkingLot from '../models/parking-lot';
import { ParkingLotWithIDNotFound } from '../error/parking-lot.service';
import { IBuildingService } from './building';

export type CreateParkingLotDTO = {
  name: string;
};

export type UpdateParkingLotDTO = {
  id: string;
  name?: string;
};

export interface IParkingLotService {
  getAll(): Promise<ParkingLot[]>;
  create(buildingId: string, dto: CreateParkingLotDTO): Promise<ParkingLot>;
  update(dto: UpdateParkingLotDTO): Promise<ParkingLot>;
  remove(id: string): Promise<ParkingLot>;
  findById(id: string): Promise<ParkingLot>;
}

export default class ParkingLotService implements IParkingLotService {
  private buildingService: IBuildingService;

  constructor(buildingService: IBuildingService) {
    this.buildingService = buildingService;
  }

  async getAll(): Promise<ParkingLot[]> {
    const parkingLotRepository = getRepository(ParkingLot);
    const allParkingLots = await parkingLotRepository.find();

    return allParkingLots;
  }

  async create(
    buildingId: string,
    dto: CreateParkingLotDTO,
  ): Promise<ParkingLot> {
    const parkingLotRepository = getRepository(ParkingLot);
    const building = await this.buildingService.findById(buildingId);
    const parkingLot = new ParkingLot();

    parkingLot.name = dto.name;
    parkingLot.buildingId = building.id;

    const createdParkingLot = await parkingLotRepository.save(parkingLot);

    return createdParkingLot;
  }

  async update(dto: UpdateParkingLotDTO): Promise<ParkingLot> {
    const parkingLotRepository = getRepository(ParkingLot);
    const parkingLot = await this.findById(dto.id);

    parkingLot.name = dto.name;

    await parkingLotRepository.update(dto.id, parkingLot);

    return parkingLot;
  }

  async remove(id: string): Promise<ParkingLot> {
    const parkingLotRepository = getRepository(ParkingLot);
    const parkingLot = await this.findById(id);
    await parkingLotRepository.delete({ id });

    return parkingLot;
  }

  async findById(id: string): Promise<ParkingLot> {
    const parkingLotRepository = getRepository(ParkingLot);
    const parkingLot = await parkingLotRepository.findOne({
      id,
    });

    if (!parkingLot) {
      throw new ParkingLotWithIDNotFound(id);
    }

    return parkingLot;
  }
}

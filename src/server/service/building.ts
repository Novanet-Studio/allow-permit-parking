import { getRepository } from 'typeorm';

import { BuildingWithIDNotFound } from '../error/building.service';
import Building from '../models/building';

import type { IResidenceService } from './residence';

export type CreateBuildingDTO = {
  name: string;
};

export interface IBuildingService {
  getAll(): Promise<Building[]>;
  create(residenceId: string, dto: CreateBuildingDTO): Promise<Building>;
  remove(id: string): Promise<Building>;
  findById(id: string): Promise<Building>;
}

export default class BuildingService implements IBuildingService {
  private residenceService: IResidenceService;

  constructor(residenceService: IResidenceService) {
    this.residenceService = residenceService;
  }

  async getAll(): Promise<Building[]> {
    const buildingRepository = getRepository(Building);
    const allBuildings = await buildingRepository.find();

    return allBuildings;
  }

  async create(residenceId: string, dto: CreateBuildingDTO): Promise<Building> {
    const buildingRepository = getRepository(Building);
    const residence = await this.residenceService.findById(residenceId);
    const building = new Building();

    building.name = dto.name;
    building.residenceId = residence.id;

    const createdBuilding = await buildingRepository.save(building);

    return createdBuilding;
  }

  async remove(id: string): Promise<Building> {
    const buildingRepository = getRepository(Building);
    const building = await this.findById(id);
    await buildingRepository.delete({ id });

    return building;
  }

  async findById(id: string): Promise<Building> {
    const buildingRepository = getRepository(Building);
    const building = await buildingRepository.findOne({ id });

    if (!building) {
      throw new BuildingWithIDNotFound(id);
    }

    return building;
  }
}

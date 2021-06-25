import { getRepository } from 'typeorm';

import Residence from '../models/residence';
import { ResidenceWithIDNotFound } from '../error/residence.service';

import type { ESW } from '../../@types/esw';

export type CreateResidenceDTO = {
  name: string;
};

export type UpdateResidenceDTO = {
  id: string;
  name?: string;
};

export interface IResidenceService {
  getAll(): Promise<ESW.Residence[]>;
  create(dto: CreateResidenceDTO): Promise<Residence>;
  update(dto: UpdateResidenceDTO): Promise<Residence>;
  remove(id: string): Promise<Residence>;
  findById(id: string): Promise<Residence>;
}

export default class ResidenceService implements IResidenceService {
  async getAll(): Promise<ESW.Residence[]> {
    const residenceRepository = getRepository(Residence);

    const allResidences = await residenceRepository.find();

    const residences = allResidences.map((residence: Residence) =>
      residence.toPresentationLayer(),
    );

    return residences;
  }

  async create(dto: CreateResidenceDTO): Promise<Residence> {
    const residenceRepository = getRepository(Residence);

    const residence = new Residence();

    residence.name = dto.name;

    const createdResidence = await residenceRepository.save(residence);

    return createdResidence;
  }

  async update(dto: UpdateResidenceDTO): Promise<Residence> {
    const residenceRepository = getRepository(Residence);
    const residence = await this.findById(dto.id);

    residence.name = dto.name;

    await residenceRepository.update(dto.id, residence);

    return residence;
  }

  async remove(id: string): Promise<Residence> {
    const residenceRepository = getRepository(Residence);
    const residence = await this.findById(id);
    await residenceRepository.delete({ id });

    return residence;
  }

  async findById(id: string): Promise<Residence> {
    const residenceRepository = getRepository(Residence);
    const residence = await residenceRepository.findOne({ id });

    if (!residence) {
      throw new ResidenceWithIDNotFound(id);
    }

    return residence;
  }
}

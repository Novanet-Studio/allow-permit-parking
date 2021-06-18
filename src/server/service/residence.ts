import { getRepository } from 'typeorm';

import Residence from '../models/residence';
import { ResidenceWithIDNotFound } from '../error/residence.service';

export type CreateResidenceDTO = {
  name: string;
};

export interface IResidenceService {
  create(dto: CreateResidenceDTO): Promise<Residence>;
  findById(id: string): Promise<Residence>;
}

export default class ResidenceService implements IResidenceService {
  async create(dto: CreateResidenceDTO): Promise<Residence> {
    const residenceRepository = getRepository(Residence);

    const residence = new Residence();

    residence.name = dto.name;

    const createdResidence = await residenceRepository.save(residence);

    return createdResidence;
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

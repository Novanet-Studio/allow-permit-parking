import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Residence from './residence';
import ParkingLot from './parking-lot';

import type { ESW } from '../../@types/esw';

@Entity({ name: 'buildings' })
export default class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  name: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @ManyToOne(() => Residence, (residence) => residence.buildings)
  public residence: Residence;

  @Column({ nullable: false })
  residenceId: string;

  @OneToMany(() => ParkingLot, (parkingLot) => parkingLot.buildingId)
  public lots: ParkingLot[];

  public toPresentationLayer(): ESW.Building {
    return {
      id: this.id,
      name: this.name,
      residenceId: this.residenceId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Residence from './residence';

import type { ESW } from '../../@types/esw';

export enum ParkingType {
  Permit = 'permit',
  Reserved = 'reserved',
  Visitor = 'visitor',
}

@Entity({ name: 'parking_slots' })
export default class ParkingSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: ParkingType,
    default: ParkingType.Permit,
  })
  parkingType: ParkingType;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isAvailable: boolean;

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

  @ManyToOne(() => Residence, (residence) => residence.slots)
  public residence: Residence;

  @Column({ nullable: false })
  residenceId: string;

  public isAllowed(requiredParkingTypes: ParkingType[]): boolean {
    return requiredParkingTypes.includes(this.parkingType);
  }

  public toPresentationLayer(): ESW.ParkingSlot {
    return {
      id: this.id,
      name: this.name,
      parkingType: this.parkingType,
      residenceId: this.residenceId,
      createdAt: this.createdAt,
      updateAt: this.updatedAt,
    };
  }
}

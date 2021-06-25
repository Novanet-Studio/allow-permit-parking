import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import ParkingLot from './parking-lot';

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

  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.slots)
  public parkingLotId: string;

  public isAllowed(requiredParkingTypes: ParkingType[]): boolean {
    return requiredParkingTypes.includes(this.parkingType);
  }

  public toPresentationLayer(): ESW.ParkingSlot {
    return {
      id: this.id,
      name: this.name,
      parkingType: this.parkingType,
      parkingLotId: this.parkingLotId,
      createdAt: this.createdAt,
      updateAt: this.updatedAt,
    };
  }
}

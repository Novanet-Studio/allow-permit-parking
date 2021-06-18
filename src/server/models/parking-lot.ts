import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import ParkingSlot from './parking-slot';

import type { ESW } from '../../@types/esw';

@Entity({ name: 'parking_lots' })
export default class ParkingLot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 128,
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

  @OneToMany(() => ParkingSlot, (parkingSlot) => parkingSlot.parkingLotId)
  public slots: ParkingSlot[];

  public toPresentationLayer(): ESW.ParkingLot {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updateAt: this.updatedAt,
    };
  }
}

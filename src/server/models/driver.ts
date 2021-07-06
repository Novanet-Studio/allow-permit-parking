import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';

import User from './user';
import Vehicle from './vehicle';

import type { ESW } from '../../@types/esw';

@Entity({ name: 'drivers ' })
export default class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  isResident: boolean;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  NID: string;

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

  @ManyToOne(() => User, (user) => user.id)
  public user: User;

  @Column({ nullable: false })
  userId: string;

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.id)
  @JoinTable()
  public vehicle: Vehicle[];

  @Column({ nullable: false })
  vehicleId: string;

  public toPresentationLayer(): ESW.Driver {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      vehicleId: this.vehicleId,
      userId: this.userId,
      isResident: this.isResident,
      NID: this.NID,
      createdAt: this.createdAt,
      updateAt: this.updatedAt,
    };
  }
}

import { Role } from '../server/models/user';
import { ParkingType } from '../server/models/parking-slot';

declare namespace ESW {
  interface JwtToken {
    email: string;
    iat: number;
    exp: number;
  }

  interface User {
    id: string;
    email: string;
    role: Role;
    createdAt: Date;
    updateAt: Date;
  }

  interface Residence {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Building {
    id: string;
    name: string;
    residenceId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  interface ParkingLot {
    id: string;
    name: string;
    buildingId: string;
    createdAt: Date;
    updateAt: Date;
  }

  interface ParkingSlot {
    id: string;
    name: string;
    parkingType: ParkingType;
    parkingLotId: string;
    createdAt: Date;
    updateAt: Date;
  }

  interface Driver {
    id: string;
    firstName: string;
    lastName: string;
    vehicleId: string;
    userId: string;
    isResident: boolean;
    NID: string;
    createdAt: Date;
    updateAt: Date;
  }

  interface Vehicle {
    id: string;
    license: string;
    color: string;
    model: string;
    brand: string;
    driverId: string;
  }
}

export class ParkingSlotWithIDNotFound extends Error {
  constructor(id: string) {
    super(`A Parking Slot with ID: ${id} doesn't exists`);

    this.name = 'ParkingSlotWithIDNotFound';
  }
}

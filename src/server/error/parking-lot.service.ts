export class ParkingLotNotFound extends Error {
  constructor(criteria: string, value: string) {
    super(`No parking lot with "${criteria}": ${value}, found`);

    this.name = 'ParkingLotNotFound';
  }
}

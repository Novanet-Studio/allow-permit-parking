export class ResidenceWithIDNotFound extends Error {
  constructor(id: string) {
    super(`Residence with ID: ${id} doesn't exists`);

    this.name = 'ResidenceWithIDNotFound';
  }
}

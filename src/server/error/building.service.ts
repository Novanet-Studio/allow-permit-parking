export class BuildingWithIDNotFound extends Error {
  constructor(id: string) {
    super(`Building with ID: ${id} doesn't exists`);

    this.name = 'BuildingWithIDNotFound';
  }
}

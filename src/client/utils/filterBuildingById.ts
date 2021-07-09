import { ESW } from '../../@types/esw';

export default function filterBuildingById(
  residenceId: string,
  buildings: ESW.Building[],
) {
  if (!residenceId || !buildings) {
    return;
  }

  const buildingsFiltred = buildings.filter(
    (building) => building.residenceId === residenceId,
  );

  return buildingsFiltred;
}

type RangeParams = {
  starting: number;
  ending: number;
  prefix?: string;
};

const generateRange = (starting: number, ending: number) => {
  const rangeArray = [];

  for (; starting <= ending; starting++) {
    rangeArray.push(starting);
  }

  return rangeArray;
};

export default function range({
  starting,
  ending,
  prefix,
}: RangeParams): string[] {
  const finalRange: number[] = generateRange(starting, ending);
  const stringRange = finalRange.map((value) =>
    prefix ? `${prefix}${value}` : value + '',
  );
  return stringRange;
}

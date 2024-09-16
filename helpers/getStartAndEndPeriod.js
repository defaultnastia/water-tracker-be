const getStartAndEndOfPeriod = (year, month, day) => {
  let startPeriod;
  let endPeriod;
  if (!day) {
    startPeriod = new Date(year, month - 1, 1).getTime();
    endPeriod = new Date(year, month, 0).getTime();
  } else {
    startPeriod = new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
    endPeriod = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
  }

  return { startPeriod, endPeriod };
};

export default getStartAndEndOfPeriod;

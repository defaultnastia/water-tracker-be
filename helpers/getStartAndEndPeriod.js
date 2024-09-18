const getStartAndEndOfPeriod = (year, month, day) => {
  let startPeriod;
  let endPeriod;
  if (!day) {
    startPeriod = new Date(year, month - 1, 1);
    endPeriod = new Date(year, month, 0);
  } else {
    startPeriod = new Date(year, month - 1, day, 0, 0, 0, 0);
    endPeriod = new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  return { startPeriod, endPeriod };
};

export default getStartAndEndOfPeriod;

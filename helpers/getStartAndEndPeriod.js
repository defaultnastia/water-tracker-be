const getStartAndEndOfPeriod = (year, month, day, timezoneOffset) => {
  let startPeriod;
  let endPeriod;
  let startPeriodLTZ;
  let endPeriodLTZ;

  const adjustTimezone = (time) => {
    const offsetTime = new Date(time + timezoneOffset * 60 * 1000);

    return offsetTime;
  };

  if (!day) {
    startPeriod = new Date(year, month - 1, 1);
    startPeriodLTZ = adjustTimezone(startPeriod);
    endPeriod = new Date(year, month, 0);
    endPeriodLTZ = adjustTimezone(endPeriod);
  } else {
    startPeriod = new Date(year, month - 1, day, 0, 0, 0, 0);
    startPeriodLTZ = adjustTimezone(startPeriod);
    endPeriod = new Date(year, month - 1, day, 23, 59, 59, 999);
    endPeriodLTZ = adjustTimezone(endPeriod);
  }

  return { startPeriodLTZ, endPeriodLTZ };
};

export default getStartAndEndOfPeriod;


export const fetchTrackersInRange = (from, to) => {

  return Promise.resolve(`Fetching trackers from ${from} to ${to}`);
};

export const fetchTrackersForDate = (date) => {
  
  return Promise.resolve(`Fetching trackers for date: ${date}`);
};

export const fetchTrackersForDayMonthYear = (day, month, year) => {

  return Promise.resolve(
    `Fetching trackers for day: ${day}, month: ${month}, year: ${year}`
  );
};

export const fetchTrackersForMonthYear = (month, year) => {

  return Promise.resolve(
    `Fetching trackers for month: ${month}, year: ${year}`
  );
};


export const fetchAllTrackers = () => {
 
  return Promise.resolve("Fetching all trackers");
};

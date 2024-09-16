
import express from "express";
import {
  fetchTrackersInRange,
  fetchTrackersForDate,
  fetchTrackersForDayMonthYear,
  fetchTrackersForMonthYear,
  fetchAllTrackers,
} from "../controllers/trackersController.js"; 

const router = express.Router();


router.get("/", (req, res) => {
  const { from, to, date, day, month, year } = req.query;


  if (from && to) {
    const fromDate = new Date(parseInt(from));
    const toDate = new Date(parseInt(to));
    return fetchTrackersInRange(fromDate, toDate)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: err.message }));
  }


  if (date) {
    const parsedDay = date.slice(0, 2);
    const parsedMonth = date.slice(2, 4);
    const parsedYear = date.slice(4, 8);
    const specificDate = new Date(parsedYear, parsedMonth - 1, parsedDay);
    return fetchTrackersForDate(specificDate)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: err.message }));
  }


  if (day && month && year) {
    return fetchTrackersForDayMonthYear(day, month, year)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: err.message }));
  }

  
  if (month && year) {
    return fetchTrackersForMonthYear(month, year)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ error: err.message }));
  }

 
  return fetchAllTrackers()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ error: err.message }));
});

export default router;

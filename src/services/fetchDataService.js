const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

function getWeekNumber(date) {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
  const week1 = new Date(target.getFullYear(), 0, 4);
  return Math.round(((target - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

async function fetchDataService(date) {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const week = getWeekNumber(formattedDate);
  const queryString = `dspy=${year}&dspp=${week}`;
  const target = `${BASE_URL}${queryString}`;

  try {
    const response = await fetch(target);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, chart: data, error: '' };
  } catch (error) {
    return { success: false, chart: [], error: `Error fetching data: ${error.message}` };
  }
}

export default fetchDataService;

const startDate = new Date("2023-07-31T04:00:00.000Z")
export const getDay = () => {
  return daysBetween(startDate, new Date())
}

export const getNextDayDate = () => {
  const newDate = new Date(startDate.valueOf())
  newDate.setDate(newDate.getDate()+getDay()+1)
  return newDate
}

function treat(date: any) {
  const result = new Date(date);
  // result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetween(startDate: any, endDate: any) {
  return Math.floor((treat(endDate).valueOf() - treat(startDate).valueOf()) / (1000 * 60 * 60 * 24));
}

const startDate = new Date("2023-07-31")
export const getDay = () => {
  const now = new Date()
  const days = Math.floor((now.getTime()-startDate.getTime())/(1000*60*60*24))
  return days
}
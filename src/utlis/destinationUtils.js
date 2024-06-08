// utils/destinationUtils.js

export const calculateDaysAndMonths = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    return { days, months };
  };
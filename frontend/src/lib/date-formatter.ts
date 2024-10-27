export const formatRMDatePicker = (date: any) => {
  // Format the date as 'YYYY-MM-DD'
  const day = date?.day?.toString()?.padStart(2, "0");
  const month = date?.month?.number?.toString()?.padStart(2, "0");
  const year = date?.year;

  return `${day}-${month}-${year}`;
};


export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


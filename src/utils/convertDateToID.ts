interface IConfig {
  withTime?: boolean;
}

export const convertDateToID = (dateStr: Date, config?: IConfig) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const indonesianDate = date.toLocaleDateString("id-ID", options);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  const time = date.toLocaleTimeString("id-ID", timeOptions);

  return `${indonesianDate}${config?.withTime ? ` ,${time}` : ""}
`;
};

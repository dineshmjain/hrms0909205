import moment from "moment/moment";

export function checkDataFucntion(labels, data, feild, serch) {
  switch (labels?.[feild]?.type) {
    case "object":
      let obj = data?.[labels?.[feild]?.objectName];
      if (
        obj?.[feild] &&
        obj?.[feild]?.toString()?.toLowerCase().includes(serch.toLocaleLowerCase())
      ) {
        return true;
      }

      break;
    case "date":
      let FormattedDate = moment(data?.[feild])?.format("DD-MM-yyyy");

      if (data?.[feild] && FormattedDate?.includes(serch?.toLocaleLowerCase())) {
        return true;
      }
      break;
    case "time":
      let displayedTime = moment(data?.[feild])
        ?.format(labels?.[feild]?.format || "hh:mm A")
        ?.toLocaleLowerCase();

      if (data?.[feild] && displayedTime?.includes(serch?.toLocaleLowerCase())) {
        return true;
      }
      break;
    case "count":
      if (
        data?.[feild] &&
        data?.[feild]?.toString()?.toLowerCase()?.includes(serch?.toLocaleLowerCase())
      ) {
        return true;
      }

      break;
    default:
      if (
        data?.[feild] &&
        data?.[feild]?.toString()?.toLowerCase()?.includes(serch?.toLocaleLowerCase())
      ) {
        return true;
      }
      break;
  }
}

export function objectSort(data, sortData, labels, feildName, ObjName) {

  let temp = [...data]
  temp.sort((a, b) => {

    // Get the value to sort by and try converting them to numbers


    const valueA = a?.[ObjName]?.[feildName];
    const valueB = b?.[ObjName]?.[feildName];

    const numA = parseFloat(valueA); // Try converting to number
    const numB = parseFloat(valueB); // Try converting to number

    // Check if both values are valid numbers (not NaN)
    const isValidNumberA = !isNaN(numA);
    const isValidNumberB = !isNaN(numB);

    if (isValidNumberA && isValidNumberB) {
      // If both values can be converted to valid numbers, sort numerically
      return sortData.direction === 1 ? numA - numB : numB - numA;
    }

    // If one or both values are not valid numbers, fall back to lexicographical comparison
    if (valueA < valueB) return sortData.direction === 1 ? -1 : 1;
    if (valueA > valueB) return sortData.direction === 1 ? 1 : -1;
    return 0;
  });
  return temp
}
export function normalSort(data, sortData) {

  let temp = [...data]
  temp.sort((a, b) => {
    // Get the value to sort by and try converting them to numbers
    const valueA = a?.[sortData?.name] || 0;
    const valueB = b?.[sortData?.name] || 0;

    const numA = parseFloat(valueA); // Try converting to number
    const numB = parseFloat(valueB);// Try converting to number

    // Check if both values are valid numbers (not NaN)
    const isValidNumberA = !isNaN(numA);
    const isValidNumberB = !isNaN(numB);

    if (isValidNumberA && isValidNumberB) {
      // If both values can be converted to valid numbers, sort numerically
      return sortData.direction === 1 ? numA - numB : numB - numA;
    }

    // If one or both values are not valid numbers, fall back to lexicographical comparison
    if (valueA < valueB) return sortData.direction === 1 ? -1 : 1;
    if (valueA > valueB) return sortData.direction === 1 ? 1 : -1;
    return 0;
  });


  return temp;
}
export function dateSort(data, sortData) {

  let temp = [...data]
  temp.sort((a, b) => {
    // Get the value to sort by and try converting them to numbers
    const valueA = new Date(a[sortData?.name]) || 0;
    const valueB = new Date(b[sortData?.name]) || 0;

    const numA = parseFloat(valueA); // Try converting to number
    const numB = parseFloat(valueB);// Try converting to number

    // Check if both values are valid numbers (not NaN)
    const isValidNumberA = !isNaN(numA);
    const isValidNumberB = !isNaN(numB);

    if (isValidNumberA && isValidNumberB) {
      // If both values can be converted to valid numbers, sort numerically
      return sortData.direction === 1 ? numA - numB : numB - numA;
    }

    // If one or both values are not valid numbers, fall back to lexicographical comparison
    if (valueA < valueB) return sortData.direction === 1 ? -1 : 1;
    if (valueA > valueB) return sortData.direction === 1 ? 1 : -1;
    return 0;
  });


  return temp;
}
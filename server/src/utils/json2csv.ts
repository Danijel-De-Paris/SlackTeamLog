export const json2csv = (items: Array<any>, header: Array<string>): string => {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const csv = [
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');
    return csv;
}
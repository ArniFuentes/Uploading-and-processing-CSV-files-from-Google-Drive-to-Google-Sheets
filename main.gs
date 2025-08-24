function main() {
  const ss = SpreadsheetApp.openById(sheetId);

  const files = getCsvFilesFromFolder(folderId);

  files.forEach((file) => {
    Logger.log(`Processing: ${file.getName()}`);

    const data = readCsvFile(file, DELIMITERS); // 2D list

    if (!data.length) return;

    const transformedData = processCsvData(data, NEW_PROPERTIES, PRICES);

    const dataReady = buildOutput(transformedData, headers);

    const sheetName = file.getName();
    const sheet = ss.insertSheet(sheetName);

    sheet
      .getRange(1, 1, dataReady.length, dataReady[0].length)
      .setValues(dataReady);
  });
}

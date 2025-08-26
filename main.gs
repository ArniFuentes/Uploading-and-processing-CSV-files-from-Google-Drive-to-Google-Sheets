function main() {
  const ss = SpreadsheetApp.openById(sheetId);
  const files = getCsvFilesFromFolder(folderId);

  files.forEach((file) => {
    Logger.log(`Processing: ${file.getName()}`);

    const data = readCsvFile(file, DELIMITERS); // 2D list

    if (!data.length) return;

    const processedCsv = processCsv(data);

    const sheetName = file.getName();
    const sheet = ss.insertSheet(sheetName);

    sheet
      .getRange(1, 1, processedCsv.length, processedCsv[0].length)
      .setValues(processedCsv);
  });
}

function main() {
  const ss = SpreadsheetApp.openById(sheetId);
  const files = getCsvFilesFromFolder(folderId);

  files.forEach((file) => {
    Logger.log(`Processing: ${file.getName()}`);

    const data = readCsvFile(file, DELIMITERS); // 2D list

    if (!data.length) return;

    const originalHeaders = data[0];
    const originalHeadersRenamed = renameOriginalHeaders(originalHeaders, NEW_PROPERTIES);

    const stores = extractStores(originalHeadersRenamed);

    const dataHeadersChanged = buildRecords(data, originalHeadersRenamed);

    const dataStructureChanged = buildChangedDataStructure(dataHeadersChanged, stores,PRICES);

    const finalData = removeDuplicates(dataStructureChanged);
    const finalDataPlusFinalHeaders = buildOutput(finalData, finalHeaders);

    const sheetName = file.getName();
    const sheet = ss.insertSheet(sheetName);

    sheet
      .getRange(
        1,
        1,
        finalDataPlusFinalHeaders.length,
        finalDataPlusFinalHeaders[0].length
      )
      .setValues(finalDataPlusFinalHeaders);
  });
}

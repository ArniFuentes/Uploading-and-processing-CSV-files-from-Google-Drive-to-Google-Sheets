function getCsvFilesFromFolder(folderId) {
  const folder = DriveApp.getFolderById(folderId);
  const files = [];
  const fileIter = folder.getFilesByType(MimeType.CSV);

  while (fileIter.hasNext()) {
    files.push(fileIter.next());
  }
  return files;
}

function readCsvFile(file, delimiters) {
  const csvString = file.getBlob().getDataAsString();

  for (const d of delimiters) {
    try {
      const data = Utilities.parseCsv(csvString, d); // 2D list

      const numberOfColumns = 93;
      if (data[0].length === numberOfColumns) return data;
    } catch {
      console.log(`The delimiter did not work ${d}`);
    }
  }
  return [];
}

function processCsv(data) {
  const originalHeadersRenamed = renameOriginalHeaders(data[0]);
  const stores = extractStores(originalHeadersRenamed);
  const dataHeadersChanged = buildRecords(data, originalHeadersRenamed);
  const dataStructureChanged = buildChangedDataStructure(dataHeadersChanged, stores);
  const finalData = removeDuplicates(dataStructureChanged);
  const finalDataPlusFinalHeaders = buildOutput(finalData);
  return finalDataPlusFinalHeaders;
}

function buildRecords(rows, headers) {
  const data = rows.slice(1);
  return data.map((row) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = row[i]));
    return obj;
  });
}

function extractStores(headers) {
  return headers
    .filter((h) => h.startsWith("Sku "))
    .map((h) => h.replace("Sku ", ""));
}

function buildChangedDataStructure(records, stores) {
  const prices = [
    ["Normal price", "Normal price {}"],
    ["Card price", "Card price {}"],
  ];
  const result = [];
  for (const r of records) {
    for (const store of stores) {
      if (r[`Sku ${store}`] && r[`Stock ${store}`] === "in_stock") {
        for (const [priceType, colPattern] of prices) {
          const colName = colPattern.replace("{}", store);
          result.push([
            r[`Sku ${store}`],
            r["Category"],
            r["Brand"],
            r["Name"],
            r[colName],
            priceType,
            r[`Stock ${store}`],
            store,
            r["Store A update date and time"],
          ]);
        }
      }
    }
  }
  return result;
}

function buildOutput(rows) {
  const finalHeaders = [
    "SKU",
    "Category",
    "Brand",
    "Name",
    "Price",
    "Price Type",
    "Stock",
    "Store",
    "Date",
  ];

  if (!rows) throw new Error("missing arguments");
  return [finalHeaders, ...rows];
}

function renameOriginalHeaders(headers) {
  const newProperties = {
    "Normal price": "Normal price Store A",
    "Card price": "Card price Store A",
    SKU: "Sku Store A",
    URL: "URL Store A",
    "Has stock": "Stock Store A",
  };
  return headers.map((key) => newProperties[key] || key);
}

function removeDuplicates(arr) {
  const seen = new Set();
  const unique = [];

  for (const row of arr) {
    const key = row.join("|");
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(row);
    }
  }
  return unique;
}

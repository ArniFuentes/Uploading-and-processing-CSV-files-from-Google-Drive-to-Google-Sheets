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

function buildChangedDataStructure(records, stores, prices) {
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

function buildOutput(rows, headers) {
  if (!rows || !headers) throw new Error("missing arguments");
  return [headers, ...rows];
}

function renameOriginalHeaders(headers, mapping) {
  return headers.map((key) => mapping[key] || key);
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

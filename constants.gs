const sheetId = PropertiesService.getScriptProperties().getProperty("sheetId");

const folderId = PropertiesService.getScriptProperties().getProperty("folderId");

const ENCODINGS = ["Windows-1252", "utf-8", "utf-8-sig", "latin-1", "cp1252"];

const DELIMITERS = [",", ";"];

const NEW_PROPERTIES = {
  "Normal price": "Normal price Store A",
  "Card price": "Card price Store A",
  SKU: "Sku Store A",
  URL: "URL Store A",
  "Has stock": "Stock Store A",
};

const PRICES = [
  ["Normal price", "Normal price {}"],
  ["Card price", "Card price {}"],
];

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

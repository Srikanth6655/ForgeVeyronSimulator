// src/utils/currencyPresets.js

export const forge = {
  standard: [
    { name: "United States Dollar", code: "USD", multiplier: 1, format: "$#,###.##" },
    { name: "Malaysian Ringgit", code: "MYR", multiplier: 5, format: "RM#,###.##" },
    { name: "South African Rand", code: "ZAR", multiplier: 10, format: "R #,###.##" },
    { name: "Zambian Kwacha", code: "ZMW", multiplier: 20, format: "K#,###.##" },
    { name: "Philippine Peso", code: "PHP", multiplier: 50, format: "Php #,###.##" },
    { name: "Icelandic Króna", code: "ISK", multiplier: 200, format: "#.###,## kr." },
  ],
  lvc: [
    { name: "Chilean Peso", code: "CLP", multiplier: 500, format: "$ # ###,##" },
    { name: "Cambodian Riel", code: "KHR", multiplier: 1000, format: "៛#,###" },
    { name: "Guinean Franc", code: "GNF", multiplier: 2000, format: "FG#,###" },
    { name: "Paraguayan Guarani", code: "PYG", multiplier: 5000, format: "₲#,###.##" },
    { name: "Indonesian Rupiah", code: "IDR", multiplier: 10000, format: "Rp#.###,##" },
  ],
  newForge: [
    { name: "Argentine Peso", code: "ARS", multiplier: 400, format: "$ #.###,##" },
    { name: "Chilean Peso", code: "CLP", multiplier: 600, format: "$ # ###,##" },
    { name: "Peruvian Nuevo Sol", code: "PEN", multiplier: 5, format: "S/. #,###.##" },
    { name: "Paraguayan Guarani", code: "PYG", multiplier: 3500, format: "₲#,###.##" },
  ],
  hybrid: [
  { name: "Yuan Renminbi", code: "CNY", minMultiplier: 5, defaultMultiplier: 5, maxMultiplier: 10, format: "¥#,###.##" },
  { name: "Argentine Peso", code: "ARS", minMultiplier: 250, defaultMultiplier: 250, maxMultiplier: 50, format: "$ #.###,##" },
  ],
};

export const veyron = {
  bet: [
    { name: "Malaysian Ringgit", code: "MYR", multiplier: 5, format: "$#,###.##" },
    { name: "Argentine Peso", code: "ARS", multiplier: 200, format: "$ #.###,##" },
    { name: "Indonesian Rupiah", code: "IDR", multiplier: 200, format: "$#,###.##" },
    { name: "Vietnamese Dong", code: "VND", multiplier: 200, format: "$#,###.##" },
    { name: "Thai Baht", code: "THB", multiplier: 50, format: "$#,###.##" },
    { name: "Korean Won", code: "KRW", multiplier: 200, format: "$#,###.##" },
    { name: "Chilean Peso", code: "CLP", multiplier: 200, format: "$#,###.##" },
    { name: "Nigerian Naira", code: "NGN", multiplier: 100, format: "$#,###.##" },
    { name: "Colombian Peso", code: "COP", multiplier: 200, format: "$#,###.##" },
    { name: "Tanzanian Shilling", code: "TZS", multiplier: 200, format: "$#,###.##" },
    { name: "Ugandan Shilling", code: "UGX", multiplier: 200, format: "$#,###.##" },
    { name: "Paraguayan Guarani", code: "PYG", multiplier: 200, format: "$#,###.##" },
  ],
  lvc: [
    { name: "Malaysian Ringgit", code: "MYR", multiplier: 5, format: "$#,###.##" },
    { name: "Indonesian Rupiah", code: "IDR", multiplier: 10000, format: "$#,###.##" },
    { name: "Vietnamese Dong", code: "VND", multiplier: 10000, format: "$#,###.##" },
    { name: "Thai Baht", code: "THB", multiplier: 50, format: "$#,###.##" },
    { name: "Korean Won", code: "KRW", multiplier: 1000, format: "$#,###.##" },
    { name: "Chilean Peso", code: "CLP", multiplier: 500, format: "$#,###.##" },
    { name: "Nigerian Naira", code: "NGN", multiplier: 500, format: "$#,###.##" },
    { name: "Colombian Peso", code: "COP", multiplier: 1000, format: "$#,###.##" },
    { name: "Tanzanian Shilling", code: "TZS", multiplier: 1000, format: "$#,###.##" },
    { name: "Ugandan Shilling", code: "UGX", multiplier: 1000, format: "$#,###.##" },
    { name: "Paraguayan Guarani", code: "PYG", multiplier: 5000, format: "$#,###.##" },
  ],
  cep: [
    { name: "Malaysian Ringgit", code: "MYR", multiplier: 5, format: "$#,###.##" },
    { name: "Indonesian Rupiah", code: "IDR", multiplier: 200, format: "$#,###.##" },
    { name: "Vietnamese Dong", code: "VND", multiplier: 200, format: "$#,###.##" },
    { name: "Thai Baht", code: "THB", multiplier: 20, format: "$#,###.##" },
    { name: "Korean Won", code: "KRW", multiplier: 200, format: "$#,###.##" },
    { name: "Chilean Peso", code: "CLP", multiplier: 200, format: "$#,###.##" },
    { name: "Nigerian Naira", code: "NGN", multiplier: 200, format: "$#,###.##" },
    { name: "Colombian Peso", code: "COP", multiplier: 200, format: "$#,###.##" },
    { name: "Tanzanian Shilling", code: "TZS", multiplier: 200, format: "$#,###.##" },
    { name: "Ugandan Shilling", code: "UGX", multiplier: 200, format: "$#,###.##" },
    { name: "Paraguayan Guarani", code: "PYG", multiplier: 200, format: "$#,###.##" },
  ],
  hybrid: [
    { name: "Yuan Renminbi", code: "CNY", minMultiplier: 5, defaultMultiplier: 5, maxMultiplier: 10, format: "¥#,###.##" },
    // ARS removed from hybrid
  ],
};

// Add default export so existing imports work
export default { forge, veyron };

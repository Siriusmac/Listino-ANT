/* Trascritto e controllato sui quattro listini 2026 Rev. 1, pagina 1.
   Prezzi in centesimi, IVA esclusa. null = non quotato; false = non disponibile. */
(function (root) {
  const catalogue = {
  "verified": true,
  "sources": [
    {
      "file": "Ant 2.0 Listino 2026 Lite-Rev.1.pdf",
      "revision": "Rev. 1",
      "pages": "1",
      "sha256": "5599f49526181bb4827fc83dcb07f76f6a34645967a768e26cc37cf1c98e96cd"
    },
    {
      "file": "Ant 2.0 Listino Industry 26-Rev.1.pdf",
      "revision": "Rev. 1",
      "pages": "1",
      "sha256": "fcb9c0633d8144bf4813afbffec385a0d3029fa60111fe6e609c5efc71509f25"
    },
    {
      "file": "Ant PRO Listino 2026- Rev.1.pdf",
      "revision": "Rev. 1",
      "pages": "1",
      "sha256": "7d50eff6147dbafb54c2c43b3345ae1878995a0b4de7b3a4b57eabe7f103c042"
    },
    {
      "file": "Listino trasporti 2026-Rev.1 copia.pdf",
      "revision": "Rev. 1",
      "pages": "1",
      "sha256": "3bfcbb2e06832904762c1b8a853404a05c0af0c1b682129016fd5d6340a92e7b"
    }
  ],
  "products": [
    {
      "power": 15,
      "line": "Lite",
      "base": 900000,
      "meter": false,
      "IP54": null,
      "IP65": null
    },
    {
      "power": 22,
      "line": "Lite",
      "base": 1000000,
      "meter": false,
      "IP54": null,
      "IP65": null
    },
    {
      "power": 30,
      "line": "Lite",
      "base": 1150000,
      "meter": false,
      "IP54": null,
      "IP65": null
    },
    {
      "power": 45,
      "line": "Lite",
      "base": 1380000,
      "meter": false,
      "IP54": null,
      "IP65": null
    },
    {
      "power": 60,
      "line": "Lite",
      "base": 1625000,
      "meter": 600000,
      "IP54": null,
      "IP65": null
    },
    {
      "power": 75,
      "line": "Lite",
      "base": 1740000,
      "meter": 650000,
      "IP54": null,
      "IP65": null
    },
    {
      "power": 100,
      "line": "Lite",
      "base": 2300000,
      "meter": 700000,
      "IP54": null,
      "IP65": null
    },
    {
      "power": 120,
      "line": "Lite",
      "base": 2500000,
      "meter": 700000,
      "IP54": null,
      "IP65": null
    },
    {
      "power": 150,
      "line": "Industry",
      "base": 3250000,
      "meter": 718000,
      "IP54": 700000,
      "IP65": 1000000
    },
    {
      "power": 200,
      "line": "Industry",
      "base": 3700000,
      "meter": 843000,
      "IP54": 1000000,
      "IP65": 1300000
    },
    {
      "power": 300,
      "line": "Industry",
      "base": 4500000,
      "meter": 1010000,
      "IP54": 1200000,
      "IP65": 1600000
    },
    {
      "power": 400,
      "line": "Industry",
      "base": 5900000,
      "meter": 1133000,
      "IP54": 1500000,
      "IP65": 1900000
    },
    {
      "power": 500,
      "line": "Industry",
      "base": 8000000,
      "meter": 1245000,
      "IP54": 1800000,
      "IP65": 2200000
    },
    {
      "power": 600,
      "line": "Industry",
      "base": 10125000,
      "meter": 1350000,
      "IP54": 2100000,
      "IP65": 2400000
    },
    {
      "power": 700,
      "line": "Industry",
      "base": 12142700,
      "meter": 1580000,
      "IP54": 2400000,
      "IP65": 2700000
    },
    {
      "power": 800,
      "line": "Industry",
      "base": 13400000,
      "meter": 1900000,
      "IP54": 2700000,
      "IP65": 3300000
    },
    {
      "power": 1000,
      "line": "Industry",
      "base": 16610000,
      "meter": 2200000,
      "IP54": 3000000,
      "IP65": 3500000
    },
    {
      "power": 1200,
      "line": "Industry",
      "base": 19300000,
      "meter": 2200000,
      "IP54": 3400000,
      "IP65": 4000000
    },
    {
      "power": 1500,
      "line": "Industry",
      "base": 23800000,
      "meter": 2600000,
      "IP54": 3800000,
      "IP65": 4500000
    },
    {
      "power": 1700,
      "line": "Industry",
      "base": 29100000,
      "meter": 2600000,
      "IP54": 4100000,
      "IP65": 5000000
    },
    {
      "power": 2000,
      "line": "Industry",
      "base": 33500000,
      "meter": 3100000,
      "IP54": 4500000,
      "IP65": 5500000
    },
    {
      "power": 2500,
      "line": "Industry",
      "base": 44000000,
      "meter": 3100000,
      "IP54": 5000000,
      "IP65": 6000000
    },
    {
      "power": 3000,
      "line": "Industry",
      "base": 50000000,
      "meter": 3600000,
      "IP54": 5500000,
      "IP65": 6500000
    },
    {
      "power": 3500,
      "line": "Industry",
      "base": 60000000,
      "meter": 4000000,
      "IP54": 6000000,
      "IP65": 8500000
    },
    {
      "power": 4000,
      "line": "Industry",
      "base": 77500000,
      "meter": 4500000,
      "IP54": 6500000,
      "IP65": 9000000
    },
    {
      "power": 150,
      "line": "PRO",
      "base": 4200000,
      "meter": false,
      "IP54": 800000,
      "IP65": 1200000
    },
    {
      "power": 200,
      "line": "PRO",
      "base": 4700000,
      "meter": false,
      "IP54": 1000000,
      "IP65": 1500000
    },
    {
      "power": 300,
      "line": "PRO",
      "base": 5600000,
      "meter": false,
      "IP54": 1200000,
      "IP65": 1700000
    },
    {
      "power": 400,
      "line": "PRO",
      "base": 7700000,
      "meter": false,
      "IP54": 1600000,
      "IP65": 2000000
    },
    {
      "power": 500,
      "line": "PRO",
      "base": 9500000,
      "meter": false,
      "IP54": 2000000,
      "IP65": 2400000
    },
    {
      "power": 600,
      "line": "PRO",
      "base": 13000000,
      "meter": false,
      "IP54": 2400000,
      "IP65": 2700000
    },
    {
      "power": 700,
      "line": "PRO",
      "base": 16500000,
      "meter": false,
      "IP54": 2600000,
      "IP65": 3000000
    },
    {
      "power": 800,
      "line": "PRO",
      "base": 20000000,
      "meter": false,
      "IP54": 2800000,
      "IP65": 3500000
    },
    {
      "power": 1000,
      "line": "PRO",
      "base": 23000000,
      "meter": false,
      "IP54": 3000000,
      "IP65": 3900000
    },
    {
      "power": 1200,
      "line": "PRO",
      "base": 26000000,
      "meter": false,
      "IP54": 3300000,
      "IP65": 4200000
    },
    {
      "power": 1500,
      "line": "PRO",
      "base": 32000000,
      "meter": false,
      "IP54": 3600000,
      "IP65": 4500000
    },
    {
      "power": 1700,
      "line": "PRO",
      "base": 35000000,
      "meter": false,
      "IP54": 3800000,
      "IP65": 4800000
    },
    {
      "power": 2000,
      "line": "PRO",
      "base": 42500000,
      "meter": false,
      "IP54": 4000000,
      "IP65": 5000000
    },
    {
      "power": 2500,
      "line": "PRO",
      "base": 48500000,
      "meter": false,
      "IP54": 4200000,
      "IP65": 6100000
    },
    {
      "power": 3000,
      "line": "PRO",
      "base": 60000000,
      "meter": false,
      "IP54": 5500000,
      "IP65": 6500000
    },
    {
      "power": 3500,
      "line": "PRO",
      "base": 74000000,
      "meter": false,
      "IP54": 6100000,
      "IP65": 7500000
    },
    {
      "power": 4000,
      "line": "PRO",
      "base": 97500000,
      "meter": false,
      "IP54": 6700000,
      "IP65": 8600000
    }
  ],
  "transport": {
    "15": 70000,
    "22": 70000,
    "30": 70000,
    "45": 70000,
    "60": 90000,
    "75": 90000,
    "100": 100000,
    "120": 100000,
    "150": 130000,
    "200": 130000,
    "300": 150000,
    "400": 150000,
    "500": 170000,
    "600": 170000,
    "700": 200000,
    "800": 250000,
    "1000": 350000
  }
};
  if (typeof module !== 'undefined' && module.exports) module.exports = catalogue;
  else root.ANT_CATALOGUE = catalogue;
})(typeof globalThis !== 'undefined' ? globalThis : this);

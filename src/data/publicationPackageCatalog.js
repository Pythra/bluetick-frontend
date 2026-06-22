/** Publication platform catalog for partner pricing. */

export function parsePublicationPrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  return parseInt(String(priceStr).replace(/[^\d]/g, ''), 10) || 0;
}

export const PUBLICATION_CATEGORIES = [
  {
    "id": "african",
    "title": "African News",
    "platforms": [
      {
        "name": "Punch",
        "priceValue": 80000
      },
      {
        "name": "BusinessDay",
        "priceValue": 80000
      },
      {
        "name": "Legit",
        "priceValue": 300000
      },
      {
        "name": "The Nation",
        "priceValue": 60000
      },
      {
        "name": "Independent",
        "priceValue": 20000
      },
      {
        "name": "Vanguard",
        "priceValue": 30000
      },
      {
        "name": "ThisDay",
        "priceValue": 30000
      },
      {
        "name": "SunOnline",
        "priceValue": 30000
      },
      {
        "name": "Daily Telegraph",
        "priceValue": 20000
      },
      {
        "name": "Daily Trust",
        "priceValue": 30000
      },
      {
        "name": "Daily Post",
        "priceValue": 30000
      },
      {
        "name": "Nairametrics",
        "priceValue": 30000
      },
      {
        "name": "Nairaland",
        "priceValue": 50000
      },
      {
        "name": "The Cable",
        "priceValue": 300000
      },
      {
        "name": "Guardian",
        "priceValue": 70000
      },
      {
        "name": "Leadership",
        "priceValue": 60000
      },
      {
        "name": "Tribune",
        "priceValue": 30000
      },
      {
        "name": "Champion",
        "priceValue": 20000
      },
      {
        "name": "People's Daily",
        "priceValue": 20000
      },
      {
        "name": "Blueprint",
        "priceValue": 30000
      },
      {
        "name": "GhanaWeb",
        "priceValue": 100000
      },
      {
        "name": "Pulse",
        "priceValue": 300000
      },
      {
        "name": "OkayAfrican",
        "priceValue": 2500000
      },
      {
        "name": "PeaceFm Online",
        "priceValue": 800000
      },
      {
        "name": "B&FT Online",
        "priceValue": 800000
      },
      {
        "name": "Nollywire",
        "priceValue": 300000
      },
      {
        "name": "The Nollywood Reporter",
        "priceValue": 400000
      },
      {
        "name": "WKMup",
        "priceValue": 300000
      },
      {
        "name": "Nolly Critic",
        "priceValue": 300000
      },
      {
        "name": "Nigerian Movies Review",
        "priceValue": 500000
      }
    ]
  },
  {
    "id": "uk",
    "title": "UK News",
    "platforms": [
      {
        "name": "LondonJournal",
        "priceValue": 200000
      },
      {
        "name": "Glasgow Report",
        "priceValue": 200000
      },
      {
        "name": "Manchester Times",
        "priceValue": 200000
      },
      {
        "name": "UkHerald",
        "priceValue": 200000
      },
      {
        "name": "Birmingham Times",
        "priceValue": 200000
      },
      {
        "name": "UkReporter",
        "priceValue": 200000
      },
      {
        "name": "The Bristol Press",
        "priceValue": 200000
      },
      {
        "name": "Uk Wire",
        "priceValue": 200000
      },
      {
        "name": "Influence",
        "priceValue": 700000
      },
      {
        "name": "Cybersecurity Insiders",
        "priceValue": 700000
      },
      {
        "name": "MSN",
        "priceValue": 800000
      },
      {
        "name": "Investing.com",
        "priceValue": 1200000
      },
      {
        "name": "StreetInsiders.com",
        "priceValue": 400000
      },
      {
        "name": "CyberNews",
        "priceValue": 1600000
      },
      {
        "name": "BusinessMole",
        "priceValue": 400000
      },
      {
        "name": "International Business Times",
        "priceValue": 1500000
      },
      {
        "name": "Business Cheshire",
        "priceValue": 500000
      },
      {
        "name": "Business Lancashire",
        "priceValue": 400000
      },
      {
        "name": "Business Manchester",
        "priceValue": 400000
      },
      {
        "name": "Business Live",
        "priceValue": 3800000
      },
      {
        "name": "Echo",
        "priceValue": 3800000
      },
      {
        "name": "Calculator UK Business News",
        "priceValue": 500000
      },
      {
        "name": "Talk Business",
        "priceValue": 1100000
      },
      {
        "name": "Investment Guide",
        "priceValue": 600000
      },
      {
        "name": "Manchester Evening News",
        "priceValue": 3800000
      },
      {
        "name": "Wales Online",
        "priceValue": 3800000
      },
      {
        "name": "MyLondon",
        "priceValue": 3800000
      },
      {
        "name": "Football.London",
        "priceValue": 3800000
      },
      {
        "name": "Luxury Adviser",
        "priceValue": 500000
      },
      {
        "name": "Financial News",
        "priceValue": 500000
      },
      {
        "name": "Wealth Tribune",
        "priceValue": 500000
      },
      {
        "name": "Trading Herald",
        "priceValue": 500000
      },
      {
        "name": "TechRound",
        "priceValue": 1600000
      },
      {
        "name": "Startup Observer",
        "priceValue": 500000
      },
      {
        "name": "Palm Bay Herald",
        "priceValue": 600000
      },
      {
        "name": "Property Development",
        "priceValue": 600000
      },
      {
        "name": "Online World News",
        "priceValue": 600000
      },
      {
        "name": "International Releases",
        "priceValue": 600000
      },
      {
        "name": "Coin Journal",
        "priceValue": 1000000
      },
      {
        "name": "Tech Bullion",
        "priceValue": 600000
      },
      {
        "name": "Crypto Daily",
        "priceValue": 1800000
      },
      {
        "name": "IGB",
        "priceValue": 4600000
      },
      {
        "name": "Esports News UK",
        "priceValue": 1000000
      },
      {
        "name": "The Sporting News",
        "priceValue": 3100000
      },
      {
        "name": "Casino Life",
        "priceValue": 3100000
      },
      {
        "name": "Economy Standard",
        "priceValue": 600000
      },
      {
        "name": "Funeral Notices",
        "priceValue": 3800000
      },
      {
        "name": "Daily Records",
        "priceValue": 4500000
      },
      {
        "name": "InYourArea",
        "priceValue": 3800000
      },
      {
        "name": "DeadLine",
        "priceValue": 900000
      },
      {
        "name": "Female First",
        "priceValue": 1400000
      },
      {
        "name": "Chronicle Live",
        "priceValue": 3800000
      },
      {
        "name": "Edinburgh Live",
        "priceValue": 3800000
      },
      {
        "name": "Galway Beo",
        "priceValue": 3800000
      },
      {
        "name": "Finsmes",
        "priceValue": 1000000
      },
      {
        "name": "Brands Journal",
        "priceValue": 600000
      },
      {
        "name": "Business Matters",
        "priceValue": 1400000
      },
      {
        "name": "Technology Dispatch",
        "priceValue": 1000000
      },
      {
        "name": "Finance Digest",
        "priceValue": 600000
      }
    ]
  },
  {
    "id": "google-news",
    "title": "Google News",
    "platforms": [
      {
        "name": "The Open News",
        "priceValue": 600000
      },
      {
        "name": "Verna Magazine",
        "priceValue": 600000
      },
      {
        "name": "AllNewsBuzz",
        "priceValue": 600000
      },
      {
        "name": "Entertainment Paper",
        "priceValue": 600000
      },
      {
        "name": "FabWorldToday",
        "priceValue": 600000
      },
      {
        "name": "Resident Weekly",
        "priceValue": 600000
      },
      {
        "name": "Sportz Weekly",
        "priceValue": 600000
      },
      {
        "name": "Data Source Hub",
        "priceValue": 600000
      },
      {
        "name": "GlobeStats",
        "priceValue": 600000
      },
      {
        "name": "Stats Globe",
        "priceValue": 600000
      },
      {
        "name": "Apsters Media",
        "priceValue": 600000
      },
      {
        "name": "Coverage Log",
        "priceValue": 600000
      },
      {
        "name": "Time Bulletin",
        "priceValue": 600000
      },
      {
        "name": "Tech News Vision",
        "priceValue": 600000
      },
      {
        "name": "The Nashville Post",
        "priceValue": 600000
      },
      {
        "name": "Industry Today",
        "priceValue": 600000
      },
      {
        "name": "California Times",
        "priceValue": 600000
      },
      {
        "name": "Feature Weekly",
        "priceValue": 600000
      },
      {
        "name": "Infuse News",
        "priceValue": 600000
      }
    ]
  },
  {
    "id": "international",
    "title": "Global News",
    "platforms": [
      {
        "name": "Forbes",
        "priceValue": 9730000
      },
      {
        "name": "Fox News",
        "priceValue": 5250000
      },
      {
        "name": "BBC News",
        "priceValue": 7950000
      },
      {
        "name": "Bloomberg",
        "priceValue": 3525000
      },
      {
        "name": "Hardcore News",
        "priceValue": 1890000
      },
      {
        "name": "GQ",
        "priceValue": 2500000
      },
      {
        "name": "NewYork Weekly",
        "priceValue": 1000000
      },
      {
        "name": "USA Wire",
        "priceValue": 900000
      },
      {
        "name": "AsiaOne",
        "priceValue": 700000
      },
      {
        "name": "AP",
        "priceValue": 700000
      },
      {
        "name": "Benzinga",
        "priceValue": 700000
      },
      {
        "name": "Joy Online",
        "priceValue": 700000
      },
      {
        "name": "The Open News",
        "priceValue": 600000
      },
      {
        "name": "Verna Magazine",
        "priceValue": 600000
      },
      {
        "name": "AllNewsBuzz",
        "priceValue": 600000
      },
      {
        "name": "Entertainment Paper",
        "priceValue": 600000
      },
      {
        "name": "FabWorldToday",
        "priceValue": 600000
      },
      {
        "name": "Resident Weekly",
        "priceValue": 600000
      },
      {
        "name": "Sportz Weekly",
        "priceValue": 600000
      },
      {
        "name": "Data Source Hub",
        "priceValue": 600000
      },
      {
        "name": "GlobeStats",
        "priceValue": 600000
      },
      {
        "name": "Stats Globe",
        "priceValue": 600000
      },
      {
        "name": "Apsters Media",
        "priceValue": 600000
      },
      {
        "name": "Coverage Log",
        "priceValue": 600000
      },
      {
        "name": "Time Bulletin",
        "priceValue": 600000
      },
      {
        "name": "Tech News Vision",
        "priceValue": 600000
      },
      {
        "name": "The Nashville Post",
        "priceValue": 600000
      },
      {
        "name": "Industry Today",
        "priceValue": 600000
      },
      {
        "name": "California Times",
        "priceValue": 600000
      },
      {
        "name": "Feature Weekly",
        "priceValue": 600000
      },
      {
        "name": "Infuse News",
        "priceValue": 600000
      },
      {
        "name": "MSN",
        "priceValue": 800000
      },
      {
        "name": "Investing.com",
        "priceValue": 1200000
      },
      {
        "name": "StreetInsiders.com",
        "priceValue": 400000
      },
      {
        "name": "CyberNews",
        "priceValue": 1600000
      },
      {
        "name": "International Business Times",
        "priceValue": 1500000
      },
      {
        "name": "Talk Business",
        "priceValue": 1100000
      },
      {
        "name": "Investment Guide",
        "priceValue": 600000
      },
      {
        "name": "The Sporting News",
        "priceValue": 3100000
      },
      {
        "name": "Casino Life",
        "priceValue": 3100000
      },
      {
        "name": "DeadLine",
        "priceValue": 900000
      },
      {
        "name": "Finsmes",
        "priceValue": 1000000
      }
    ]
  },
  {
    "id": "tech",
    "title": "Tech & Startups",
    "platforms": [
      {
        "name": "Techpoint",
        "priceValue": 300000
      },
      {
        "name": "TechCabal",
        "priceValue": 300000
      },
      {
        "name": "Cybersecurity Insiders",
        "priceValue": 700000
      },
      {
        "name": "TechRound",
        "priceValue": 1600000
      },
      {
        "name": "Startup Observer",
        "priceValue": 500000
      },
      {
        "name": "Coin Journal",
        "priceValue": 1000000
      },
      {
        "name": "Tech Bullion",
        "priceValue": 600000
      },
      {
        "name": "Crypto Daily",
        "priceValue": 1800000
      },
      {
        "name": "Esports News UK",
        "priceValue": 1000000
      },
      {
        "name": "Technology Dispatch",
        "priceValue": 1000000
      }
    ]
  }
];

const chatForm = document.querySelector("#chatForm");
const chatWindow = document.querySelector("#chatWindow");
const messageInput = document.querySelector("#messageInput");
const statusButton = document.querySelector("#statusButton");
const suggestionButtons = document.querySelectorAll("[data-prompt]");
const navLinks = document.querySelectorAll(".nav-list a");
const assistantPanel = document.querySelector("#assistant");
const viewPanel = document.querySelector("#viewPanel");
const pageTitle = document.querySelector(".page-title h2");

let activeTrip = null;
let activeView = "dashboard";
const CHAT_TIMEOUT_MS = 60000;

const destinationGuides = [
  {
    keys: ["goa"],
    name: "Goa",
    type: "beach nightlife",
    overview: "Goa is famous for beaches, nightlife, Portuguese heritage, seafood, water sports, and relaxed coastal markets.",
    climate: "Warm tropical climate with humid afternoons and breezy evenings near the coast.",
    culture: "Portuguese-influenced coastal culture with churches, music, seafood, beach markets, and festivals.",
    languages: "Konkani, English, Hindi, Marathi",
    currency: "Indian Rupee (INR)",
    map: "West coast of India, along the Arabian Sea",
    images: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls"],
    attractions: ["Baga and Calangute beaches", "Fort Aguada", "Anjuna flea market", "Dudhsagar Falls", "Mandovi sunset cruise", "Basilica of Bom Jesus", "Shantadurga Temple", "Mangeshi Temple"],
    food: ["Goan fish curry", "prawn balchao", "bebinca", "poi with xacuti", "vindaloo"],
    packing: ["sunscreen", "swimwear", "flip-flops", "light cotton clothes", "sunglasses"],
    bestTime: "November to February is best for beaches, parties, and water sports.",
    weather: { temp: "28-32°C", condition: "Sunny to partly cloudy", humidity: "60-75%", wind: "10-18 km/h", rain: "Low outside monsoon", outside: "Morning beaches and evening markets" },
    budgetSplit: { transportation: 25, hotel: 30, food: 18, shopping: 5, activities: 17, miscellaneous: 5 }
  },
  {
    keys: ["gokarna"],
    name: "Gokarna",
    type: "beach and temple getaway",
    overview: "Gokarna is loved for laid-back beaches, temple heritage, scenic cliffs, trekking trails, and peaceful stays.",
    climate: "Warm tropical weather with coastal breeze and pleasant evenings.",
    culture: "Temple-town culture with beaches, seafood, yoga retreats, and spiritual visits.",
    languages: "Kannada, English, Hindi",
    currency: "Indian Rupee (INR)",
    map: "Karnataka coast of India",
    images: ["Om Beach", "Paradise Beach", "Mahabaleshwar Temple"],
    attractions: ["Om Beach", "Paradise Beach", "Kudle Beach", "Mahabaleshwar Temple", "Half Moon Beach", "Yana Caves", "Gokarna Main Beach", "Cliff viewpoint"],
    food: ["seafood fry", "fish curry", "banana fry", "filter coffee", "local dosa"],
    packing: ["sunscreen", "swimwear", "flip-flops", "light clothes", "hat"],
    bestTime: "October to February is best for beaches and temple visits.",
    weather: { temp: "24-32°C", condition: "Warm and coastal", humidity: "60-80%", wind: "10-18 km/h", rain: "Moderate in monsoon", outside: "Morning beaches and evening temple walks" },
    budgetSplit: { transportation: 24, hotel: 30, food: 18, shopping: 6, activities: 14, miscellaneous: 8 }
  },
  {
    keys: ["araku", "araku valley", "araku hills"],
    name: "Araku Valley",
    type: "hill station and tribal culture",
    overview: "Araku Valley is known for misty hills, tribal culture, coffee plantations, waterfalls, and scenic train views.",
    climate: "Cool hill climate with mist, light rain, and pleasant weather most of the year.",
    culture: "Tribal heritage, coffee estates, local markets, and scenic village life.",
    languages: "Telugu, English, Hindi",
    currency: "Indian Rupee (INR)",
    map: "Andhra Pradesh hills near Vizag",
    images: ["Coffee plantations", "Katiki Waterfalls", "Borra Caves"],
    attractions: ["Coffee plantations", "Katiki Waterfalls", "Borra Caves", "Tribal museum", "Ananthagiri hills", "Araku valley viewpoints", "Local market", "Train ride through the hills"],
    food: ["local coffee", "tribal stew", "fresh fruits", "corn dishes", "hot tea"],
    packing: ["light jacket", "comfortable shoes", "umbrella", "camera", "water bottle"],
    bestTime: "October to March is ideal for a cool-weather trip.",
    weather: { temp: "12-24°C", condition: "Cool and misty", humidity: "55-75%", wind: "6-14 km/h", rain: "Moderate", outside: "Morning views and afternoon walks" },
    budgetSplit: { transportation: 26, hotel: 28, food: 18, shopping: 6, activities: 14, miscellaneous: 8 }
  },
  {
    keys: ["manali"],
    name: "Manali",
    type: "mountain adventure",
    overview: "Manali is known for Himalayan views, adventure sports, cafes, temples, valleys, and snow-season getaways.",
    climate: "Cool mountain climate; winters can be snowy and summers are pleasant.",
    culture: "Himachali mountain culture with temples, woollens, cafes, local markets, and adventure tourism.",
    languages: "Hindi, Himachali, English",
    currency: "Indian Rupee (INR)",
    map: "Kullu Valley, Himachal Pradesh, India",
    images: ["Solang Valley", "Hadimba Temple", "Old Manali"],
    attractions: ["Solang Valley", "Hadimba Temple", "Old Manali cafes", "Atal Tunnel or Sissu", "Mall Road", "Manu Temple", "Vashisht Temple", "Rohtang Pass"],
    food: ["siddu", "trout fish", "momos", "thukpa", "hot chocolate in Old Manali"],
    packing: ["warm jacket", "woollen socks", "trek shoes", "moisturizer", "motion sickness tablets"],
    bestTime: "March to June is best for sightseeing; December to February is best for snow.",
    weather: { temp: "5-18°C", condition: "Cool mountain weather", humidity: "45-65%", wind: "8-16 km/h", rain: "Moderate in monsoon, snow possible in winter", outside: "Late morning to afternoon" },
    budgetSplit: { transportation: 32, hotel: 26, food: 16, shopping: 5, activities: 11, miscellaneous: 10 }
  },
  {
    keys: ["kerala", "alleppey", "alappuzha", "kochi", "cochin", "munnar", "wayanad"],
    name: "Kerala",
    type: "backwaters and greenery",
    overview: "Kerala blends backwaters, tea gardens, beaches, spice plantations, Ayurveda, and cultural performances.",
    climate: "Tropical and humid, with lush monsoon greenery and pleasant winter travel weather.",
    culture: "Malayali culture with Kathakali, Ayurveda, temple festivals, seafood, and coconut-rich cuisine.",
    languages: "Malayalam, English, Hindi",
    currency: "Indian Rupee (INR)",
    map: "Southwestern coast of India",
    images: ["Alleppey houseboat", "Munnar tea gardens", "Fort Kochi"],
    attractions: ["Alleppey houseboat", "Munnar tea gardens", "Fort Kochi", "spice plantation", "Kathakali show", "Wayanad viewpoints", "Padmanabhaswamy Temple", "Sabarimala Temple"],
    food: ["Kerala sadya", "appam with stew", "puttu kadala", "banana chips", "Malabar seafood"],
    packing: ["umbrella", "mosquito repellent", "light cotton clothes", "comfortable sandals", "sunscreen"],
    bestTime: "October to March is comfortable; monsoon is lush but needs rain planning.",
    weather: { temp: "24-31°C", condition: "Humid and green", humidity: "70-85%", wind: "8-14 km/h", rain: "Moderate to high in monsoon", outside: "Morning sightseeing and evening waterfront walks" },
    budgetSplit: { transportation: 24, hotel: 32, food: 18, shopping: 5, activities: 13, miscellaneous: 8 }
  },
  {
    keys: ["jaipur"],
    name: "Jaipur",
    type: "royal heritage",
    overview: "Jaipur is famous for forts, palaces, pink sandstone architecture, bazaars, textiles, jewellery, and Rajasthani food.",
    climate: "Dry semi-arid climate with hot afternoons and cooler winter evenings.",
    culture: "Rajasthani royal culture with handicrafts, folk music, palace museums, markets, and traditional cuisine.",
    languages: "Hindi, Rajasthani, English",
    currency: "Indian Rupee (INR)",
    map: "Rajasthan, northwestern India",
    images: ["Amber Fort", "Hawa Mahal", "City Palace"],
    attractions: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Johari Bazaar", "Nahargarh Fort", "Birla Mandir", "Govind Dev Ji Temple"],
    food: ["dal baati churma", "pyaz kachori", "laal maas", "lassi", "ghewar"],
    packing: ["walking shoes", "hat", "sunscreen", "water bottle", "modest clothes for forts and temples"],
    bestTime: "October to March is best because afternoons are cooler for fort visits.",
    weather: { temp: "18-32°C", condition: "Dry and sunny", humidity: "25-45%", wind: "8-18 km/h", rain: "Low except monsoon", outside: "Morning forts and evening bazaars" },
    budgetSplit: { transportation: 24, hotel: 30, food: 20, shopping: 8, activities: 10, miscellaneous: 8 }
  },
  {
    keys: ["vizag", "vixag", "visakhapatnam", "vizag city", "vishakhapatnam"],
    name: "Visakhapatnam (Vizag)",
    type: "beach and city sightseeing",
    overview: "Visakhapatnam is known for its beaches, scenic viewpoints, harbors, seafood, and relaxed coastal vibes.",
    climate: "Tropical coastal climate with warm weather and sea breezes.",
    culture: "Coastal Andhra culture with seafood, temples, street food, and bustling harbor life.",
    languages: "Telugu, English, Hindi",
    currency: "Indian Rupee (INR)",
    map: "Andhra Pradesh coastline on the Bay of Bengal",
    images: ["RK Beach", "Kailasagiri", "Rushikonda Beach"],
    attractions: ["RK Beach", "Rushikonda Beach", "Kailasagiri Park", "Submarine Museum", "Dolphin's Nose", "INS Kursura", "Araku Valley day trip", "Bheemili Beach"],
    food: ["prawn fry", "fish curry", "gongura dishes", "boneless fish fry", "local seafood biryani"],
    packing: ["sunscreen", "light cotton clothes", "slippers", "hat", "water bottle"],
    bestTime: "October to March is ideal for beaches and sightseeing.",
    weather: { temp: "24-32°C", condition: "Warm and coastal", humidity: "60-80%", wind: "10-20 km/h", rain: "Moderate in monsoon", outside: "Morning beaches and evening viewpoints" },
    budgetSplit: { transportation: 24, hotel: 30, food: 20, shopping: 6, activities: 12, miscellaneous: 8 }
  },
  {
    keys: ["dubai"],
    name: "Dubai",
    type: "modern city and desert",
    overview: "Dubai combines skyscrapers, luxury malls, desert safari, marina views, beaches, souks, and global dining.",
    climate: "Hot desert climate; winter is pleasant, summer afternoons are very hot.",
    culture: "Cosmopolitan Emirati city with Islamic customs, global food, malls, souks, and desert experiences.",
    languages: "Arabic, English, Hindi widely understood",
    currency: "UAE Dirham (AED)",
    map: "United Arab Emirates, Persian Gulf coast",
    images: ["Burj Khalifa", "Dubai Marina", "Desert Safari"],
    attractions: ["Burj Khalifa", "Dubai Mall fountain show", "desert safari", "Dubai Marina", "Gold Souk", "Jumeirah Beach", "Jumeirah Mosque", "Dubai Creek Temple District"],
    food: ["shawarma", "mandi", "luqaimat", "Arabic mezze", "karak chai"],
    packing: ["passport copies", "light modest outfits", "comfortable shoes", "sunglasses", "universal adapter"],
    bestTime: "November to March is best; summer afternoons are very hot, so plan indoor stops.",
    weather: { temp: "24-36°C", condition: "Sunny and dry", humidity: "45-65%", wind: "10-22 km/h", rain: "Very low", outside: "Evening outdoor activities and morning landmarks" },
    budgetSplit: { transportation: 30, hotel: 35, food: 17, shopping: 5, activities: 8, miscellaneous: 5 }
  }
];

const categoryGuides = [
  {
    match: /arunachalam|arunachaleswarar|tiruvannamalai|tiruvannamalai temple|arunachaleshwar|ramanathapuram|sabarimala|rameswaram|kanchipuram|madurai|chidambaram|tirupati|varanasi|haridwar|rishikesh/i,
    name: "Pilgrimage Destination",
    type: "temple pilgrimage",
    overview: "A spiritual trip focused on temples, sacred rivers, rituals, local food, and peaceful travel planning.",
    climate: "Usually warm and comfortable; weather depends on the season and region.",
    culture: "Deep spiritual traditions, temple architecture, festivals, local food, and devotional practices.",
    languages: "Local language, English, and Hindi in major tourist areas",
    currency: "Local currency",
    map: "Sacred pilgrimage region",
    images: ["Temple complex", "Sacred river", "Market street"],
    attractions: ["Main temple complex", "Sacred tank", "Temple market", "Night lighting ceremony", "Local food street", "Nearby hill viewpoints"],
    food: ["traditional thali", "filter coffee", "local sweets", "south Indian meals"],
    packing: ["comfortable footwear", "light cotton clothes", "water bottle", "sun hat", "small prayer bag"],
    bestTime: "Winter and early summer are usually comfortable for temple visits.",
    weather: { temp: "24-35°C", condition: "Warm and clear", humidity: "50-75%", wind: "8-16 km/h", rain: "Season dependent", outside: "Morning and evening" },
    budgetSplit: { transportation: 24, hotel: 32, food: 18, shopping: 8, activities: 10, miscellaneous: 8 }
  },
  {
    match: /gokarna|pondicherry|puducherry|andaman|maldives|bali|phuket/i,
    name: "Beach Destination",
    type: "beach",
    overview: "A coastal trip focused on beaches, seafood, sunsets, and relaxed local markets.",
    climate: "Warm coastal climate with humid afternoons.",
    culture: "Coastal culture with seafood, markets, water activities, and relaxed evenings.",
    languages: "Local language, English, Hindi in tourist areas",
    currency: "Local currency",
    map: "Coastal tourist region",
    images: ["Main Beach", "Sunset View", "Local Market"],
    attractions: ["main beach", "sunset viewpoint", "water activity", "local market", "old town walk"],
    food: ["seafood curry", "local snacks", "coconut-based dishes", "regional dessert"],
    packing: ["sunscreen", "sunglasses", "swimwear", "cotton clothes", "flip-flops"],
    bestTime: "Winter and early summer are usually best for beaches.",
    weather: { temp: "27-33°C", condition: "Warm and humid", humidity: "60-80%", wind: "10-18 km/h", rain: "Depends on season", outside: "Morning and evening" },
    budgetSplit: { transportation: 25, hotel: 30, food: 18, shopping: 5, activities: 17, miscellaneous: 5 }
  },
  {
    match: /shimla|kashmir|srinagar|gulmarg|auli|darjeeling|ooty|coorg|nainital|mussoorie|ladakh|leh/i,
    name: "Hill Destination",
    type: "hill station",
    overview: "A mountain trip focused on viewpoints, local markets, cafes, nature trails, and cool weather.",
    climate: "Cooler climate with chilly mornings and evenings.",
    culture: "Hill-town culture with local markets, warm food, viewpoints, and nature activities.",
    languages: "Local language, Hindi, English in tourist areas",
    currency: "Indian Rupee (INR)",
    map: "Mountain tourism region",
    images: ["Viewpoint", "Local Market", "Nature Trail"],
    attractions: ["viewpoint", "local market", "nature trail", "mountain cafe", "adventure activity"],
    food: ["momos", "soup", "local thali", "tea at a hill cafe"],
    packing: ["warm jacket", "comfortable shoes", "woollen socks", "moisturizer", "basic medicines"],
    bestTime: "Summer is comfortable for sightseeing; winter is better for snow.",
    weather: { temp: "5-20°C", condition: "Cool mountain weather", humidity: "45-70%", wind: "8-16 km/h", rain: "Season dependent", outside: "Late morning to afternoon" },
    budgetSplit: { transportation: 30, hotel: 28, food: 17, shopping: 5, activities: 10, miscellaneous: 10 }
  }
];

function currentTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const destinationAliases = {
  vizag: "vizag",
  vixag: "vizag",
  visakhapatnam: "vizag",
  vishakhapatnam: "vizag",
  "vizag city": "vizag",
  gokarna: "gokarna",
  araku: "araku",
  "araku valley": "araku",
  "araku hills": "araku"
};

function normalizeDestinationName(destination) {
  const cleaned = (destination || "").toLowerCase().trim().replace(/\s+/g, " ");
  return destinationAliases[cleaned] || cleaned;
}

function parseBudget(message) {
  const lakhMatch = message.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lakhs|lac|lacs)\b/i);
  if (lakhMatch) return Math.round(Number(lakhMatch[1]) * 100000);
  const kMatch = message.match(/([0-9]+(?:\.[0-9]+)?)\s*k\b/i);
  if (kMatch) return Math.round(Number(kMatch[1]) * 1000);
  const amountMatch = message.match(/(?:₹|rs\.?|inr)?\s*([0-9][0-9,]{2,})(?:\s*(?:rupees|rs|inr))?/i);
  return amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : null;
}

function formatINR(amount) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function collectFamousAttractions(destination, replyText = "") {
  const safeDestination = (destination || "your destination").trim();
  const baseGuide = guideForDestination(safeDestination);
  const knownAttractions = (baseGuide.attractions || []).filter(Boolean);
  const lines = (replyText || "").split(/\n+/).map(line => line.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
  const aiCandidates = lines
    .filter(line => /visit|place|spot|attraction|landmark|beach|temple|fort|palace|museum|viewpoint|waterfall|market|park|cafe|valley|safari/i.test(line))
    .map(line => line.replace(/^(?:visit|must visit|must-see|top|famous|popular|recommended)\s*/i, "").replace(/[:;,.].*$/, "").trim())
    .filter(item => item.length >= 3 && item.length <= 40)
    .filter(item => !/^(visit|must|top|famous|popular|recommended|places?|spots?|attractions?|landmarks?|food|hotel|weather|budget|packing|trip|travel|plan)$/i.test(item));

  return [...new Set([...knownAttractions, ...aiCandidates])].slice(0, 8);
}

function buildGuideFromReply(destination, reply) {
  const safeDestination = (destination || "your destination").trim();
  const text = (reply || "").trim();
  const lines = text.split(/\n+/).map(line => line.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
  const overview = lines.find(line => line.length > 20) || `Travel plan for ${safeDestination} generated by the model.`;
  const attractionList = collectFamousAttractions(safeDestination, text);

  const foodMatches = Array.from(text.matchAll(/(?:food|dish|cuisine|restaurant|eat|try|specialty)[^\n.;,]+/gi))
    .map(match => match[0].trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
  const foodList = foodMatches.length ? foodMatches.slice(0, 5) : [`Local specialty in ${safeDestination}`, `Street food`, `Regional dessert`];

  return {
    name: safeDestination,
    type: "AI-generated travel plan",
    overview,
    climate: "Generated from the model based on the destination and traveler request.",
    culture: "Generated from the model based on local traditions, food, and sightseeing.",
    languages: "Generated from the model based on the destination context.",
    currency: "Local currency",
    map: `AI travel overview for ${safeDestination}`,
    images: ["AI-generated landmark", "AI-generated market", "AI-generated viewpoint"],
    attractions: attractionList,
    food: foodList,
    packing: ["comfortable shoes", "charger", "ID proof", "light weather-appropriate clothes"],
    bestTime: `Generated from the model for ${safeDestination}.`,
    weather: { temp: "Generated by the model", condition: "Generated by the model", humidity: "Generated by the model", wind: "Generated by the model", rain: "Generated by the model", outside: "Morning or evening" },
    budgetSplit: { transportation: 26, hotel: 30, food: 18, shopping: 5, activities: 13, miscellaneous: 8 }
  };
}

function extractTripDetails(text) {
  const normalizedText = text.trim();
  const lowerText = normalizedText.toLowerCase();
  const daysMatch = normalizedText.match(/(\d+)\s*-?\s*(?:day|days|d)\b/i);
  const travelersMatch = normalizedText.match(/(?:for|with|persons?|people|travelers|travellers|adults|friends|members)\s+(\d+)/i);
  const budgetValue = parseBudget(normalizedText);

  const explicitDestinationMatch = normalizedText.match(/(?:to|for|in|visit|trip\s+to)\s+([a-zA-Z][a-zA-Z\s.-]{1,40})(?=\s+(?:under|within|for|with|during|from|and|$)|[,.!?]|$)/i);
  const fallbackDestinationMatch = normalizedText.match(/([a-zA-Z][a-zA-Z\s.-]{1,40})(?=\s+(?:\d+)\s*(?:day|days|d)\b)/i);
  const peopleBeforeDestinationMatch = normalizedText.match(/([a-zA-Z][a-zA-Z\s.-]{1,40})(?=\s+(?:persons?|people|travelers|travellers|adults|friends|members)\s+\d+)/i);
  const budgetBeforeDestinationMatch = normalizedText.match(/([a-zA-Z][a-zA-Z\s.-]{1,40})(?=\s+(?:budget|₹|rs|inr)\b)/i);

  const rawDestination = (explicitDestinationMatch ? explicitDestinationMatch[1] : fallbackDestinationMatch ? fallbackDestinationMatch[1] : peopleBeforeDestinationMatch ? peopleBeforeDestinationMatch[1] : budgetBeforeDestinationMatch ? budgetBeforeDestinationMatch[1] : null)
    ?.trim()
    .replace(/\s+/g, " ");
  const destination = rawDestination ? normalizeDestinationName(rawDestination) : null;

  const travelers = travelersMatch ? Number(travelersMatch[1]) : 1;
  return {
    destination,
    days: daysMatch ? Number(daysMatch[1]) : null,
    travelers,
    budgetValue
  };
}

function inferTravelTags(destination, text = "") {
  const haystack = `${destination || ""} ${text}`.toLowerCase();
  const tags = [];

  if (/(temple|mandir|church|cathedral|mosque|shrine|pagoda|stupa|monastery)/i.test(haystack)) tags.push("temples");
  if (/(beach|coast|island|sea|shore|lagoon|bay|reef)/i.test(haystack)) tags.push("beaches");
  if (/(hill|mountain|peak|valley|alpine|himalaya|highland|ridge)/i.test(haystack)) tags.push("hill stations");
  if (/(desert|dune|oasis|safari)/i.test(haystack)) tags.push("deserts and safaris");
  if (/(wildlife|park|forest|jungle|reserve|zoo)/i.test(haystack)) tags.push("wildlife");
  if (/(heritage|castle|fort|palace|museum|historic|ruins)/i.test(haystack)) tags.push("heritage sites");
  if (/(city|town|capital|metro|urban)/i.test(haystack)) tags.push("city sightseeing");
  if (tags.length === 0) tags.push("city sightseeing", "food streets", "heritage sites");

  return tags.slice(0, 3);
}

function buildGenericGuide(destination) {
  const safeDestination = (destination || "your destination").trim();
  const tags = inferTravelTags(safeDestination);
  const attractions = [];

  if (tags.includes("temples")) {
    attractions.push(`Historic temple in ${safeDestination}`, `Old shrine district`, `Pilgrimage trail`);
  }
  if (tags.includes("beaches")) {
    attractions.push(`Main beach in ${safeDestination}`, `Sunset viewpoint`, `Water activities zone`);
  }
  if (tags.includes("hill stations")) {
    attractions.push(`Scenic viewpoint near ${safeDestination}`, `Local hill market`, `Trekking trail`);
  }
  if (tags.includes("deserts and safaris")) {
    attractions.push(`Desert safari near ${safeDestination}`, `Dune viewpoint`, `Oasis visit`);
  }
  if (tags.includes("wildlife")) {
    attractions.push(`Wildlife reserve near ${safeDestination}`, `Birdwatching trail`, `Forest boardwalk`);
  }
  if (tags.includes("city sightseeing")) {
    attractions.push(`Historic center of ${safeDestination}`, `Local market`, `Panoramic city viewpoint`);
  }
  if (tags.includes("heritage sites")) {
    attractions.push(`Heritage monument in ${safeDestination}`, `Museum visit`, `Old town walk`);
  }

  attractions.push(`Food street in ${safeDestination}`, `Cultural festival area`, `Popular lookout point`);

  return {
    name: safeDestination,
    type: tags.join(" and "),
    overview: `${safeDestination} is a popular travel destination with a strong mix of ${tags.join(", ")}, local food, and cultural experiences.`,
    climate: "Weather varies by season and altitude; check the local forecast before travel.",
    culture: "Local traditions, markets, cuisine, and landmarks are usually the highlight of a visit.",
    languages: "Local language plus English in most major tourist areas",
    currency: "Local currency",
    map: `Map search: ${safeDestination}`,
    images: ["Main landmark", "Local market", "Scenic viewpoint"],
    attractions: attractions.slice(0, 8),
    food: ["local specialty", "street food", "regional dessert", "popular cafe dish"],
    packing: ["comfortable shoes", "charger", "ID proof", "light weather-appropriate clothes"],
    bestTime: `Check ${safeDestination} weather and local tour season before booking.`,
    weather: { temp: "Season dependent", condition: "Check live forecast", humidity: "Varies", wind: "Varies", rain: "Varies", outside: "Morning or evening" },
    budgetSplit: { transportation: 26, hotel: 30, food: 18, shopping: 5, activities: 13, miscellaneous: 8 }
  };
}

function guideForDestination(destination) {
  const name = (destination || "").toLowerCase();
  const exactGuide = destinationGuides.find(guide => guide.keys.some(key => name.includes(key)));
  if (exactGuide) return { ...exactGuide, name: exactGuide.name || destination };
  const categoryGuide = categoryGuides.find(guide => guide.match.test(destination || ""));
  if (categoryGuide) return { ...categoryGuide, name: destination || categoryGuide.name };
  return buildGenericGuide(destination);
}

function buildBudget(trip) {
  const split = trip.guide.budgetSplit;
  const total = trip.budgetValue || 30000;
  const items = Object.entries(split).map(([key, percent]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    amount: Math.round(total * percent / 100),
    percent
  }));
  return { total, items };
}

function createTripFromText(text, aiReply = null) {
  const details = extractTripDetails(text);
  const hasTripSignals = Boolean(details.destination || details.days || details.budgetValue);
  if (!hasTripSignals) return null;

  const destination = details.destination || "your destination";
  const guide = aiReply ? buildGuideFromReply(destination, aiReply) : guideForDestination(destination);
  return {
    destination: guide.name || destination,
    days: details.days || 3,
    travelers: details.travelers || 2,
    budgetValue: details.budgetValue || 30000,
    budget: formatINR(details.budgetValue || 30000),
    guide,
    aiReply: aiReply || null,
    sourceText: text,
    updatedAt: new Date()
  };
}

function addUserMessage(text) {
  const row = document.createElement("div");
  row.className = "message-row user";
  row.innerHTML = `<div class="message user"><span class="user-text"></span><span class="message-time">${currentTime()} ✓</span></div>`;
  row.querySelector(".user-text").textContent = text;
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addBotText(text) {
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.innerHTML = `<div class="message-avatar">🤖</div><div class="message bot"><p></p><span class="message-time dark">${currentTime()}</span></div>`;
  row.querySelector("p").textContent = text;
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return row;
}

function updateTripSummary() {
  if (!activeTrip) return;
  if (activeView === "dashboard") {
    renderView("dashboard");
  }
}

function setActiveTrip(trip) {
  if (!trip) return;
  activeTrip = trip;
  updateTripSummary();
  renderView(activeView);
}

function emptyTripHtml() {
  return `<div class="empty-state"><h3>No active trip yet</h3><p>Plan a trip in Dashboard first, for example: Plan a 5-day trip to Goa under ₹30,000 for 2 people.</p></div>`;
}

function card(title, body) {
  return `<article class="detail-card"><h4>${title}</h4>${body}</article>`;
}

function list(items) {
  return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
}

function renderDestinations(trip) {
  const g = trip.guide;
  const terrainLabel = g.type.includes("beach") ? "Popular Beaches" : g.type.includes("mountain") || g.type.includes("hill") ? "Popular Hills" : "Popular Cities / Areas";
  return `<div class="destination-page">
    <section class="destination-hero">
      <div>
        <span>${g.type}</span>
        <h3>${trip.destination}</h3>
        <p>${g.overview}</p>
      </div>
      <div class="map-card">
        <strong>Map Location</strong>
        <p>${g.map}</p>
      </div>
    </section>

    <div class="fact-strip">
      <div><strong>Best Time</strong><span>${g.bestTime}</span></div>
      <div><strong>Climate</strong><span>${g.climate}</span></div>
      <div><strong>Currency</strong><span>${g.currency}</span></div>
      <div><strong>Languages</strong><span>${g.languages}</span></div>
    </div>

    <div class="detail-grid two-col">
      ${card("Destination Overview", `<p>${g.overview}</p>`)}
      ${card("Famous Places to Visit", list(g.attractions))}
      ${card(terrainLabel, list(g.attractions.slice(0, 4)))}
    </div>

    <section class="destination-images" aria-label="Top destination images">
      ${g.images.map((image, index) => `<article><div>${index + 1}</div><strong>${image}</strong><span>${trip.destination}</span></article>`).join("")}
    </section>
  </div>`;
}
function sectionIntro(title, trip, copy) {
  return `<section class="section-intro"><div><span>${trip.destination}</span><h3>${title}</h3><p>${copy}</p></div><aside><strong>${trip.days} Days</strong><span>${trip.budget}</span><small>${trip.travelers} traveler(s)</small></aside></section>`;
}

function renderHotels(trip) {
  const base = Math.max(1200, Math.round((trip.budgetValue * trip.guide.budgetSplit.hotel / 100) / Math.max(trip.days - 1, 1)));
  const areas = trip.guide.attractions.slice(0, 5);
  const hotels = ["Comfort Inn", "Heritage Stay", "Central Residency", "View Point Resort", "Premium Retreat", "Family Suites"].map((name, index) => ({
    name: `${trip.destination} ${name}`,
    rating: (4.1 + Math.min(index, 4) * 0.1).toFixed(1),
    price: formatINR(base + index * 650),
    address: `Near ${areas[index % areas.length]}`,
    distance: `${(1 + index * 0.8).toFixed(1)} km from main tourist area`,
    amenities: ["Wi-Fi", "Breakfast", index % 2 ? "Travel desk" : "Parking", index % 3 ? "Room service" : "Airport pickup", "Clean rooms"],
    suitable: ["Budget travelers", "Families", "Couples", "Sightseeing trips", "Comfort stays", "Groups"][index],
    description: `A practical stay for a ${trip.guide.type} trip with easy access to ${areas[index % areas.length]}. Prices are approximate and should be verified before booking.`
  }));
  return `${sectionIntro("Hotels", trip, `Recommended stays are generated only for ${trip.destination} and recalculated from the active trip budget.`)}<div class="detail-grid">${hotels.map(hotel => card(hotel.name, `<p><strong>Rating:</strong> ${hotel.rating}/5</p><p><strong>Price Per Night:</strong> ${hotel.price}</p><p><strong>Address:</strong> ${hotel.address}</p><p><strong>Distance:</strong> ${hotel.distance}</p><p><strong>Amenities:</strong> ${hotel.amenities.join(", ")}</p><p><strong>Suitable For:</strong> ${hotel.suitable}</p><p>${hotel.description}</p>`)).join("")}</div>`;
}

function renderAttractions(trip) {
  return `${sectionIntro("Attractions", trip, `Destination-specific places to visit in ${trip.destination}, with timing, fees, and time required.`)}<div class="detail-grid">${trip.guide.attractions.map((name, index) => card(name, `<p>${name} is a recommended ${trip.destination} stop for this ${trip.guide.type} trip.</p><p><strong>Entry Fee:</strong> ${index % 2 ? "₹50-₹300 approx" : "Free / varies by activity"}</p><p><strong>Best Visiting Time:</strong> ${index < 2 ? "Morning" : index < 4 ? "Afternoon" : "Evening"}</p><p><strong>Time Required:</strong> ${index % 2 ? "1-2 hours" : "2-3 hours"}</p><p><strong>Distance from Hotel:</strong> ${2 + index * 2} km approx</p><p><strong>Tip:</strong> Keep tickets, transport, and weather in mind before finalizing the day.</p>`)).join("")}</div>`;
}

function renderFood(trip) {
  return `${sectionIntro("Food", trip, `Local dishes and approximate meal costs for ${trip.destination}.`)}<div class="detail-grid">${trip.guide.food.map((dish, index) => card(dish, `<p><strong>Description:</strong> A famous local food item to try during your ${trip.destination} trip.</p><p><strong>Type:</strong> ${/fish|prawn|trout|seafood|laal|shawarma|mandi/i.test(dish) ? "Non-Vegetarian" : "Vegetarian / varies"}</p><p><strong>Spice Level:</strong> ${index % 3 === 0 ? "Medium" : index % 3 === 1 ? "Mild" : "Spicy"}</p><p><strong>Recommended Restaurant:</strong> Well-rated local restaurant near ${trip.guide.attractions[index % trip.guide.attractions.length]}</p><p><strong>Approximate Price:</strong> ${formatINR(120 + index * 70)}</p><p><strong>Best Time:</strong> ${index % 2 ? "Lunch" : "Dinner"}</p>`)).join("")}</div>`;
}

function renderWeather(trip) {
  const w = trip.guide.weather;
  return `${sectionIntro("Weather", trip, `Expected travel weather for ${trip.destination}. Verify live forecast before departure.`)}<div class="weather-board">
    ${card("Temperature", `<p>${w.temp}</p>`)}
    ${card("Weather Condition", `<p>${w.condition}</p>`)}
    ${card("Humidity", `<p>${w.humidity}</p>`)}
    ${card("Wind Speed", `<p>${w.wind}</p>`)}
    ${card("Rain Chances", `<p>${w.rain}</p>`)}
    ${card("Best Time to Go Outside", `<p>${w.outside}</p>`)}
  </div>`;
}

function renderPacking(trip) {
  const isCold = /warm|woollen|jacket|snow|mountain|hill/i.test(trip.guide.packing.join(" ") + trip.guide.type);
  return `${sectionIntro("Packing List", trip, `Packing suggestions are based on ${trip.destination}, weather, and planned activities.`)}<div class="detail-grid two-col">
    ${card("Clothing", list(trip.guide.packing.concat([isCold ? "thermal layer" : "comfortable day outfit", "sleepwear"]))) }
    ${card("Electronics", list(["phone charger", "power bank", "camera", "adapter if needed", "offline maps downloaded"]))}
    ${card("Medicines", list(["basic first aid", "personal medicines", "motion sickness tablets", "ORS packets", "pain relief balm"]))}
    ${card("Documents", list(["ID proof", "booking confirmations", "emergency contacts", "passport/visa if international", "travel insurance if needed"]))}
    ${card("Accessories", list(["day bag", "water bottle", "sunglasses", isCold ? "gloves / cap" : "umbrella or cap", "small lock"]))}
    ${card("Activity Specific", list(trip.guide.type.includes("beach") ? ["swimwear", "waterproof pouch", "beach towel"] : trip.guide.type.includes("mountain") ? ["trek shoes", "warm socks", "light backpack"] : ["walking shoes", "shopping tote", "portable charger"]))}
  </div>`;
}

function renderBudget(trip) {
  const budget = buildBudget(trip);
  return `${sectionIntro("Budget Estimator", trip, `Budget is recalculated from the active trip amount: ${formatINR(budget.total)}.`)}<div class="budget-layout"><div class="detail-grid two-col">
    ${budget.items.map(item => card(item.label, `<p>${formatINR(item.amount)} (${item.percent}%)</p><div class="bar"><span style="width:${item.percent}%"></span></div><small>Approximate ${item.label.toLowerCase()} allowance for ${trip.destination}.</small>`)).join("")}
    ${card("Total Budget", `<p>${formatINR(budget.total)}</p><div class="pie-note">Pie chart data: ${budget.items.map(item => `${item.label} ${item.percent}%`).join(", ")}</div>`)}
  </div><aside class="budget-total"><strong>${formatINR(budget.total)}</strong><span>Total Estimated Budget</span><p>Costs are approximate and should be verified for live prices.</p></aside></div>`;
}

function renderItinerary(trip) {
  return `${sectionIntro("Itinerary", trip, `Detailed ${trip.days}-day plan for ${trip.destination}.`)}<div class="itinerary-list">${Array.from({ length: trip.days }, (_, i) => {
    const attraction = trip.guide.attractions[i % trip.guide.attractions.length];
    const second = trip.guide.attractions[(i + 1) % trip.guide.attractions.length];
    const food = trip.guide.food[i % trip.guide.food.length];
    return card(`Day ${i + 1}`, `<p><strong>Morning:</strong> Visit ${attraction}.</p><p><strong>Afternoon:</strong> Try ${food} and explore ${second}.</p><p><strong>Evening:</strong> Market, sunset, cafe, or relaxed walk.</p><p><strong>Night:</strong> Dinner near hotel and rest. Keep transport booked for the next day.</p>`);
  }).join("")}</div>`;
}

function renderTips(trip) {
  return `${sectionIntro("Travel Tips", trip, `Practical advice for a smooth ${trip.destination} trip.`)}<div class="detail-grid two-col">
    ${card("Safety Tips", list(["Keep valuables secure", "Use trusted transport", "Share itinerary with family", "Avoid isolated areas late night", "Save hotel address offline"]))}
    ${card("Emergency Numbers", `<p>India: 112. For international trips, verify the local emergency number before travel.</p>`)}
    ${card("Local Language", `<p>${trip.guide.languages}</p>`)}
    ${card("Currency", `<p>${trip.guide.currency}</p>`)}
    ${card("Transportation Tips", list(["Pre-check fares", "Use maps", "Keep offline location saved", "Use rental vehicles only where safe", "Avoid unverified agents"]))}
    ${card("Cultural Etiquette", `<p>${trip.guide.culture}</p>`)}
    ${card("Things to Avoid", list(["Unverified bookings", "Overpacking", "Ignoring weather", "Last-minute peak season travel", "Carrying too much cash"] ))}
    ${card("Best Time", `<p>${trip.guide.bestTime}</p>`)}
  </div>`;
}
function renderProfile() {
  return `<div class="detail-grid two-col">${card("Traveler Profile", `<p>Hello, Traveler!</p><p>Your active trip powers every section of this dashboard.</p>`)}${card("Current Preference", `<p>${activeTrip ? `${activeTrip.destination}, ${activeTrip.days} days, ${activeTrip.budget}` : "No active trip yet."}</p>`)}</div>`;
}

const renderers = {
  destinations: renderDestinations,
  hotels: renderHotels,
  attractions: renderAttractions,
  food: renderFood,
  weather: renderWeather,
  packing: renderPacking,
  budget: renderBudget,
  itinerary: renderItinerary,
  tips: renderTips
};

function viewName(view) {
  return ({ dashboard: "Dashboard", destinations: "Destinations", itinerary: "Itinerary Planner", budget: "Budget Estimator", hotels: "Hotels", attractions: "Attractions", weather: "Weather", packing: "Packing List", food: "Food", tips: "Travel Tips", profile: "Profile" })[view] || "Dashboard";
}

function renderView(view) {
  activeView = view;
  window.scrollTo({ top: 0, behavior: "smooth" });
  pageTitle.textContent = viewName(view);
  navLinks.forEach(link => link.classList.toggle("active", normalizeView(link.getAttribute("href")) === view));
  if (view === "dashboard") {
    assistantPanel.hidden = false;
    viewPanel.hidden = true;
    return;
  }
  assistantPanel.hidden = true;
  viewPanel.hidden = false;
  if (view === "profile") {
    viewPanel.innerHTML = `<div class="detail-heading"><h3>Profile</h3><p>Your travel profile and active trip context.</p></div>${renderProfile()}`;
    return;
  }
  if (!activeTrip) {
    viewPanel.innerHTML = emptyTripHtml();
    return;
  }
  const renderer = renderers[view];
  viewPanel.innerHTML = `<div class="detail-heading"><h3>${viewName(view)} for ${activeTrip.destination}</h3><p>Synced with active trip: ${activeTrip.days} days, ${activeTrip.budget}, ${activeTrip.travelers} traveler(s).</p></div>${renderer ? renderer(activeTrip) : emptyTripHtml()}`;
}

function normalizeView(hash) {
  const view = (hash || "#assistant").replace("#", "");
  if (view === "assistant") return "dashboard";
  return view;
}

function buildLocalFallbackReply(text, trip) {
  const fallbackTrip = trip || createTripFromText(text);
  if (!fallbackTrip) {
    const cleanedText = (text || "").trim();
    const inferredDestination = cleanedText.split(/\s+/).slice(0, 4).join(" ") || "your destination";
    const lowerText = cleanedText.toLowerCase();
    const isQuestion = /what|which|where|how|why|when|can you|help|tell me/i.test(lowerText);
    const isGreeting = /hi|hello|hey|good morning|good evening|good afternoon/i.test(lowerText);
    const isRequest = /plan|trip|travel|visit|holiday|vacation|stay|hotel|food|weather|attractions|packing|budget/i.test(lowerText);

    if (isGreeting) {
      return `Hello! I can help you plan a trip, suggest attractions, food, hotels, weather, and packing tips. Tell me your destination, trip length, and budget and I’ll build a travel plan for you.`;
    }

    if (isQuestion) {
      return `I can help with that. If you tell me your destination, number of days, and budget, I can create a useful travel plan for you. For example: “Plan a 4-day trip to Goa under ₹40000 for 2 people.”`;
    }

    if (isRequest) {
      return `I understand you want travel help. I can plan a trip for ${inferredDestination}, suggest attractions, food, hotels, weather, and packing list. Share your destination, days, and budget and I’ll tailor the response.`;
    }

    return `I can help you with travel planning for ${inferredDestination}. Share your destination, days, and budget and I’ll create a useful itinerary for you.`;
  }

  const guide = fallbackTrip.guide;
  const places = guide.attractions.join(", ");
  return [
    `🌍 Destination: ${fallbackTrip.destination}`,
    `📅 Duration: ${fallbackTrip.days} days`,
    `💰 Budget: ${fallbackTrip.budget}`,
    `📝 Overview: ${guide.overview}`,
    `📍 Visiting places: ${places}`,
    `🏨 Suggested areas: ${guide.attractions.slice(0, 3).join(", ")}`,
    `🍴 Food ideas: ${guide.food.slice(0, 3).join(", ")}`,
    `🎒 Packing: ${guide.packing.slice(0, 4).join(", ")}`,
    `Would you like to explore Hotels, Attractions, Weather, Budget Estimation, or Packing List?`
  ].join("\n\n");
}

async function sendMessage(text) {
  addUserMessage(text);

  const loading = addBotText("Planning the best travel answer for you...");
  const fallbackReply = buildLocalFallbackReply(text, null);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
    const response = await fetch("/api/chat", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    clearTimeout(timeout);

    const rawText = await response.text();
    let data = {};

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error("Chat endpoint returned a non-JSON response", parseError, rawText);
      }
    }

    const aiReply = data.reply || data.message || fallbackReply;
    const trip = createTripFromText(text, aiReply);
    if (trip) setActiveTrip(trip);

    loading.querySelector("p").textContent = aiReply;
  } catch (error) {
    const trip = createTripFromText(text, fallbackReply);
    if (trip) setActiveTrip(trip);
    loading.querySelector("p").textContent = fallbackReply;
    console.error(error);
  }
}

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  messageInput.value = "";
  sendMessage(message);
});

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    renderView(normalizeView(link.getAttribute("href")));
  });
});

suggestionButtons.forEach(button => {
  button.addEventListener("click", () => {
    const label = button.textContent.toLowerCase();
    if (label.includes("hotel")) return renderView("hotels");
    if (label.includes("attraction")) return renderView("attractions");
    if (label.includes("weather")) return renderView("weather");
    if (label.includes("budget")) return renderView("budget");
    if (label.includes("packing")) return renderView("packing");
    messageInput.value = button.dataset.prompt;
    messageInput.focus();
  });
});

statusButton.addEventListener("click", () => {
  addBotText("Every navigation section now uses the current active trip. Create a trip first, then open Destinations, Hotels, Attractions, Weather, Food, Budget, Packing List, Itinerary, or Travel Tips.");
});

addBotText("Hi! Plan a trip with destination, days, and budget. Once created, every sidebar page will update for that active trip.");
updateTripSummary();
renderView("dashboard");






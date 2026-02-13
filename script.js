// Adding new global variables for month tracking and war justification
let gameMonth = 1; // 1 = January, 2 = February, etc.
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let justificationData = {}; // Track war justifications {neighborName: {progress: 0-100, reason: string, startMonth: number, startYear: number}}
const JUSTIFICATION_MONTHS_REQUIRED = 3; // How many months needed to justify a war
let joinFactionSound = new Audio('hoi4-join-faction-made-with-Voicemod.mp3');

// Added war occupation tracking
let occupationData = {}; // Track war occupations {targetCountry: {progress: 0-100, startMonth: number, startYear: number, canPeaceTreaty: boolean}}

// Add peace treaty tracking
let peaceTreatyData = {}; // Track peace treaties {targetCountry: {endYear: number, endMonth: number, terms: string[]}}
const PEACE_TREATY_YEARS = 5; // Peace treaties last 5 years by default

// Add regions tracking
let regionElectionYears = {}; // Track when each region has elections {regionName: nextElectionYear}

let converter;
if (typeof showdown !== 'undefined') {
     converter = new showdown.Converter({ tables: true, simpleLineBreaks: true });
} else {
    console.error("Showdown library not loaded!");
    converter = { makeHtml: (text) => `<p>Error: Markdown library not loaded.</p><pre>${text || ''}</pre>` };
}

const setupForm = document.getElementById('setup-form');
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const loadingIndicator = document.getElementById('loading-indicator');
const actionLoadingIndicator = document.getElementById('action-loading-indicator');
const diseaseWarning = document.getElementById('disease-warning'); 

const gameTitle = document.getElementById('game-title');
const gameSubtitle = document.getElementById('game-subtitle');
const playerFlagImg = document.getElementById('player-flag');

const diplomacyTab = document.getElementById('Diplomacy');
const economyTab = document.getElementById('Economy');
const militaryTab = document.getElementById('Military');
const internalTab = document.getElementById('Internal');
const cultureTab = document.getElementById('Culture');
const governmentTab = document.getElementById('Government');
const religionTab = document.getElementById('Religion');
const secretAgencyTab = document.getElementById('SecretAgency');
const mapsTab = document.getElementById('Maps');
const internationalTab = document.getElementById('International');
const tradeTab = document.getElementById('Trade');
const immigrationTab = document.getElementById('Immigration'); 
const researchTab = document.getElementById('Research'); 
const historyTab = document.getElementById('History'); 
const creditsTab = document.getElementById('Credits'); 
const organizationsTab = document.getElementById('Organizations');
const factionsTab = document.getElementById('Factions');
const communicationsTab = document.getElementById('Communications');
const communicationsLeadersList = document.getElementById('communications-leaders-list');

let saveSlotModal;
let loadSlotModal;

const diplomacySituation = document.getElementById('diplomacy-situation');
const diplomacyStats = document.getElementById('diplomacy-stats');
const diplomacyNeighbors = document.getElementById('diplomacy-neighbors');
const diplomacyPuppetsSection = document.getElementById('diplomacy-puppets-section');
const diplomacyPuppetsList = document.getElementById('diplomacy-puppets-list');

const economySituation = document.getElementById('economy-situation');
const economyStats = document.getElementById('economy-stats');

const militarySituation = document.getElementById('military-situation');
const militaryStats = document.getElementById('military-stats');
const militaryInventory = document.getElementById('military-inventory'); 
const ongoingWarsSection = document.getElementById('ongoing-wars-section'); 
const ongoingWarsList = document.getElementById('ongoing-wars-list'); 

const internalSituation = document.getElementById('internal-situation');
const internalStats = document.getElementById('internal-stats');

const cultureSituation = document.getElementById('culture-situation');
const cultureStats = document.getElementById('culture-stats');
const cultureLanguages = document.getElementById('culture-languages');
const cultureEthnicGroups = document.getElementById('culture-ethnic-groups');
const cultureNeighborEthnicitiesOverview = document.getElementById('culture-neighbor-ethnicities-overview');
const cultureNeighborEthnicitiesList = document.getElementById('culture-neighbor-ethnicities-list');

const governmentSituation = document.getElementById('government-situation');
const governmentStats = document.getElementById('government-stats');
const ministersList = document.getElementById('ministers-list');
const govTypeDisplay = document.getElementById('gov-type-display');
const nextElectionYearDisplay = document.getElementById('next-election-year');
const politicalPartiesList = document.getElementById('political-parties-list');

const religionSituation = document.getElementById('religion-situation'); 
const religionStats = document.getElementById('religion-stats');
const religionDemographics = document.getElementById('religion-demographics');

const secretAgencySituation = document.getElementById('secretagency-situation');
const secretAgencyStats = document.getElementById('secretagency-stats');
const secretAgencyIntelReports = document.getElementById('secretagency-intel-reports');
const secretAgencyNeighborIntelSummary = document.getElementById('secretagency-neighbor-intel-summary');
const secretAgencyNeighborIntelList = document.getElementById('secretagency-neighbor-intel-list');

const mapCountryName = document.getElementById('map-country-name');
const mapBorderList = document.getElementById('map-border-list');
const mapTerritoriesList = document.getElementById('map-territories-list');
const worldMapImage = document.getElementById('world-map-image');
const worldMapPlaceholder = document.getElementById('world-map-placeholder');

const internationalNations = document.getElementById('international-nations');
const internationalSituation = document.getElementById('international-situation');
const internationalConflictsTreaties = document.getElementById('international-conflicts-treaties');

const tradeSituation = document.getElementById('trade-situation'); 
const tradeStats = document.getElementById('trade-stats');
const tradeResourcesList = document.getElementById('trade-resources-list');
const tradePartnersList = document.getElementById('trade-partners-list');

const immigrationSituation = document.getElementById('immigration-situation'); 
const immigrationStats = document.getElementById('immigration-stats'); 

const researchSituation = document.getElementById('research-situation'); 
const researchStats = document.getElementById('research-stats'); 
const researchOngoingProjects = document.getElementById('research-ongoing-projects'); 
const researchDiseasesStatus = document.getElementById('research-diseases-status'); 

const historyContent = document.getElementById('history-content'); 

const organizationsSituation = document.getElementById('organizations-situation');
const organizationsList = document.getElementById('organizations-list');

const factionsSituation = document.getElementById('factions-situation');
const playerFactionInfo = document.getElementById('player-faction-info');
const globalFactionsList = document.getElementById('global-factions-list');

const actionFeedback = document.getElementById('action-feedback');
const globalEventsFeed = document.getElementById('global-events-feed');
const localNewsFeed = document.getElementById('local-news-feed');
const actionButtons = document.querySelectorAll('.action-button');
const actionInputs = document.querySelectorAll('.action-area input');

const neighborModal = document.getElementById('neighbor-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalLoading = document.getElementById('modal-loading');
const modalNeighborFlag = document.getElementById('modal-neighbor-flag');
const modalNeighborName = document.getElementById('modal-neighbor-name');

const chatModal = document.getElementById('chat-modal');
const chatModalTitle = document.getElementById('chat-modal-title');
const chatLog = document.getElementById('chat-log');
const chatMessageInput = document.getElementById('chat-message-input');
const sendChatMessageButton = document.getElementById('send-chat-message-button');

const gameOverScreen = document.getElementById('game-over-screen');
const collapseReason = document.getElementById('collapse-reason');
const restartButton = document.getElementById('restart-button');
const endScreenTitle = document.getElementById('end-screen-title');

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const tabButtonContainer = document.querySelector('.tab-buttons');

const saveGameButton = document.getElementById('save-game-button');
const loadGameButton = document.getElementById('load-game-button');

let countryData = {};
let gameYear = 0;
let countryDetails = {};
let isGameOver = false;
let recentlyConquered = null;
let currentGovType = '';
let currentPlayerLeaderStyle = '';
let worldNationsCache = [];
let historicalEventsEnabled = true;
let factionElectionYears = {}; 
let organizationApplicationStatus = {}; 
const ELECTION_HOLDING_GOV_TYPES = [
    'Democracy', 'Republic', 'Democratic Socialism', 'Liberalism', 'Progressivism', 'Solarpunk', 'Meritocracy',
    'Parliamentary Republic', 'Constitutional Monarchy', 'Libertarianism', 'Technocracy', 'Environmentalism', 'Socialism',
    'Federal Republic', 'Presidential Republic', 'Semi-Presidential Republic', 'Elective Monarchy',
    'Cybercratic Union', 'Techno-Utopianism', 'Agrarianism',
    'People\'s Republic', 'City-County Federation', 'Autonomous Region', 'Political Party'
];
const SAVE_GAME_KEY_BASE = 'countrySimulatorSaveData_slot';
const MAX_SAVE_SLOTS = 10;

// Add currency mappings for real currencies
const REAL_CURRENCY_SYMBOLS = {
    'US Dollar': '$',
    'USD': '$',
    'Euro': '€',
    'EUR': '€',
    'British Pound': '£',
    'GBP': '£',
    'Japanese Yen': '¥',
    'JPY': '¥',
    'Chinese Yuan': '¥',
    'CNY': '¥',
    'Canadian Dollar': 'C$',
    'CAD': 'C$',
    'Australian Dollar': 'A$',
    'AUD': 'A$',
    'Swiss Franc': 'CHF',
    'Russian Ruble': '₽',
    'RUB': '₽',
    'Indian Rupee': '₹',
    'INR': '₹',
    'Brazilian Real': 'R$',
    'BRL': 'R$',
    'South Korean Won': '₩',
    'KRW': '₩',
    'Mexican Peso': '$',
    'MXN': '$',
    'South African Rand': 'R',
    'ZAR': 'R',
    'Turkish Lira': '₺',
    'TRY': '₺',
    'Norwegian Krone': 'kr',
    'NOK': 'kr',
    'Swedish Krona': 'kr',
    'SEK': 'kr',
    'Danish Krone': 'kr',
    'DKK': 'kr'
};

function isRealCurrency(currencyName) {
    return REAL_CURRENCY_SYMBOLS.hasOwnProperty(currencyName);
}

function getCurrencySymbol(currencyName) {
    return REAL_CURRENCY_SYMBOLS[currencyName] || '¤';
}

async function generateCurrencyIcon(currencyName, countryName) {
    const prompt = `A currency icon for "${currencyName}" from the nation of ${countryName}. Circular coin or banknote design with national symbols, elegant typography, official monetary design, professional appearance.`;
    
    try {
        const result = await websim.imageGen({
            prompt: prompt,
            aspect_ratio: "1:1",
            width: 64,
            height: 64
        });
        return result?.url || null;
    } catch (error) {
        console.error("Error generating currency icon:", error);
        return null;
    }
}

function getNestedValue(obj, path, defaultValue = null) {
    if (!obj || typeof path !== 'string') return defaultValue;
    const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    return typeof value !== 'undefined' && value !== null ? value : defaultValue;
}

let leaderData = {
    current: null,
    family: {
        spouse: null,
        children: [],
        heir: null
    },
    pastLeaders: [],
    memorials: []
};

let familyEvents = [];
let siblingRivalry = {};

function ensureCoreDataStructure(data) {
    if (!data) data = {};
    data.countryName = data.countryName || countryDetails.countryName || "Unknown Nation";
    data.leaderName = data.leaderName || countryDetails.leaderName || "Unknown Leader";
    data.gameYear = data.gameYear || gameYear; 
    if(data.leaderAge === undefined) data.leaderAge = countryDetails.leaderAge; 

    data.diplomacy = data.diplomacy || { stats: {}, situation: "", neighbors: [], puppets: [], allies: [] };
    data.diplomacy.stats = data.diplomacy.stats || {};
    data.diplomacy.neighbors = data.diplomacy.neighbors || [];
    data.diplomacy.puppets = data.diplomacy.puppets || [];
    data.diplomacy.allies = data.diplomacy.allies || [];
    data.diplomacy.neighbors = data.diplomacy.neighbors.map(n => {
        n.ethnicGroups = n.ethnicGroups || [{ name: "Majority", percentage: 100 }];
        n.flagUrl = n.flagUrl || null;
        n.flagPrompt = n.flagPrompt || `Flag of ${n.name} (${n.ideology || 'Nation'})`;
        n.leaderName = n.leaderName || `Leader of ${n.name}`;
        n.leaderAge = n.leaderAge ?? Math.floor(Math.random() * 30) + 45; 
        n.leaderPersonality = n.leaderPersonality || ['Cautious', 'Aggressive', 'Diplomatic', 'Erratic', 'Calculating'][Math.floor(Math.random() * 5)];
        n.ideology = n.ideology || 'Unknown Ideology';
        n.estimatedStrength = n.estimatedStrength || '???';
        n.relationship = n.relationship || 'Neutral'; 
        n.reason = n.reason || ''; 
        n.communicationLog = n.communicationLog || [];
        n.justifyingOnPlayer = n.justifyingOnPlayer || null;
        return n;
    });

    data.economy = data.economy || { stats: {}, situation: "", currency: {} };
    data.economy.stats = data.economy.stats || {};
    data.economy.currency = data.economy.currency || {
        name: "National Currency",
        symbol: "¤",
        isReal: false,
        iconUrl: null,
        iconPrompt: null
    };
    
    // Ensure currency has all required properties
    if (!data.economy.currency.name) data.economy.currency.name = "National Currency";
    if (!data.economy.currency.symbol) data.economy.currency.symbol = "¤";
    if (data.economy.currency.isReal === undefined) {
        data.economy.currency.isReal = isRealCurrency(data.economy.currency.name);
    }
    if (data.economy.currency.isReal) {
        data.economy.currency.symbol = getCurrencySymbol(data.economy.currency.name);
        data.economy.currency.iconUrl = null; // Real currencies use symbols
    } else {
        if (!data.economy.currency.iconPrompt) {
            data.economy.currency.iconPrompt = `A currency icon for "${data.economy.currency.name}" from the nation of ${data.countryName}. Circular coin design with national symbols, elegant typography, official monetary design.`;
        }
    }

    data.military = data.military || { stats: {}, situation: "", inventory: {}, ongoingWars: [] }; 
    data.military.stats = data.military.stats || {};
    data.military.stats['Missile Count'] = data.military.stats['Missile Count'] ?? 0;
    data.military.stats['Nuclear Status'] = data.military.stats['Nuclear Status'] ?? 'None';
    data.military.stats['Total Soldiers'] = data.military.stats['Total Soldiers'] ?? 0; 
    data.military.inventory = data.military.inventory || { Army: [], Navy: [], Airforce: [], Missiles: [], Nuclear: [] }; 
    if (!data.military.inventory.Army) data.military.inventory.Army = [];
    if (!data.military.inventory.Navy) data.military.inventory.Navy = [];
    if (!data.military.inventory.Airforce) data.military.inventory.Airforce = [];
    if (!data.military.inventory.Missiles) data.military.inventory.Missiles = [];
    if (!data.military.inventory.Nuclear) data.military.inventory.Nuclear = [];
    data.military.ongoingWars = data.military.ongoingWars || []; 
    
    // Add terrain information for military calculations
    data.military.terrain = data.military.terrain || 'Mixed'; // Default terrain

    data.internal = data.internal || { stats: {}, situation: "" };
    data.internal.stats = data.internal.stats || {};
    if(data.internal.stats['Dominant Ideology'] === undefined) data.internal.stats['Dominant Ideology'] = countryDetails.dominantIdeology || countryDetails.govType;
    if(data.internal.stats['Government Type'] === undefined) data.internal.stats['Government Type'] = countryDetails.govType || '';
    data.internal.stats['Leader Security Level'] = data.internal.stats['Leader Security Level'] || 'Medium';
    data.internal.stats['Population'] = data.internal.stats['Population'] ?? 1000000;
    data.internal.stats['Happiness'] = data.internal.stats['Happiness'] ?? 70; 
    data.internal.stats['Leader Approval'] = data.internal.stats['Leader Approval'] ?? 70; 

    data.culture = data.culture || { stats: {}, situation: "", ethnicGroups: [], languages: [] };
    data.culture.stats = data.culture.stats || {};
    data.culture.ethnicGroups = data.culture.ethnicGroups || [{ name: "Main", percentage: 100, notes: "Default ethnicity" }];
    data.culture.languages = data.culture.languages || ["Native Tongue"];

    data.government = data.government || { stats: {}, situation: "", ministers: {}, politicalParties: [], nextElectionYear: null };
    data.government.stats = data.government.stats || {};
    data.government.ministers = data.government.ministers || { Defense: null, ForeignAffairs: null, Economy: null, InternalSecurity: null };
    for (const port in data.government.ministers) {
        if (data.government.ministers[port] && typeof data.government.ministers[port] === 'object') {
            data.government.ministers[port].name = data.government.ministers[port].name || null;
            data.government.ministers[port].skill = data.government.ministers[port].skill || null;
            data.government.ministers[port].loyalty = data.government.ministers[port].loyalty || null;
        } else if (data.government.ministers[port] === null) {
        } else {
            data.government.ministers[port] = { name: data.government.ministers[port], skill: 'Medium', loyalty: 'Neutral' };
        }
    }

    data.government.politicalParties = data.government.politicalParties || [];
    data.government.politicalParties = data.government.politicalParties.map(p => {
        p.name = p.name || 'Unknown Party';
        p.ideology = p.ideology || 'Unknown Ideology';
        p.leaderName = p.leaderName || 'Unknown Leader';
        p.leaderStyle = p.leaderStyle || 'Unknown Style';
        p.popularity = p.popularity ?? 0;
        p.goals = p.goals || '';
        p.isExtremist = p.isExtremist ?? false;
        return p;
    });


    if (data.government.nextElectionYear === undefined) {
        const ideology = getNestedValue(data, 'internal.stats.Dominant Ideology', countryDetails.dominantIdeology);
        const govType = getNestedValue(data, 'internal.stats.Government Type', countryDetails.govType);
        data.government.nextElectionYear = ELECTION_HOLDING_GOV_TYPES.includes(govType) ? (gameYear || countryDetails.startYear) + 4 : null;
    }

    data.religion = data.religion || { stats: {}, situation: "", demographics: [] };
    data.religion.stats = data.religion.stats || {};
    data.religion.demographics = data.religion.demographics || [];


    data.secretAgency = data.secretAgency || { stats: {}, situation: "", knownPlots: [], neighborIntel: {} };
    data.secretAgency.stats = data.secretAgency.stats || {};
    data.secretAgency.knownPlots = data.secretAgency.knownPlots || [];
    data.secretAgency.neighborIntel = data.secretAgency.neighborIntel || {};
    for (const name in data.secretAgency.neighborIntel) {
        if (!data.diplomacy.neighbors.some(n => n.name === name)) {
            delete data.secretAgency.neighborIntel[name];
        }
    }

    data.worldNations = data.worldNations || [];
    data.worldNations = data.worldNations.map(n => {
        n.name = n.name || 'Unknown Nation';
        n.ideology = n.ideology || 'Unknown';
        n.status = n.status || 'Unknown';
        n.notes = n.notes || '';
        n.leaderInfo = n.leaderInfo || 'Unknown Leader';
        n.flagPrompt = n.flagPrompt || `Flag of ${n.name}`; 
        n.flagUrl = n.flagUrl || null;
        n.communicationLog = n.communicationLog || [];
        return n;
    });
    worldNationsCache = data.worldNations; 

    data.trade = data.trade || { stats: {}, situation: "", resources: [], partners: [] };
    data.trade.stats = data.trade.stats || {};
    data.trade.resources = data.trade.resources || [];
    data.trade.partners = data.trade.partners || [];

    data.history = data.history || "The history of your nation is yet to be written, but its origins are shrouded in mystery."; 

    data.organizations = data.organizations || [];
    data.factions = data.factions || [];
    data.playerFaction = data.playerFaction || null;
    
    if (!data.organizationApplications) {
        data.organizationApplications = [];
    }
    
    if (!data.factionElections) {
        data.factionElections = [];
    }
    
    // Add peace treaty data to save data structure
    if (!data.peaceTreaties) {
        data.peaceTreaties = {};
    }
    
    data.regions = data.regions || [];
    
    // Calculate number of regions based on GDP/income if not already set
    if (data.regions.length === 0) {
        const gdp = parseFloat(data.economy?.stats?.['GDP Growth']) || 0;
        const treasury = parseFloat(data.economy?.stats?.['Treasury']) || 0;
        // Base number of regions on economy size
        const baseRegionCount = Math.max(3, Math.min(12, Math.floor((gdp + treasury/1000) / 2)));
        
        // Generate initial regions
        for (let i = 0; i < baseRegionCount; i++) {
            const regionName = generateRegionName(i, data.countryName);
            const isCoastal = Math.random() > 0.6;
            const hasRiver = Math.random() > 0.7;
            const terrainTypes = ['Mountainous', 'Plains', 'Forest', 'Desert', 'Jungle', 'Tundra'];
            const terrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
            
            data.regions.push({
                name: regionName,
                population: Math.floor(Math.random() * 500000) + 100000,
                governor: {
                    name: generateGovernorName(),
                    party: data.government?.politicalParties ? 
                        data.government.politicalParties[Math.floor(Math.random() * data.government.politicalParties.length)]?.name : 
                        'Independent',
                    nextElectionYear: (data.gameYear || gameYear) + Math.floor(Math.random() * 4) + 1
                },
                facilities: [],
                terrain: terrain,
                isCoastal: isCoastal,
                hasRiver: hasRiver,
                economicOutput: Math.floor(Math.random() * 500) + 100,
                resourceRichness: Math.floor(Math.random() * 100),
                description: `A ${terrain.toLowerCase()} region ${isCoastal ? 'with coastal access' : ''}${hasRiver ? ' and river access' : ''}.`
            });
        }
    }
    
    // Ensure all regions have the required properties
    data.regions = data.regions.map(region => {
        region.name = region.name || generateRegionName(0, data.countryName);
        region.population = region.population || 100000;
        region.governor = region.governor || {
            name: generateGovernorName(),
            party: 'Independent',
            nextElectionYear: (data.gameYear || gameYear) + Math.floor(Math.random() * 4) + 1
        };
        region.facilities = region.facilities || [];
        region.terrain = region.terrain || 'Mixed';
        region.isCoastal = region.isCoastal !== undefined ? region.isCoastal : false;
        region.hasRiver = region.hasRiver !== undefined ? region.hasRiver : false;
        region.economicOutput = region.economicOutput || 100;
        region.resourceRichness = region.resourceRichness || 50;
        region.description = region.description || `A ${region.terrain.toLowerCase()} region.`;
        return region;
    });
    
    // Add leader and family data structure
    if (!data.leaderData) {
        data.leaderData = {
            current: {
                name: countryDetails.leaderName,
                age: countryDetails.leaderAge,
                style: countryDetails.leaderStyle,
                startYear: gameYear,
                startMonth: gameMonth,
                health: 85,
                popularity: 70,
                securityLevel: 'Medium',
                traits: generateLeaderTraits(),
                accomplishments: [],
                scandals: []
            },
            family: {
                spouse: null,
                children: [],
                heir: null
            },
            pastLeaders: [],
            memorials: [],
            familyEvents: []
        };
        
        // Auto-generate family for non-monarchy governments
        const isMonarchy = ['Monarchy (Absolute)', 'Constitutional Monarchy', 'Elective Monarchy'].includes(currentGovType);
        if (!isMonarchy) {
            generateInitialFamily(data.leaderData);
        }
    }
    
    return data;
}

/* Improved JSON sanitization + tolerant parsing for AI responses.
   sanitizeJSONResponse extracts the outermost JSON object if the AI wrapped it in markdown or extra text.
   tolerantParseJSON attempts JSON.parse first, then progressively cleans common issues (smart quotes, trailing commas,
   unescaped newlines inside strings) and ultimately falls back to a safe Function() evaluate if required.
*/
function sanitizeJSONResponse(raw) {
    if (typeof raw !== 'string') return raw;
    let trimmed = raw.trim();

    // If wrapped in markdown fences like ```json ... ``` or ``` ... ```
    if (trimmed.startsWith('```')) {
        const firstBrace = trimmed.indexOf('{');
        const lastBrace = trimmed.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            trimmed = trimmed.slice(firstBrace, lastBrace + 1);
        }
    } else {
        // General safety: extract from first '{' to last '}' if there is extra text
        const firstBrace = trimmed.indexOf('{');
        const lastBrace = trimmed.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            trimmed = trimmed.slice(firstBrace, lastBrace + 1);
        }
    }

    return trimmed;
}

function tolerantParseJSON(raw) {
    // If already an object, return as-is
    if (raw && typeof raw === 'object') return raw;
    if (typeof raw !== 'string') return null;

    let candidate = sanitizeJSONResponse(raw);

    // First quick attempt
    try {
        return JSON.parse(candidate);
    } catch (e) {
        // Continue to cleaning attempts
    }

    // Replace common smart quotes and invisible characters
    candidate = candidate.replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
                         .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
                         .replace(/\u00A0/g, ' ');

    // Remove trailing commas in objects/arrays (e.g., {"a":1,} or [1,2,])
    candidate = candidate.replace(/,\s*(?=[}\]])/g, '');

    // Escape unescaped line breaks inside quotes by converting literal line breaks between quotes into \n
    // This is a heuristic: find string spans and replace newline chars inside them
    candidate = candidate.replace(/"([^"\\]*(\\.[^"\\]*)*)"/gs, (m) => {
        // Inside quoted string m, replace bare newlines/tabs with escaped versions
        const inner = m.slice(1, -1).replace(/\r\n|\n|\r/g, '\\n').replace(/\t/g, '\\t');
        return `"${inner}"`;
    });

    // Attempt parse again
    try {
        return JSON.parse(candidate);
    } catch (e) {
        // Final fallback: attempt to evaluate as JS object in a safe wrapper
        try {
            // Wrap in parentheses so object literal parses, and avoid exposing local scope
            // This is a last-resort measure and should only be used when previous attempts fail.
            // Use Function to evaluate; this is sandboxed from local variables.
            // Replace `undefined` occurrences (common when AI writes "null | undefined" or similar) to null
            const safer = candidate.replace(/\bundefined\b/g, 'null');
            // Ensure no top-level code other than an object/array
            const fn = new Function(`return (${safer});`);
            const result = fn();
            return result;
        } catch (evalErr) {
            console.error("tolerantParseJSON final eval failed:", evalErr);
            // Return null to indicate failure to parse
            return null;
        }
    }
}

function generateLeaderTraits() {
    const traits = ['Charismatic', 'Intelligent', 'Brave', 'Cautious', 'Ambitious', 'Diplomatic', 'Strategic', 'Corrupt', 'Honest', 'Ruthless'];
    const numTraits = Math.floor(Math.random() * 3) + 2; // 2-4 traits
    const selectedTraits = [];
    
    for (let i = 0; i < numTraits; i++) {
        const trait = traits[Math.floor(Math.random() * traits.length)];
        if (!selectedTraits.includes(trait)) {
            selectedTraits.push(trait);
        }
    }
    
    return selectedTraits;
}

function generateInitialFamily(leaderData) {
    // Generate spouse for non-monarchy (automatically married)
    if (Math.random() > 0.3) { // 70% chance of having a spouse
        leaderData.family.spouse = {
            name: generateSpouseName(),
            age: leaderData.current.age + Math.floor(Math.random() * 10) - 5,
            personality: generatePersonality(),
            influence: Math.floor(Math.random() * 50) + 25
        };
        
        // Generate children
        const numChildren = Math.floor(Math.random() * 4); // 0-3 children
        for (let i = 0; i < numChildren; i++) {
            const child = generateChild(leaderData.current.age);
            leaderData.family.children.push(child);
        }
    }
}

function generateChild(parentAge) {
    const genders = ['Male', 'Female'];
    const personalities = ['Kind', 'Ambitious', 'Devious', 'Loyal', 'Intelligent', 'Reckless', 'Evil', 'Good'];
    
    return {
        name: generateChildName(),
        age: Math.max(0, Math.floor(Math.random() * (parentAge - 20))),
        gender: genders[Math.floor(Math.random() * genders.length)],
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        isHeir: false,
        birthYear: gameYear - Math.max(0, Math.floor(Math.random() * (parentAge - 20))),
        traits: generateLeaderTraits().slice(0, 2), // Children have fewer traits
        education: 'Basic',
        loyalty: Math.floor(Math.random() * 100)
    };
}

function generateSpouseName() {
    const names = ['Alexandra', 'Catherine', 'Victoria', 'Elizabeth', 'Margaret', 'Isabella', 'Maria', 'Anna', 'Sophia', 'Helena',
                   'Alexander', 'Nicholas', 'William', 'Charles', 'Henry', 'Frederick', 'Edward', 'George', 'Philip', 'Richard'];
    return names[Math.floor(Math.random() * names.length)];
}

function generateChildName() {
    const maleNames = ['Alexander', 'Nicholas', 'William', 'Charles', 'Henry', 'Frederick', 'Edward', 'George', 'Philip', 'Richard'];
    const femaleNames = ['Alexandra', 'Catherine', 'Victoria', 'Elizabeth', 'Margaret', 'Isabella', 'Maria', 'Anna', 'Sophia', 'Helena'];
    const allNames = [...maleNames, ...femaleNames];
    return allNames[Math.floor(Math.random() * allNames.length)];
}

function generatePersonality() {
    const personalities = ['Kind', 'Ambitious', 'Supportive', 'Independent', 'Diplomatic', 'Traditional', 'Progressive', 'Influential'];
    return personalities[Math.floor(Math.random() * personalities.length)];
}

function openTab(tabName) {
    tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    const selectedContent = document.getElementById(tabName);
    const selectedButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);

    if (selectedContent) {
        selectedContent.classList.add('active');
        selectedContent.style.display = 'block';
    }
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

if (tabButtonContainer) {
    tabButtonContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('tab-button') && !event.target.classList.contains('active')) {
            const tabName = event.target.dataset.tab;
            if (tabName) {
                openTab(tabName);
            }
        }
    });
} else {
    console.error("Tab button container not found!");
}

setupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    localStorage.removeItem(`${SAVE_GAME_KEY_BASE}1`);
    await initializeGame();
});

async function generateAndSetImage(imgElement, prompt, urlPropertyPath, objectToUpdateUrlOn, aspect = "3:2", isMap = false) {
    if (!imgElement) {
        console.error("Image element not provided for prompt:", prompt);
        return;
    }
    if (!prompt) {
        imgElement.src = isMap ? 'placeholder_map.png' : 'placeholder_flag.png';
        imgElement.style.display = 'inline-block';
        if (isMap && worldMapPlaceholder) worldMapPlaceholder.style.display = 'none';
        return;
    }

    imgElement.src = isMap ? 'placeholder_map.png' : 'placeholder_flag.png';
    imgElement.style.opacity = '0.5';
    imgElement.style.display = 'inline-block';
    if (isMap && worldMapPlaceholder) worldMapPlaceholder.textContent = 'Generating map...';

    try {
        const imageOptions = { prompt: prompt, aspect_ratio: aspect };
        if (isMap) {
            imageOptions.width = 1024;
            imageOptions.height = aspect === "16:9" ? 576 : (aspect === "4:3" ? 768 : 1024);
        }

        const result = await websim.imageGen(imageOptions);
        if (result && result.url) {
            imgElement.src = result.url;
            if (objectToUpdateUrlOn && urlPropertyPath) {
                const parts = urlPropertyPath.split('.');
                let current = objectToUpdateUrlOn;
                for (let i = 0; i < parts.length - 1; i++) {
                    current = current[parts[i]] = current[parts[i]] || {};
                }
                current[parts[parts.length - 1]] = result.url;
            }
        } else {
            imgElement.src = isMap ? 'placeholder_map.png' : 'placeholder_flag.png';
            console.warn("Image generation failed or returned no URL for prompt:", prompt);
        }
    } catch (error) {
        console.error("Error generating image:", error, "for prompt:", prompt);
        imgElement.src = isMap ? 'placeholder_map.png' : 'placeholder_flag.png';
    } finally {
        imgElement.style.opacity = '1';
        if (isMap) {
            if (imgElement.src !== 'placeholder_map.png' && imgElement.src !== '') {
                if (worldMapPlaceholder) worldMapPlaceholder.style.display = 'none';
            } else {
                if (worldMapPlaceholder) {
                    worldMapPlaceholder.textContent = 'Map generation failed or not available.';
                }
            }
        }
    }
}

async function initializeGame(savedGameData = null) {
    loadingIndicator.style.display = 'block';
    loadingIndicator.textContent = savedGameData ? 'Loading saved game...' : 'Generating your world...';
    actionFeedback.textContent = '';
    globalEventsFeed.innerHTML = '';
    globalEventsFeed.style.display = 'none';
    localNewsFeed.innerHTML = '';
    localNewsFeed.style.display = 'none';
    closeModal();
    closeChatModal();
    recentlyConquered = null;
    worldNationsCache = [];
    isGameOver = false;

    if (savedGameData) {
        countryData = ensureCoreDataStructure(savedGameData.countryData || {});
        gameYear = savedGameData.gameYear || 0;
        countryDetails = savedGameData.countryDetails || {};
        worldNationsCache = savedGameData.worldNationsCache || [];
        historicalEventsEnabled = savedGameData.historicalEventsEnabled !== undefined ? savedGameData.historicalEventsEnabled : true;
        currentGovType = savedGameData.currentGovType || countryDetails.govType || '';
        currentPlayerLeaderStyle = savedGameData.currentPlayerLeaderStyle || countryDetails.leaderStyle || '';
        factionElectionYears = savedGameData.factionElectionYears || {};
        organizationApplicationStatus = savedGameData.organizationApplicationStatus || {};
        isGameOver = savedGameData.isGameOver || false;
        
        // Restore occupation data if available
        if (savedGameData.occupationData) {
            occupationData = savedGameData.occupationData;
        }
        
        // Restore peace treaty data if available
        if (savedGameData.peaceTreatyData) {
            peaceTreatyData = savedGameData.peaceTreatyData;
        }
        
        // Restore justification data if available
        if (savedGameData.justificationData) {
            justificationData = savedGameData.justificationData;
        }

        if (isGameOver) {
            showGameOver(countryData.gameOverReason || "Game was over in saved state.", countryData.gameOverType || 'collapse');
            loadingIndicator.style.display = 'none';
            return;
        }

        setupScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        await updateUI();
        openTab('Diplomacy');
        enableAllInputs();
        loadingIndicator.style.display = 'none';
        return;
    }

    const formData = new FormData(setupForm);
    countryDetails = {
        countryName: formData.get('country-name'),
        leaderName: formData.get('leader-name'),
        leaderAge: parseInt(formData.get('leader-age'), 10),
        startYear: parseInt(formData.get('start-year'), 10),
        govType: formData.get('gov-type'),
        dominantIdeology: formData.get('dominant-ideology'),
        leaderStyle: formData.get('leader-style'),
        playerFlagPrompt: `A flag representing ${formData.get('country-name')}, a ${formData.get('gov-type')} with ${formData.get('dominant-ideology')} ideology led by a ${formData.get('leader-style')} leader.`,
        playerFlagUrl: null,
        worldMapPrompt: `A political map showing the nation of ${formData.get('country-name')} and its surrounding region or continent.`,
        worldMapUrl: null,
    };
    gameYear = countryDetails.startYear;
    currentGovType = countryDetails.govType;
    currentPlayerLeaderStyle = countryDetails.leaderStyle;
    historicalEventsEnabled = document.getElementById('historical-events').checked;

    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    enableAllInputs();

    try {
        const userDetailsString = `Country: ${countryDetails.countryName}, Leader: ${countryDetails.leaderName} (Age ${countryDetails.leaderAge}), Year: ${countryDetails.startYear}, Government Type: ${countryDetails.govType}, Dominant Ideology: ${countryDetails.dominantIdeology}, Leadership Style: ${countryDetails.leaderStyle}, Historical Events: ${historicalEventsEnabled ? 'Enabled' : 'Fictional Focus'}`;

        const buffsDebuffsDescription = `
        Consider the chosen Government Type and Dominant Ideology separately for buffs/debuffs.
        Government Type affects administrative efficiency, stability, and decision-making speed.
        Dominant Ideology affects popular support, international relations, and policy directions.
        Apply these as MODIFIERS to the base generation.
        
        Government Type Effects:
        Democracy/Republic: Higher stability, slower decisions, better international standing
        Monarchy/Empire: Faster decisions, potential succession issues, traditional authority
        Dictatorship: Fast decisions, lower happiness, potential resistance
        Theocracy: Religious unity, potential minority issues, moral authority
        
        Ideology Effects:
        Pacifism: Better international standing, lower military start.
        Globalism: Better trade, vulnerable to global events.
        Tribalism: High cohesion, poor external relations/tech.
        Futurism: Faster tech, potential instability.
        Traditionalism: High stability, slow tech/reform resistance.
        Christianity/Judaism/Paganism: Religious effects based on historical period and neighbors.
        
        For ancient years (0-500 CE), include Biblical and classical historical context if Historical Events enabled.
        Shared ethnicity with neighbors should generally lead to better initial relations unless ideologies clash severely.
        `;

        const initialWorldSchema = `{
          "countryName": "string",
          "leaderName": "string",
          "playerFlagPrompt": "string (detailed description for AI to generate player's flag, e.g., 'A flag with a golden sun on a blue field with three white stars for the nation of Eldoria')",
          "playerFlagUrl": "null|string (will be populated later)",
          "worldMapPrompt": "string (description for AI to generate a world map, e.g., 'A political map of the continent of Veridia, showing Eldoria and its neighbors...')",
          "worldMapUrl": "null|string",
          "history": "string (markdown, describe the origin story of the nation - e.g., how it was formed, key events leading to the start year, reflecting the government type, leader style, and potentially location/neighbors if implied by prompt)",
          "diplomacy": {
            "stats": { "Stability": "number(0-100)", "International Standing": "string(e.g., Good, Neutral, Poor)", "Influence": "number(0-100)" },
            "situation": "string(markdown)",
            "neighbors": [ { "name": "string", "relationship": "string(Friendly/Neutral/Hostile/Ally)", "reason": "string", "leaderName": "string", "leaderAge": "number(30-85)", "leaderPersonality": "string", "estimatedStrength": "string(??? or number, should be ??? initially)", "ideology": "string", "flagPrompt": "string", "flagUrl": "null|string", "ethnicGroups": [{"name": "string", "percentage": "number"}] } ],
            "puppets": [ { "name": "string", "taxRate": "number(0-100)", "autonomyDesire": "number(0-100)", "loyaltyToPlayer": "number(0-100)" } ],
            "allies": ["string"]
          },
          "economy": {
            "stats": { "GDP Growth": "string", "Unemployment": "number(0-100)", "Treasury": "number", "Inflation": "number(0-100)", "Army Maintenance Cost": "number", "Revenue": "number", "Expenses": "number" },
            "situation": "string(markdown)",
            "currency": {
              "name": "string",
              "symbol": "string", 
              "isReal": "boolean",
              "iconUrl": "null|string",
              "iconPrompt": "string"
            }
          },
          "military": {
             "stats": { "Strength": "number(10-100)", "Technology Level": "string", "Morale": "string(High/Medium/Low)", "Total Soldiers": "number", "Missile Count": "number", "Nuclear Status": "string(None/Developing/Ready)" },
             "situation": "string(markdown)",
             "inventory": {
                 "Army": [{"name": "string (e.g. M1 Abrams)", "type": "string (e.g. Main Battle Tank)", "quantity": "number", "description": "string (markdown, brief)", "efficiency": "number", "price": "number"}],
                 "Navy": [{"name": "string (e.g. Arleigh Burke-class)", "type": "string (e.g. Destroyer)", "quantity": "number", "description": "string (markdown, brief)", "efficiency": "number", "price": "number"}],
                 "Airforce": [{"name": "string (e.g. F-35 Lightning II)", "type": "string (e.g. Fighter Jet)", "quantity": "number", "description": "string (markdown, brief)", "efficiency": "number", "price": "number"}],
                 "Missiles": [{"name": "string (e.g. Tomahawk)", "type": "string (e.g. Cruise Missile)", "quantity": "number", "description": "string (markdown, brief)", "efficiency": "number", "price": "number"}],
                 "Nuclear": [{"name": "string (e.g. ICBM)", "type": "string (e.g. Intercontinental Ballistic Missile)", "quantity": "number", "description": "string (markdown, brief)", "efficiency": "number", "price": "number"}]
             },
             "terrain": "string(e.g., Mountainous, Flat Plains, Desert, Jungle, Mixed)" 
          },
          "internal": {
             "stats": { "Population": "number", "Happiness": "number(0-100)", "Dominant Ideology": "string", "Government Type": "string", "Leader Approval": "number(0-100)", "Leader Security Level": "string(Low/Medium/High)" },
             "situation": "string(markdown)"
          },
          "culture": {
             "stats": { "Dominant Values": "string", "Artistic Output": "string(High/Medium/Low)", "Social Cohesion": "number(0-100)", "Cultural Influence (Abroad)": "number(0-100)"},
             "situation": "string(markdown)",
             "ethnicGroups": [ { "name": "string", "percentage": "number(0-100)", "notes": "string (optional, e.g. historical grievances, cultural distinctiveness)" } ],
             "languages": ["string"]
          },
          "government": {
             "stats": { "Efficiency": "number", "Corruption Level": "number", "Tax Rate": "number" },
             "situation": "string(markdown)",
             "ministers": {
                "Defense": { "name": "string|null", "skill": "string|null", "loyalty": "string|null" },
                "ForeignAffairs": { "name": "string|null", "skill": "string|null", "loyalty": "string|null" },
                "Economy": { "name": "string|null", "skill": "string|null", "loyalty": "string|null" },
                "InternalSecurity": { "name": "string|null", "skill": "string|null", "loyalty": "string|null" }
             },
             "politicalParties": [ { "name": "string", "ideology": "string", "leaderName": "string", "leaderStyle": "string", "popularity": "number", "goals": "string", "isExtremist": "boolean" } ],
             "nextElectionYear": "number|null (year of next election, null if not applicable, e.g. gameYear + 4 for new democracies)"
          },
          "religion": {
             "stats": {"Religious Harmony": "number", "InfluenceOfReligion": "string"},
             "situation": "string(markdown)",
             "demographics": [{"name": "string", "percentage": "number", "beliefsSummary": "string"}]
          },
          "secretAgency": {
            "stats": { "Agency Funding": "number", "CounterIntelligence": "number", "GlobalReach": "number" },
            "situation": "string(markdown)",
            "knownPlots": ["string"],
            "neighborIntel": { /* Populated by AI based on neighbors */ }
          },
          "trade": {
             "stats": { "Trade Balance": "string", "Resource Abundance": "string", "Trade Efficiency": "number" },
             "situation": "string(markdown)",
             "resources": [ { "name": "string (e.g. Oil, Food)", "quantity": "number", "unit": "string (e.g. barrels, tons)", "pricePerUnit": "number" } ],
             "partners": [ { "name": "string (Nation Name)", "relationship": "string (e.g. Active Trade Deal, Sanctioned, Embargoed)", "tradeValueLastYear": "number" } ]
          },
          "worldNations": [ { "name": "string", "ideology": "string", "status": "string", "notes": "string", "leaderInfo": "string", "flagPrompt": "string", "flagUrl": "null|string"} ],
          "organizations": [ { "name": "string", "type": "string", "influence": "number", "members": "string[]", "playerIsMember": "boolean", "playerIsLeader": "boolean", "requirements": "string" } ],
          "factions": [ { "name": "string", "type": "string", "goal": "string", "members": "string[]", "leader": "string", "nextElectionYear": "number", "playerIsMember": "boolean", "playerIsLeader": "boolean", "requirements": "string" } ],
          "playerFaction": { "name": "string", "type": "string", "goal": "string", "members": "string[]", "leader": "string", "nextElectionYear": "number" } | null,
          "organizationApplications": [ { "name": "string", "responseYear": "number", "status": "string", "reason": "string" } ],
          "factionElections": [ { "factionName": "string", "nextElectionYear": "number" } ]
        }`;

        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a world simulation AI. Based on the user's input, generate the initial state for their country.
                    ${buffsDebuffsDescription}
                    The starting 'Dominant Ideology' in internal.stats MUST match the user's selected 'Dominant Ideology' (separate from Government Type).
                    Government Type and Dominant Ideology are now separate concepts - Government Type is how the state is organized, Ideology is what beliefs dominate society.
                    
                    BIBLICAL/ANCIENT EVENTS (if Historical Events enabled and year 0-500 CE):
                    - Year 0-33 CE: Jesus of Nazareth's ministry, teachings, and growing following
                    - Roman persecution of early Christians
                    - Jewish revolts against Rome
                    - Rise of Christianity as major religion
                    - Classical philosophy (Stoicism, Epicureanism) competing with new faiths
                    - Include these events in worldEventsSummary and neighbor relationships if relevant
                    
                    Initialize 'estimatedStrength' for all neighbors to "???" unless specific starting intel is granted by a buff.
                    Initialize 'Missile Count' to 0 and 'Nuclear Status' to 'None'. Leader Security Level should be Medium initially.
                    Generate diverse ethnicGroups for the player's nation and for neighbors. Player's flagPrompt should be based on user input. Neighbor/WorldNation flagPrompts should be creative based on their names/ideologies.
                    Generate a worldMapPrompt: if historical, base on startYear and player region. If fictional, create a compelling continental setup.
                    Ensure 'playerFlagUrl', 'worldMapUrl', and neighbor/worldNation 'flagUrl' are 'null'.
                    Initialize default ministers as null or with generic names and 'Medium' skill, 'Neutral' loyalty.
                    Initialize secretAgency.stats with low-to-medium starting values. secretAgency.knownPlots should be empty. secretAgency.neighborIntel should be an empty object initially.
                    For currency: If historical events enabled and startYear is modern (1900+), use real currencies based on geographic hints. Otherwise, create a fictional currency with creative name and simple symbol. Set isReal appropriately and generate iconPrompt for fictional currencies.
                    If the chosen 'Government Type' is one that holds elections, initialize 'government.nextElectionYear' to startYear + 4, and create 2-3 'government.politicalParties'.
                    Initialize military.inventory with realistic starting units for Army, Navy, and Airforce appropriate for the historical period and nation size.
                    Initialize trade with a few starting resources and potentially one or two neutral trade partners. Give them some starting 'Revenue' and 'Expenses' in economy stats.
                    If 'Historical Events' is enabled, flavor text, worldNations, and map prompt should subtly reflect this. Otherwise, more fictional.
                    Crucially, generate a compelling origin story for the nation (history field) based on the provided parameters.
                    Respond directly with JSON, following this JSON schema EXACTLY, and no other text:
                    ${initialWorldSchema}`,
                },
                { role: "user", content: `Simulate world generation for ${countryDetails.countryName} in ${countryDetails.startYear}.` }
            ],
            json: true,
        });

        let parsedContent;
        try {
            const sanitized = sanitizeJSONResponse(completion.content);
            parsedContent = tolerantParseJSON(sanitized);
            if (!parsedContent) throw new Error('tolerantParseJSON failed to parse content');
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            console.error("Raw AI response:", completion.content);
            loadingIndicator.textContent = "Error: Could not understand the generated world data. Please try again.";
            actionFeedback.textContent = `Error parsing setup data: ${parseError.message}. Raw response (sanitized attempt): ${sanitizeJSONResponse(completion.content).substring(0, 200)}...`;
            loadingIndicator.style.display = 'none';
            return;
        }

        countryData = ensureCoreDataStructure(parsedContent);

        // If player selected "Political Party" as government type, ensure they start as a small party
        // with a very small military (50 soldiers) and clear instructions/goals for taking power.
        try {
            if (countryDetails.govType === 'Political Party' || (countryData.internal && countryData.internal.stats && countryData.internal.stats['Government Type'] === 'Political Party')) {
                countryData.government = countryData.government || {};
                countryData.government.politicalParties = countryData.government.politicalParties || [];

                // Ensure player's party exists and is small
                const playerPartyName = `${countryDetails.countryName} Party`;
                const existingIndex = countryData.government.politicalParties.findIndex(p => p.name === playerPartyName || p.leaderName === countryDetails.leaderName);
                const playerParty = {
                    name: playerPartyName,
                    ideology: countryDetails.dominantIdeology || (countryData.internal && countryData.internal.stats && countryData.internal.stats['Dominant Ideology']) || 'Unknown',
                    leaderName: countryDetails.leaderName,
                    leaderStyle: countryDetails.leaderStyle || 'Unknown',
                    popularity: 3, // very small starting popularity
                    goals: "Grow party support and take power through elections or by force (coup).",
                    isExtremist: false
                };

                if (existingIndex >= 0) {
                    countryData.government.politicalParties[existingIndex] = Object.assign(countryData.government.politicalParties[existingIndex], playerParty);
                } else {
                    countryData.government.politicalParties.unshift(playerParty);
                }

                // Force small military: total soldiers 50, minimal inventory
                countryData.military = countryData.military || {};
                countryData.military.stats = countryData.military.stats || {};
                countryData.military.stats['Total Soldiers'] = 50;
                countryData.military.stats['Strength'] = 10; // low strength rating consistent with tiny force
                countryData.military.inventory = countryData.military.inventory || {};
                countryData.military.inventory.Army = countryData.military.inventory.Army || [];
                // Remove heavy units if any, keep a small militia entry
                countryData.military.inventory.Army = [{
                    name: "Party Militia",
                    type: "Infantry (Militia)",
                    quantity: 50,
                    description: "A small partisan militia loyal to the player's political party, lightly armed and poorly trained.",
                    efficiency: 40,
                    price: 0
                }];
                countryData.military.inventory.Navy = countryData.military.inventory.Navy || [];
                countryData.military.inventory.Airforce = countryData.military.inventory.Airforce || [];
                countryData.military.inventory.Missiles = countryData.military.inventory.Missiles || [];
                countryData.military.inventory.Nuclear = countryData.military.inventory.Nuclear || [];

                // Add a visible hint in government situation to drive gameplay
                countryData.government.situation = (countryData.government.situation || '') + `\n\nNote: Your nation currently functions as a small political party with limited forces (50 militia). You must grow your party's popularity to win elections or attempt a coup to seize control.`;
            }
        } catch (e) {
            console.error("Failed to initialize political-party start overrides:", e);
        }

        if (countryData.factions) {
            countryData.factions.forEach(faction => {
                if (faction.playerIsMember && !faction.nextElectionYear) {
                    faction.nextElectionYear = gameYear + 10;
                }
            });
        }
        
        setupScreen.style.display = 'none';
        gameScreen.style.display = 'block';

        // Show an AI-generated intro "video" slideshow narrating the start of the country
        try {
            // Only show intro when starting a NEW simulation (not loading saved)
            if (!savedGameData) {
                await generateAndPlayIntro(countryDetails, countryData);
            }
        } catch (introErr) {
            console.error('Intro generation/playback failed:', introErr);
        }

        await updateUI();
        openTab('Diplomacy');
        loadingIndicator.style.display = 'none';

    } catch (error) {
        console.error("Error fetching data from AI:", error);
        loadingIndicator.textContent = "Error generating world. Please try again.";
        actionFeedback.textContent = `Error during setup: ${error.message || String(error)}`;
        loadingIndicator.style.display = 'none';
    }
}

actionButtons.forEach(button => {
    button.addEventListener('click', handleActionSubmit);
});

if (sendChatMessageButton) {
    sendChatMessageButton.addEventListener('click', () => {
        const targetLeaderName = sendChatMessageButton.dataset.leaderName;
        const targetCountryName = sendChatMessageButton.dataset.countryName;
        const message = chatMessageInput.value.trim();
        if (message && targetLeaderName && targetCountryName) {
            const actionText = `Send message to ${targetLeaderName} of ${targetCountryName}: "${message}"`;
            handleActionSubmit(null, actionText, 'Communications');
            chatMessageInput.value = '';
            // The modal will be updated/closed after the action response
        }
    });
}

restartButton.addEventListener('click', () => {
    localStorage.removeItem(`${SAVE_GAME_KEY_BASE}1`);
    setupScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    loadingIndicator.style.display = 'none';
    actionLoadingIndicator.style.display = 'none';
    actionFeedback.textContent = '';
    globalEventsFeed.innerHTML = '';
    globalEventsFeed.style.display = 'none';
    localNewsFeed.innerHTML = '';
    localNewsFeed.style.display = 'none';
    countryData = {};
    countryDetails = {};
    gameYear = 0;
    isGameOver = false;
    recentlyConquered = null;
    currentGovType = '';
    currentPlayerLeaderStyle = '';
    worldNationsCache = [];
    closeModal();
    closeChatModal();
    if (setupForm) setupForm.reset();
    enableAllInputs();

    const allSituations = [diplomacySituation, economySituation, militarySituation, internalSituation, cultureSituation, governmentSituation, secretAgencySituation, internationalSituation, tradeSituation, organizationsSituation, factionsSituation, communicationsSituation]; 
    allSituations.forEach(el => { if (el) el.innerHTML = ''; });
    const allStatsLists = [diplomacyStats, economyStats, militaryStats, internalStats, cultureStats, governmentStats, secretAgencyStats, tradeStats]; 
    allStatsLists.forEach(el => { if (el) el.innerHTML = ''; });
    if (diplomacyNeighbors) diplomacyNeighbors.innerHTML = '';
    if (diplomacyPuppetsList) diplomacyPuppetsList.innerHTML = '';
    if (communicationsLeadersList) communicationsLeadersList.innerHTML = '';
    if (ministersList) ministersList.innerHTML = '';
    if (secretAgencyIntelReports) secretAgencyIntelReports.innerHTML = '';
    if (mapBorderList) mapBorderList.innerHTML = '<li>Loading border information...</li>';
    if (mapCountryName) mapCountryName.textContent = '';
    if (internationalNations) internationalNations.innerHTML = '';
    if (cultureEthnicGroups) cultureEthnicGroups.innerHTML = '<p>Ethnic composition data not yet available.</p>';
    if (militaryInventory) militaryInventory.innerHTML = ''; 
    if (tradeResourcesList) tradeResourcesList.innerHTML = ''; 
    if (tradePartnersList) tradePartnersList.innerHTML = '';

    if (gameTitle) gameTitle.textContent = '';
    if (gameSubtitle) gameSubtitle.textContent = '';
    if (nextElectionYearDisplay) nextElectionYearDisplay.textContent = 'N/A';
    if (politicalPartiesList) politicalPartiesList.innerHTML = '';

    if (playerFlagImg) {
        playerFlagImg.style.display = 'none';
        playerFlagImg.src = 'placeholder_flag.png';
    }
    if (worldMapImage) {
        worldMapImage.style.display = 'none';
        worldMapImage.src = 'placeholder_map.png';
    }
    if (worldMapPlaceholder) {
        worldMapPlaceholder.textContent = 'World map visualization is being generated or is under development.';
        worldMapPlaceholder.style.display = 'block';
    }
    if (historyContent) historyContent.innerHTML = '<p>History data not available.</p>'; 

    if (organizationsSituation) organizationsSituation.innerHTML = '<p>Overview of major global organizations.</p>';
    if (organizationsList) organizationsList.innerHTML = '<li>Loading organizations...</li>';

    if (factionsSituation) factionsSituation.innerHTML = '<p>Overview of major global factions and your involvement.</p>';
    if (playerFactionInfo) playerFactionInfo.innerHTML = '<p>You are not currently a member or leader of a faction.</p>';
    if (globalFactionsList) globalFactionsList.innerHTML = '<li>Loading factions...</li>';
});

async function handleActionSubmit(event, directActionText = null, directTabName = null) {
    if (isGameOver) return;

    // Safely resolve the action button from the click event (child elements may be clicked)
    let button = null;
    if (event) {
        try {
            if (event.target && typeof event.target.closest === 'function') {
                button = event.target.closest('.action-button') || event.target;
            } else {
                button = event.target;
            }
        } catch (e) {
            button = event.target;
        }
    } else {
        button = document.querySelector('.action-button[data-tab="Diplomacy"]');
    }

    const tabName = directTabName || (button && button.dataset && button.dataset.tab ? button.dataset.tab : 'Internal');
    const inputId = `${tabName.toLowerCase()}-action`;
    const inputElement = document.getElementById(inputId);

    const actionText = directActionText || (inputElement ? inputElement.value.trim() : '');
    if (!actionText && tabName !== "Internal") {
        actionFeedback.textContent = "Please enter an action.";
        return;
    }

    // Check for direct war declaration without justification
    if (actionText.toLowerCase().includes("war") && 
        actionText.toLowerCase().includes("declare") && 
        !Object.keys(justificationData).some(neighbor => 
            justificationData[neighbor].progress >= 100 && 
            actionText.toLowerCase().includes(neighbor.toLowerCase()))) {
        
        const targetCountry = (countryData.diplomacy?.neighbors || [])
            .find(n => actionText.toLowerCase().includes(n.name.toLowerCase()))?.name;
            
        if (targetCountry) {
            // Check if already at war (no need to show warning)
            const alreadyAtWar = occupationData[targetCountry] !== undefined;
            
            // Check for peace treaty violation
            const hasPeaceTreaty = peaceTreatyData[targetCountry] !== undefined;
            const treatyActive = hasPeaceTreaty && 
                                (peaceTreatyData[targetCountry].endYear > gameYear || 
                                 (peaceTreatyData[targetCountry].endYear === gameYear && 
                                  peaceTreatyData[targetCountry].endMonth >= gameMonth));
            
            if (alreadyAtWar) {
                // Already at war, no need to show warning
                // Continue with the war action
            } else if (treatyActive) {
                // Peace treaty still active, show warning about severe consequences
                actionFeedback.innerHTML = converter.makeHtml(`**TREATY VIOLATION WARNING:** You have an active peace treaty with ${targetCountry} that will expire in ${monthNames[peaceTreatyData[targetCountry].endMonth-1]} ${peaceTreatyData[targetCountry].endYear}. Breaking this treaty will result in severe diplomatic penalties, possible sanctions, and reduced international standing. Do you wish to proceed anyway?`);
                
                // Create confirmation buttons
                const confirmDiv = document.createElement('div');
                confirmDiv.style.marginTop = '10px';
                
                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = 'Break Treaty';
                confirmBtn.className = 'action-button';
                confirmBtn.style.backgroundColor = '#f44336';
                confirmBtn.style.marginRight = '10px';
                confirmBtn.onclick = () => {
                    // Add treaty violation penalties through the action system
                    handleActionSubmit(null, `Break peace treaty with ${targetCountry} and declare war`);
                };
                
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';
                cancelBtn.className = 'action-button';
                cancelBtn.onclick = () => {
                    actionFeedback.innerHTML = converter.makeHtml(`War declaration cancelled. The peace treaty with ${targetCountry} remains in effect.`);
                };
                
                confirmDiv.appendChild(confirmBtn);
                confirmDiv.appendChild(cancelBtn);
                actionFeedback.appendChild(confirmDiv);
                
                return; // Stop here until user confirms
            } else {
                actionFeedback.innerHTML = converter.makeHtml(`**WARNING:** You are attempting to declare war on ${targetCountry} without justification. This will severely damage your international reputation and may trigger sanctions. It is recommended to justify war first.`);
                
                // Continue with the war declaration, but with penalties applied later
                // We'll let the existing action processing handle this with the AI understanding the player is being aggressive
            }
        }
    }

    // Check for faction joining to play sound
    const isJoiningFaction = actionText.toLowerCase().includes("join") && 
                           (actionText.toLowerCase().includes("faction") || 
                            (countryData.factions || []).some(f => 
                                actionText.toLowerCase().includes(f.name.toLowerCase())));
    
    // Check for war declaration to initialize occupation tracking
    const warDeclarationMatch = actionText.toLowerCase().match(/declare\s+war\s+(?:on|against)\s+([a-zA-Z\s]+)/i);
    if (warDeclarationMatch && warDeclarationMatch[1]) {
        const targetCountry = warDeclarationMatch[1].trim();
        // Find the country in neighbors to make sure it exists
        const neighbor = (countryData.diplomacy?.neighbors || []).find(n => 
            n.name.toLowerCase() === targetCountry.toLowerCase());
            
        if (neighbor) {
            // Check if already at war (shouldn't reinitialize)
            if (!occupationData[neighbor.name]) {
                // Initialize occupation tracking at 0%
                occupationData[neighbor.name] = {
                    progress: 0,
                    startMonth: gameMonth,
                    startYear: gameYear,
                    canPeaceTreaty: false,
                    terrain: neighbor.terrain || 'Mixed'
                };
            }
            
            // If we broke a peace treaty, we need to track this for penalties
            if (peaceTreatyData[neighbor.name] && 
                (peaceTreatyData[neighbor.name].endYear > gameYear || 
                 (peaceTreatyData[neighbor.name].endYear === gameYear && 
                  peaceTreatyData[neighbor.name].endMonth >= gameMonth))) {
                
                // Will be handled by the AI through action processing
                actionText = `Break peace treaty with ${neighbor.name} and declare war`;
            }
            
            // Clear any justification data as we've now declared war
            if (justificationData[neighbor.name]) {
                delete justificationData[neighbor.name];
            }
        }
    }
    
    // Check for peace treaty action
    const peaceTreatyMatch = actionText.toLowerCase().match(/(?:offer|propose|make)\s+peace\s+(?:to|with)\s+([a-zA-Z\s]+)/i);
    if (peaceTreatyMatch && peaceTreatyMatch[1]) {
        const targetCountry = peaceTreatyMatch[1].trim();
        
        // Check if we can offer peace (must have 100% occupation)
        if (occupationData[targetCountry] && occupationData[targetCountry].progress >= 100) {
            // This will be handled by the AI through the action system
            occupationData[targetCountry].canPeaceTreaty = true;
        } else if (occupationData[targetCountry]) {
            actionFeedback.innerHTML = converter.makeHtml(`**Cannot offer peace treaty:** You must reach 100% occupation of ${targetCountry} before you can dictate peace terms. Current occupation: ${Math.round(occupationData[targetCountry].progress)}%`);
            return;
        } else {
            actionFeedback.innerHTML = converter.makeHtml(`**Cannot offer peace treaty:** You are not currently at war with ${targetCountry} or no occupation progress is tracked.`);
            return;
        }
    }
    
    actionLoadingIndicator.style.display = 'block';
    actionFeedback.textContent = '';
    globalEventsFeed.innerHTML = '';
    globalEventsFeed.style.display = 'none';
    localNewsFeed.innerHTML = '';
    localNewsFeed.style.display = 'none';
    closeModal();
    closeChatModal();
    disableActionInputs(true);
    recentlyConquered = null;

    const playerIdeologyForPrompt = getNestedValue(countryData, 'internal.stats.Dominant Ideology', countryDetails.dominantIdeology);
    const playerGovTypeForPrompt = getNestedValue(countryData, 'internal.stats.Government Type', countryDetails.govType);
    const playerLeaderStyleForPrompt = countryDetails.leaderStyle;

    try {
        const slimCountryData = JSON.parse(JSON.stringify(countryData, (key, value) => {
            if (key.endsWith('Url') || (key.endsWith('Prompt') && key !== 'playerFlagPrompt' && key !== 'worldMapPrompt')) return undefined;
            if (key === 'ethnicGroups' && value && value.length > 5) return value.slice(0, 5).map(g => ({ name: g.name, percentage: g.percentage }));
            if (key === 'languages' && value && value.length > 5) return value.slice(0, 5);
            if (key === 'neighbors' && value && value.length > 5) {
                return value.slice(0, 5).map(n => ({ name: n.name, relationship: n.relationship, ideology: n.ideology, estimatedStrength: n.estimatedStrength }));
            }
            if (key === 'puppets' && value && value.length > 3) return value.slice(0, 3).map(p => ({ name: p.name, loyaltyToPlayer: p.loyaltyToPlayer }));
            if (key === 'politicalParties' && value && value.length > 3) return value.slice(0, 3).map(p => ({ name: p.name, popularity: p.popularity, ideology: p.ideology }));
            if (key === 'knownPlots' && value && value.length > 3) return value.slice(0, 3);
            if (key === 'resources' && value && value.length > 5) return value.slice(0, 5);
            if (key === 'partners' && value && value.length > 3) return value.slice(0, 3);
            if (key === 'ministers' && typeof value === 'object' && value !== null) {
                const slimMinisters = {};
                for (const port in value) {
                    if (value[port] && value[port].name) slimMinisters[port] = { name: value[port].name, loyalty: value[port].loyalty || 'Unknown' };
                    else slimMinisters[port] = null;
                }
                return slimMinisters;
            }
            return value;
        }));

        const currentStateString = JSON.stringify(slimCountryData, null, 1);
        const neighborInfoString = JSON.stringify(getNestedValue(countryData, 'diplomacy.neighbors', []).map(n => `${n.name}(Str:${getNestedValue(countryData, `secretAgency.neighborIntel.${n.name}.strengthKnown`) ? n.estimatedStrength : '???'},Rel:${n.relationship},Ideo:${n.ideology || '?'})`) || 'N/A');
        const puppetInfoString = JSON.stringify(getNestedValue(countryData, 'diplomacy.puppets', []).map(p => `${p.name}(Tax:${p.taxRate}%,Autonomy:${p.autonomyDesire}%)`) || 'None');
        const alliesString = JSON.stringify(getNestedValue(countryData, 'diplomacy.allies', []) || 'None');
        const leaderDetailsString = `${countryDetails.leaderName} (Age: ${countryDetails.leaderAge}, Style: ${playerLeaderStyleForPrompt}, Government: ${playerGovTypeForPrompt}, Ideology: ${playerIdeologyForPrompt})`;
        const worldNationsString = JSON.stringify((worldNationsCache || []).slice(0, 10).map(n => `${n.name} (${n.status}, Ideo: ${n.ideology}, Leader: ${n.leaderInfo || 'Unknown'})`) || 'N/A');
        const ministersString = JSON.stringify(getNestedValue(countryData, 'government.ministers', {}));
        const justificationString = JSON.stringify(justificationData);
        const occupationString = JSON.stringify(occupationData);

        const actionResponseSchema = `{
          "newState": {
            /* ... same structure as initialWorldSchema, ALL fields must be present ... */
            "diplomacy": { /* ... */ "neighbors": [ { /*...,*/ "estimatedStrength": "string(??? or number)", "flagPrompt":"string", "flagUrl":"null|string", "ethnicGroups": [{"name": "string", "percentage": "number"}] } ], "puppets": [ { "name": "string", "taxRate": "number", "autonomyDesire": "number", "loyaltyToPlayer": "number" } ], "allies": ["string"] /*...*/ },
            "economy": { "stats": { "GDP Growth": "string", "Unemployment": "number", "Treasury": "number", "Inflation": "number", "Army Maintenance Cost": "number", "Revenue": "number", "Expenses": "number" }, "situation": "string(markdown)"},
             "military": {
                "stats": { "Strength": "number", "Technology Level": "string", "Morale": "string", "Total Soldiers": "number", "Missile Count": "number", "Nuclear Status": "string" },
                "situation": "string(markdown)",
                "inventory": {
                    "Army": [{"name": "string", "type": "string", "quantity": "number", "description": "string(markdown, brief)", "efficiency": "number", "price": "number"}],
                    "Navy": [{"name": "string", "type": "string", "quantity": "number", "description": "string(markdown, brief)", "efficiency": "number", "price": "number"}],
                    "Airforce": [{"name": "string", "type": "string", "quantity": "number", "description": "string(markdown, brief)", "efficiency": "number", "price": "number"}],
                    "Missiles": [{"name": "string", "type": "string", "quantity": "number", "description": "string(markdown, brief)", "efficiency": "number", "price": "number"}],
                    "Nuclear": [{"name": "string", "type": "string", "quantity": "number", "description": "string(markdown, brief)", "efficiency": "number", "price": "number"}]
                }
             },
            "internal": {
                "stats": { "Population": "number", "Happiness": "number(0-100)", "Dominant Ideology": "string", "Government Type": "string", "Leader Approval": "number(0-100)", "Leader Security Level": "string" },
                "situation": "string(markdown)"
            },
            "culture": {
                "stats": { "Dominant Values": "string", "Artistic Output": "string(High/Medium/Low)", "Social Cohesion": "number(0-100)", "Cultural Influence (Abroad)": "number(0-100)"},
                "situation": "string(markdown)",
                "ethnicGroups": [ { "name": "string", "percentage": "number(0-100)", "notes": "string" } ],
                "languages": ["string"]
            },
            "government": {
                "stats": { "Efficiency": "number", "Corruption Level": "number", "Tax Rate": "number" },
                "situation": "string(markdown)",
                "ministers": {
                    "Defense": { "name": "string|null", "skill": "string|null", "loyalty": "string|null" },
                    "ForeignAffairs": { "name": "string|null", "skill": "string|null", "loyalty": "string|null" },
                    "Economy": { "name": "string|null", "skill": "string|null", "loyalty": "string|null" },
                    "InternalSecurity": { "name": "string|null", "skill": "string|null", "loyalty": "string|null" }
                },
                "politicalParties": [ { "name": "string", "ideology": "string", "leaderName": "string", "leaderStyle": "string", "popularity": "number", "goals": "string", "isExtremist": "boolean" } ],
                "nextElectionYear": "number|null"
            },
            "religion": {
                "stats": {"Religious Harmony": "number", "InfluenceOfReligion": "string"},
                "situation": "string(markdown)",
                "demographics": [{"name": "string", "percentage": "number", "beliefsSummary": "string"}]
            },
            "secretAgency": {
                "stats": { "Agency Funding": "number", "CounterIntelligence": "number", "GlobalReach": "number" },
                "situation": "string(markdown)",
                "knownPlots": ["string"],
                "neighborIntel": { /* Populated by AI based on neighbors */ }
            },
            "trade": {
                "stats": { "Trade Balance": "string", "Resource Abundance": "string", "Trade Efficiency": "number" },
                "situation": "string(markdown)",
                "resources": [ { "name": "string", "quantity": "number", "unit": "string", "pricePerUnit": "number" } ],
                "partners": [ { "name": "string", "relationship": "string", "tradeValueLastYear": "number" } ]
            },
            "worldNations": [ { "name": "string", "ideology": "string", "status": "string", "notes": "string", "leaderInfo": "string", "flagPrompt": "string", "flagUrl": "null|string"} ],
            "organizations": [ { "name": "string", "type": "string", "influence": "number", "members": "string[]", "playerIsMember": "boolean", "playerIsLeader": "boolean", "requirements": "string" } ],
            "factions": [ { "name": "string", "type": "string", "goal": "string", "members": "string[]", "leader": "string", "nextElectionYear": "number", "playerIsMember": "boolean", "playerIsLeader": "boolean", "requirements": "string" } ],
            "playerFaction": { "name": "string", "type": "string", "goal": "string", "members": "string[]", "leader": "string", "nextElectionYear": "number" } | null,
            "organizationApplications": [ { "name": "string", "responseYear": "number", "status": "string", "reason": "string" } ],
            "factionElections": [ { "factionName": "string", "nextElectionYear": "number" } ]
          },
          "outcomeSummary": "string(markdown, detailed summary of player's action and direct consequences. If player leader died, include details of funeral, international reactions, and impact on national stability.)",
          "worldEventsSummary": ["string(markdown, for major non-player actions, neighbor actions, random events, leader deaths of OTHER nations including neighbors, neighbor elections. Max 3-4 distinct events. Update neighbor/worldNation leader details in newState if they change.)"],
          "localNewsFeed": ["string(markdown, 2-3 short, flavorful news snippets about domestic events like local festivals, minor accidents, scientific discoveries, or celebrity gossip)"],
          "playerLeaderDied": "boolean",
          "reasonForPlayerLeaderDeath": "string|null",
          "conquestSuccess": { "name": "string", "newNeighbors": ["string"] } | null,
          "collapsed": "boolean",
          "playerLeaderReplaced": "boolean",
          "newPlayerLeader": { "name": "string", "style": "string", "reason": "string" } | null,
          "factionElectionResults": { "factionName": "string", "previousLeader": "string", "newLeader": "string", "playerWon": "boolean" } | null,
          "organizationApplicationResult": { "name": "string", "accepted": "boolean", "reason": "string" } | null,
          "joinedFaction": "boolean",
          "warOccupationUpdate": { "targetCountry": "string", "newProgress": "number", "description": "string" } | null,
          "peaceTreatyResult": { "targetCountry": "string", "accepted": "boolean", "territories": ["string"], "reparations": "number", "puppeted": "boolean", "description": "string" } | null,
          "leaderEvents": {
            "leaderDied": "boolean",
            "deathCause": "string|null (e.g., 'Old age', 'Assassination', 'Illness', 'Missile strike')",
            "newLeader": {
              "name": "string",
              "age": "number", 
              "style": "string",
              "relationship": "string (e.g., 'Son', 'Vice President', 'Military Commander')"
            } | null,
            "memorial": {
              "name": "string",
              "reignYears": "string (e.g., '2024-2026')",
              "achievements": ["string"],
              "publicOpinion": "string (e.g., 'Beloved', 'Controversial', 'Hated')"
            } | null,
            "familyEvent": {
              "type": "string (e.g., 'birth', 'marriage', 'assassination_attempt', 'sibling_gift')",
              "description": "string",
              "participant": "string (family member name)"
            } | null
          },
          "chatReply": {
            "targetLeaderName": "string",
            "replyMessage": "string(markdown, the leader's direct reply to the player's message)"
          } | null
        }`;

        const enhancedSystemPrompt = `You are a complex world simulation AI. Simulate the consequences of the user's action for one month.
Current Year: ${gameYear}, Current Month: ${monthNames[gameMonth-1]}. Player Leader Age: ${countryDetails.leaderAge}. Historical Events: ${historicalEventsEnabled ? 'Enabled' : 'Fictional Focus'}.
Country: ${countryDetails.countryName}. Leader: ${leaderDetailsString}.
Current State (slimmed): ${currentStateString}
Neighbors Overview: ${neighborInfoString}. Puppets: ${puppetInfoString}. Allies: ${alliesString}. Ministers: ${ministersString}.
Known World Nations Overview: ${worldNationsString}.
Current War Justifications: ${justificationString}
Current War Occupations: ${occupationString}

BIBLICAL/ANCIENT EVENTS (if Historical Events enabled and year 0-500 CE):
If the current year is around 0-33 CE, incorporate major Biblical events:
- Jesus's ministry, teachings, and growing following
- Roman authorities' concern about this new religious movement
- The crucifixion of Jesus by Roman authorities
- Reports of Jesus's resurrection and empty tomb
- Early Christian community formation
- Jewish religious leaders' reactions
- Roman persecution of early Christians
- Spread of Christianity throughout the Roman Empire

These events should influence neighbor relations, internal stability, and world events if relevant to the player's nation and neighbors.

ENHANCED NEIGHBOR AUTONOMY & REACTIONS:
1. **Neighbor Emotional Reactions:** Each neighbor should react emotionally to player actions:
   - Trade deals/aid/positive diplomacy → happy/very_happy
   - War declarations/sanctions/hostility → angry/very_angry
   - Spy actions/justifications → suspicious/worried
   - Nuclear threats/major aggression → threatening/nuclear_threat
   - Neutral actions → neutral

2. **Autonomous Neighbor Actions:** Neighbors should take independent actions based on:
   - Their ideology, leader personality, and current emotional state
   - Regional power dynamics and opportunities
   - Their military strength and nuclear capabilities
   - Economic needs and territorial ambitions
   - Player's perceived weakness or strength

3. **Neighbor War Powers:** Any neighbor can:
   - Justify war against player or other nations (takes 2-3 months)
   - Declare war when justified or if desperate/aggressive
   - Use nuclear weapons if they possess them and situation is dire
   - Form alliances against strong players
   - Demand territory, reparations, or puppet status

4. **Realistic Neighbor Behavior:** 
   - Aggressive ideologies (Fascism, extreme Nationalism) more likely to start wars
   - Weak neighbors may band together against strong player
   - Nuclear powers may threaten use if being invaded
   - Economic powers may use sanctions and trade wars
   - Neighbors should have their own goals beyond just reacting to player

LEADER DEATH & SUCCESSION RULES:
Leaders can die from various causes. Age-based death probability increases after age 65.
Death causes: Natural causes, illness, assassination, accident, war casualties, nuclear attack.
Upon leader death, succession depends on government type:
- Monarchy: Heir becomes new leader (if designated), otherwise civil war risk
- Democracy/Republic: Elections held immediately or VP takes over
- Dictatorship: Military coup or successor designated by regime
- Theocracy: Religious council selects new leader

ACTION: CHAT MESSAGES
If the action is a chat message, generate a realistic reply from the target leader in the 'chatReply' object. The reply should be based on their personality, their country's relationship with the player, and the message content. The AI's reply should also impact the relationship in the 'newState'. Keep the conversation log updated.

ACTION: NPC WAR JUSTIFICATION/DECLARATION
If a neighbor's relationship is 'Hostile' or they have an aggressive ideology, they have a high chance of starting a 'Justify War' action against the player, which you should add to their 'justifyingOnPlayer' object { progress: 33, reason: '...' }. Report this in worldEventsSummary. If a justification is already complete, they may declare war, which should be a major world event.

**IMPORTANT:** In your response, include detailed neighbor reactions and autonomous actions in the worldEventsSummary. Specify exact emotions for each neighbor affected by player actions. When world events happen, ensure the consequences are reflected in the 'newState' (e.g., a famine in a neighbor country should reduce their stats). Generate a few flavorful 'localNewsFeed' items.

Respond ONLY with JSON following this schema EXACTLY:
${actionResponseSchema}`;

        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: enhancedSystemPrompt,
                },
                { role: "user", content: `Simulate action: ${actionText} (Tab: ${tabName})` }
            ],
            json: true,
        });

        let result;
        try {
            const sanitized = sanitizeJSONResponse(completion.content);
            result = tolerantParseJSON(sanitized);
            if (!result || typeof result !== 'object') {
                console.error("Invalid response structure from AI (missing newState or not an object):", result);
                actionFeedback.textContent = "Received an incomplete simulation response. State not updated.";
                actionLoadingIndicator.style.display = 'none';
                disableActionInputs(false);
                return;
            }
        } catch (error) {
            console.error("Error parsing AI action response:", error);
            console.error("Raw AI response:", completion.content);
            actionFeedback.textContent = `Error: Could not understand the simulation results. State not updated. ${error.message}. Raw response (sanitized attempt): ${sanitizeJSONResponse(completion.content).substring(0, 200)}...`;
            actionLoadingIndicator.style.display = 'none';
            disableActionInputs(false);
            return;
        }

        console.log("AI Action Response:", result);

        if (result.newState) {
            countryData = ensureCoreDataStructure(result.newState);
            
            // Handle chat reply
            if (result.chatReply) {
                const { targetLeaderName, replyMessage } = result.chatReply;
                let targetFound = false;

                // Find in neighbors
                const neighbor = (countryData.diplomacy.neighbors || []).find(n => n.leaderName === targetLeaderName);
                if (neighbor) {
                    neighbor.communicationLog = neighbor.communicationLog || [];
                    // Add player's message (from action text) and AI's reply
                    const playerMessageMatch = actionText.match(/"([^"]*)"/);
                    if(playerMessageMatch && playerMessageMatch[1]) {
                        neighbor.communicationLog.push({ from: countryDetails.leaderName, message: playerMessageMatch[1], year: gameYear, month: gameMonth });
                    }
                    neighbor.communicationLog.push({ from: targetLeaderName, message: replyMessage, year: gameYear, month: gameMonth });
                    targetFound = true;
                }

                // Find in world nations if not in neighbors
                if (!targetFound) {
                    const worldNation = (countryData.worldNations || []).find(n => n.leaderInfo && n.leaderInfo.includes(targetLeaderName.split(' ')[0])); // simplified search
                     if (worldNation) {
                        worldNation.communicationLog = worldNation.communicationLog || [];
                        const playerMessageMatch = actionText.match(/"([^"]*)"/);
                        if(playerMessageMatch && playerMessageMatch[1]) {
                            worldNation.communicationLog.push({ from: countryDetails.leaderName, message: playerMessageMatch[1], year: gameYear, month: gameMonth });
                        }
                        worldNation.communicationLog.push({ from: targetLeaderName, message: replyMessage, year: gameYear, month: gameMonth });
                    }
                }
                
                // If the chat modal is open for this leader, refresh it
                if (chatModal.style.display === 'block' && sendChatMessageButton.dataset.leaderName === targetLeaderName) {
                    const country = neighbor || worldNationsCache.find(n => n.leaderInfo && n.leaderInfo.includes(targetLeaderName.split(' ')[0]));
                    if (country) {
                        openChatModal(country.leaderName || country.leaderInfo, country.name);
                    }
                } else {
                    closeChatModal();
                }
            }


            // Increment month
            gameMonth++;
            if (gameMonth > 12) {
                gameMonth = 1;
                gameYear++;
            }
            
            // Only increment age in January (month 1)
            if (gameMonth === 1) {
                countryDetails.leaderAge++;
            }

            // Process justification action
            if (actionText.toLowerCase().includes("justify war against") || actionText.toLowerCase().includes("justify war on")) {
                const regex = /justify war (?:against|on) ([^,]+)(?:,| for) ?(.*)?/i;
                const match = actionText.match(regex);
                
                if (match && match[1]) {
                    const targetCountry = match[1].trim();
                    const reason = (match[2] || "Unspecified reason").trim();
                    
                    // Check if country exists
                    if ((countryData.diplomacy?.neighbors || []).some(n => n.name === targetCountry)) {
                        // Start justification
                        justificationData[targetCountry] = {
                            progress: 33, // Start with 33% progress
                            reason: reason,
                            startMonth: gameMonth,
                            startYear: gameYear
                        };
                        
                        // Update relations with target (make them more hostile)
                        countryData.diplomacy.neighbors = countryData.diplomacy.neighbors.map(n => {
                            if (n.name === targetCountry) {
                                n.relationship = "Hostile";
                                n.reason = `${n.reason || ''} They know you are preparing for war.`;
                            }
                            return n;
                        });
                    }
                }
            }
            
            // Process existing justifications
            Object.keys(justificationData).forEach(country => {
                const justification = justificationData[country];
                
                // Update progress
                if (justification.progress < 100) {
                    justification.progress += 33; // Roughly 33% per month
                    
                    // Cap at 100%
                    if (justification.progress > 100) {
                        justification.progress = 100;
                        
                        // Show completion message
                        actionFeedback.innerHTML += converter.makeHtml(`\n\n**War Justification Complete:** You can now declare war on ${country}. Justification reason: ${justification.reason}`);
                    }
                    
                    // Make country more hostile as justification progresses
                    countryData.diplomacy.neighbors = countryData.diplomacy.neighbors.map(n => {
                        if (n.name === country) {
                            n.relationship = "Hostile";
                            n.reason = `${n.reason || ''} They are aware of your war preparations.`;
                        }
                        return n;
                    });
                }
            });
            
            // Process war occupation updates
            if (result.warOccupationUpdate) {
                const update = result.warOccupationUpdate;
                if (occupationData[update.targetCountry]) {
                    occupationData[update.targetCountry].progress = update.newProgress;
                    
                    // If occupation reaches 100%, enable peace treaty
                    if (update.newProgress >= 100) {
                        occupationData[update.targetCountry].canPeaceTreaty = true;
                    }
                }
            }
            
            // Process peace treaty results
            if (result.peaceTreatyResult) {
                const treaty = result.peaceTreatyResult;
                if (treaty.accepted) {
                    // Remove country from occupation tracking
                    delete occupationData[treaty.targetCountry];
                    
                    // Create a peace treaty record
                    peaceTreatyData[treaty.targetCountry] = {
                        endYear: gameYear + PEACE_TREATY_YEARS,
                        endMonth: gameMonth,
                        terms: []
                    };
                    
                    // Add terms to the treaty
                    if (treaty.territories && treaty.territories.length > 0) {
                        peaceTreatyData[treaty.targetCountry].terms.push(`Territories ceded: ${treaty.territories.join(', ')}`);
                    }
                    if (treaty.reparations) {
                        peaceTreatyData[treaty.targetCountry].terms.push(`Reparations: $${treaty.reparations.toLocaleString()}`);
                    }
                    if (treaty.puppeted) {
                        peaceTreatyData[treaty.targetCountry].terms.push(`Puppeted`);
                        
                        // If puppeted, add to puppets list
                        const neighbor = countryData.diplomacy.neighbors.find(n => n.name === treaty.targetCountry);
                        if (neighbor) {
                            // Create a puppet entry with default values
                            const newPuppet = {
                                name: treaty.targetCountry,
                                taxRate: 20,
                                autonomyDesire: 30,
                                loyaltyToPlayer: 60
                            };
                            
                            // Add to puppets array
                            countryData.diplomacy.puppets = countryData.diplomacy.puppets || [];
                            countryData.diplomacy.puppets.push(newPuppet);
                            
                            // Remove from neighbors or update its status
                            countryData.diplomacy.neighbors = countryData.diplomacy.neighbors.filter(n => 
                                n.name !== treaty.targetCountry);
                        }
                    }
                    
                    // Update military.ongoingWars
                    countryData.military.ongoingWars = (countryData.military.ongoingWars || []).filter(war => 
                        war.opponent !== treaty.targetCountry);
                }
            }

            if (result.playerLeaderDied) {
                actionFeedback.innerHTML += `<br><strong>Your leader, ${countryDetails.leaderName}, has died. ${result.reasonForPlayerLeaderDeath || ''}</strong>`;
            }

            if (result.playerLeaderReplaced && result.newPlayerLeader) {
                countryDetails.leaderStyle = result.newPlayerLeader.style;
                currentPlayerLeaderStyle = result.newPlayerLeader.style;
                countryDetails.leaderName = result.newPlayerLeader.name;
            }

            if (countryData.internal?.stats?.['Dominant Ideology'] && countryData.internal.stats['Dominant Ideology'] !== currentGovType) {
                currentGovType = countryData.internal.stats['Dominant Ideology'];
            }
            
            // Play joined faction sound if applicable
            if (result.joinedFaction || isJoiningFaction) {
                joinFactionSound.play().catch(error => console.log('Error playing faction sound:', error));
            }

            // Play an AI-generated short action video/slideshow depicting the player's typed action (best-effort)
            try {
                await generateAndPlayActionVideo(actionText, result.outcomeSummary || '');
            } catch (e) {
                console.warn('Action video generation/playback failed:', e);
            }

            await updateUI();

        } else {
            console.error("Invalid response structure from AI (missing newState):", result);
            actionFeedback.textContent = "Received an incomplete simulation response. State not updated.";
            actionLoadingIndicator.style.display = 'none';
            disableActionInputs(false);
            return;
        }

        let finalOutcomeSummary = converter.makeHtml(`**${monthNames[gameMonth-1]} ${gameYear} (Leader Age: ${countryDetails.leaderAge}):** ${result.outcomeSummary || 'No specific outcome for your action.'}`);
        if (recentlyConquered) {
            finalOutcomeSummary += `<br><i>Successfully conquered ${recentlyConquered}. Their lands are now part of yours. Use diplomatic actions to manage new relations.</i>`;
        }
        
        // Add war occupation updates
        if (result.warOccupationUpdate) {
            finalOutcomeSummary += `<br><div class="war-occupation-update" style="margin-top: 10px; padding: 8px; background-color: rgba(244, 67, 54, 0.1); border-radius: 3px;">
                <strong>War Update:</strong> ${result.warOccupationUpdate.description || `Occupation of ${result.warOccupationUpdate.targetCountry}: ${Math.round(result.warOccupationUpdate.newProgress)}%`}
            </div>`;
        }
        
        // Add peace treaty results
        if (result.peaceTreatyResult) {
            const treatyResult = result.peaceTreatyResult;
            if (treatyResult.accepted) {
                finalOutcomeSummary += `<br><div class="peace-treaty-result" style="margin-top: 10px; padding: 8px; background-color: rgba(33, 150, 243, 0.1); border-radius: 3px;">
                    <strong>Peace Treaty Accepted:</strong> ${treatyResult.description || `Peace treaty with ${treatyResult.targetCountry} has been accepted.`}`;
                
                if (treatyResult.territories && treatyResult.territories.length > 0) {
                    finalOutcomeSummary += `<br>Territories gained: ${treatyResult.territories.join(', ')}`;
                }
                if (treatyResult.reparations) {
                    finalOutcomeSummary += `<br>Reparations: $${treatyResult.reparations.toLocaleString()}`;
                }
                if (treatyResult.puppeted) {
                    finalOutcomeSummary += `<br>${treatyResult.targetCountry} is now your puppet state.`;
                }
                
                finalOutcomeSummary += `</div>`;
            } else {
                finalOutcomeSummary += `<br><div class="peace-treaty-result" style="margin-top: 10px; padding: 8px; background-color: rgba(255, 152, 0, 0.1); border-radius: 3px;">
                    <strong>Peace Treaty Rejected:</strong> ${treatyResult.description || `${treatyResult.targetCountry} has rejected your peace terms.`}
                </div>`;
            }
        }
        
        actionFeedback.innerHTML = finalOutcomeSummary;

        // Add ongoing occupation information for all active wars
        if (Object.keys(occupationData).length > 0) {
            let occupationHTML = '<div style="margin-top: 15px; padding: 10px; background-color: rgba(33, 33, 33, 0.1); border-radius: 3px;">';
            occupationHTML += '<h4 style="margin-top: 0; margin-bottom: 8px; color: #f44336;">Current War Occupations:</h4>';
            
            Object.keys(occupationData).forEach(country => {
                const occupation = occupationData[country];
                const progress = Math.round(occupation.progress);
                
                occupationHTML += `<div style="margin-bottom: 10px;">
                    <strong>${country}:</strong> ${progress}% occupied
                    <div style="height: 12px; background-color: #444; border-radius: 6px; margin-top: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${progress}%; background-color: ${progress >= 100 ? '#4caf50' : '#f44336'}; border-radius: 6px;"></div>
                    </div>
                    ${progress >= 100 ? 
                        `<button class="action-button" onclick="triggerPuppetAction('Offer peace to ${country}', '${country}')" style="margin-top: 5px; padding: 5px 10px; font-size: 0.8em;">Offer Peace Treaty</button>` : 
                        `<span style="font-size: 0.8em; color: #888; margin-top: 3px; display: inline-block;">Need 100% occupation to dictate peace</span>`
                    }
                </div>`;
            });
            
            occupationHTML += '</div>';
            actionFeedback.innerHTML += occupationHTML;
        }

        if (result.worldEventsSummary && result.worldEventsSummary.length > 0) {
            globalEventsFeed.innerHTML = '<h4>Global & Passive Events:</h4>' + result.worldEventsSummary.map(event => converter.makeHtml(`- ${event}`)).join('');
            globalEventsFeed.style.display = 'block';
        } else {
            globalEventsFeed.style.display = 'none';
        }

        if (result.localNewsFeed && result.localNewsFeed.length > 0) {
            localNewsFeed.innerHTML = '<h4>Local News Feed:</h4>' + result.localNewsFeed.map(news => converter.makeHtml(`- ${news}`)).join('');
            localNewsFeed.style.display = 'block';
            const localNewsContent = document.getElementById('local-news-content');
            if (localNewsContent) {
                 localNewsContent.innerHTML = result.localNewsFeed.map(news => `<p>${converter.makeHtml(news)}</p>`).join('');
            }
        } else {
            localNewsFeed.style.display = 'none';
            const localNewsContent = document.getElementById('local-news-content');
            if(localNewsContent) localNewsContent.innerHTML = `<p>No local news to report.</p>`;
        }

        if (result.factionElectionResults) {
            const electionResults = result.factionElectionResults;
            actionFeedback.innerHTML += `<br><strong>Faction Election Results for ${electionResults.factionName}:</strong><br>
                Previous leader: ${electionResults.previousLeader}<br>
                New leader: ${electionResults.newLeader}<br>
                ${electionResults.playerWon ? 'You have been elected as the faction leader!' : ''}`;
        }
        
        if (result.organizationApplicationResult) {
            const appResult = result.organizationApplicationResult;
            actionFeedback.innerHTML += `<br><strong>Organization Application Result:</strong><br>
                Your application to ${appResult.name} has been ${appResult.accepted ? 'accepted' : 'rejected'}.<br>
                Reason: ${appResult.reason}`;
        }

        if (result.collapsed === true || (result.playerLeaderReplaced && result.newPlayerLeader && !result.playerLeaderDied) /* Coup/overthrow style replacement */) {
            isGameOver = true;
            let endReason = result.outcomeSummary || "The country has become unstable or the leader was replaced.";
            let endType = result.playerLeaderReplaced ? 'transition' : 'collapse';

            if (result.playerLeaderReplaced === true && result.newPlayerLeader) {
                endReason = `${result.outcomeSummary || 'Leadership transition occurred.'} You are no longer in control. The new leader is ${result.newPlayerLeader.name} (${result.newPlayerLeader.style}). ${result.newPlayerLeader.reason || ''}`;
            } else if (result.collapsed === true) {
                endReason = result.outcomeSummary || `The country collapsed in ${monthNames[gameMonth-1]} ${gameYear}.`;
            }

            showGameOver(endReason, endType);
            actionLoadingIndicator.style.display = 'none';

        } else {
            if (inputElement) inputElement.value = ''; 
            disableActionInputs(false);
        }

    } catch (error) {
        console.error("Error processing action:", error);
        actionFeedback.textContent = `Error during action simulation: ${error.message || error}`;
        disableActionInputs(false);
    } finally {
        if (!isGameOver) {
            actionLoadingIndicator.style.display = 'none';
        }
    }
}

function showGameOver(reason, type = 'collapse') {
    gameScreen.style.display = 'none';
    actionLoadingIndicator.style.display = 'none';
    actionFeedback.style.display = 'none';
    globalEventsFeed.style.display = 'none';
    localNewsFeed.style.display = 'none';
    gameOverScreen.style.display = 'block';
    gameOverScreen.className = '';
    gameOverScreen.classList.add(type);

    if (type === 'transition') {
        endScreenTitle.textContent = "Leadership Transition";
        collapseReason.innerHTML = converter.makeHtml(`**Transition in ${monthNames[gameMonth-1]} ${gameYear}:** ${reason}`);
    } else {
        endScreenTitle.textContent = "Game Over";
        collapseReason.innerHTML = converter.makeHtml(`**Collapse in ${monthNames[gameMonth-1]} ${gameYear}:** ${reason}`);
    }

    disableActionInputs(true);
    tabButtons.forEach(button => button.disabled = true);
    document.querySelectorAll('#diplomacy-neighbors li, #diplomacy-puppets-list li').forEach(li => {
        li.style.pointerEvents = 'none';
        li.style.opacity = '0.7';
    });
}

function enableAllInputs() {
    actionButtons.forEach(button => button.disabled = false);
    actionInputs.forEach(input => input.disabled = false);
    tabButtons.forEach(button => button.disabled = false);
    setTimeout(() => {
        document.querySelectorAll('#diplomacy-neighbors li').forEach(li => {
            li.style.pointerEvents = 'auto';
            li.style.opacity = '1';
            li.onclick = () => handleNeighborClick(li.dataset.neighborName);
        });
        document.querySelectorAll('.puppet-action-button').forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
        });
    }, 100);
    actionFeedback.style.display = 'block';
    globalEventsFeed.style.display = 'block';
    localNewsFeed.style.display = 'block';
}

async function handleNeighborClick(neighborName) {
    if (!countryData || !countryData.diplomacy || !countryData.diplomacy.neighbors) {
        console.error("Neighbor data not available for click.");
        return;
    }
    const neighbor = (countryData.diplomacy.neighbors || []).find(n => n.name === neighborName);
    if (!neighbor) {
        console.error(`Neighbor ${neighborName} not found in current data.`);
        modalTitle.textContent = "Error";
        modalBody.innerHTML = `<p>Could not retrieve details for ${neighborName}.</p>`;
        neighborModal.style.display = "block";
        return;
    }

    modalTitle.textContent = `Details: ${neighborName}`;
    modalBody.innerHTML = '';
    modalLoading.style.display = 'block';
    neighborModal.style.display = "block";

    try {
        const playerIntelOnNeighbor = countryData.secretAgency?.neighborIntel?.[neighborName] || {};
        const knownIntelString = `
        Current relationship: ${neighbor.relationship || 'Unknown'} (${neighbor.reason || 'N/A'})
        Player's current recorded leader for ${neighborName}: ${neighbor.leaderName || 'Unknown'}, Age: ${neighbor.leaderAge || '?'}, Personality: ${neighbor.leaderPersonality || 'Unknown'}, Strength: ${playerIntelOnNeighbor.strengthKnown ? (neighbor.estimatedStrength || 'N/A') : '???'}, Ideology: ${neighbor.ideology || '?'}
        Player has an active spy in ${neighborName}: ${playerIntelOnNeighbor.spyActive ? 'Yes' : 'No'}
        Last intelligence report on ${neighborName} from player's agency: ${playerIntelOnNeighbor.lastReport || 'None'}
        For context, player's nation is ${countryDetails.countryName} (${countryDetails.govType}).
    `;

        const neighborDetailSchema = `{
          "name": "string (Neighbor's Name, should be ${neighborName})",
          "leaderProfile": "string (markdown description of leader: personality, age, style, based on latest info or common perception if player has no direct intel)",
          "ideologyAndGovernment": "string (markdown, overview of their ideology and government type)",
          "relationshipWithPlayer": "string (Their current stance: Friendly/Neutral/Hostile/Wary/Exploitative etc.)",
          "playerRelationshipReason": "string (markdown, their perspective on why this relationship exists with player's nation)",
          "estimatedMilitaryStrength": "string (Their actual current strength, e.g. 'Approx. 50,000 well-equipped troops', or qualitative like 'Significant but outdated', if player has intel, this might be more specific, otherwise general assessment)",
          "militaryNotes": "string (markdown, notes on their military doctrine, known special units, nuclear status if any, recent military activities)",
          "economicStanding": "string (markdown, e.g., 'Strong industrial base, reliant on X imports', 'Struggling, high debt')",
          "internalSituation": "string (markdown, e.g., 'Generally stable, leader popular', 'Significant internal dissent from Y group, economic hardship causing unrest')",
          "shortTermAmbitions": "string (markdown, e.g., 'Secure borders', 'Seek new trade deals', 'Undermine Z region')",
          "longTermGoals": "string (markdown, e.g., 'Regional hegemony', 'Technological supremacy', 'Cultural unification of Q peoples')",
          "keyRelationships": [
            { "nationName": "string (another nation)", "relationshipType": "string (e.g., Allied, Hostile, Trade Partner, Protectorate)", "notes": "string (markdown, brief)" }
          ],
          "playerSpecificIntelAssessment": "string (markdown, what the AI assesses the player *should* know or suspect based on active spies, general world knowledge, and the neighbor's actions. Highlight any discrepancies from player's recorded intel if significant.)"
        }`;

        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an intelligence analyst providing a detailed briefing on a neighboring country for the player.
                    The player's nation is ${countryDetails.countryName}, led by ${countryDetails.leaderName} (${currentPlayerLeaderStyle}, ${currentGovType}).
                    The current game year is ${gameYear}. Historical Events: ${historicalEventsEnabled ? 'Enabled' : 'Fictional Focus'}.
                    The world state (player's country data, including all known neighbors and their basic info) is: ${JSON.stringify(countryData, null, 1)}.
                    The player is requesting details on: ${neighborName}.
                    Player's current specific intel on ${neighborName}: ${knownIntelString}.
                    
                    Provide a comprehensive overview based on all available information. If player's intel is lacking (e.g. no spy), provide more general/reputed information. If player has good intel, be more specific.
                    The response MUST be a JSON object following this exact schema, with no other text:
                    ${neighborDetailSchema}`,
                },
                { role: "user", content: `Provide detailed information on ${neighborName}.` }
            ],
            json: true,
        });

        const details = tolerantParseJSON(completion.content);
        if (!details) {
            throw new Error('Failed to parse neighbor details from AI response.');
        }

        let htmlContent = `<p><strong>Leader:</strong> ${converter.makeHtml(details.leaderProfile || "N/A")}</p>`;
        htmlContent += `<p><strong>Ideology & Government:</strong> ${converter.makeHtml(details.ideologyAndGovernment || "N/A")}</p>`;
        htmlContent += `<p><strong>Relationship with ${countryDetails.countryName}:</strong> ${details.relationshipWithPlayer || 'N/A'}<br><em>Reason: ${converter.makeHtml(details.playerRelationshipReason || "N/A")}</em></p>`;
        htmlContent += `<p><strong>Military Strength:</strong> ${converter.makeHtml(details.estimatedMilitaryStrength || "N/A")}</p>`;
        if (details.militaryNotes) htmlContent += `<div><strong>Military Notes:</strong> ${converter.makeHtml(details.militaryNotes)}</div>`;
        htmlContent += `<p><strong>Economic Standing:</strong> ${converter.makeHtml(details.economicStanding || "N/A")}</p>`;
        htmlContent += `<div><strong>Internal Situation:</strong> ${converter.makeHtml(details.internalSituation || "N/A")}</div>`;
        htmlContent += `<p><strong>Short-Term Ambitions:</strong> ${converter.makeHtml(details.shortTermAmbitions || "N/A")}</p>`;
        htmlContent += `<p><strong>Long-Term Goals:</strong> ${converter.makeHtml(details.longTermGoals || "N/A")}</p>`;

        if (details.keyRelationships && details.keyRelationships.length > 0) {
            htmlContent += `<h4>Key Relationships with Other Nations:</h4><ul>`;
            details.keyRelationships.forEach(rel => {
                htmlContent += `<li><strong>${rel.nationName}</strong> (${rel.relationshipType}): ${converter.makeHtml(rel.notes || "")}</li>`;
            });
            htmlContent += `</ul>`;
        }

        htmlContent += `<h4>Player-Specific Intel Assessment:</h4><div>${converter.makeHtml(details.playerSpecificIntelAssessment || "No specific assessment available.")}</div>`;
        
        // Add war occupation info if applicable
        if (occupationData[neighborName]) {
            const occupation = occupationData[neighborName];
            const progress = Math.round(occupation.progress);
            
            htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: rgba(244, 67, 54, 0.1); border-left: 3px solid #f44336; border-radius: 3px;">
                <h4 style="margin-top: 0; color: #f44336;">War Status</h4>
                <p><strong>Current Occupation:</strong> ${progress}% occupied
                <div style="height: 12px; background-color: #444; border-radius: 6px; margin-top: 5px; overflow: hidden;">
                    <div style="height: 100%; width: ${progress}%; background-color: ${progress >= 100 ? '#4caf50' : '#f44336'}; border-radius: 6px;"></div>
                </div>
                <p><strong>Terrain:</strong> ${occupation.terrain || 'Mixed'} (${getTerrainDescription(occupation.terrain || 'Mixed')})</p>
                ${progress >= 100 ? 
                    `<button class="action-button" onclick="triggerPuppetAction('Offer peace to ${neighborName}', '${neighborName}')" style="margin-top: 5px; padding: 5px 10px; font-size: 0.8em;">Offer Peace Treaty</button>` : 
                    `<span style="font-size: 0.8em; color: #888; margin-top: 3px; display: inline-block;">Need 100% occupation to dictate peace</span>`
                }
            </div>`;
        }
        // Add peace treaty info if applicable
        else if (peaceTreatyData[neighborName]) {
            const treaty = peaceTreatyData[neighborName];
            const treatyActive = treaty.endYear > gameYear || 
                              (treaty.endYear === gameYear && treaty.endMonth >= gameMonth);
            
            if (treatyActive) {
                htmlContent += `<div style="margin-top: 15px; padding: 10px; background-color: rgba(33, 150, 243, 0.1); border-left: 3px solid #2196F3; border-radius: 3px;">
                    <h4 style="margin-top: 0; color: #2196F3;">Peace Treaty</h4>
                    <p><strong>Status:</strong> Active until ${monthNames[treaty.endMonth-1]} ${treaty.endYear}</p>
                    ${treaty.terms.length > 0 ? `<p><strong>Terms:</strong></p><ul>${treaty.terms.map(term => `<li>${term}</li>`).join('')}</ul>` : ''}
                    <p><em>Note: Breaking this treaty will result in severe diplomatic penalties.</em></p>
                </div>`;
            }
        }

        modalBody.innerHTML = htmlContent;

    } catch (error) {
        console.error("Error fetching neighbor details from AI:", error);
        modalBody.innerHTML = `<p>Error loading details for ${neighborName}. The simulation AI might be busy or an error occurred. Details: ${error.message}</p>`;
    } finally {
        modalLoading.style.display = 'none';
    }
}

window.closeModal = function () {
    neighborModal.style.display = "none";
}

window.closeChatModal = function() {
    if (chatModal) chatModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == neighborModal) {
        closeModal();
    }
    if (event.target == chatModal) {
        closeChatModal();
    }
}

function disableActionInputs(disabled) {
    actionButtons.forEach(button => button.disabled = disabled);
    actionInputs.forEach(input => input.disabled = disabled);
    if (!isGameOver) {
        document.querySelectorAll('#diplomacy-neighbors li').forEach(li => {
            li.style.pointerEvents = disabled ? 'none' : 'auto';
            li.style.opacity = disabled ? '0.7' : '1';
        });
        document.querySelectorAll('.puppet-action-button').forEach(button => {
            button.disabled = disabled;
            button.style.opacity = disabled ? '0.7' : '1';
        });
    }
}

async function updateUI() { 
    if (isGameOver) return;

    gameTitle.textContent = `${countryDetails.countryName}`;
    gameSubtitle.textContent = `Leader: ${countryDetails.leaderName} (Age ${countryDetails.leaderAge}) | ${monthNames[gameMonth-1]} ${gameYear} | Ideology: ${countryData.internal?.stats?.['Dominant Ideology'] || countryDetails.dominantIdeology}`;

    if (countryDetails.playerFlagPrompt && countryDetails.playerFlagUrl === null) {
        generateAndSetImage(playerFlagImg, countryDetails.playerFlagPrompt, 'playerFlagUrl', countryDetails, "3:2", false).then(() => {
            playerFlagImg.style.display = 'inline-block';
        });
    } else if (countryDetails.playerFlagUrl) {
         playerFlagImg.src = countryDetails.playerFlagUrl;
         playerFlagImg.style.display = 'inline-block';
    } else {
        playerFlagImg.style.display = 'none';
    }

    if (countryDetails.worldMapPrompt && countryDetails.worldMapUrl === null) {
         await generateAndSetImage(worldMapImage, countryDetails.worldMapPrompt, 'worldMapUrl', countryDetails, "16:9", true);
    } else if (countryDetails.worldMapUrl) {
         worldMapImage.src = countryDetails.worldMapUrl;
         worldMapImage.style.display = 'block';
         if (worldMapPlaceholder) worldMapPlaceholder.style.display = 'none';
    } else {
        worldMapImage.style.display = 'none';
        if (worldMapPlaceholder) {
             worldMapPlaceholder.textContent = 'World map visualization is being generated or is under development.';
             worldMapPlaceholder.style.display = 'block';
        }
    }

    updateDiplomacyTab();
    updateEconomyTab();
    updateMilitaryTab();
    updateInternalTab();
    updateCultureTab();
    updateGovernmentTab();
    updateReligionTab();
    updateSecretAgencyTab();
    updateMapsTab();
    updateInternationalTab();
    updateTradeTab();
    updateImmigrationTab(); 
    updateResearchTab(); 
    updateOrganizationsTab(); 
    updateFactionsTab(); 
    updateCommunicationsTab();

    updateLeaderTab();

    if (historyContent) {
        historyContent.innerHTML = converter.makeHtml(countryData.history || "The history of your nation is yet to be written, but its origins are shrouded in mystery.");
    }

}

function updateDiplomacyTab() {
    const data = countryData.diplomacy;
    if (!data) return;
    diplomacySituation.innerHTML = converter.makeHtml(data.situation || "No diplomatic situation description available.");

    diplomacyStats.innerHTML = '';
    for (const [key, value] of Object.entries(data.stats || {})) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${key}:</strong> ${value}`;
        diplomacyStats.appendChild(li);
    }

    diplomacyNeighbors.innerHTML = '';
    (data.neighbors || []).forEach(neighbor => {
        const li = document.createElement('li');
        let relationshipClass = '';
        if (neighbor.relationship?.toLowerCase() === 'friendly') relationshipClass = 'status-friendly';
        else if (neighbor.relationship?.toLowerCase() === 'neutral') relationshipClass = 'status-neutral';
        else if (neighbor.relationship?.toLowerCase() === 'hostile') relationshipClass = 'status-hostile';

        const strengthDisplay = countryData.secretAgency?.neighborIntel?.[neighbor.name]?.strengthKnown ? (neighbor.estimatedStrength || 'N/A') : '???';
        const leaderName = neighbor.leaderName || `Leader of ${neighbor.name}`;
        const leaderAge = neighbor.leaderAge || '?';
        const personality = neighbor.leaderPersonality || 'Unknown';
        const ideology = neighbor.ideology || 'Unknown';

        // Enhanced neighbor information display
        li.innerHTML = `
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="font-size: 1.1em;">${neighbor.name}</strong>
                    <span class="${relationshipClass}" style="font-weight: bold; padding: 2px 8px; border-radius: 3px; background-color: rgba(0,0,0,0.2);">${neighbor.relationship || 'Unknown'}</span>
                </div>
                
                <div style="background-color: rgba(26, 23, 19, 0.7); padding: 10px; border-radius: 4px; margin-bottom: 8px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        <div><strong>Leader:</strong> ${leaderName} (Age: ${leaderAge})</div>
                        <div><strong>Personality:</strong> ${personality}</div>
                        <div><strong>Ideology:</strong> ${ideology}</div>
                        <div><strong>Military Strength:</strong> ${strengthDisplay}</div>
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        <strong>Current Situation:</strong> ${neighbor.reason || 'No specific diplomatic issues at this time.'}
                    </div>
                    
                    ${getTradeRelationshipInfo(neighbor.name)}
                    ${getIdeologicalCompatibility(neighbor.ideology, countryData.internal?.stats?.['Dominant Ideology'])}
                    ${getBorderTensionInfo(neighbor.name)}
                </div>
            </div>
        `;
        
        // Add occupation percentage if at war
        if (occupationData[neighbor.name]) {
            const occupation = occupationData[neighbor.name];
            const progress = Math.round(occupation.progress);
            
            li.innerHTML += `<div style="margin-top: 10px; padding: 8px; background-color: rgba(244, 67, 54, 0.1); border-left: 3px solid #f44336; border-radius: 3px;">
                <strong>Active War Status:</strong> ${progress}% occupied
                <div style="height: 8px; background-color: #444; border-radius: 4px; margin: 5px 0; overflow: hidden;">
                    <div style="height: 100%; width: ${progress}%; background-color: ${progress >= 100 ? '#4caf50' : '#f44336'}; border-radius: 4px;"></div>
                </div>
                <div style="font-size: 0.9em; color: #ff8a80;">War started: ${monthNames[occupation.startMonth-1]} ${occupation.startYear} | Terrain: ${occupation.terrain || 'Mixed'}</div>
                ${progress >= 100 ? 
                    `<button class="action-button" onclick="triggerPuppetAction('Offer peace to ${neighbor.name}', '${neighbor.name}')" style="margin-top: 5px; padding: 5px 10px; font-size: 0.8em;">Offer Peace Treaty</button>` : 
                    `<span style="font-size: 0.8em; color: #888; margin-top: 3px; display: inline-block;">Need 100% occupation to dictate peace</span>`
                }
            </div>`;
        }
        // Check if there's an active peace treaty
        else if (peaceTreatyData[neighbor.name]) {
            const treaty = peaceTreatyData[neighbor.name];
            const treatyActive = treaty.endYear > gameYear || 
                              (treaty.endYear === gameYear && treaty.endMonth >= gameMonth);
            
            if (treatyActive) {
                li.innerHTML += `<div style="margin-top: 10px; padding: 8px; background-color: rgba(33, 150, 243, 0.1); border-left: 3px solid #2196F3; border-radius: 3px;">
                    <strong>Peace Treaty Active:</strong> Expires in ${monthNames[treaty.endMonth-1]} ${treaty.endYear}
                    ${treaty.terms.length > 0 ? `<div style="margin-top: 5px; font-size: 0.9em;">Terms: ${treaty.terms.join(', ')}</div>` : ''}
                </div>`;
            } else {
                // Show war justification buttons if treaty expired
                li.innerHTML += `<div style="margin-top: 10px;">
                    <button class="action-button" onclick="showJustifyWarModal('${neighbor.name}')" style="padding: 5px 10px; font-size: 0.85em;">Justify War</button>
                </div>`;
            }
        }
        // Add war justification buttons if no treaty and not at war
        else if (justificationData[neighbor.name]) {
            const justification = justificationData[neighbor.name];
            if (justification.progress >= 100) {
                li.innerHTML += `<div style="margin-top: 10px; padding: 8px; background-color: rgba(255, 193, 7, 0.1); border-left: 3px solid #ffc107; border-radius: 3px;">
                    <strong>War Justification Complete</strong> - Ready to declare war
                    <div style="margin-top: 5px;">
                        <button class="action-button" onclick="triggerPuppetAction('Declare war on ${neighbor.name}', '${neighbor.name}')" style="padding: 5px 10px; font-size: 0.85em;">Declare War</button>
                    </div>
                </div>`;
            } else {
                li.innerHTML += `<div style="margin-top: 10px; padding: 8px; background-color: rgba(255, 152, 0, 0.1); border-left: 3px solid #ff9800; border-radius: 3px;">
                    <strong>War Justification in Progress:</strong> ${Math.round(justification.progress)}% complete
                    <div style="margin-top: 3px; font-size: 0.9em;">Reason: ${justification.reason}</div>
                    <div style="margin-top: 3px; font-size: 0.85em; color: #888;">Started: ${monthNames[justification.startMonth-1]} ${justification.startYear}</div>
                </div>`;
            }
        } else {
            li.innerHTML += `<div style="margin-top: 10px;">
                <button class="action-button" onclick="showJustifyWarModal('${neighbor.name}')" style="padding: 5px 10px; font-size: 0.85em;">Justify War</button>
            </div>`;
        }
        
        li.dataset.neighborName = neighbor.name;
        li.onclick = () => handleNeighborClick(neighbor.name);
        diplomacyNeighbors.appendChild(li);
    });

    // ... existing puppets code ...
}

function getTradeRelationshipInfo(neighborName) {
    const tradePartner = countryData.trade?.partners?.find(p => p.name === neighborName);
    if (tradePartner) {
        let tradeStatus = '';
        switch(tradePartner.relationship?.toLowerCase()) {
            case 'active trade deal':
                tradeStatus = '<span style="color: #4caf50;">Active Trade Deal</span>';
                break;
            case 'sanctioned':
                tradeStatus = '<span style="color: #f44336;">Under Sanctions</span>';
                break;
            case 'embargoed':
                tradeStatus = '<span style="color: #d32f2f;">Embargoed</span>';
                break;
            default:
                tradeStatus = '<span style="color: #ff9800;">Limited Trade</span>';
        }
        return `<div><strong>Trade Status:</strong> ${tradeStatus} (Last Year: $${tradePartner.tradeValueLastYear?.toLocaleString() || 0})</div>`;
    }
    return '<div><strong>Trade Status:</strong> <span style="color: #666;">No Active Trade</span></div>';
}

function getIdeologicalCompatibility(neighborIdeology, playerIdeology) {
    if (!neighborIdeology || !playerIdeology) {
        return '<div><strong>Ideological Relations:</strong> <span style="color: #666;">Unknown</span></div>';
    }
    
    const compatibleIdeologies = {
        'Democracy': ['Republic', 'Democratic Socialism', 'Liberalism', 'Constitutional Monarchy'],
        'Republic': ['Democracy', 'Parliamentary Republic', 'Federal Republic'],
        'Communism': ['Socialism', 'Democratic Socialism', "People's Republic"],
        'Fascism': ['Nationalism', 'Authoritarianism', 'National-Conservatism'],
        'Monarchy': ['Constitutional Monarchy', 'Traditionalism'],
        'Theocracy': ['Traditionalism', 'Conservatism'],
        'National-Socialism': ['Nationalism', 'Authoritarianism', 'National-Conservatism'],
        'National-Conservatism': ['Conservatism', 'Nationalism', 'National-Socialism'],
        'Eco-Nationalism': ['Environmentalism', 'Nationalism'],
        'Market Socialism': ['Socialism', 'Democratic Socialism'],
        'Authoritarian Nationalism': ['Authoritarianism', 'Nationalism']
    };
    
    const conflictingIdeologies = {
        'Democracy': ['Fascism', 'Communism', 'Dictatorship', 'National-Socialism'],
        'Communism': ['Fascism', 'Capitalism', 'Monarchy'],
        'Fascism': ['Democracy', 'Communism', 'Liberalism'],
        'Theocracy': ['Progressivism', 'Libertarianism'],
        'National-Socialism': ['Democracy', 'Liberalism', 'Communism'],
        'National-Conservatism': ['Progressivism', 'Globalism']
    };
    
    let compatibility = 'Neutral';
    let color = '#ff9800';
    
    if (neighborIdeology === playerIdeology) {
        compatibility = 'Identical';
        color = '#4caf50';
    } else if (compatibleIdeologies[playerIdeology]?.includes(neighborIdeology)) {
        compatibility = 'Compatible';
        color = '#8bc34a';
    } else if (conflictingIdeologies[playerIdeology]?.includes(neighborIdeology)) {
        compatibility = 'Conflicting';
        color = '#f44336';
    }
    
    return `<div><strong>Ideological Relations:</strong> <span style="color: ${color};">${compatibility}</span></div>`;
}

function getBorderTensionInfo(neighborName) {
    // Check for various tension factors
    let tensionLevel = 'Low';
    let tensionColor = '#4caf50';
    let tensionReasons = [];
    
    // Check for war justification
    if (justificationData[neighborName]) {
        tensionLevel = 'Very High';
        tensionColor = '#f44336';
        tensionReasons.push('War justification in progress');
    }
    
    // Check relationship status
    const neighbor = countryData.diplomacy?.neighbors?.find(n => n.name === neighborName);
    if (neighbor?.relationship === 'Hostile') {
        tensionLevel = 'High';
        tensionColor = '#ff5722';
        tensionReasons.push('Hostile relations');
    } else if (neighbor?.relationship === 'Neutral') {
        tensionLevel = 'Moderate';
        tensionColor = '#ff9800';
    }
    
    // Check for peace treaty
    if (peaceTreatyData[neighborName]) {
        const treaty = peaceTreatyData[neighborName];
        const treatyActive = treaty.endYear > gameYear || 
                          (treaty.endYear === gameYear && treaty.endMonth >= gameMonth);
        if (treatyActive) {
            tensionLevel = 'Low';
            tensionColor = '#4caf50';
            tensionReasons.push('Peace treaty in effect');
        }
    }
    
    const reasonText = tensionReasons.length > 0 ? ` (${tensionReasons.join(', ')})` : '';
    return `<div><strong>Border Tension:</strong> <span style="color: ${tensionColor};">${tensionLevel}</span>${reasonText}</div>`;
}

function updateEconomyTab() {
    const data = countryData.economy;
    if (!data) {
        if (economySituation) economySituation.innerHTML = "Economy data not available.";
        if (economyStats) economyStats.innerHTML = "";
        return;
    }
    if (economySituation) economySituation.innerHTML = converter.makeHtml(data.situation || "No economic situation description available.");
    if (economyStats) {
        economyStats.innerHTML = '';
        
        // Add currency information at the top
        if (data.currency) {
            const currencyLi = document.createElement('li');
            let currencyHTML = `<strong>National Currency:</strong> ${data.currency.name}`;
            
            if (data.currency.isReal) {
                currencyHTML += ` (${data.currency.symbol})`;
            } else {
                if (data.currency.iconUrl) {
                    currencyHTML += ` <img src="${data.currency.iconUrl}" alt="${data.currency.name}" style="width: 24px; height: 24px; vertical-align: middle; margin-left: 5px;">`;
                } else if (data.currency.iconPrompt) {
                    currencyHTML += ` (${data.currency.symbol})`;
                    // Generate icon for fictional currency
                    generateCurrencyIcon(data.currency.name, countryDetails.countryName).then(iconUrl => {
                        if (iconUrl) {
                            data.currency.iconUrl = iconUrl;
                            currencyLi.innerHTML = `<strong>National Currency:</strong> ${data.currency.name} <img src="${iconUrl}" alt="${data.currency.name}" style="width: 24px; height: 24px; vertical-align: middle; margin-left: 5px;">`;
                        }
                    });
                } else {
                    currencyHTML += ` (${data.currency.symbol})`;
                }
            }
            
            currencyLi.innerHTML = currencyHTML;
            economyStats.appendChild(currencyLi);
        }
        
        // Add other economic stats
        for (const [key, value] of Object.entries(data.stats || {})) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            economyStats.appendChild(li);
        }
    }
}

function updateMilitaryTab() {
    const data = countryData.military;
    if (!data) {
        if (militarySituation) militarySituation.innerHTML = "Military data not available.";
        if (militaryStats) militaryStats.innerHTML = "";
        if (militaryInventory) militaryInventory.innerHTML = "";
        if (ongoingWarsSection) ongoingWarsSection.style.display = 'none';
        if (ongoingWarsList) ongoingWarsList.innerHTML = "";
        return;
    }
    if (militarySituation) militarySituation.innerHTML = converter.makeHtml(data.situation || "No military situation description available.");
    if (militaryStats) {
        militaryStats.innerHTML = '';
        for (const [key, value] of Object.entries(data.stats || {})) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            militaryStats.appendChild(li);
        }
    }

    if (militaryInventory) {
        militaryInventory.innerHTML = ''; 
        const inventory = data.inventory || {};
        const unitCategories = ['Army', 'Navy', 'Airforce', 'Missiles', 'Nuclear'];

        let hasInventory = false;

        unitCategories.forEach(category => {
            const units = inventory[category] || [];
            if (units.length > 0) {
                hasInventory = true;
                const categoryHeader = document.createElement('h4');
                categoryHeader.textContent = `${category} Units`;
                militaryInventory.appendChild(categoryHeader);

                units.forEach(unit => {
                    const unitCard = document.createElement('div');
                    unitCard.className = 'unit-card';
                    unitCard.innerHTML = `
                        <strong>${unit.name || 'Unknown Unit'}</strong>
                        <span>Type: ${unit.type || 'N/A'} | Quantity: ${unit.quantity || 0}</span>
                        <span>Efficiency: ${unit.efficiency || 'N/A'}% | Est. Price: ${unit.price ? `$${unit.price.toLocaleString()}` : 'N/A'}</span>
                        ${unit.description ? `<div class="unit-description">${converter.makeHtml(unit.description)}</div>` : ''}
                    `;
                    militaryInventory.appendChild(unitCard);
                });
            }
        });

        if (!hasInventory) {
            militaryInventory.innerHTML = '<p>No military units listed in inventory.</p>';
        }
    }

    const ongoingWars = data.ongoingWars || []; 
    if (ongoingWars.length > 0) {
        ongoingWarsSection.style.display = 'block';
        ongoingWarsList.innerHTML = '';
        ongoingWars.forEach(war => {
            const li = document.createElement('li');
            let warHTML = `<strong>Conflict with ${war.opponent || 'Unknown'}:</strong> ${converter.makeHtml(war.status || 'Ongoing')}`;
            
            // Add occupation percentage if available
            if (occupationData[war.opponent]) {
                const occupation = occupationData[war.opponent];
                const progress = Math.round(occupation.progress);
                
                warHTML += `<div style="margin-top: 5px;">
                    <strong>Occupation Progress:</strong> ${progress}%
                    <div style="height: 10px; background-color: #444; border-radius: 5px; margin-top: 5px; overflow: hidden;">
                        <div style="height: 100%; width: ${progress}%; background-color: ${progress >= 100 ? '#4caf50' : '#f44336'}; border-radius: 5px;"></div>
                    </div>
                    ${progress >= 100 ? 
                        `<button class="action-button" onclick="triggerPuppetAction('Offer peace to ${war.opponent}', '${war.opponent}')" style="margin-top: 5px; padding: 5px 10px; font-size: 0.8em;">Offer Peace Treaty</button>` : 
                        `<span style="font-size: 0.8em; color: #888; margin-top: 3px; display: inline-block;">Need 100% occupation to dictate peace</span>`
                    }
                </div>`;
            }
            
            li.innerHTML = warHTML;
            ongoingWarsList.appendChild(li);
        });
    } else {
        ongoingWarsSection.style.display = 'none';
        ongoingWarsList.innerHTML = '';
    }
}

function updateInternalTab() {
    const data = countryData.internal;
    if (!data) {
        if (internalSituation) internalSituation.innerHTML = "Internal affairs data not available.";
        if (internalStats) internalStats.innerHTML = "";
        return;
    }
    if (internalSituation) internalSituation.innerHTML = converter.makeHtml(data.situation || "No internal situation description available.");
    if (internalStats) {
        internalStats.innerHTML = '';
        for (const [key, value] of Object.entries(data.stats || {})) {
            const li = document.createElement('li');
            if (key === 'Government Type' || key === 'Dominant Ideology') {
                li.innerHTML = `<strong>${key}:</strong> <span style="color: #d4af37;">${value}</span>`;
            } else {
                li.innerHTML = `<strong>${key}:</strong> ${value}`;
            }
            internalStats.appendChild(li);
        }
    }
}

function updateCultureTab() {
    const data = countryData.culture;
    if (!data) {
        if (cultureSituation) cultureSituation.innerHTML = "Culture data not available.";
        if (cultureStats) cultureStats.innerHTML = "";
        return;
    }
    if (cultureSituation) cultureSituation.innerHTML = converter.makeHtml(data.situation || "No cultural situation description available.");
    if (cultureStats) {
        cultureStats.innerHTML = '';
        for (const [key, value] of Object.entries(data.stats || {})) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            cultureStats.appendChild(li);
        }
    }
    if (cultureEthnicGroups) {
        cultureEthnicGroups.innerHTML = '';
        const ethnicGroups = data.ethnicGroups || [];
        if (ethnicGroups.length > 0) {
            ethnicGroups.forEach(group => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${group.name}:</strong> ${group.percentage}%`;
                if (group.notes) li.innerHTML += ` (<em>${group.notes}</em>)`;
                cultureEthnicGroups.appendChild(li);
            });
        } else {
            cultureEthnicGroups.innerHTML = '<p>Ethnic composition data not yet available.</p>';
        }
    }
    if (cultureLanguages) {
        cultureLanguages.innerHTML = '';
        const languages = data.languages || [];
        if (languages.length > 0) {
            languages.forEach(language => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${language}:</strong>`;
                cultureLanguages.appendChild(li);
            });
        } else {
            cultureLanguages.innerHTML = '<p>No languages are listed.</p>';
        }
    }
}

function updateGovernmentTab() {
    const data = countryData.government;
    if (!data) {
        if (governmentSituation) governmentSituation.innerHTML = "Government data not available.";
        if (governmentStats) governmentStats.innerHTML = "";
        if (ministersList) ministersList.innerHTML = "";
        if (govTypeDisplay) govTypeDisplay.textContent = "N/A";
        if (nextElectionYearDisplay) nextElectionYearDisplay.textContent = 'N/A';
        if (politicalPartiesList) politicalPartiesList.innerHTML = "";
        return;
    }
    if (governmentSituation) governmentSituation.innerHTML = converter.makeHtml(data.situation || "No government situation description available.");

    if (governmentStats) {
        governmentStats.innerHTML = '';
        for (const [key, value] of Object.entries(data.stats || {})) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            governmentStats.appendChild(li);
        }
    }

    if (ministersList) {
        ministersList.innerHTML = '';
        if (data.ministers && Object.keys(data.ministers).length > 0) {
            for (const [portfolio, minister] of Object.entries(data.ministers)) {
                const div = document.createElement('div');
                div.className = 'minister-card';
                if (minister && minister.name) {
                    div.innerHTML = `
                        <strong>${portfolio.replace(/([A-Z])/g, ' $1').trim()}: ${minister.name}</strong>
                        <span>Skill: ${minister.skill || 'N/A'} | Loyalty: <span class="loyalty-${minister.loyalty || 'Neutral'}">${minister.loyalty || 'N/A'}</span></span>
                    `;
                } else {
                    div.innerHTML = `<strong>${portfolio.replace(/([A-Z])/g, ' $1').trim()}:</strong> <span>Position Vacant</span>`;
                }
                ministersList.appendChild(div);
            }
        } else {
            ministersList.innerHTML = '<p>No ministers currently appointed or data unavailable.</p>';
        }
    }

    if (govTypeDisplay) {
        const govType = countryData.internal?.stats?.['Government Type'] || countryDetails.govType;
        const ideology = countryData.internal?.stats?.['Dominant Ideology'] || countryDetails.dominantIdeology;
        govTypeDisplay.innerHTML = `${govType}<br><small style="color: #a89f81;">Ideology: ${ideology}</small>`;
    }

    if (nextElectionYearDisplay) {
        const currentGovType = countryData.internal?.stats?.['Government Type'] || countryDetails.govType;
        const isElectionHolding = ELECTION_HOLDING_GOV_TYPES.includes(currentGovType);
        if (isElectionHolding && data.nextElectionYear) {
            nextElectionYearDisplay.textContent = data.nextElectionYear;
        } else if (isElectionHolding && !data.nextElectionYear) {
            nextElectionYearDisplay.textContent = "Pending (next cycle)";
        }
        else {
            nextElectionYearDisplay.textContent = "Not Applicable";
        }
    }

    if (politicalPartiesList) {
        politicalPartiesList.innerHTML = '';
        const parties = data.politicalParties || [];
        if (parties.length > 0) {
            parties.forEach(party => {
                const div = document.createElement('div');
                div.className = 'party-card';
                let partyHtml = `<strong>${party.name}</strong>`;
                partyHtml += `<div class="party-details">`;
                partyHtml += `Leader: ${party.leaderName || 'N/A'} (Style: <em>${party.leaderStyle || 'N/A'}</em>)<br>`;
                partyHtml += `Ideology: <em>${party.ideology || 'N/A'}</em> | Popularity: ${party.popularity || '0'}%`;
                if (party.isExtremist) {
                    partyHtml += ` | <span class="party-extremist">Extremist</span>`;
                }
                partyHtml += `</div>`;
                if (party.goals) {
                    partyHtml += `<div class="party-goals"><strong>Goals:</strong> ${converter.makeHtml(party.goals)}</div>`;
                }
                div.innerHTML = partyHtml;
                politicalPartiesList.appendChild(div);
            });
        } else {
            const currentGovType = countryData.internal?.stats?.['Government Type'] || countryDetails.govType;
            const isElectionHolding = ELECTION_HOLDING_GOV_TYPES.includes(currentGovType);
            if (isElectionHolding) {
                politicalPartiesList.innerHTML = '<p>No political parties registered. This may indicate a new democracy or a need to establish parties.</p>';
            } else {
                politicalPartiesList.innerHTML = '<p>Political parties are not a feature of the current government type or none are active.</p>';
            }

        }
    }
}

function updateReligionTab() {
    const data = countryData.religion || {};
    if (religionSituation) {
        religionSituation.innerHTML = converter.makeHtml(data.situation || 'No religion data available');
    }
    if (religionStats) {
        religionStats.innerHTML = '';
        for (const [key, value] of Object.entries(data.stats || {})) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            religionStats.appendChild(li);
        }
    }
    if (religionDemographics) {
        religionDemographics.innerHTML = '';
        const demographics = data.demographics || [];
        if (demographics.length > 0) {
            demographics.forEach(demo => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${demo.name}:</strong> ${demo.percentage}%`;
                religionDemographics.appendChild(li);
            });
        } else {
            religionDemographics.innerHTML = '<p>Religious demographics data not yet available.</p>';
        }
    }
}

function updateSecretAgencyTab() {
    const data = countryData.secretAgency;
    if (!data) {
        if (secretAgencySituation) secretAgencySituation.innerHTML = "Secret Agency data not available.";
        if (secretAgencyStats) secretAgencyStats.innerHTML = "";
        if (secretAgencyIntelReports) secretAgencyIntelReports.innerHTML = "";
        return;
    }

    if (secretAgencySituation) secretAgencySituation.innerHTML = converter.makeHtml(data.situation || "No agency situation description available.");

    if (secretAgencyStats) {
        secretAgencyStats.innerHTML = '';
        for (const [key, value] of Object.entries(data.stats || {})) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            secretAgencyStats.appendChild(li);
        }
    }

    if (secretAgencyIntelReports) {
        secretAgencyIntelReports.innerHTML = '';
        if (data.knownPlots && data.knownPlots.length > 0) {
            data.knownPlots.forEach(plot => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>Plot Detected:</strong> ${converter.makeHtml(plot)}`;
                secretAgencyIntelReports.appendChild(p);
            });
        } else {
            secretAgencyIntelReports.innerHTML = '<p>No specific plots detected at this time.</p>';
        }
        if (data.neighborIntel) {
            for (const [name, intel] of Object.entries(data.neighborIntel)) {
                if (intel.plotDetected && !data.knownPlots.some(p => p.includes(name))) {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>Intel on ${name}:</strong> Plot detected! ${converter.makeHtml(intel.lastReport || "Suspected activities.")}`;
                    secretAgencyIntelReports.appendChild(p);
                } else if (intel.strengthKnown && intel.lastReport && intel.lastReport !== "No specific intel yet.") {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>Intel on ${name}:</strong> ${converter.makeHtml(intel.lastReport)}`;
                    secretAgencyIntelReports.appendChild(p);
                }
            }
        }
    }
}

async function updateMapsTab() {
    if (mapCountryName) {
        mapCountryName.textContent = countryDetails.countryName || "Your Nation";
    }
    if (mapBorderList) {
        mapBorderList.innerHTML = '';
        const neighbors = countryData.diplomacy?.neighbors || [];
        if (neighbors.length > 0) {
            neighbors.forEach(neighbor => {
                const li = document.createElement('li');
                let borderText = `Border with ${neighbor.name}`;
                
                // Add war status if applicable
                if (occupationData[neighbor.name]) {
                    const progress = Math.round(occupationData[neighbor.name].progress);
                    borderText += ` (At War, ${progress}% occupied)`;
                }
                
                li.textContent = borderText;
                mapBorderList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "Your nation appears to have no immediate land/sea neighbors on record (e.g., isolated island nation or all neighbors conquered).";
            mapBorderList.appendChild(li);
        }
    }
    
    // Update regions section
    updateRegionsList();
    
    // World map display
    if (countryDetails.worldMapPrompt && countryDetails.worldMapUrl === null) {
         await generateAndSetImage(worldMapImage, countryDetails.worldMapPrompt, 'worldMapUrl', countryDetails, "16:9", true);
    } else if (countryDetails.worldMapUrl) {
         worldMapImage.src = countryDetails.worldMapUrl;
         worldMapImage.style.display = 'block';
         if (worldMapPlaceholder) worldMapPlaceholder.style.display = 'none';
    } else {
        worldMapImage.style.display = 'none';
        if (worldMapPlaceholder) {
             worldMapPlaceholder.textContent = 'World map visualization is being generated or is under development.';
             worldMapPlaceholder.style.display = 'block';
        }
    }
}

function updateRegionsList() {
    const regionsList = document.getElementById('regions-list');
    if (!regionsList) return;
    
    const regions = countryData.regions || [];
    if (regions.length === 0) {
        regionsList.innerHTML = '<li>No regions defined for your country.</li>';
        return;
    }
    
    regionsList.innerHTML = '';
    regions.forEach(region => {
        const regionCard = document.createElement('div');
        regionCard.className = 'region-card';
        
        // Create header with name and governor
        const header = document.createElement('div');
        header.className = 'region-header';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'region-name';
        nameDiv.textContent = region.name;
        
        const governorDiv = document.createElement('div');
        governorDiv.className = 'region-governor';
        governorDiv.textContent = `Governor: ${region.governor.name} (${region.governor.party})`;
        
        header.appendChild(nameDiv);
        header.appendChild(governorDiv);
        
        // Create stats section
        const stats = document.createElement('div');
        stats.className = 'region-stats';
        
        const populationStat = document.createElement('span');
        populationStat.className = 'region-stat';
        populationStat.textContent = `Population: ${region.population.toLocaleString()}`;
        
        const terrainStat = document.createElement('span');
        terrainStat.className = 'region-stat';
        terrainStat.textContent = `Terrain: ${region.terrain}`;
        
        const economyStat = document.createElement('span');
        economyStat.className = 'region-stat region-income';
        economyStat.textContent = `Economic Output: $${region.economicOutput.toLocaleString()}`;
        
        stats.appendChild(populationStat);
        stats.appendChild(terrainStat);
        stats.appendChild(economyStat);
        
        // Create description
        const description = document.createElement('div');
        description.className = 'region-description';
        description.textContent = region.description;
        
        // Create facilities list
        const facilitiesTitle = document.createElement('div');
        facilitiesTitle.style.marginTop = '10px';
        facilitiesTitle.style.marginBottom = '5px';
        facilitiesTitle.style.fontWeight = 'bold';
        facilitiesTitle.textContent = 'Facilities:';
        
        const facilitiesList = document.createElement('ul');
        facilitiesList.className = 'facility-list';
        
        if (region.facilities && region.facilities.length > 0) {
            region.facilities.forEach(facility => {
                const facilityItem = document.createElement('li');
                facilityItem.className = 'facility-item';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'facility-name';
                nameSpan.textContent = facility.name;
                
                const statusSpan = document.createElement('span');
                statusSpan.className = 'facility-status';
                statusSpan.textContent = facility.status || 'Operational';
                
                facilityItem.appendChild(nameSpan);
                facilityItem.appendChild(statusSpan);
                
                facilitiesList.appendChild(facilityItem);
            });
        } else {
            const noFacilities = document.createElement('li');
            noFacilities.className = 'facility-item';
            noFacilities.textContent = 'No facilities built yet';
            facilitiesList.appendChild(noFacilities);
        }
        
        // Create build options
        const buildOptions = document.createElement('div');
        buildOptions.className = 'build-options';
        
        // Add appropriate build buttons based on region geography
        const buildables = [];
        if (region.isCoastal) buildables.push('Harbor');
        if (region.hasRiver && !region.isCoastal) buildables.push('River Port');
        buildables.push('Military Base');
        buildables.push('Market');
        buildables.push('Factory');
        if (region.terrain === 'Plains' || region.terrain === 'Forest') buildables.push('Farm');
        if (region.resourceRichness > 60) buildables.push('Mine');
        
        buildables.forEach(facilityType => {
            if (!region.facilities.some(f => f.name && f.name.includes(facilityType))) {
                const buildButton = document.createElement('button');
                buildButton.className = 'build-button';
                buildButton.textContent = `Build ${facilityType}`;
                buildButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleActionSubmit(null, `Build ${facilityType} in ${region.name}`);
                });
                buildOptions.appendChild(buildButton);
            }
        });
        
        // Add election info if applicable
        const election = document.createElement('div');
        election.className = 'region-election';
        election.textContent = `Next gubernatorial election: ${region.governor.nextElectionYear}`;
        
        // Assemble the card
        regionCard.appendChild(header);
        regionCard.appendChild(stats);
        regionCard.appendChild(description);
        regionCard.appendChild(facilitiesTitle);
        regionCard.appendChild(facilitiesList);
        regionCard.appendChild(buildOptions);
        regionCard.appendChild(election);
        
        regionsList.appendChild(regionCard);
    });
}

function generateRegionName(index, countryName) {
    const prefixes = ['North', 'South', 'East', 'West', 'Central', 'Upper', 'Lower'];
    const suffixes = ['Province', 'District', 'Territory', 'Region', 'State', 'Prefecture', 'Zone'];
    
    if (index === 0) return `Capital Region`;
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    // Use parts of the country name
    const nameParts = countryName.split(' ');
    let baseName = nameParts[0];
    if (nameParts.length > 1 && Math.random() > 0.5) {
        baseName = nameParts[Math.floor(Math.random() * nameParts.length)];
    }
    
    // Sometimes use a more unique name
    if (Math.random() > 0.7) {
        const uniqueNames = ['Golden', 'Silver', 'Iron', 'Coal', 'Diamond', 'Emerald', 'Ruby', 'Jade', 
                             'Forest', 'Mountain', 'River', 'Lake', 'Valley', 'Highland', 'Lowland'];
        return `${uniqueNames[Math.floor(Math.random() * uniqueNames.length)]} ${suffix}`;
    }
    
    return `${prefix} ${baseName} ${suffix}`;
}

function generateGovernorName() {
    const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 
                       'Thomas', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
                       'Alexander', 'Catherine', 'Victoria', 'Margaret', 'Anne', 'Sarah', 'Emily'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 
                      'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 
                      'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez'];
    
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${first} ${last}`;
}

function getTerrainDescription(terrain) {
    const descriptions = {
        'Mountainous': 'Slow troop movement, defensive advantage',
        'Plains': 'Rapid troop movement, favorable for offense',
        'Forest': 'Moderate movement, good for ambushes',
        'Desert': 'Rapid movement but supply problems',
        'Jungle': 'Very slow movement, disease risk',
        'Tundra': 'Slow movement, harsh weather conditions',
        'Mixed': 'Varied terrain with different strategic values'
    };
    
    return descriptions[terrain] || 'Various strategic considerations';
}

function saveGameToSlot(slotNumber) {
    const slotKey = `${SAVE_GAME_KEY_BASE}${slotNumber}`;
    const saveData = {
        countryData: countryData,
        gameYear: gameYear,
        countryDetails: countryDetails,
        worldNationsCache: worldNationsCache,
        historicalEventsEnabled: historicalEventsEnabled,
        currentGovType: currentGovType,
        currentPlayerLeaderStyle: currentPlayerLeaderStyle,
        factionElectionYears: factionElectionYears,
        organizationApplicationStatus: organizationApplicationStatus,
        isGameOver: isGameOver,
        saveDate: new Date().toISOString(),
        saveVersion: '1.0',
        occupationData: occupationData,
        peaceTreatyData: peaceTreatyData,
        justificationData: justificationData,
        localNews: countryData.localNews || []
    };
    
    try {
        localStorage.setItem(slotKey, JSON.stringify(saveData));
        actionFeedback.textContent = `Game saved successfully to Slot ${slotNumber}! Your save will persist even after browser restarts.`;
        actionFeedback.style.display = 'block';
    } catch (e) {
        console.error("Error saving game:", e);
        if (e.name === 'QuotaExceededError') {
            actionFeedback.textContent = "Error: Storage quota exceeded. Try clearing other browser data or using a different slot.";
        } else {
            actionFeedback.textContent = "Error saving game. Local storage might be full or disabled.";
        }
        actionFeedback.style.display = 'block';
    }
}

function generateSlotButtons(type) {
    let html = '';
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
        const slotKey = `${SAVE_GAME_KEY_BASE}${i}`;
        const savedData = localStorage.getItem(slotKey);
        let slotInfo = 'Empty';
        let saveDate = '';
        
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                slotInfo = `${parsed.countryDetails.countryName} (Year ${parsed.gameYear})`;
                
                if (parsed.saveDate) {
                    const date = new Date(parsed.saveDate);
                    saveDate = `Saved: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                }
            } catch (e) {
                slotInfo = 'Corrupted Data';
            }
        }
        
        html += `
            <div class="save-slot ${savedData ? 'slot-filled' : 'slot-empty'}">
                <span class="slot-number">Slot ${i}</span>
                <span class="slot-info">${savedData ? slotInfo : 'Empty'}</span>
                ${saveDate ? `<span class="slot-date">${saveDate}</span>` : ''}
                <button class="slot-button" onclick="handle${type === 'save' ? 'Save' : 'Load'}Slot(${i})">${type === 'save' ? 'Save' : 'Load'}</button>
            </div>
        `;
    }
    return html;
}

function showSaveSlotModal() {
    createSaveLoadModals();
    document.getElementById('save-slots-container').innerHTML = generateSlotButtons('save');
    
    const persistenceInfo = document.createElement('p');
    persistenceInfo.className = 'persistence-notice';
    persistenceInfo.innerHTML = 'Your saves are stored in your browser and will persist indefinitely, even after browser restarts.<br>Note: Clearing browser data or using private browsing may affect save availability.';
    document.querySelector('#save-slot-modal .modal-content').appendChild(persistenceInfo);
    
    saveSlotModal.style.display = 'block';
}

function showLoadSlotModal() {
    createSaveLoadModals();
    document.getElementById('load-slots-container').innerHTML = generateSlotButtons('load');
    
    if (!document.querySelector('#load-slot-modal .persistence-notice')) {
        const persistenceInfo = document.createElement('p');
        persistenceInfo.className = 'persistence-notice';
        persistenceInfo.innerHTML = 'Your saves are stored in your browser and will persist indefinitely, even after browser restarts.<br>Note: Clearing browser data or using private browsing may affect save availability.';
        document.querySelector('#load-slot-modal .modal-content').appendChild(persistenceInfo);
    }
    
    loadSlotModal.style.display = "block";
}

window.handleSaveSlot = function(slotNumber) {
    saveGameToSlot(slotNumber);
    closeSaveLoadModals();
}

window.handleLoadSlot = function(slotNumber) {
    loadGameFromSlot(slotNumber);
    closeSaveLoadModals();
}

window.closeSaveLoadModals = function() {
    if (saveSlotModal) saveSlotModal.style.display = 'none';
    if (loadSlotModal) loadSlotModal.style.display = 'none';
}

function loadGameFromSlot(slotNumber) {
    try {
        const slotKey = `${SAVE_GAME_KEY_BASE}${slotNumber}`;
        const savedData = localStorage.getItem(slotKey);
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            initializeGame(parsedData);
            actionFeedback.textContent = `Game loaded successfully from Slot ${slotNumber}!`;
            actionFeedback.style.display = 'block';
        } else {
            actionFeedback.textContent = `No saved game found in Slot ${slotNumber}.`;
            actionFeedback.style.display = 'block';
        }
    } catch (e) {
        console.error("Error loading game:", e);
        actionFeedback.textContent = "Error loading game. Saved data might be corrupted.";
        actionFeedback.style.display = 'block';
    }
}

function setupNeighborClickHandler() {
    document.querySelectorAll('#diplomacy-neighbors li').forEach(li => {
        li._clickListener = () => handleNeighborClick(li.dataset.neighborName);
        li.addEventListener('click', li._clickListener);
        li.style.cursor = 'pointer'; 
        li.style.pointerEvents = isGameOver ? 'none' : 'auto'; 
        li.style.opacity = isGameOver ? '0.7' : '1';
    });
}

function setupBackgroundMusic() {
    const backgroundMusic = document.getElementById('background-music');
    
    // Set appropriate volume
    backgroundMusic.volume = 0.4; 
    
    // Ensure it loops
    backgroundMusic.loop = true;
    
    // Try to play it automatically
    playAttempt();
    
    // Try playing again after a short delay (some browsers need this)
    setTimeout(playAttempt, 1000);
    setTimeout(playAttempt, 2000);
    
    // Function to attempt playing the audio
    function playAttempt() {
        backgroundMusic.play().catch(function(error) {
            console.log('Autoplay prevented. Will try to play on user interaction.', error);
        });
    }
    
    // Play audio on first user interaction if autoplay fails
    const playOnInteraction = function() {
        playAttempt();
        // Remove event listeners after first interaction
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
    };
    
    document.addEventListener('click', playOnInteraction);
    document.addEventListener('keydown', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);
    
    // Extra handler to ensure looping works
    backgroundMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play().catch(error => console.log('Error restarting music:', error));
    });
}

function createSaveLoadModals() {
    if (!document.getElementById('save-slot-modal')) {
        // Create save slot modal
        saveSlotModal = document.createElement('div');
        saveSlotModal.id = 'save-slot-modal';
        saveSlotModal.className = 'modal';
        saveSlotModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" onclick="closeSaveLoadModals()">&times;</span>
                <h3>Save Game</h3>
                <p>Choose a slot to save your game:</p>
                <div id="save-slots-container" class="slots-container"></div>
            </div>
        `;
        document.body.appendChild(saveSlotModal);
    }

    if (!document.getElementById('load-slot-modal')) {
        // Create load slot modal
        loadSlotModal = document.createElement('div');
        loadSlotModal.id = 'load-slot-modal';
        loadSlotModal.className = 'modal';
        loadSlotModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" onclick="closeSaveLoadModals()">&times;</span>
                <h3>Load Game</h3>
                <p>Choose a slot to load your game:</p>
                <div id="load-slots-container" class="slots-container"></div>
            </div>
        `;
        document.body.appendChild(loadSlotModal);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupBackgroundMusic();
    createSaveLoadModals();
    
    // Check for saved game in slot 1 and offer to load it
    const savedData = localStorage.getItem(`${SAVE_GAME_KEY_BASE}1`);
    if (savedData) {
        const loadLatestBtn = document.createElement('button');
        loadLatestBtn.textContent = 'Load Latest Game';
        loadLatestBtn.id = 'load-latest-game';
        loadLatestBtn.style.marginTop = '10px';
        loadLatestBtn.onclick = () => loadGameFromSlot(1);
        
        const setupForm = document.getElementById('setup-form');
        if (setupForm) {
            setupForm.appendChild(loadLatestBtn);
        }
    }
    
    // Set up click handlers for save/load buttons
    if (saveGameButton) {
        saveGameButton.addEventListener('click', showSaveSlotModal);
    }
    
    if (loadGameButton) {
        loadGameButton.addEventListener('click', showLoadSlotModal);
    }
});

const originalUpdateDiplomacyTab = updateDiplomacyTab;
updateDiplomacyTab = function() {
    originalUpdateDiplomacyTab();
    setupNeighborClickHandler(); 
};

function updateCommunicationsTab() {
    if (!communicationsLeadersList) return;

    communicationsLeadersList.innerHTML = '';
    const leaders = [];

    // Add neighbors' leaders
    (countryData.diplomacy?.neighbors || []).forEach(n => {
        if (n.leaderName && !leaders.some(l => l.leaderName === n.leaderName)) {
            leaders.push({ leaderName: n.leaderName, countryName: n.name });
        }
    });

    // Add world nations' leaders
    (worldNationsCache || []).forEach(n => {
        if (n.leaderInfo && n.leaderInfo !== 'Unknown' && !leaders.some(l => l.leaderName === n.leaderInfo)) {
            leaders.push({ leaderName: n.leaderInfo, countryName: n.name });
        }
    });

    if (leaders.length > 0) {
        leaders.forEach(leader => {
            const li = document.createElement('li');
            li.style.cursor = 'pointer';
            li.innerHTML = `
                <strong>${leader.leaderName}</strong> (<em>${leader.countryName}</em>)
            `;
            li.onclick = () => openChatModal(leader.leaderName, leader.countryName);
            communicationsLeadersList.appendChild(li);
        });
    } else {
        communicationsLeadersList.innerHTML = '<li>No known leaders to communicate with.</li>';
    }
}

function openChatModal(leaderName, countryName) {
    if (!chatModal) return;

    chatModalTitle.textContent = `Communicating with ${leaderName} of ${countryName}`;
    chatLog.innerHTML = ''; // Clear previous chat

    // Find the country object to get the log
    let country = (countryData.diplomacy.neighbors || []).find(n => n.name === countryName) || 
                  (worldNationsCache || []).find(n => n.name === countryName);

    if (country && country.communicationLog) {
        country.communicationLog.forEach(msg => {
            const messageDiv = document.createElement('div');
            const isPlayer = msg.from === countryDetails.leaderName;
            messageDiv.className = `chat-message ${isPlayer ? 'player' : 'other'}`;
            messageDiv.innerHTML = `<span class="sender-name">${msg.from}</span>${converter.makeHtml(msg.message)}`;
            chatLog.appendChild(messageDiv);
        });
    } else {
        chatLog.innerHTML = '<p><em>No communication history.</em></p>';
    }
    
    // Scroll to the bottom of the chat log
    chatLog.scrollTop = chatLog.scrollHeight;
    
    sendChatMessageButton.dataset.leaderName = leaderName;
    sendChatMessageButton.dataset.countryName = countryName;
    chatMessageInput.value = '';
    chatModal.style.display = 'block';
    chatMessageInput.focus();
}

function updateInternationalTab() {
    if (internationalSituation) {
        internationalSituation.innerHTML = converter.makeHtml("Overview of the international landscape and global politics.");
    }
    
    if (internationalNations) {
        internationalNations.innerHTML = '';
        const worldNations = worldNationsCache || countryData.worldNations || [];
        if (worldNations.length > 0) {
            worldNations.forEach(nation => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${nation.name}</strong> (${nation.ideology || 'Unknown'}) - Status: <em>${nation.status || 'Unknown'}</em><br>Leader: ${nation.leaderInfo || 'Unknown'}<br>${nation.notes || 'No additional notes.'}`;
                internationalNations.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "No international nations data available.";
            internationalNations.appendChild(li);
        }
    }
    
    if (internationalConflictsTreaties) {
        // This could be expanded based on global events data
        internationalConflictsTreaties.innerHTML = '<p>No known global conflicts or treaties at this time.</p>';
    }
}

function updateTradeTab() {
    const data = countryData.trade;
    if (!data) {
        if (tradeSituation) tradeSituation.innerHTML = "Trade data not available.";
        if (tradeStats) tradeStats.innerHTML = "";
        if (tradeResourcesList) tradeResourcesList.innerHTML = "";
        if (tradePartnersList) tradePartnersList.innerHTML = "";
        return;
    }
    
    if (tradeSituation) tradeSituation.innerHTML = converter.makeHtml(data.situation || "No trade situation description available.");
    
    if (tradeStats) {
        tradeStats.innerHTML = '';
        for (const [key, value] of Object.entries(data.stats || {})) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            tradeStats.appendChild(li);
        }
    }
    
    if (tradeResourcesList) {
        tradeResourcesList.innerHTML = '';
        const resources = data.resources || [];
        if (resources.length > 0) {
            resources.forEach(resource => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${resource.name}:</strong> ${resource.quantity || 0} ${resource.unit || 'units'} @ $${resource.pricePerUnit || 0} per unit`;
                tradeResourcesList.appendChild(li);
            });
        } else {
            tradeResourcesList.innerHTML = '<p>No resources available for trade.</p>';
        }
    }
    
    if (tradePartnersList) {
        tradePartnersList.innerHTML = '';
        const partners = data.partners || [];
        if (partners.length > 0) {
            partners.forEach(partner => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${partner.name}:</strong> ${partner.relationship || 'Unknown'} (Last Year Trade: $${partner.tradeValueLastYear?.toLocaleString() || 0})`;
                tradePartnersList.appendChild(li);
            });
        } else {
            tradePartnersList.innerHTML = '<p>No active trade partners.</p>';
        }
    }
}

function updateImmigrationTab() {
    const data = countryData.immigration || { stats: {}, situation: "" };
    
    if (immigrationSituation) {
        immigrationSituation.innerHTML = converter.makeHtml(data.situation || 
            `Immigration flows are influenced by your nation's economic opportunities, political stability, and international reputation. 
            Current policies and border security measures affect both legal and illegal immigration rates.`);
    }
    
    if (immigrationStats) {
        immigrationStats.innerHTML = '';
        const stats = data.stats || {};
        
        // Default realistic immigration stats if not provided
        const defaultStats = {
            'Legal Immigrants (Annual)': stats['Legal Immigrants (Annual)'] || Math.floor(countryData.internal?.stats?.Population * 0.002) || 2000,
            'Illegal Immigrants (Estimated)': stats['Illegal Immigrants (Estimated)'] || Math.floor(countryData.internal?.stats?.Population * 0.001) || 1000,
            'Border Security Level': stats['Border Security Level'] || 'Medium',
            'Immigration Policy': stats['Immigration Policy'] || 'Moderate',
            'Refugee Applications': stats['Refugee Applications'] || Math.floor(Math.random() * 500) + 100,
            'Brain Drain/Gain Index': stats['Brain Drain/Gain Index'] || (Math.random() > 0.5 ? '+2.1' : '-1.3'),
            'Visa Processing Time': stats['Visa Processing Time'] || '3-6 months'
        };
        
        for (const [key, value] of Object.entries(defaultStats)) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            immigrationStats.appendChild(li);
        }
    }
}

function updateResearchTab() {
    const data = countryData.research || { stats: {}, situation: "", ongoingProjects: [], diseases: [] };
    
    if (researchSituation) researchSituation.innerHTML = converter.makeHtml(data.situation || 
        `Your nation's research capabilities determine technological advancement, medical breakthroughs, and industrial innovation. 
        Research funding and international cooperation affect progress rates and breakthrough potential.`);
    
    if (researchStats) {
        researchStats.innerHTML = '';
        const stats = data.stats || {};
        
        const defaultStats = {
            'R&D Budget (% of GDP)': stats['R&D Budget (% of GDP)'] || '2.1%',
            'Scientists & Researchers': stats['Scientists & Researchers'] || Math.floor(countryData.internal?.stats?.Population * 0.001) || 1000,
            'Technology Level': stats['Technology Level'] || 'Modern',
            'Patent Applications (Annual)': stats['Patent Applications (Annual)'] || Math.floor(Math.random() * 1000) + 500,
            'International Cooperation': stats['International Cooperation'] || 'Active',
            'Medical Research Priority': stats['Medical Research Priority'] || 'General Health',
            'Military Tech Development': stats['Military Tech Development'] || 'Standard'
        };
        
        for (const [key, value] of Object.entries(defaultStats)) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${key}:</strong> ${value}`;
            researchStats.appendChild(li);
        }
    }
    
    if (researchOngoingProjects) {
        researchOngoingProjects.innerHTML = '';
        const projects = data.ongoingProjects || [];
        if (projects.length > 0) {
            projects.forEach(project => {
                const div = document.createElement('div');
                div.innerHTML = `<strong>${project.name}:</strong> ${project.progress || 0}% complete (${project.description || 'No description'})`;
                researchOngoingProjects.appendChild(div);
            });
        } else {
            researchOngoingProjects.innerHTML = '<p>No active research projects. Consider initiating new research programs.</p>';
        }
    }
    
    if (researchDiseasesStatus) {
        researchDiseasesStatus.innerHTML = '';
        const diseases = data.diseases || [];
        if (diseases.length > 0) {
            diseases.forEach(disease => {
                const div = document.createElement('div');
                div.style.padding = '8px';
                div.style.margin = '5px 0';
                div.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                div.style.borderLeft = '3px solid #f44336';
                div.innerHTML = `<strong>${disease.name}:</strong> ${disease.status || 'Active'} - ${disease.description || 'Unknown disease'}`;
                researchDiseasesStatus.appendChild(div);
                
                // Show disease warning banner
                if (diseaseWarning) diseaseWarning.style.display = 'block';
            });
        } else {
            researchDiseasesStatus.innerHTML = '<p>No known disease outbreaks. Public health status: Normal.</p>';
            if (diseaseWarning) diseaseWarning.style.display = 'none';
        }
    }
}

function updateOrganizationsTab() {
    const data = countryData.organizations || [];
    
    if (organizationsSituation) {
        organizationsSituation.innerHTML = converter.makeHtml(
            `International organizations provide platforms for cooperation, trade, and diplomatic influence. 
            Membership requirements vary and often include political, economic, or ideological criteria. 
            Leadership positions in these organizations can significantly boost your nation's global influence.`);
    }
    
    if (organizationsList) {
        organizationsList.innerHTML = '';
        if (data.length > 0) {
            data.forEach(org => {
                const li = document.createElement('li');
                let membershipStatus = '';
                if (org.playerIsLeader) {
                    membershipStatus = '<span style="color: #d4af37; font-weight: bold;">Leader</span>';
                } else if (org.playerIsMember) {
                    membershipStatus = '<span style="color: #4caf50;">Member</span>';
                } else {
                    membershipStatus = '<span style="color: #666;">Not a Member</span>';
                }
                
                li.innerHTML = `
                    <strong>${org.name}</strong> (${org.type || 'Organization'}) - ${membershipStatus}<br>
                    <em>Influence Level: ${org.influence || 'Unknown'}</em><br>
                    Members: ${org.members?.join(', ') || 'Unknown'}<br>
                    ${org.requirements ? `Requirements: ${org.requirements}` : ''}
                `;
                organizationsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerHTML = 'No international organizations are currently known or accessible.';
            organizationsList.appendChild(li);
        }
    }
}

function updateFactionsTab() {
    const data = countryData.factions || [];
    const playerFaction = countryData.playerFaction;
    
    if (factionsSituation) {
        factionsSituation.innerHTML = converter.makeHtml(
            `Military and political factions represent formal alliances between nations with shared goals. 
            Faction membership provides mutual defense, trade benefits, and coordinated diplomatic actions. 
            Faction leaders can call upon member nations for military support and economic cooperation.`);
    }
    
    if (playerFactionInfo) {
        if (playerFaction) {
            let leadershipText = '';
            if (playerFaction.leader === countryDetails.countryName) {
                leadershipText = '<span style="color: #d4af37; font-weight: bold;">You are the faction leader</span>';
            } else {
                leadershipText = `<span style="color: #4caf50;">Leader: ${playerFaction.leader}</span>`;
            }
            
            playerFactionInfo.innerHTML = `
                <strong>Your Faction: ${playerFaction.name}</strong><br>
                Type: ${playerFaction.type || 'Unknown'}<br>
                Goal: ${playerFaction.goal || 'No specific goal'}<br>
                ${leadershipText}<br>
                Members: ${playerFaction.members?.join(', ') || 'Unknown'}<br>
                ${playerFaction.nextElectionYear ? `Next Leadership Election: ${playerFaction.nextElectionYear}` : ''}
            `;
        } else {
            playerFactionInfo.innerHTML = '<p>You are not currently a member or leader of any faction.</p>';
        }
    }
    
    if (globalFactionsList) {
        globalFactionsList.innerHTML = '';
        if (data.length > 0) {
            data.forEach(faction => {
                const li = document.createElement('li');
                let membershipStatus = '';
                if (faction.playerIsLeader) {
                    membershipStatus = '<span style="color: #d4af37; font-weight: bold;">You Lead This Faction</span>';
                } else if (faction.playerIsMember) {
                    membershipStatus = '<span style="color: #4caf50;">You Are a Member</span>';
                } else {
                    membershipStatus = '<span style="color: #999;">External Faction</span>';
                }
                
                li.innerHTML = `
                    <strong>${faction.name}</strong> (${faction.type || 'Faction'}) - ${membershipStatus}<br>
                    Current Leader: ${faction.leader || 'Unknown'}<br>
                    Members: ${faction.members?.join(', ') || 'Unknown'}<br>
                    ${faction.requirements ? `Join Requirements: ${faction.requirements}` : ''}
                    ${faction.nextElectionYear ? `<br>Next Election: ${faction.nextElectionYear}` : ''}
                `;
                globalFactionsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerHTML = 'No known global factions exist at this time.';
            globalFactionsList.appendChild(li);
        }
    }
}

function updateLeaderTab() {
    const data = countryData.leaderData;
    if (!data) return;
    
    const currentLeaderInfo = document.getElementById('current-leader-info');
    const leaderSpouseInfo = document.getElementById('leader-spouse-info');
    const childrenList = document.getElementById('children-list');
    const pastLeadersList = document.getElementById('past-leaders-list');
    const monarchyActions = document.getElementById('monarchy-actions');
    
    // Update current leader info
    if (currentLeaderInfo && data.current) {
        const leader = data.current;
        currentLeaderInfo.innerHTML = `
            <div class="leadership-stats">
                <div class="leadership-stat">
                    <strong>Name:</strong> ${leader.name}<br>
                    <strong>Age:</strong> ${leader.age}<br>
                    <strong>Style:</strong> ${leader.style}
                </div>
                <div class="leadership-stat">
                    <strong>Health:</strong> ${leader.health || 85}%<br>
                    <strong>Popularity:</strong> ${leader.popularity || 70}%<br>
                    <strong>Security:</strong> ${leader.securityLevel || 'Medium'}
                </div>
            </div>
            <div style="margin-top: 10px;">
                <strong>Traits:</strong> ${(leader.traits || []).join(', ')}<br>
                <strong>In Power Since:</strong> ${monthNames[(leader.startMonth || 1) - 1]} ${leader.startYear || gameYear}<br>
                <strong>Major Accomplishments:</strong> ${(leader.accomplishments || []).join(', ') || 'None yet'}
            </div>
        `;
    }
    
    // Show monarchy actions if applicable
    const isMonarchy = ['Monarchy (Absolute)', 'Constitutional Monarchy', 'Elective Monarchy'].includes(currentGovType);
    if (monarchyActions) {
        monarchyActions.style.display = isMonarchy ? 'block' : 'none';
    }
    
    // Update spouse info
    if (leaderSpouseInfo && data.family) {
        if (data.family.spouse) {
            const spouse = data.family.spouse;
            leaderSpouseInfo.innerHTML = `
                <div class="family-member">
                    <strong>Spouse:</strong> ${spouse.name} (Age: ${spouse.age})<br>
                    <strong>Personality:</strong> ${spouse.personality}<br>
                    <strong>Influence:</strong> ${spouse.influence}%
                </div>
            `;
        } else if (isMonarchy) {
            leaderSpouseInfo.innerHTML = '<div class="family-member">No spouse - consider finding one to secure the succession</div>';
        } else {
            leaderSpouseInfo.innerHTML = '<div class="family-member">Single</div>';
        }
    }
    
    // Update children list
    if (childrenList && data.family.children) {
        childrenList.innerHTML = '';
        if (data.family.children.length > 0) {
            data.family.children.forEach((child, index) => {
                const div = document.createElement('div');
                div.className = `family-member ${child.personality === 'Evil' || child.personality === 'Devious' ? 'sibling-threat' : 'sibling-loyal'}`;
                
                let childInfo = `<strong>${child.name}</strong> (Age: ${child.age}, ${child.gender})`;
                if (isMonarchy) {
                    const title = child.gender === 'Male' ? 'Prince' : 'Princess';
                    childInfo = `<strong>${title} ${child.name}</strong> (Age: ${child.age})`;
                    
                    if (child.isHeir) {
                        childInfo += '<span class="heir-marker">HEIR</span>';
                    }
                }
                
                childInfo += `<br><strong>Personality:</strong> ${child.personality}`;
                childInfo += `<br><strong>Loyalty:</strong> ${child.loyalty}%`;
                childInfo += `<br><strong>Traits:</strong> ${(child.traits || []).join(', ')}`;
                
                if (child.personality === 'Evil' || child.personality === 'Devious') {
                    childInfo += '<br><span style="color: #f44336;"><strong>Warning:</strong> May pose a threat to your rule</span>';
                }
                
                div.innerHTML = childInfo;
                childrenList.appendChild(div);
            });
            
            // Update heir dropdown for monarchies
            updateHeirDropdown();
        } else {
            childrenList.innerHTML = '<div class="family-member">No children</div>';
        }
    }
    
    // Update past leaders
    if (pastLeadersList && data.pastLeaders) {
        pastLeadersList.innerHTML = '';
        data.pastLeaders.forEach(leader => {
            const div = document.createElement('div');
            div.className = 'memorial-card';
            div.innerHTML = `
                <strong>${leader.name}</strong> (${leader.reignYears})<br>
                <span class="death-cause">Cause of Death: ${leader.deathCause}</span><br>
                <strong>Legacy:</strong> ${leader.publicOpinion}<br>
                <strong>Achievements:</strong> ${(leader.achievements || []).join(', ') || 'None recorded'}
            `;
            pastLeadersList.appendChild(div);
        });
        
        if (data.memorials && data.memorials.length > 0) {
            const memorialHeader = document.createElement('h4');
            memorialHeader.textContent = 'National Memorials';
            memorialHeader.style.marginTop = '20px';
            pastLeadersList.appendChild(memorialHeader);
            
            data.memorials.forEach(memorial => {
                const div = document.createElement('div');
                div.className = 'memorial-card';
                div.innerHTML = `
                    <strong>${memorial.name}</strong><br>
                    <em>${memorial.description}</em><br>
                    <strong>Location:</strong> ${memorial.location}
                `;
                pastLeadersList.appendChild(div);
            });
        }
    }
}

function updateHeirDropdown() {
    const heirDropdown = document.getElementById('heir-dropdown');
    const data = countryData.leaderData;
    
    if (heirDropdown && data && data.family.children) {
        heirDropdown.innerHTML = '<option value="">Select Heir</option>';
        data.family.children.forEach((child, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${child.name} (Age: ${child.age}, ${child.personality})`;
            if (child.isHeir) {
                option.selected = true;
            }
            heirDropdown.appendChild(option);
        });
    }
}

window.findSpouse = function() {
    handleActionSubmit(null, 'Arrange royal marriage and find suitable spouse');
}

window.tryForChild = function() {
    const data = countryData.leaderData;
    if (data && data.family.spouse) {
        handleActionSubmit(null, 'Try for another child');
    } else {
        actionFeedback.innerHTML = converter.makeHtml('**Cannot have children:** You need a spouse first.');
    }
}

window.designateHeir = function() {
    const heirDropdown = document.getElementById('heir-dropdown');
    const selectedIndex = heirDropdown.value;
    
    if (selectedIndex !== '') {
        const data = countryData.leaderData;
        if (data && data.family.children[selectedIndex]) {
            // Clear current heir
            data.family.children.forEach(child => child.isHeir = false);
            // Set new heir
            data.family.children[selectedIndex].isHeir = true;
            const heirName = data.family.children[selectedIndex].name;
            
            actionFeedback.innerHTML = converter.makeHtml(`**Heir Designated:** ${heirName} is now the designated heir to the throne.`);
            updateLeaderTab();
        }
    }
}

let neighborReactions = {}; // Track recent neighbor actions and reactions
let autonomousActionCooldowns = {}; // Prevent spam of autonomous actions
let neighborEmotionalStates = {}; // Track each neighbor's current emotional state toward player

function showNeighborReaction(neighborName, emotion, actionDescription) {
    const neighborLi = document.querySelector(`#diplomacy-neighbors li[data-neighbor-name="${neighborName}"]`);
    if (!neighborLi) return;
    
    // Remove existing emoji if present
    const existingEmoji = neighborLi.querySelector('.neighbor-reaction-emoji');
    if (existingEmoji) {
        existingEmoji.remove();
    }
    
    // Create emoji element
    const emojiElement = document.createElement('div');
    emojiElement.className = 'neighbor-reaction-emoji';
    
    // Set emoji based on emotion
    const emojiMap = {
        'angry': '😠',
        'very_angry': '🤬',
        'happy': '😊',
        'very_happy': '😍',
        'suspicious': '🤨',
        'worried': '😰',
        'threatening': '💀',
        'nuclear_threat': '☢️',
        'neutral': '😐',
        'plotting': '😈',
        'surprised': '😲',
        'disappointed': '😞'
    };
    
    emojiElement.textContent = emojiMap[emotion] || '😐';
    
    // Add emoji to neighbor element
    neighborLi.style.position = 'relative';
    neighborLi.appendChild(emojiElement);
    
    // Update emotional state
    neighborEmotionalStates[neighborName] = emotion;
    
    // Show popup notification if it's a significant action
    if (['very_angry', 'nuclear_threat', 'threatening', 'plotting'].includes(emotion)) {
        showNeighborActionPopup(neighborName, actionDescription, emotion);
    }
    
    // Remove emoji after animation
    setTimeout(() => {
        if (emojiElement && emojiElement.parentNode) {
            emojiElement.remove();
        }
    }, 2000);
}

function showNeighborActionPopup(neighborName, actionDescription, type) {
    const popup = document.createElement('div');
    popup.className = `neighbor-action-popup ${type === 'nuclear_threat' ? 'nuclear' : 
                                                type === 'very_happy' ? 'positive' : 
                                                type === 'neutral' ? 'neutral' : ''}`;
    
    const title = type === 'nuclear_threat' ? '☢️ NUCLEAR THREAT ☢️' :
                  type === 'threatening' ? '⚔️ WAR THREAT' :
                  type === 'plotting' ? '🕵️ SUSPICIOUS ACTIVITY' : 
                  '📢 DIPLOMATIC ACTION';
    
    popup.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
        <div style="font-size: 0.9em;"><strong>${neighborName}:</strong> ${actionDescription}</div>
    `;
    
    document.body.appendChild(popup);
    
    // Remove popup after animation
    setTimeout(() => {
        if (popup && popup.parentNode) {
            popup.remove();
        }
    }, type === 'nuclear_threat' ? 6000 : 5000);
}

function addAutonomousIndicator(neighborName, type = 'planning') {
    const neighborLi = document.querySelector(`#diplomacy-neighbors li[data-neighbor-name="${neighborName}"]`);
    if (!neighborLi) return;
    
    // Remove existing indicator
    const existingIndicator = neighborLi.querySelector('.autonomous-action-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Add new indicator
    const indicator = document.createElement('div');
    indicator.className = `autonomous-action-indicator ${type}`;
    indicator.title = type === 'planning' ? 'This country is planning something...' :
                     type === 'peaceful' ? 'This country is in a peaceful state' :
                     'This country is taking hostile action';
    
    neighborLi.style.position = 'relative';
    neighborLi.appendChild(indicator);
    
    // Remove indicator after some time
    setTimeout(() => {
        if (indicator && indicator.parentNode) {
            indicator.remove();
        }
    }, 30000); // 30 seconds
}

function getAutonomyThreatLevel(neighbor) {
    let threatLevel = 'Low';
    let threatColor = '#4caf50';
    let threatReasons = [];
    
    // Assess based on ideology
    const aggressiveIdeologies = ['Fascism', 'Nationalism', 'Expansionism', 'Authoritarianism'];
    if (aggressiveIdeologies.includes(neighbor.ideology)) {
        threatLevel = 'High';
        threatColor = '#f44336';
        threatReasons.push('Aggressive ideology');
    }
    
    // Assess based on personality
    const aggressivePersonalities = ['Aggressive', 'Erratic', 'Calculating', 'Expansionist'];
    if (aggressivePersonalities.includes(neighbor.leaderPersonality)) {
        threatLevel = threatLevel === 'Low' ? 'Moderate' : 'High';
        threatColor = threatLevel === 'High' ? '#ff5722' : '#ff9800';
        threatReasons.push('Aggressive leadership');
    }
    
    // Check nuclear status
    if (neighbor.estimatedStrength && neighbor.estimatedStrength.toLowerCase().includes('nuclear')) {
        threatLevel = 'Nuclear Power';
        threatColor = '#ff9800';
        threatReasons.push('Nuclear capabilities');
    }
    
    // Check current emotional state
    const currentEmotion = neighborEmotionalStates[neighbor.name];
    if (['very_angry', 'threatening', 'nuclear_threat', 'plotting'].includes(currentEmotion)) {
        threatLevel = 'Immediate Threat';
        threatColor = '#d32f2f';
        threatReasons.push('Currently hostile');
    }
    
    const reasonText = threatReasons.length > 0 ? ` (${threatReasons.join(', ')})` : '';
    return `<div><strong>Autonomy Threat Level:</strong> <span style="color: ${threatColor};">${threatLevel}</span>${reasonText}</div>`;
}

/* Intro "short film" playback: generate multi-frame sequences per scene and animate them with Ken Burns
   pan/zoom + crossfade to create a moving-picture effect rather than static slides. Frames are generated
   per scene (3 scenes) with a few frames each and played back in quick succession; narration (TTS) is synced
   when available. This is a best-effort, browser-side animation — avoids heavy CPU by using CSS transforms
   and swapping images rather than encoding a real video.
*/
async function generateAndPlayIntro(details, saveDataSnapshot) {
    const modal = document.getElementById('intro-video-modal');
    const slideImg = document.getElementById('intro-slide-img');
    const caption = document.getElementById('intro-caption');
    const progressBar = document.getElementById('intro-progress-bar');
    const skipBtn = document.getElementById('intro-skip');
    const closeBtn = document.getElementById('intro-close-button');
    const audioEl = document.getElementById('intro-narration-audio');

    if (!modal || !slideImg || !caption || !progressBar) return;
    modal.style.display = 'block';

    // Scene prompts
    const scenes = [
        { prompt: details.worldMapPrompt || `A detailed political map showing ${details.countryName} in ${details.startYear}`, caption: `${details.countryName} — ${details.startYear}`, aspect: "16:9" },
        { prompt: `Cinematic founding scene of ${details.countryName} in ${details.startYear}: banners, leaders, map table, citizens, dramatic lighting`, caption: `Origins: ${details.countryName}`, aspect: "16:9" },
        { prompt: `Portrait of ${details.leaderName} as a ${details.leaderStyle} leader, cinematic, moody lighting`, caption: `${details.leaderName} — ${details.leaderStyle}`, aspect: "3:4" }
    ];

    // For a moving-picture effect we generate N frames per scene with slight prompt variation to simulate motion.
    const FRAMES_PER_SCENE = 4;
    const FRAME_DELAY_MS = 350; // playback speed per frame
    const imageFramesByScene = [];

    for (let s = 0; s < scenes.length; s++) {
        const scene = scenes[s];
        imageFramesByScene[s] = [];
        for (let f = 0; f < FRAMES_PER_SCENE; f++) {
            const framePrompt = `${scene.prompt} — cinematic frame ${f + 1} of ${FRAMES_PER_SCENE}, slight camera movement, consistent style`;
            try {
                const opts = { prompt: framePrompt, aspect_ratio: scene.aspect, width: scene.aspect === "16:9" ? 1280 : 900, height: scene.aspect === "3:4" ? 1200 : 720 };
                const res = await websim.imageGen(opts);
                imageFramesByScene[s].push(res && res.url ? res.url : slideImg.src || 'placeholder_map.png');
            } catch (err) {
                console.warn('Intro frame generation failed:', err);
                // Push placeholder to keep timing consistent
                imageFramesByScene[s].push(slideImg.src || 'placeholder_map.png');
            }
        }
    }

    // Prepare narration and TTS (short)
    const narrationText = `Welcome to ${details.countryName}, founded in ${details.startYear}. Led by ${details.leaderName}, a ${details.leaderStyle} leader. Shape its destiny.`;
    try {
        const tts = await websim.textToSpeech({ text: narrationText, voice: "en-male" });
        audioEl.src = (tts && tts.url) ? tts.url : '';
    } catch (e) {
        console.warn('Intro TTS failed:', e);
        audioEl.src = '';
    }

    let aborted = false;
    skipBtn.onclick = () => { aborted = true; stopAndClose(); };
    closeBtn.onclick = () => { aborted = true; stopAndClose(); };

    function stopAndClose() {
        try { audioEl.pause(); } catch (e) {}
        modal.style.display = 'none';
        progressBar.style.width = '0%';
        slideImg.style.opacity = 0;
    }

    // Helper: play frames for a scene with simple Ken Burns CSS transform animations
    async function playSceneFrames(frames, sceneCaption) {
        caption.innerText = sceneCaption || '';
        // create an offscreen img element to pre-load frames
        for (let i = 0; i < frames.length; i++) {
            if (aborted) return;
            slideImg.style.transition = 'opacity 220ms ease, transform 5s ease';
            slideImg.style.opacity = '0';
            // small delay to allow fade-out
            // eslint-disable-next-line no-await-in-loop
            await new Promise(r => setTimeout(r, 120));
            slideImg.src = frames[i];
            // apply random subtle transform for ken burns effect
            const scale = 1 + (Math.random() * 0.06); // 1.00 - 1.06
            const tx = (Math.random() - 0.5) * 6; // -3 to 3 px
            const ty = (Math.random() - 0.5) * 6;
            slideImg.style.transform = `scale(${scale}) translate(${tx}px, ${ty}px)`;
            slideImg.style.opacity = '1';
            // update progress bar
            const progressTotal = (i + 1) / (frames.length * scenes.length) * 100;
            progressBar.style.width = `${Math.min(100, Math.round(progressTotal))}%`;
            // wait for frame display duration
            // eslint-disable-next-line no-await-in-loop
            await new Promise(r => setTimeout(r, FRAME_DELAY_MS));
        }
    }

    // Try to play audio; if blocked, still run visuals
    const useAudio = audioEl.src && audioEl.src.length > 0;
    if (useAudio) {
        try { await audioEl.play(); } catch (e) { /* ignore autoplay block */ }
    }

    // Play each scene sequentially
    for (let s = 0; s < imageFramesByScene.length; s++) {
        if (aborted) break;
        await playSceneFrames(imageFramesByScene[s], scenes[s].caption);
    }

    stopAndClose();
}

/* Action "short film" playback: generate small multi-frame sequences for action and outcome scenes,
   then play them back as animated frames with Ken Burns movement and crossfade to create a short-film feel.
*/
async function generateAndPlayActionVideo(actionText, outcomeSummary = '') {
    try {
        const modal = document.getElementById('action-video-modal');
        const slideImg = document.getElementById('action-slide-img');
        const caption = document.getElementById('action-caption');
        const progressBar = document.getElementById('action-progress-bar');
        const skipBtn = document.getElementById('action-skip');
        const closeBtn = document.getElementById('action-close-button');
        const audioEl = document.getElementById('action-narration-audio');

        if (!modal || !slideImg || !caption || !progressBar) return;
        modal.style.display = 'block';

        const safeAction = (actionText || '').slice(0, 300);
        const scenes = [
            { prompt: `Cinematic depiction of: ${safeAction}. One moment in motion, cinematic camera shift`, caption: `Action`, aspect: "16:9" },
            { prompt: outcomeSummary ? `Result: ${outcomeSummary}` : `Aftermath of: ${safeAction}`, caption: `Outcome`, aspect: "16:9" },
            { prompt: `Emotional close-up representing the stakes of: ${safeAction}`, caption: `Moment`, aspect: "3:4" }
        ];

        const FRAMES_PER_SCENE = 5;
        const FRAME_DELAY_MS = 280;
        const framesByScene = [];

        for (let s = 0; s < scenes.length; s++) {
            framesByScene[s] = [];
            for (let f = 0; f < FRAMES_PER_SCENE; f++) {
                const framePrompt = `${scenes[s].prompt} — frame ${f + 1} of ${FRAMES_PER_SCENE}, subtle camera shift, consistent lighting`;
                try {
                    const opts = { prompt: framePrompt, aspect_ratio: scenes[s].aspect };
                    if (scenes[s].aspect === "16:9") { opts.width = 1280; opts.height = 720; }
                    if (scenes[s].aspect === "3:4") { opts.width = 900; opts.height = 1200; }
                    const res = await websim.imageGen(opts);
                    framesByScene[s].push(res && res.url ? res.url : slideImg.src || 'placeholder_map.png');
                } catch (err) {
                    console.warn('Action frame generation failed:', err);
                    framesByScene[s].push(slideImg.src || 'placeholder_map.png');
                }
            }
        }

        // TTS
        const narration = outcomeSummary ? `${safeAction}. Result: ${outcomeSummary}` : `${safeAction}.`;
        try {
            const tts = await websim.textToSpeech({ text: narration, voice: "en-male" });
            audioEl.src = (tts && tts.url) ? tts.url : '';
        } catch (e) {
            console.warn('Action TTS failed:', e);
            audioEl.src = '';
        }

        let aborted = false;
        skipBtn.onclick = () => { aborted = true; stopAndClose(); };
        closeBtn.onclick = () => { aborted = true; stopAndClose(); };

        function stopAndClose() {
            try { audioEl.pause(); } catch (e) {}
            modal.style.display = 'none';
            progressBar.style.width = '0%';
            slideImg.style.opacity = 0;
        }

        async function playScene(frames, label, sceneIndex, totalScenes) {
            caption.innerText = label;
            for (let i = 0; i < frames.length; i++) {
                if (aborted) return;
                slideImg.style.transition = 'opacity 200ms ease, transform 4.5s ease';
                slideImg.style.opacity = '0';
                await new Promise(r => setTimeout(r, 120));
                slideImg.src = frames[i];
                // subtle ken burns
                const scale = 1 + (Math.random() * 0.07);
                const tx = (Math.random() - 0.5) * 8;
                const ty = (Math.random() - 0.5) * 8;
                slideImg.style.transform = `scale(${scale}) translate(${tx}px, ${ty}px)`;
                slideImg.style.opacity = '1';
                const globalProgress = ((sceneIndex * frames.length) + (i + 1)) / (totalScenes * frames.length);
                progressBar.style.width = `${Math.round(globalProgress * 100)}%`;
                await new Promise(r => setTimeout(r, FRAME_DELAY_MS));
            }
        }

        // Try audio
        const useAudio = audioEl.src && audioEl.src.length > 0;
        if (useAudio) {
            try { await audioEl.play(); } catch (e) { /* ignore */ }
        }

        const totalScenes = framesByScene.length;
        for (let s = 0; s < totalScenes; s++) {
            if (aborted) break;
            await playScene(framesByScene[s], scenes[s].caption || scenes[s].caption, s, totalScenes);
        }

        stopAndClose();
    } catch (e) {
        console.error('generateAndPlayActionVideo error:', e);
    }
}
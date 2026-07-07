// Answer Seeds: curated starting answers for 15 world-shaping questions.
// The labels are generic worldbuilding styles, not exact references to any named setting.

const SEED_STYLES = [
  { key: 'heroicRealm', label: 'Heroic Realm' },
  { key: 'ancientEpic', label: 'Ancient Epic' },
  { key: 'grittyKingdoms', label: 'Gritty Kingdoms' },
  { key: 'strangePlanes', label: 'Strange Planes' },
  { key: 'mythicGods', label: 'Mythic Gods' },
];

const ANSWER_SEEDS = {
  'world-basics-003': {
    heroicRealm: 'The world has a heroic fantasy tone: dangerous, colorful, and full of places where brave people can change history. Ancient ruins, rival kingdoms, divine temples, monster-haunted roads, and powerful factions all exist close enough to ordinary life that adventurers are not strange; they are necessary.',
    ancientEpic: 'The world feels ancient, solemn, and layered with lost ages. The present is shaped by old oaths, broken bloodlines, buried kingdoms, and songs that remember more truth than living scholars do. Wonder exists, but it is heavy with memory and consequence.',
    grittyKingdoms: 'The world has a grounded, political tone. Power comes from land, inheritance, food, debt, soldiers, marriages, and fear. Magic may exist, but most lives are shaped by law, hunger, loyalty, corruption, and the ambitions of noble houses.',
    strangePlanes: 'The world feels strange, magical, and unstable. Cities may connect to impossible realms, species may come from other planes, and magic is part of industry, travel, warfare, and identity. The setting should make people ask not only who rules, but what reality even is.',
    mythicGods: 'The world has a mythic tone where gods, monsters, omens, heroes, and prophecy matter. Mortal actions can echo into legend, divine punishment is remembered for generations, and sacred places are not symbolic only; they are dangerous and real.'
  },
  'world-basics-004': {
    heroicRealm: 'This world is built for quests, exploration, faction conflict, dungeon delves, political bargains, monster hunts, and heroic last stands. Stories should begin with local danger but grow into choices that affect cities, gods, nations, or the balance between old powers.',
    ancientEpic: 'The stories here should feel like rediscovered legends: long journeys, doomed oaths, heirs of forgotten lines, ancient evils waking, and small acts of mercy or pride that matter centuries later. Victory should feel meaningful, but never simple.',
    grittyKingdoms: 'Stories should focus on survival, power, betrayal, and consequence. A marriage can matter as much as a battle, a debt can start a war, and a secret can kill more people than a dragon. Heroes survive by choosing who to trust and what to sacrifice.',
    strangePlanes: 'Stories should involve planar crossings, magical accidents, living machines, impossible cities, strange species, metaphysical laws, and factions that treat reality itself as territory. Adventures should often begin with a question that should not have an answer.',
    mythicGods: 'Stories should feel like myths being made in real time: divine tests, cursed bloodlines, sacred monsters, prophecy, heroes wrestling with fate, and mortals trying to survive the attention of gods. Every major choice should feel like it could become a tale.'
  },
  'world-basics-007': {
    heroicRealm: 'The main wound of the world is that old evils were never fully defeated. Kingdoms, temples, and guilds keep daily life moving, but beneath them lie sealed ruins, broken divine relics, buried monsters, and factions trying to inherit powers they barely understand.',
    ancientEpic: 'The main wound is a loss from a previous age: a fallen realm, a broken covenant, a betrayal by kin, or a victory that cost too much. The present is living in the shadow of that ancient fracture, and many people no longer understand what was broken.',
    grittyKingdoms: 'The main pressure is a crisis of legitimacy. Rulers claim law, priests claim truth, merchants claim necessity, and soldiers claim order, but ordinary people can see that the system is cracking. Famine, succession, debt, or war may be the spark.',
    strangePlanes: 'The main wound is instability in reality. Planes overlap, portals open incorrectly, magic mutates places and people, and powerful groups exploit the damage. Some call it progress. Others know it is the sign of something larger breaking.',
    mythicGods: 'The main conflict is between mortal will and divine design. Gods, prophecies, monsters, and sacred laws push the world toward a foretold shape, but mortals keep making choices that threaten to fulfill, twist, or destroy that destiny.'
  },
  'geography-nature-001': {
    heroicRealm: 'The world is divided into several recognizable regions: settled heartlands, border kingdoms, monster-haunted wilderness, ancient ruins, sacred mountains, dangerous seas, and strange frontier zones where maps become unreliable. Travel between them creates natural adventure paths.',
    ancientEpic: 'The world is shaped by ancient lands with deep names: old forests, cold mountains, dying kingdoms, ruined roads, sacred rivers, and seas that separate the known world from forgotten shores. Geography should feel like history carved into the earth.',
    grittyKingdoms: 'The important regions are defined by resources and borders: grain valleys, iron hills, river crossings, ports, castles, disputed marches, islands, and harsh frontier lands. Geography matters because whoever controls food, roads, and chokepoints controls politics.',
    strangePlanes: 'The world is not only made of continents and seas. It includes overlapping planes, floating districts, mirror realms, buried worlds, portals, dead zones, and cities built around magical breaches. Some regions may be physically close but metaphysically distant.',
    mythicGods: 'The world is divided by sacred geography: god-marked mountains, cursed seas, oracle caves, underworld gates, monster islands, holy groves, and cities founded where divine acts once occurred. A map is also a record of myth.'
  },
  'history-006': {
    heroicRealm: 'The greatest fallen empire was a realm of roads, towers, spell-forges, and oathbound legions. It fell when its rulers tried to bind ancient powers for the good of the world, only to fracture their own empire into ruins, cursed provinces, and successor kingdoms.',
    ancientEpic: 'The lost empire was the brightest realm of an earlier age, remembered in songs as wiser and fairer than anything alive today. It fell through pride, betrayal, and the slow forgetting of sacred duties. Its ruins still seem more noble than most living cities.',
    grittyKingdoms: 'The fallen empire collapsed because it could no longer pay for its own size. Grain shipments failed, armies chose generals over emperors, nobles stopped obeying the capital, and provinces became kingdoms. The official story says tragedy; the ledgers say bankruptcy.',
    strangePlanes: 'The fallen empire mastered planar travel, magical infrastructure, and artificial life. It did not fall to an enemy army, but to a cascading failure of gates, engines, and treaties with things beyond the world. Some parts of the empire still exist elsewhere.',
    mythicGods: 'The fallen empire challenged the gods or broke a divine law that had protected the world. Its fall was not merely political; it was a punishment, a flood, a plague, a curse, or a monster-birth that turned imperial glory into sacred warning.'
  },
  'culture-001': {
    heroicRealm: 'The outcasts are often peoples linked to feared magic, old wars, monster bloodlines, or lands beyond the map. Some distrust is based on real historical wounds, but most of it has hardened into unfair tradition, making these groups easy scapegoats for rulers and priests.',
    ancientEpic: 'The pariah peoples descend from a broken oath, a cursed lineage, or a side that chose wrongly in an ancient war. Their exile is preserved in song and custom, though the original truth has become distorted by generations of grief and pride.',
    grittyKingdoms: 'Outcasts are defined less by species and more by usefulness to power: refugees, debtors, bastard lines, defeated clans, foreign workers, religious minorities, and conquered peoples. The reasons given are usually moral; the real reasons are political and economic.',
    strangePlanes: 'The outcasts include planar-touched peoples, artificial beings, immigrants from unstable realms, and species whose biology or memory does not fit local law. Fear of them is partly fear of the places they come from and partly fear that reality is less fixed than people want.',
    mythicGods: 'The outcasts are those marked by divine anger, monster ancestry, taboo worship, or prophecy. Some are feared because myths say they bring ruin. Whether that is true depends on whether the myth is warning, propaganda, or a god still enforcing old punishment.'
  },
  'people-races-002': {
    heroicRealm: 'Many sentient peoples exist: humans, elder folk, beast-blooded clans, underground cultures, sea peoples, small clever kin, and stranger beings near magical borders. They trade, fight, intermarry, form kingdoms, and carry old grudges that make politics more complicated.',
    ancientEpic: 'Other sentient peoples feel ancient and distinct, each tied to a deep origin: starlit ancestors, stone halls, forests, seas, fire, shadow, or songs from the first age. They are not just humans with different faces; they remember the world differently.',
    grittyKingdoms: 'Other sentient peoples exist, but their status depends on land, law, and power. Some are citizens, some are mercenaries, some are servants, some are feared foreigners, and some are used by rulers as proof that the realm needs strong borders.',
    strangePlanes: 'Sentient species may come from different planes, experiments, magical disasters, living cities, dream realms, or artificial creation. Some live in the main world; others visit through gates, embassies, trade routes, or exile communities.',
    mythicGods: 'Sentient peoples often come from divine acts, monster lineages, sacred transformations, or the children of gods and mortals. Their differences are spiritual as much as biological, and myths about their creation still shape how they are treated.'
  },
  'economics-004': {
    heroicRealm: 'Common resources include grain, timber, iron, wool, salt, and simple craft goods. Scarce resources include healing herbs, spell components, monster parts, ancient metals, clean water in cursed lands, and relic-grade materials. Adventurers often become part of the supply chain.',
    ancientEpic: 'Common resources come from the patient labor of farms, forests, rivers, and mines. Scarce resources are old things: star-metal, true silver, ancient seeds, sacred wood, lost dyes, and stones taken from ruins no living mason can imitate.',
    grittyKingdoms: 'The most important resources are food, coin, land, labor, ships, iron, horses, and credit. Scarcity is political: grain may exist but be hoarded, mines may be rich but owned by rivals, and trade may fail because roads are taxed or unsafe.',
    strangePlanes: 'Resources include mundane goods and impossible materials: bottled lightning, memory glass, void salts, planar wood, dream-silk, gate-stone, living metal, and stable reality anchors. Some resources are common in one plane and priceless in another.',
    mythicGods: 'Resources are shaped by divine favor and taboo. Sacred oils, oracle bones, blessed grain, monster blood, underworld coins, storm bronze, and god-touched springs may be more valuable than gold because they connect mortal life to divine power.'
  },
  'religion-001': {
    heroicRealm: 'Life and death follow a known but imperfectly understood cycle. Souls pass to divine realms, ancestral halls, underworld courts, or unknown roads depending on belief, patron gods, burial rites, and unfinished bonds. Resurrection exists, but it is costly, rare, and never casual.',
    ancientEpic: 'Death is a passage beyond the circles of the living world. The dead are preserved through names, songs, tombs, and memory. Spirits may linger because of oaths, curses, or grief, but true return is rare and often changes the one who returns.',
    grittyKingdoms: 'Most people believe the dead go where priests say they go, but certainty is a luxury. Funerals, inheritance, burial land, and religious fees matter as much as theology. The poor fear being forgotten; the powerful fear judgment or political use of their corpse.',
    strangePlanes: 'Death may be a transition into another plane, a soul-market, a reincarnation engine, a memory archive, or a metaphysical bureaucracy. Some cultures map death like geography. Others try to hack, delay, trade, or industrialize it.',
    mythicGods: 'Life and death are governed by gods, fate, and sacred law. The dead may cross rivers, stand before judges, become spirits, join divine domains, or be claimed by powers they served. Breaking death’s rules invites curses, monsters, or divine attention.'
  },
  'religion-003': {
    heroicRealm: 'There are organized temples, local cults, mystery faiths, ancestor traditions, druidic circles, forbidden sects, and philosophical orders. Most people honor several powers depending on need: harvest, travel, birth, battle, trade, healing, and death.',
    ancientEpic: 'Religions are old and layered. Some honor high powers through songs and seasonal rites, some keep ancestral oaths, and some preserve fragments of truth from before the current age. Heresies often begin as older memories the official faith tried to bury.',
    grittyKingdoms: 'Religion is both belief and institution. Temples own land, bless marriages, legitimize rulers, educate nobles, collect tithes, and bury the dead. Cults and radical movements grow where official faiths fail the poor, the defeated, or the frightened.',
    strangePlanes: 'Religions may worship gods, cosmic principles, living planes, dead machines, ascended mortals, alien intelligences, or abstract laws. Some cults are effectively research societies trying to understand powers that traditional theology cannot explain.',
    mythicGods: 'Religions center on gods, heroes, monsters, sacred places, and divine stories that still affect the world. Cults form around forbidden gods, local manifestations, dead heroes, prophetic dreams, or attempts to bargain with powers outside the accepted pantheon.'
  },
  'magic-001': {
    heroicRealm: 'Magic is uncommon but recognized. Most villages know a hedge healer, shrine blessing, minor charm, or scary story, while cities may have guild mages, temple miracles, enchanted items, and magical services. Powerful magic is rare enough to drive adventures.',
    ancientEpic: 'Magic exists, but it feels old, rare, and meaningful. It is found in songs, true names, ancient bloodlines, sacred places, crafted relics, and beings from earlier ages. When magic appears, it should feel like history waking up.',
    grittyKingdoms: 'Magic exists, but access is controlled by wealth, bloodline, institutions, fear, or secrecy. Nobles and rulers treat magic as a strategic asset. Ordinary people may fear magic users, need them, or resent that miracles are expensive.',
    strangePlanes: 'Magic is common enough to shape reality, industry, travel, communication, medicine, and identity. Some places run on it. Other places are damaged by it. The main question is not whether magic exists, but who controls the systems built from it.',
    mythicGods: 'Magic exists as a sacred and dangerous force tied to gods, fate, monsters, prophecy, sacrifice, or divine law. Some magic is learned, some is granted, and some is stolen from powers that remember every theft.'
  },
  'magic-002': {
    heroicRealm: 'Magic comes from several sources: study, divine blessing, pacts, bloodlines, nature, ancient relics, and contact with other realms. Different traditions disagree about which source is pure, safe, legal, or corrupting.',
    ancientEpic: 'Magic comes from the first making of the world: old words, stars, deep roots, true names, ancestral songs, and powers that existed before current kingdoms. Modern mages do not invent magic as much as rediscover fragments of it.',
    grittyKingdoms: 'Magic comes from knowledge and leverage: books, teachers, bloodlines, institutions, dangerous patrons, and rare materials. The source matters because whoever controls access to it controls power, status, and fear.',
    strangePlanes: 'Magic comes from the pressure between realities. Planes leak force, thought, memory, elements, dreams, or divine residue into the world. Mages learn how to shape these leaks, stabilize them, exploit them, or survive them.',
    mythicGods: 'Magic comes from divine breath, sacred law, monster blood, prophecy, sacrifice, and the places where gods once touched the world. Even scholarly magic may ultimately be a mortal grammar for divine or mythic forces.'
  },
  'magic-005': {
    heroicRealm: 'Magic cannot solve every problem. It has costs, components, limits of range, risk of failure, and consequences when used carelessly. It can heal, reveal, protect, and destroy, but it cannot easily erase history, create trust, or make choices for people.',
    ancientEpic: 'Magic cannot break the deepest laws without price: death, true oaths, fate, the names of things, and the memory of the world resist being rewritten. The greater the working, the more it demands sacrifice, time, place, and meaning.',
    grittyKingdoms: 'Magic is limited by politics as much as metaphysics. It needs money, protection, secrecy, licenses, rare materials, or patronage. It cannot feed a kingdom unless someone controls the land and labor around it.',
    strangePlanes: 'Magic cannot freely ignore stability. Reality pushes back. Too much alteration creates paradox, mutation, planar bleed, memory loss, broken geography, or attention from things that maintain the boundaries between worlds.',
    mythicGods: 'Magic cannot safely violate divine law, prophecy, sacred death, or a god’s claimed domain without consequence. It can bargain with mythic rules, exploit loopholes, or perform rituals, but open defiance invites punishment.'
  },
  'government-law-001': {
    heroicRealm: 'Governments claim to protect order, roads, trade, borders, and the innocent from monsters and chaos. The populace values safety, justice, and opportunity, but often distrusts rulers who rely on adventurers while pretending the realm is fully under control.',
    ancientEpic: 'Government ideals come from inherited duty: rightful rule, sacred oaths, protection of the weak, loyalty to bloodline, and preservation of old law. The populace respects tradition, but may suffer when ancient duties become empty ceremony.',
    grittyKingdoms: 'The government claims stability, law, and prosperity. In practice, it protects landholders, tax flow, succession, and military control. The populace wants bread, safety, fair judgment, and fewer wars started by people who never bleed in them.',
    strangePlanes: 'Government tries to regulate reality: portals, citizenship across planes, magical pollution, artificial beings, dangerous research, memory crimes, and extradimensional trade. The populace may value freedom, but also fears what unregulated magic can do.',
    mythicGods: 'Government claims to uphold divine order, sacred law, ancestral duty, or prophecy. The populace may accept this when harvests are good and omens are favorable, but doubt grows when rulers use the gods as excuses for cruelty.'
  },
  'war-power-002': {
    heroicRealm: 'The strongest forces include royal armies, knightly orders, mage colleges, temple champions, monster-hunter guilds, mercenary companies, ancient guardians, and warlords with access to relics or dragons. No single force dominates everywhere.',
    ancientEpic: 'The strongest powers are old houses, oathbound hosts, hidden guardians, mountain strongholds, immortal remnants, and armies that still carry banners from a greater age. Their strength is not only numbers, but memory and legitimacy.',
    grittyKingdoms: 'The strongest armies belong to those who can pay, feed, and move soldiers: crown forces, great houses, mercenary captains, religious military orders, naval powers, and merchant leagues. Logistics decide more wars than songs admit.',
    strangePlanes: 'The strongest forces may include planar navies, gatekeepers, construct legions, reality engineers, mercenary species, spell-artillery houses, and factions that control portals. Whoever controls movement between worlds controls war.',
    mythicGods: 'The strongest forces are those with divine backing: sacred armies, hero cults, monster-blooded clans, oracle-led warbands, temple guardians, and champions chosen by gods. A small army with prophecy behind it may terrify an empire.'
  },
  'travel-adventure-monsters-006': {
    heroicRealm: 'The first hook should begin locally: a missing caravan, a ruined shrine, strange lights in the hills, a monster attack, or a faction asking for discreet help. The trail should quickly reveal that a small danger is connected to a larger forgotten power.',
    ancientEpic: 'The first hook should feel like a forgotten song returning: an old tomb opens, a broken oath resurfaces, an heirloom reacts to a name, or a traveler brings news from a ruin no one should have found. The party steps into history before they understand it.',
    grittyKingdoms: 'The first hook should be practical and tense: a tax convoy vanishes, a noble dies suspiciously, grain is stolen, a hostage is taken, a border village is abandoned, or a contract sounds simple but hides a political trap.',
    strangePlanes: 'The first hook should begin with something impossible becoming local: a door opens into the wrong sky, a stranger remembers a city that never existed, a machine dreams, or a district briefly overlaps with another plane and brings something back.',
    mythicGods: 'The first hook should start with an omen: a sacred animal dies, a statue weeps, a monster speaks a prophecy, a festival rite fails, or a god-mark appears on an ordinary person. The danger should feel both immediate and symbolic.'
  }
};

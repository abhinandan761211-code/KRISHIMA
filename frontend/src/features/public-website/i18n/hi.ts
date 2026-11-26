import type { Messages } from "@krishima/ui";

/**
 * Hindi (hi-IN) catalogue for the public website — STRUCTURAL MIRROR.
 *
 * ⚠️ PENDING PROFESSIONAL TRANSLATION (OPEN-QUESTIONS A-15).
 * Every key below exists so the app never renders the raw key id, but the values
 * are NOT translations yet: they are the English strings, each block marked with
 * the `// TODO(hi)` tag. This file is therefore registered with `status: "partial"`
 * in LOCALE_REGISTRY, which makes Hindi **not selectable** by any user. Hindi is
 * offered only once every `// TODO(hi)` tag is removed and the copy has been
 * reviewed by a professional translator. A unit test enforces that the key set
 * stays exactly equal to en.ts, so the two files cannot drift.
 *
 * Do not present this content as Hindi anywhere. See en.ts for the copy rules
 * (no unverified statistics, no claimed government partnership/certification).
 */
export const hi: Messages = {
  /* ---------------------------------------------------------------- common */
  // TODO(hi): translate → common.language
  "common.language": "Language",
  // TODO(hi): translate → common.comingSoon
  "common.comingSoon": "coming soon",
  // TODO(hi): translate → common.questionsContact
  "common.questionsContact": "Questions about this page? Contact us.",

  /* ------------------------------------------------------------------- nav */
  // TODO(hi): translate → nav.home
  "nav.home": "Home",
  // TODO(hi): translate → nav.about
  "nav.about": "About",
  // TODO(hi): translate → nav.services
  "nav.services": "Services",
  // TODO(hi): translate → nav.howItWorks
  "nav.howItWorks": "How it works",
  // TODO(hi): translate → nav.contact
  "nav.contact": "Contact",
  // TODO(hi): translate → nav.faq
  "nav.faq": "FAQ",
  // TODO(hi): translate → nav.help
  "nav.help": "Help",
  // TODO(hi): translate → nav.privacy
  "nav.privacy": "Privacy policy",
  // TODO(hi): translate → nav.terms
  "nav.terms": "Terms of use",
  // TODO(hi): translate → nav.homeLabel
  "nav.homeLabel": "KRISHIMA home",
  // TODO(hi): translate → nav.primaryLabel
  "nav.primaryLabel": "Primary",
  // TODO(hi): translate → nav.openMenu
  "nav.openMenu": "Open menu",
  // TODO(hi): translate → nav.closeMenu
  "nav.closeMenu": "Close menu",
  // TODO(hi): translate → nav.skipToContent
  "nav.skipToContent": "Skip to main content",

  /* ------------------------------------------------------------------- cta */
  // TODO(hi): translate → cta.login
  "cta.login": "Log in",
  // TODO(hi): translate → cta.getStarted
  "cta.getStarted": "Get started",
  // TODO(hi): translate → cta.exploreServices
  "cta.exploreServices": "Explore services",

  /* ---------------------------------------------------------- announcement */
  // TODO(hi): translate → announcement.launch
  "announcement.launch": "KRISHIMA is in active development — here is what we are building.",
  // TODO(hi): translate → announcement.readMore
  "announcement.readMore": "Read more",
  // TODO(hi): translate → announcement.dismiss
  "announcement.dismiss": "Dismiss announcement",

  /* ------------------------------------------------------------------ hero */
  // TODO(hi): translate → hero.eyebrow
  "hero.eyebrow": "An agriculture platform for India",
  // TODO(hi): translate → hero.title
  "hero.title": "Grow smarter. Trade better. Build a stronger future.",
  // TODO(hi): translate → hero.description
  "hero.description":
    "One connected digital platform for farmers, agricultural businesses, workers, and essential farming services.",
  // TODO(hi): translate → hero.supportNote
  "hero.supportNote": "Account creation is being built. You can explore everything the platform will offer today.",
  // TODO(hi): translate → hero.imageAlt
  "hero.imageAlt": "A wheat field at sunrise under a clear sky",
  // TODO(hi): translate → hero.rolesCaption
  "hero.rolesCaption": "Built for",
  // TODO(hi): translate → hero.rolesSummary
  "hero.rolesSummary": "Eight kinds of agricultural work",

  /* -------------------------------------------------------------- platform */
  // TODO(hi): translate → platform.eyebrow
  "platform.eyebrow": "What KRISHIMA is",
  // TODO(hi): translate → platform.title
  "platform.title": "One platform for the whole agricultural value chain",
  // TODO(hi): translate → platform.description
  "platform.description":
    "KRISHIMA connects the people and services that agriculture depends on — from the farm to the buyer, and everything in between — in one trusted, multilingual place.",
  // TODO(hi): translate → platform.points.identity.title
  "platform.points.identity.title": "One identity, many roles",
  // TODO(hi): translate → platform.points.identity.description
  "platform.points.identity.description":
    "A person can be a farmer, a buyer and an equipment owner at the same time. Each role keeps its own data, so nothing is mixed between them.",
  // TODO(hi): translate → platform.points.workspaces.title
  "platform.points.workspaces.title": "Independent workspaces",
  // TODO(hi): translate → platform.points.workspaces.description
  "platform.points.workspaces.description":
    "A personal account and a larger business account can live side by side. Work done in one workspace never leaks into another.",
  // TODO(hi): translate → platform.points.trust.title
  "platform.points.trust.title": "Access by permission",
  // TODO(hi): translate → platform.points.trust.description
  "platform.points.trust.description":
    "Access is denied by default and granted explicitly, checked both in the application and at the database. Sensitive actions are recorded.",

  /* ----------------------------------------------------------------- roles */
  // TODO(hi): translate → roles.eyebrow
  "roles.eyebrow": "Who it is for",
  // TODO(hi): translate → roles.title
  "roles.title": "Eight kinds of work, one platform",
  // TODO(hi): translate → roles.description
  "roles.description":
    "Every participant in agriculture has different needs. Each category below has its own workspace, permissions and tools.",
  // TODO(hi): translate → roles.footnote
  "roles.footnote":
    "These are roles a person can hold, not separate accounts. One login can carry several roles, each with its own workspace.",
  // TODO(hi): translate → roles.learnMore
  "roles.learnMore": "Learn more",

  // TODO(hi): translate → roles.farmer.name
  "roles.farmer.name": "Farmer",
  // TODO(hi): translate → roles.farmer.short
  "roles.farmer.short": "Keep farm records, follow crops and find the services a season needs.",
  // TODO(hi): translate → roles.farmer.headline
  "roles.farmer.headline": "Run your farm with clearer records",
  // TODO(hi): translate → roles.farmer.long
  "roles.farmer.long":
    "KRISHIMA is being built so a farmer can keep plot and crop records in one place, follow the season, and find labour, equipment, transport and storage when they are needed — without losing track of what happened last year.",
  // TODO(hi): translate → roles.farmer.needs
  "roles.farmer.needs": "Farm and plot records, crop timelines, weather, market information and service discovery.",
  // TODO(hi): translate → roles.farmer.requirements
  "roles.farmer.requirements": "An account is all that is needed to keep records. Selling produce will require verification when that service launches.",
  // TODO(hi): translate → roles.farmer.highlights.h1.title
  "roles.farmer.highlights.h1.title": "Farm records",
  // TODO(hi): translate → roles.farmer.highlights.h1.body
  "roles.farmer.highlights.h1.body": "Plots, crops and seasons in one place instead of scattered notes.",
  // TODO(hi): translate → roles.farmer.highlights.h2.title
  "roles.farmer.highlights.h2.title": "Crop tracking",
  // TODO(hi): translate → roles.farmer.highlights.h2.body
  "roles.farmer.highlights.h2.body": "Follow each crop from sowing through harvest.",
  // TODO(hi): translate → roles.farmer.highlights.h3.title
  "roles.farmer.highlights.h3.title": "Market information",
  // TODO(hi): translate → roles.farmer.highlights.h3.body
  "roles.farmer.highlights.h3.body": "Understand prices before deciding when to sell.",
  // TODO(hi): translate → roles.farmer.highlights.h4.title
  "roles.farmer.highlights.h4.title": "Services nearby",
  // TODO(hi): translate → roles.farmer.highlights.h4.body
  "roles.farmer.highlights.h4.body": "Find labour, equipment, transport and storage in one search.",
  // TODO(hi): translate → roles.farmer.seo.title
  "roles.farmer.seo.title": "KRISHIMA for farmers",
  // TODO(hi): translate → roles.farmer.seo.description
  "roles.farmer.seo.description": "Farm records, crop tracking, weather, market information and service discovery in one platform.",

  // TODO(hi): translate → roles.buyer.name
  "roles.buyer.name": "Buyer",
  // TODO(hi): translate → roles.buyer.short
  "roles.buyer.short": "Discover produce and agricultural inputs from verified sellers.",
  // TODO(hi): translate → roles.buyer.headline
  "roles.buyer.headline": "Find produce and inputs with confidence",
  // TODO(hi): translate → roles.buyer.long
  "roles.buyer.long":
    "Buyers will be able to browse agricultural produce and inputs, filter by category and location, and see which sellers have completed verification — so a purchase decision rests on facts, not guesswork.",
  // TODO(hi): translate → roles.buyer.needs
  "roles.buyer.needs": "A clear catalogue, honest seller verification, and records of what was agreed.",
  // TODO(hi): translate → roles.buyer.requirements
  "roles.buyer.requirements": "Browsing will be open. Placing orders will require verification once ordering launches.",
  // TODO(hi): translate → roles.buyer.highlights.h1.title
  "roles.buyer.highlights.h1.title": "Search that fits agriculture",
  // TODO(hi): translate → roles.buyer.highlights.h1.body
  "roles.buyer.highlights.h1.body": "Filter by crop, quantity and location rather than generic keywords.",
  // TODO(hi): translate → roles.buyer.highlights.h2.title
  "roles.buyer.highlights.h2.title": "Verified sellers",
  // TODO(hi): translate → roles.buyer.highlights.h2.body
  "roles.buyer.highlights.h2.body": "Verification status shown clearly on every listing.",
  // TODO(hi): translate → roles.buyer.highlights.h3.title
  "roles.buyer.highlights.h3.title": "Clear quantities and units",
  // TODO(hi): translate → roles.buyer.highlights.h3.body
  "roles.buyer.highlights.h3.body": "Controlled units so a quintal never becomes a guess.",
  // TODO(hi): translate → roles.buyer.highlights.h4.title
  "roles.buyer.highlights.h4.title": "Records you can refer to",
  // TODO(hi): translate → roles.buyer.highlights.h4.body
  "roles.buyer.highlights.h4.body": "What was listed stays on record, unchanged after the fact.",
  // TODO(hi): translate → roles.buyer.seo.title
  "roles.buyer.seo.title": "KRISHIMA for buyers",
  // TODO(hi): translate → roles.buyer.seo.description
  "roles.buyer.seo.description": "Browse agricultural produce and inputs from verified sellers with clear quantities and units.",

  // TODO(hi): translate → roles.retailer.name
  "roles.retailer.name": "Retailer",
  // TODO(hi): translate → roles.retailer.short
  "roles.retailer.short": "Source agricultural stock for a shop or a distribution business.",
  // TODO(hi): translate → roles.retailer.headline
  "roles.retailer.headline": "Source stock for your business",
  // TODO(hi): translate → roles.retailer.long
  "roles.retailer.long":
    "Retailers will be able to source produce and inputs in the quantities a shop actually needs, keep a record of suppliers, and present a business identity that buyers and sellers can recognise.",
  // TODO(hi): translate → roles.retailer.needs
  "roles.retailer.needs": "Business verification, repeatable sourcing, and a clear record of suppliers.",
  // TODO(hi): translate → roles.retailer.requirements
  "roles.retailer.requirements": "Business verification will be required before trading, reflecting the trust a shop needs to carry.",
  // TODO(hi): translate → roles.retailer.highlights.h1.title
  "roles.retailer.highlights.h1.title": "Business identity",
  // TODO(hi): translate → roles.retailer.highlights.h1.body
  "roles.retailer.highlights.h1.body": "A verified business profile, separate from a personal account.",
  // TODO(hi): translate → roles.retailer.highlights.h2.title
  "roles.retailer.highlights.h2.title": "Bulk quantities",
  // TODO(hi): translate → roles.retailer.highlights.h2.body
  "roles.retailer.highlights.h2.body": "Quantities expressed in units a shop actually trades in.",
  // TODO(hi): translate → roles.retailer.highlights.h3.title
  "roles.retailer.highlights.h3.title": "Supplier history",
  // TODO(hi): translate → roles.retailer.highlights.h3.body
  "roles.retailer.highlights.h3.body": "Know who supplied what, and when.",
  // TODO(hi): translate → roles.retailer.highlights.h4.title
  "roles.retailer.highlights.h4.title": "Organization workspace",
  // TODO(hi): translate → roles.retailer.highlights.h4.body
  "roles.retailer.highlights.h4.body": "Staff can work in one business workspace with separate permissions.",
  // TODO(hi): translate → roles.retailer.seo.title
  "roles.retailer.seo.title": "KRISHIMA for retailers",
  // TODO(hi): translate → roles.retailer.seo.description
  "roles.retailer.seo.description": "Source agricultural stock with a verified business identity and clear supplier records.",

  // TODO(hi): translate → roles.worker.name
  "roles.worker.name": "Worker",
  // TODO(hi): translate → roles.worker.short
  "roles.worker.short": "Find farm work and keep a record of the work you have done.",
  // TODO(hi): translate → roles.worker.headline
  "roles.worker.headline": "Find work and keep a record of it",
  // TODO(hi): translate → roles.worker.long
  "roles.worker.long":
    "Workers will be able to see farm work available nearby, apply for it, and keep a record of engagements — a simple history that makes the next opportunity easier to find.",
  // TODO(hi): translate → roles.worker.needs
  "roles.worker.needs": "Work listings that are nearby and real, plus a record of engagements.",
  // TODO(hi): translate → roles.worker.requirements
  "roles.worker.requirements": "A phone-verified account. Work history starts building with the first engagement.",
  // TODO(hi): translate → roles.worker.highlights.h1.title
  "roles.worker.highlights.h1.title": "Work nearby",
  // TODO(hi): translate → roles.worker.highlights.h1.body
  "roles.worker.highlights.h1.body": "See work that is within reach, not hundreds of kilometres away.",
  // TODO(hi): translate → roles.worker.highlights.h2.title
  "roles.worker.highlights.h2.title": "Apply once",
  // TODO(hi): translate → roles.worker.highlights.h2.body
  "roles.worker.highlights.h2.body": "One application per job — no duplicate applications.",
  // TODO(hi): translate → roles.worker.highlights.h3.title
  "roles.worker.highlights.h3.title": "Work history",
  // TODO(hi): translate → roles.worker.highlights.h3.body
  "roles.worker.highlights.h3.body": "A record of engagements you can point to.",
  // TODO(hi): translate → roles.worker.highlights.h4.title
  "roles.worker.highlights.h4.title": "Clear terms",
  // TODO(hi): translate → roles.worker.highlights.h4.body
  "roles.worker.highlights.h4.body": "What the work involves and how it is settled, stated up front.",
  // TODO(hi): translate → roles.worker.seo.title
  "roles.worker.seo.title": "KRISHIMA for farm workers",
  // TODO(hi): translate → roles.worker.seo.description
  "roles.worker.seo.description": "Find farm work nearby and keep a record of the engagements you complete.",

  // TODO(hi): translate → roles.equipment.name
  "roles.equipment.name": "Equipment owner",
  // TODO(hi): translate → roles.equipment.short
  "roles.equipment.short": "Offer tractors, pumps and machinery to farms that need them.",
  // TODO(hi): translate → roles.equipment.headline
  "roles.equipment.headline": "Put your machinery to work",
  // TODO(hi): translate → roles.equipment.long
  "roles.equipment.long":
    "Equipment owners will be able to list machines, set availability, and take bookings without two farmers ever being promised the same machine at the same time.",
  // TODO(hi): translate → roles.equipment.needs
  "roles.equipment.needs": "Listings with real availability, and bookings that cannot overlap.",
  // TODO(hi): translate → roles.equipment.requirements
  "roles.equipment.requirements": "Owner verification will be required before taking bookings.",
  // TODO(hi): translate → roles.equipment.highlights.h1.title
  "roles.equipment.highlights.h1.title": "Machine listings",
  // TODO(hi): translate → roles.equipment.highlights.h1.body
  "roles.equipment.highlights.h1.body": "Describe what you own and when it is free.",
  // TODO(hi): translate → roles.equipment.highlights.h2.title
  "roles.equipment.highlights.h2.title": "No double bookings",
  // TODO(hi): translate → roles.equipment.highlights.h2.body
  "roles.equipment.highlights.h2.body": "Overlapping bookings are prevented at the database level.",
  // TODO(hi): translate → roles.equipment.highlights.h3.title
  "roles.equipment.highlights.h3.title": "Rental history",
  // TODO(hi): translate → roles.equipment.highlights.h3.body
  "roles.equipment.highlights.h3.body": "A record of what was rented and when.",
  // TODO(hi): translate → roles.equipment.highlights.h4.title
  "roles.equipment.highlights.h4.title": "Reach nearby farms",
  // TODO(hi): translate → roles.equipment.highlights.h4.body
  "roles.equipment.highlights.h4.body": "Machines found by the people close enough to use them.",
  // TODO(hi): translate → roles.equipment.seo.title
  "roles.equipment.seo.title": "KRISHIMA for equipment owners",
  // TODO(hi): translate → roles.equipment.seo.description
  "roles.equipment.seo.description": "List tractors and machinery, set availability and take bookings that cannot overlap.",

  // TODO(hi): translate → roles.transporter.name
  "roles.transporter.name": "Transporter",
  // TODO(hi): translate → roles.transporter.short
  "roles.transporter.short": "Move produce and inputs between farm, market and warehouse.",
  // TODO(hi): translate → roles.transporter.headline
  "roles.transporter.headline": "Move what agriculture grows",
  // TODO(hi): translate → roles.transporter.long
  "roles.transporter.long":
    "Transporters will be able to see movement requests that fit their route and capacity, and agree terms before a load is committed.",
  // TODO(hi): translate → roles.transporter.needs
  "roles.transporter.needs": "Requests that match a real route, and terms agreed before the load moves.",
  // TODO(hi): translate → roles.transporter.requirements
  "roles.transporter.requirements": "Vehicle and identity verification will be required before accepting loads.",
  // TODO(hi): translate → roles.transporter.highlights.h1.title
  "roles.transporter.highlights.h1.title": "Loads that fit",
  // TODO(hi): translate → roles.transporter.highlights.h1.body
  "roles.transporter.highlights.h1.body": "Requests matched to your route and capacity.",
  // TODO(hi): translate → roles.transporter.highlights.h2.title
  "roles.transporter.highlights.h2.title": "Terms before movement",
  // TODO(hi): translate → roles.transporter.highlights.h2.body
  "roles.transporter.highlights.h2.body": "What is carried and how it is settled, agreed in advance.",
  // TODO(hi): translate → roles.transporter.highlights.h3.title
  "roles.transporter.highlights.h3.title": "Delivery records",
  // TODO(hi): translate → roles.transporter.highlights.h3.body
  "roles.transporter.highlights.h3.body": "A record of each completed movement.",
  // TODO(hi): translate → roles.transporter.highlights.h4.title
  "roles.transporter.highlights.h4.title": "Vehicle verification",
  // TODO(hi): translate → roles.transporter.highlights.h4.body
  "roles.transporter.highlights.h4.body": "Verified vehicles build trust on both sides.",
  // TODO(hi): translate → roles.transporter.seo.title
  "roles.transporter.seo.title": "KRISHIMA for transporters",
  // TODO(hi): translate → roles.transporter.seo.description
  "roles.transporter.seo.description": "Find agricultural loads that fit your route and agree terms before moving them.",

  // TODO(hi): translate → roles.warehouse.name
  "roles.warehouse.name": "Warehouse",
  // TODO(hi): translate → roles.warehouse.short
  "roles.warehouse.short": "Offer storage for produce between harvest and sale.",
  // TODO(hi): translate → roles.warehouse.headline
  "roles.warehouse.headline": "Offer storage farmers can rely on",
  // TODO(hi): translate → roles.warehouse.long
  "roles.warehouse.long":
    "Warehouses will be able to publish capacity, accept storage requests, and keep an accurate record of what is held and for how long.",
  // TODO(hi): translate → roles.warehouse.needs
  "roles.warehouse.needs": "Accurate capacity, clear storage terms, and a record of what is held.",
  // TODO(hi): translate → roles.warehouse.requirements
  "roles.warehouse.requirements": "Facility verification will be required before accepting produce.",
  // TODO(hi): translate → roles.warehouse.highlights.h1.title
  "roles.warehouse.highlights.h1.title": "Publish capacity",
  // TODO(hi): translate → roles.warehouse.highlights.h1.body
  "roles.warehouse.highlights.h1.body": "Show what space is genuinely available.",
  // TODO(hi): translate → roles.warehouse.highlights.h2.title
  "roles.warehouse.highlights.h2.title": "Storage terms",
  // TODO(hi): translate → roles.warehouse.highlights.h2.body
  "roles.warehouse.highlights.h2.body": "Duration and conditions stated before produce arrives.",
  // TODO(hi): translate → roles.warehouse.highlights.h3.title
  "roles.warehouse.highlights.h3.title": "Accurate records",
  // TODO(hi): translate → roles.warehouse.highlights.h3.body
  "roles.warehouse.highlights.h3.body": "Know what is held, and since when.",
  // TODO(hi): translate → roles.warehouse.highlights.h4.title
  "roles.warehouse.highlights.h4.title": "No overbooking",
  // TODO(hi): translate → roles.warehouse.highlights.h4.body
  "roles.warehouse.highlights.h4.body": "Capacity is checked when a request is accepted.",
  // TODO(hi): translate → roles.warehouse.seo.title
  "roles.warehouse.seo.title": "KRISHIMA for warehouses",
  // TODO(hi): translate → roles.warehouse.seo.description
  "roles.warehouse.seo.description": "Publish storage capacity, accept storage requests and keep accurate records of what is held.",

  // TODO(hi): translate → roles.creator.name
  "roles.creator.name": "Content creator",
  // TODO(hi): translate → roles.creator.short
  "roles.creator.short": "Share agricultural knowledge through writing and video.",
  // TODO(hi): translate → roles.creator.headline
  "roles.creator.headline": "Share what you know about farming",
  // TODO(hi): translate → roles.creator.long
  "roles.creator.long":
    "Creators will be able to publish agricultural knowledge and video learning for people who need it in their own language — practical guidance rather than noise.",
  // TODO(hi): translate → roles.creator.needs
  "roles.creator.needs": "A place to publish, and an audience that can find the work in their language.",
  // TODO(hi): translate → roles.creator.requirements
  "roles.creator.requirements": "A verified account. Published material follows a moderation policy.",
  // TODO(hi): translate → roles.creator.highlights.h1.title
  "roles.creator.highlights.h1.title": "Written knowledge",
  // TODO(hi): translate → roles.creator.highlights.h1.body
  "roles.creator.highlights.h1.body": "Practical guidance organised by crop and season.",
  // TODO(hi): translate → roles.creator.highlights.h2.title
  "roles.creator.highlights.h2.title": "Video learning",
  // TODO(hi): translate → roles.creator.highlights.h2.body
  "roles.creator.highlights.h2.body": "Short, useful video for people who learn by watching.",
  // TODO(hi): translate → roles.creator.highlights.h3.title
  "roles.creator.highlights.h3.title": "Local languages",
  // TODO(hi): translate → roles.creator.highlights.h3.body
  "roles.creator.highlights.h3.body": "Knowledge that reaches people in the language they use.",
  // TODO(hi): translate → roles.creator.highlights.h4.title
  "roles.creator.highlights.h4.title": "Moderated publishing",
  // TODO(hi): translate → roles.creator.highlights.h4.body
  "roles.creator.highlights.h4.body": "A clear policy keeps advice trustworthy.",
  // TODO(hi): translate → roles.creator.seo.title
  "roles.creator.seo.title": "KRISHIMA for content creators",
  // TODO(hi): translate → roles.creator.seo.description
  "roles.creator.seo.description": "Publish agricultural knowledge and video learning for people in their own language.",

  /* -------------------------------------------------------------- features */
  // TODO(hi): translate → features.eyebrow
  "features.eyebrow": "Platform features",
  // TODO(hi): translate → features.title
  "features.title": "What the platform will bring together",
  // TODO(hi): translate → features.description
  "features.description":
    "Ten connected areas, designed to work as one system rather than ten separate apps. Each one is labelled with its real status.",
  // TODO(hi): translate → features.planned
  "features.planned": "Planned",
  // TODO(hi): translate → features.legend
  "features.legend": "means the feature is being built and is not usable yet.",

  // TODO(hi): translate → features.farmManagement.title
  "features.farmManagement.title": "Farm management",
  // TODO(hi): translate → features.farmManagement.description
  "features.farmManagement.description": "Plots, seasons and records kept in one place instead of scattered notes.",
  // TODO(hi): translate → features.cropManagement.title
  "features.cropManagement.title": "Crop management",
  // TODO(hi): translate → features.cropManagement.description
  "features.cropManagement.description": "Follow each crop from sowing through harvest, with what was done and when.",
  // TODO(hi): translate → features.weather.title
  "features.weather.title": "Weather information",
  // TODO(hi): translate → features.weather.description
  "features.weather.description": "Local conditions to plan sowing, spraying and harvest around.",
  // TODO(hi): translate → features.mandiPrices.title
  "features.mandiPrices.title": "Mandi prices",
  // TODO(hi): translate → features.mandiPrices.description
  "features.mandiPrices.description": "Market prices to inform when and where to sell.",
  // TODO(hi): translate → features.marketplace.title
  "features.marketplace.title": "Agriculture marketplace",
  // TODO(hi): translate → features.marketplace.description
  "features.marketplace.description": "Produce and inputs listed with clear quantities, units and seller verification.",
  // TODO(hi): translate → features.equipmentRental.title
  "features.equipmentRental.title": "Equipment rental",
  // TODO(hi): translate → features.equipmentRental.description
  "features.equipmentRental.description": "Tractors and machinery available nearby, with bookings that cannot overlap.",
  // TODO(hi): translate → features.employment.title
  "features.employment.title": "Farm employment",
  // TODO(hi): translate → features.employment.description
  "features.employment.description": "Work offered and found nearby, with one application per job.",
  // TODO(hi): translate → features.transport.title
  "features.transport.title": "Transport services",
  // TODO(hi): translate → features.transport.description
  "features.transport.description": "Move produce between farm, market and warehouse with terms agreed first.",
  // TODO(hi): translate → features.warehouse.title
  "features.warehouse.title": "Warehouse services",
  // TODO(hi): translate → features.warehouse.description
  "features.warehouse.description": "Storage with published capacity and accurate records of what is held.",
  // TODO(hi): translate → features.knowledge.title
  "features.knowledge.title": "Knowledge and community",
  // TODO(hi): translate → features.knowledge.description
  "features.knowledge.description": "Practical agricultural guidance and learning, in the languages people actually use.",

  /* ------------------------------------------------------------- ecosystem */
  // TODO(hi): translate → ecosystem.eyebrow
  "ecosystem.eyebrow": "The connected ecosystem",
  // TODO(hi): translate → ecosystem.title
  "ecosystem.title": "How the participants connect",
  // TODO(hi): translate → ecosystem.description
  "ecosystem.description":
    "Agriculture is a chain of relationships, not isolated transactions. KRISHIMA is designed so each participant can reach the next without leaving the platform.",
  // TODO(hi): translate → ecosystem.hub
  "ecosystem.hub": "KRISHIMA",
  // TODO(hi): translate → ecosystem.nodes.farmer
  "ecosystem.nodes.farmer": "Farmer",
  // TODO(hi): translate → ecosystem.nodes.buyer
  "ecosystem.nodes.buyer": "Buyer",
  // TODO(hi): translate → ecosystem.nodes.retailer
  "ecosystem.nodes.retailer": "Retailer",
  // TODO(hi): translate → ecosystem.nodes.worker
  "ecosystem.nodes.worker": "Worker",
  // TODO(hi): translate → ecosystem.nodes.equipment
  "ecosystem.nodes.equipment": "Equipment",
  // TODO(hi): translate → ecosystem.nodes.transporter
  "ecosystem.nodes.transporter": "Transport",
  // TODO(hi): translate → ecosystem.nodes.warehouse
  "ecosystem.nodes.warehouse": "Warehouse",
  // TODO(hi): translate → ecosystem.nodes.creator
  "ecosystem.nodes.creator": "Creator",
  // TODO(hi): translate → ecosystem.links.farmer.from
  "ecosystem.links.farmer.from": "Farmer",
  // TODO(hi): translate → ecosystem.links.farmer.relation
  "ecosystem.links.farmer.relation": "lists produce, hires labour and equipment, and arranges transport and storage.",
  // TODO(hi): translate → ecosystem.links.buyer.from
  "ecosystem.links.buyer.from": "Buyer",
  // TODO(hi): translate → ecosystem.links.buyer.relation
  "ecosystem.links.buyer.relation": "discovers produce and inputs from verified sellers.",
  // TODO(hi): translate → ecosystem.links.retailer.from
  "ecosystem.links.retailer.from": "Retailer",
  // TODO(hi): translate → ecosystem.links.retailer.relation
  "ecosystem.links.retailer.relation": "sources stock in the quantities a business needs.",
  // TODO(hi): translate → ecosystem.links.worker.from
  "ecosystem.links.worker.from": "Worker",
  // TODO(hi): translate → ecosystem.links.worker.relation
  "ecosystem.links.worker.relation": "finds work nearby and builds a record of engagements.",
  // TODO(hi): translate → ecosystem.links.equipment.from
  "ecosystem.links.equipment.from": "Equipment owner",
  // TODO(hi): translate → ecosystem.links.equipment.relation
  "ecosystem.links.equipment.relation": "offers machinery to farms that need it, without double bookings.",
  // TODO(hi): translate → ecosystem.links.transporter.from
  "ecosystem.links.transporter.from": "Transporter",
  // TODO(hi): translate → ecosystem.links.transporter.relation
  "ecosystem.links.transporter.relation": "moves produce and inputs between farm, market and warehouse.",
  // TODO(hi): translate → ecosystem.links.warehouse.from
  "ecosystem.links.warehouse.from": "Warehouse",
  // TODO(hi): translate → ecosystem.links.warehouse.relation
  "ecosystem.links.warehouse.relation": "stores produce between harvest and sale with accurate records.",
  // TODO(hi): translate → ecosystem.links.creator.from
  "ecosystem.links.creator.from": "Content creator",
  // TODO(hi): translate → ecosystem.links.creator.relation
  "ecosystem.links.creator.relation": "shares practical knowledge in the languages people use.",

  /* ------------------------------------------------------------------- how */
  // TODO(hi): translate → how.eyebrow
  "how.eyebrow": "How it works",
  // TODO(hi): translate → how.title
  "how.title": "From account to activity, in four steps",
  // TODO(hi): translate → how.description
  "how.description": "A short journey that works the same way for every role.",
  // TODO(hi): translate → how.stepLabel
  "how.stepLabel": "Step",
  // TODO(hi): translate → how.availableNow
  "how.availableNow": "Available now",
  // TODO(hi): translate → how.note
  "how.note":
    "The account foundation exists today. The workspaces and services described below are being built — nothing here is presented as live until it is.",
  // TODO(hi): translate → how.seeFaq
  "how.seeFaq": "See common questions",
  // TODO(hi): translate → how.steps.account.title
  "how.steps.account.title": "Create an account",
  // TODO(hi): translate → how.steps.account.description
  "how.steps.account.description": "One identity, with a personal workspace ready from the start.",
  // TODO(hi): translate → how.steps.workspace.title
  "how.steps.workspace.title": "Choose a workspace",
  // TODO(hi): translate → how.steps.workspace.description
  "how.steps.workspace.description": "Work as yourself, or join an organization with its own members and permissions.",
  // TODO(hi): translate → how.steps.discover.title
  "how.steps.discover.title": "Discover tools and services",
  // TODO(hi): translate → how.steps.discover.description
  "how.steps.discover.description": "Find the records, information and services that fit what you do.",
  // TODO(hi): translate → how.steps.connect.title
  "how.steps.connect.title": "Connect and manage activity",
  // TODO(hi): translate → how.steps.connect.description
  "how.steps.connect.description": "Work with other participants and keep a record of what was agreed.",

  /* ------------------------------------------------------------ solutions */
  // TODO(hi): translate → solutions.farmer.eyebrow
  "solutions.farmer.eyebrow": "Farmer solutions",
  // TODO(hi): translate → solutions.farmer.title
  "solutions.farmer.title": "The farmer experience we are building",
  // TODO(hi): translate → solutions.farmer.description
  "solutions.farmer.description":
    "Records that stay useful across seasons, and services that can be found when they are needed.",
  // TODO(hi): translate → solutions.farmer.statusNote
  "solutions.farmer.statusNote": "Every item below is planned. None of these tools is live yet.",
  // TODO(hi): translate → solutions.farmer.items.records.title
  "solutions.farmer.items.records.title": "Farm records",
  // TODO(hi): translate → solutions.farmer.items.records.description
  "solutions.farmer.items.records.description": "Plots, crops and seasons kept in one place.",
  // TODO(hi): translate → solutions.farmer.items.crops.title
  "solutions.farmer.items.crops.title": "Crop tracking",
  // TODO(hi): translate → solutions.farmer.items.crops.description
  "solutions.farmer.items.crops.description": "Each crop followed from sowing through harvest.",
  // TODO(hi): translate → solutions.farmer.items.weather.title
  "solutions.farmer.items.weather.title": "Weather",
  // TODO(hi): translate → solutions.farmer.items.weather.description
  "solutions.farmer.items.weather.description": "Local conditions for planning field work.",
  // TODO(hi): translate → solutions.farmer.items.market.title
  "solutions.farmer.items.market.title": "Market information",
  // TODO(hi): translate → solutions.farmer.items.market.description
  "solutions.farmer.items.market.description": "Prices to inform when and where to sell.",
  // TODO(hi): translate → solutions.farmer.items.harvest.title
  "solutions.farmer.items.harvest.title": "Harvest management",
  // TODO(hi): translate → solutions.farmer.items.harvest.description
  "solutions.farmer.items.harvest.description": "What was harvested, and what happened to it.",
  // TODO(hi): translate → solutions.farmer.items.services.title
  "solutions.farmer.items.services.title": "Service discovery",
  // TODO(hi): translate → solutions.farmer.items.services.description
  "solutions.farmer.items.services.description": "Labour, equipment, transport and storage in one search.",
  // TODO(hi): translate → solutions.seeFarmer
  "solutions.seeFarmer": "More for farmers",

  // TODO(hi): translate → solutions.business.eyebrow
  "solutions.business.eyebrow": "Business solutions",
  // TODO(hi): translate → solutions.business.title
  "solutions.business.title": "What businesses gain from the platform",
  // TODO(hi): translate → solutions.business.description
  "solutions.business.description":
    "Buyers, retailers, transporters, equipment providers and warehouses all need the same thing: a reliable counterparty and a clear record.",
  // TODO(hi): translate → solutions.business.statusNote
  "solutions.business.statusNote": "Every item below is planned. None of these tools is live yet.",
  // TODO(hi): translate → solutions.business.items.buyers.title
  "solutions.business.items.buyers.title": "Buyers",
  // TODO(hi): translate → solutions.business.items.buyers.description
  "solutions.business.items.buyers.description": "A catalogue with clear quantities and verified sellers.",
  // TODO(hi): translate → solutions.business.items.retailers.title
  "solutions.business.items.retailers.title": "Retailers",
  // TODO(hi): translate → solutions.business.items.retailers.description
  "solutions.business.items.retailers.description": "Business identity and repeatable sourcing.",
  // TODO(hi): translate → solutions.business.items.transport.title
  "solutions.business.items.transport.title": "Transport companies",
  // TODO(hi): translate → solutions.business.items.transport.description
  "solutions.business.items.transport.description": "Loads matched to route and capacity.",
  // TODO(hi): translate → solutions.business.items.equipment.title
  "solutions.business.items.equipment.title": "Equipment providers",
  // TODO(hi): translate → solutions.business.items.equipment.description
  "solutions.business.items.equipment.description": "Machinery bookings that cannot overlap.",
  // TODO(hi): translate → solutions.business.items.warehouses.title
  "solutions.business.items.warehouses.title": "Warehouses",
  // TODO(hi): translate → solutions.business.items.warehouses.description
  "solutions.business.items.warehouses.description": "Published capacity with accurate records.",
  // TODO(hi): translate → solutions.business.items.partners.title
  "solutions.business.items.partners.title": "Other partners",
  // TODO(hi): translate → solutions.business.items.partners.description
  "solutions.business.items.partners.description": "Organizations with their own members, roles and permissions.",
  // TODO(hi): translate → solutions.seeBusiness
  "solutions.seeBusiness": "More for businesses",

  /* --------------------------------------------------------------- preview */
  // TODO(hi): translate → preview.eyebrow
  "preview.eyebrow": "Marketplace preview",
  // TODO(hi): translate → preview.title
  "preview.title": "A first look at how listings will work",
  // TODO(hi): translate → preview.description
  "preview.description":
    "This is a design concept, not live inventory. It shows the shape of a listing: crop, quantity, unit and price.",
  // TODO(hi): translate → preview.illustrative
  "preview.illustrative": "Illustrative only",
  // TODO(hi): translate → preview.illustrativeNote
  "preview.illustrativeNote": "Sample content for design purposes. No real listings, sellers or prices.",
  // TODO(hi): translate → preview.sampleMeta
  "preview.sampleMeta": "Sample listing",
  // TODO(hi): translate → preview.rows.wheat.name
  "preview.rows.wheat.name": "Wheat",
  // TODO(hi): translate → preview.rows.wheat.price
  "preview.rows.wheat.price": "₹ — sample",
  // TODO(hi): translate → preview.rows.paddy.name
  "preview.rows.paddy.name": "Paddy",
  // TODO(hi): translate → preview.rows.paddy.price
  "preview.rows.paddy.price": "₹ — sample",
  // TODO(hi): translate → preview.rows.tomato.name
  "preview.rows.tomato.name": "Tomato",
  // TODO(hi): translate → preview.rows.tomato.price
  "preview.rows.tomato.price": "₹ — sample",
  // TODO(hi): translate → preview.side.title
  "preview.side.title": "How listings will work",
  // TODO(hi): translate → preview.side.filters
  "preview.side.filters": "Filters by crop, location and quantity.",
  // TODO(hi): translate → preview.side.verified
  "preview.side.verified": "Seller verification shown on every listing.",
  // TODO(hi): translate → preview.side.units
  "preview.side.units": "Controlled units, so a quintal is always a quintal.",
  // TODO(hi): translate → preview.side.disclaimer
  "preview.side.disclaimer": "Prices will come from real listings once the marketplace launches.",

  /* ------------------------------------------------------------- community */
  // TODO(hi): translate → community.eyebrow
  "community.eyebrow": "Community and knowledge",
  // TODO(hi): translate → community.title
  "community.title": "Learning that reaches the people who need it",
  // TODO(hi): translate → community.description
  "community.description":
    "Practical agricultural knowledge is often hard to find in the right language. This area is being designed to change that.",
  // TODO(hi): translate → community.statusNote
  "community.statusNote": "Community features are planned. There is no social feed or publishing available yet.",
  // TODO(hi): translate → community.pillars.knowledge.title
  "community.pillars.knowledge.title": "Knowledge",
  // TODO(hi): translate → community.pillars.knowledge.description
  "community.pillars.knowledge.description": "Practical guidance organised by crop and season, not scattered posts.",
  // TODO(hi): translate → community.pillars.video.title
  "community.pillars.video.title": "Video learning",
  // TODO(hi): translate → community.pillars.video.description
  "community.pillars.video.description": "Short, useful video for people who learn by watching.",
  // TODO(hi): translate → community.pillars.community.title
  "community.pillars.community.title": "Community",
  // TODO(hi): translate → community.pillars.community.description
  "community.pillars.community.description": "A place to ask and answer, moderated so advice stays trustworthy.",

  /* ----------------------------------------------------------------- trust */
  // TODO(hi): translate → trust.eyebrow
  "trust.eyebrow": "Trust and security",
  // TODO(hi): translate → trust.title
  "trust.title": "What is protected today, and what is coming",
  // TODO(hi): translate → trust.description
  "trust.description":
    "We separate what is actually implemented from what is planned. Nothing below is a certification or a guarantee.",
  // TODO(hi): translate → trust.implementedTitle
  "trust.implementedTitle": "Implemented today",
  // TODO(hi): translate → trust.plannedTitle
  "trust.plannedTitle": "Planned",
  // TODO(hi): translate → trust.implemented.auth.title
  "trust.implemented.auth.title": "Verified sign-in",
  // TODO(hi): translate → trust.implemented.auth.description
  "trust.implemented.auth.description":
    "Tokens are verified against the identity provider's published keys. Forged, expired and wrongly addressed tokens are rejected.",
  // TODO(hi): translate → trust.implemented.access.title
  "trust.implemented.access.title": "Deny-by-default access",
  // TODO(hi): translate → trust.implemented.access.description
  "trust.implemented.access.description":
    "Every protected action needs an explicit permission, checked in the application and enforced again at the database.",
  // TODO(hi): translate → trust.implemented.storage.title
  "trust.implemented.storage.title": "Private document storage",
  // TODO(hi): translate → trust.implemented.storage.description
  "trust.implemented.storage.description":
    "Private files are not publicly listable or downloadable; access is time-limited and deliberate.",
  // TODO(hi): translate → trust.implemented.privacy.title
  "trust.implemented.privacy.title": "Careful handling of data",
  // TODO(hi): translate → trust.implemented.privacy.description
  "trust.implemented.privacy.description":
    "Logs and error responses are written to avoid exposing personal details, credentials or internal addresses.",
  // TODO(hi): translate → trust.planned.kyc.title
  "trust.planned.kyc.title": "Verification (KYC)",
  // TODO(hi): translate → trust.planned.kyc.description
  "trust.planned.kyc.description":
    "Seller, business, vehicle and facility verification with a review queue. Planned, not live.",
  // TODO(hi): translate → trust.planned.audit.title
  "trust.planned.audit.title": "Audit trail",
  // TODO(hi): translate → trust.planned.audit.description
  "trust.planned.audit.description":
    "A record of sensitive actions such as role changes and verification decisions. Planned, not live.",
  // TODO(hi): translate → trust.planned.moderation.title
  "trust.planned.moderation.title": "Moderation",
  // TODO(hi): translate → trust.planned.moderation.description
  "trust.planned.moderation.description":
    "Review of listings and published material. Planned, not live.",
  // TODO(hi): translate → trust.disclaimer
  "trust.disclaimer":
    "KRISHIMA makes no claim of government certification, partnership or formal compliance at this stage. Those would only ever be stated with evidence.",

  /* ------------------------------------------------------------------- faq */
  // TODO(hi): translate → faq.eyebrow
  "faq.eyebrow": "Frequently asked questions",
  // TODO(hi): translate → faq.title
  "faq.title": "Questions people actually ask",
  // TODO(hi): translate → faq.description
  "faq.description": "Short, direct answers about accounts, services and what is available today.",
  // TODO(hi): translate → faq.pageDescription
  "faq.pageDescription": "Practical answers about account types, services, availability and support.",
  // TODO(hi): translate → faq.moreQuestions
  "faq.moreQuestions": "Still have a question?",
  // TODO(hi): translate → faq.contactUs
  "faq.contactUs": "Contact us",
  // TODO(hi): translate → faq.items.accounts.question
  "faq.items.accounts.question": "Are these separate accounts?",
  // TODO(hi): translate → faq.items.accounts.answer
  "faq.items.accounts.answer":
    "No. A farmer, buyer or equipment owner is a role a person holds, not a separate login. One identity can carry several roles, each with its own workspace and permissions.",
  // TODO(hi): translate → faq.items.availability.question
  "faq.items.availability.question": "Is the platform available now?",
  // TODO(hi): translate → faq.items.availability.answer
  "faq.items.availability.answer":
    "The public website is live and the account foundation is built. The agricultural services described here are being built and are labelled as planned wherever they appear.",
  // TODO(hi): translate → faq.items.services.question
  "faq.items.services.question": "Which services will be offered first?",
  // TODO(hi): translate → faq.items.services.answer
  "faq.items.services.answer":
    "Farm and crop records, market and weather information, and the marketplace are the first areas in development. Labour, equipment, transport, warehouse and knowledge follow.",
  // TODO(hi): translate → faq.items.cost.question
  "faq.items.cost.question": "How much will it cost?",
  // TODO(hi): translate → faq.items.cost.answer
  "faq.items.cost.answer":
    "Pricing has not been finalised, so we are not quoting figures. When pricing is decided it will be published clearly before anything is charged.",
  // TODO(hi): translate → faq.items.support.question
  "faq.items.support.question": "How do I get help?",
  // TODO(hi): translate → faq.items.support.answer
  "faq.items.support.answer":
    "Use the help page for guidance on this website. A support channel for platform accounts will be published when account creation opens.",
  // TODO(hi): translate → faq.items.data.question
  "faq.items.data.question": "What happens to my data?",
  // TODO(hi): translate → faq.items.data.answer
  "faq.items.data.answer":
    "Access is denied by default and granted explicitly. Our privacy policy is a draft until it has been legally reviewed, and it is marked as such.",

  /* ------------------------------------------------------------- final cta */
  // TODO(hi): translate → finalCta.title
  "finalCta.title": "Be part of building agriculture's digital foundation",
  // TODO(hi): translate → finalCta.description
  "finalCta.description":
    "Registration is being built. Until it opens, you can explore the platform and tell us what your work needs.",
  // TODO(hi): translate → finalCta.secondary
  "finalCta.secondary": "Get in touch",
  // TODO(hi): translate → finalCta.note
  "finalCta.note": "No payment is required and nothing is charged on this website.",

  /* ---------------------------------------------------------------- footer */
  // TODO(hi): translate → footer.tagline
  "footer.tagline": "An agriculture super-application for India, built for the whole value chain.",
  // TODO(hi): translate → footer.platform
  "footer.platform": "Platform",
  // TODO(hi): translate → footer.solutions
  "footer.solutions": "Account categories",
  // TODO(hi): translate → footer.support
  "footer.support": "Help and legal",
  // TODO(hi): translate → footer.contact
  "footer.contact": "Contact",
  // TODO(hi): translate → footer.contactUnavailable
  "footer.contactUnavailable": "A support channel will be published when accounts open.",
  // TODO(hi): translate → footer.rights
  "footer.rights": "All rights reserved.",
  // TODO(hi): translate → footer.platformNote
  "footer.platformNote": "KRISHIMA is in active development. Features marked as planned are not yet available.",

  /* ------------------------------------------------------------------ meta */
  // TODO(hi): translate → meta.home.title
  "meta.home.title": "KRISHIMA — one platform for Indian agriculture",
  // TODO(hi): translate → meta.home.description
  "meta.home.description":
    "KRISHIMA connects farmers, buyers, retailers, workers, equipment owners, transporters, warehouses and creators in one multilingual agriculture platform.",
  // TODO(hi): translate → meta.about.title
  "meta.about.title": "About KRISHIMA",
  // TODO(hi): translate → meta.about.description
  "meta.about.description": "What KRISHIMA is, the principles it is built on, and where development stands today.",
  // TODO(hi): translate → meta.services.title
  "meta.services.title": "Services",
  // TODO(hi): translate → meta.services.description
  "meta.services.description": "The ten connected areas KRISHIMA will bring together, with honest status for each.",
  // TODO(hi): translate → meta.howItWorks.title
  "meta.howItWorks.title": "How it works",
  // TODO(hi): translate → meta.howItWorks.description
  "meta.howItWorks.description": "From creating an account to managing activity, in four steps.",
  // TODO(hi): translate → meta.faq.title
  "meta.faq.title": "Frequently asked questions",
  // TODO(hi): translate → meta.faq.description
  "meta.faq.description": "Answers about account types, service availability, pricing and support.",
  // TODO(hi): translate → meta.contact.title
  "meta.contact.title": "Contact",
  // TODO(hi): translate → meta.contact.description
  "meta.contact.description": "Reach the KRISHIMA team about the platform, services or partnership.",
  // TODO(hi): translate → meta.help.title
  "meta.help.title": "Help",
  // TODO(hi): translate → meta.help.description
  "meta.help.description": "Guidance on using this website, languages, accessibility and reporting a problem.",
  // TODO(hi): translate → meta.privacy.title
  "meta.privacy.title": "Privacy policy (draft)",
  // TODO(hi): translate → meta.privacy.description
  "meta.privacy.description": "How KRISHIMA handles personal data. This policy is a draft pending legal review.",
  // TODO(hi): translate → meta.terms.title
  "meta.terms.title": "Terms of use (draft)",
  // TODO(hi): translate → meta.terms.description
  "meta.terms.description": "The terms for using KRISHIMA. These terms are a draft pending legal review.",
  // TODO(hi): translate → meta.notFound.title
  "meta.notFound.title": "Page not found",
  // TODO(hi): translate → meta.notFound.description
  "meta.notFound.description": "The page you were looking for does not exist.",

  /* ----------------------------------------------------------------- about */
  // TODO(hi): translate → about.eyebrow
  "about.eyebrow": "About",
  // TODO(hi): translate → about.title
  "about.title": "Agriculture deserves better software",
  // TODO(hi): translate → about.description
  "about.description":
    "KRISHIMA exists to give every participant in Indian agriculture one trusted place to keep records, find services and work with each other.",
  // TODO(hi): translate → about.missionTitle
  "about.missionTitle": "Why we are building it",
  // TODO(hi): translate → about.mission
  "about.mission":
    "Agricultural work is connected in reality but fragmented in software. A farmer's records, a buyer's catalogue, a worker's history and a transporter's route all describe the same value chain, yet each usually lives somewhere separate. KRISHIMA is designed as one system so that information and trust can move with the work.",
  // TODO(hi): translate → about.principlesTitle
  "about.principlesTitle": "Principles",
  // TODO(hi): translate → about.principles.trust.title
  "about.principles.trust.title": "Safety by construction",
  // TODO(hi): translate → about.principles.trust.description
  "about.principles.trust.description": "Access is denied by default, enforced in the database as well as the application.",
  // TODO(hi): translate → about.principles.rural.title
  "about.principles.rural.title": "Built for rural India",
  // TODO(hi): translate → about.principles.rural.description
  "about.principles.rural.description": "Mobile-first, light on data, and readable on a low-cost phone.",
  // TODO(hi): translate → about.principles.modular.title
  "about.principles.modular.title": "One system, modular inside",
  // TODO(hi): translate → about.principles.modular.description
  "about.principles.modular.description": "Each domain can change without disturbing the others.",
  // TODO(hi): translate → about.principles.languages.title
  "about.principles.languages.title": "Language is not an afterthought",
  // TODO(hi): translate → about.principles.languages.description
  "about.principles.languages.description": "English and Hindi at launch, with room for regional languages without redesign.",
  // TODO(hi): translate → about.statusTitle
  "about.statusTitle": "Where things stand",
  // TODO(hi): translate → about.status
  "about.status":
    "The foundation — authentication, access rules, the design system and this website — is built. The agricultural services described across this site are being built and are labelled as planned wherever they appear. We would rather say what is true than look further along than we are.",
  // TODO(hi): translate → about.contactCta
  "about.contactCta": "Talk to us",

  /* -------------------------------------------------------------- services */
  // TODO(hi): translate → servicesPage.eyebrow
  "servicesPage.eyebrow": "Services",
  // TODO(hi): translate → servicesPage.title
  "servicesPage.title": "Everything KRISHIMA will bring together",
  // TODO(hi): translate → servicesPage.description
  "servicesPage.description":
    "Ten connected areas, designed as one system. Every one is labelled with its real status so you always know what is available.",
  // TODO(hi): translate → servicesPage.intro
  "servicesPage.intro":
    "These services share one identity, one set of access rules and one design. That is what makes them a platform rather than a collection of apps.",
  // TODO(hi): translate → servicesPage.listTitle
  "servicesPage.listTitle": "The service catalogue",
  // TODO(hi): translate → servicesPage.listDescription
  "servicesPage.listDescription": "What each area covers, and who it is for.",
  // TODO(hi): translate → servicesPage.statusNote
  "servicesPage.statusNote": "No service in this catalogue is live yet. Each will be announced when it becomes usable.",
  // TODO(hi): translate → servicesPage.rolesTitle
  "servicesPage.rolesTitle": "Find your category",
  // TODO(hi): translate → servicesPage.rolesDescription
  "servicesPage.rolesDescription": "Each category has its own page describing what the platform will do for that work.",
  // TODO(hi): translate → servicesPage.contactCta
  "servicesPage.contactCta": "Ask about a service",
  // TODO(hi): translate → servicesPage.audience.farmManagement
  "servicesPage.audience.farmManagement": "For farmers and farm managers",
  // TODO(hi): translate → servicesPage.audience.cropManagement
  "servicesPage.audience.cropManagement": "For farmers and agronomists",
  // TODO(hi): translate → servicesPage.audience.weather
  "servicesPage.audience.weather": "For everyone working outdoors",
  // TODO(hi): translate → servicesPage.audience.mandiPrices
  "servicesPage.audience.mandiPrices": "For farmers, buyers and retailers",
  // TODO(hi): translate → servicesPage.audience.marketplace
  "servicesPage.audience.marketplace": "For farmers, buyers and retailers",
  // TODO(hi): translate → servicesPage.audience.equipmentRental
  "servicesPage.audience.equipmentRental": "For equipment owners and farmers",
  // TODO(hi): translate → servicesPage.audience.employment
  "servicesPage.audience.employment": "For workers and employers",
  // TODO(hi): translate → servicesPage.audience.transport
  "servicesPage.audience.transport": "For transporters and sellers",
  // TODO(hi): translate → servicesPage.audience.warehouse
  "servicesPage.audience.warehouse": "For warehouses and producers",
  // TODO(hi): translate → servicesPage.audience.knowledge
  "servicesPage.audience.knowledge": "For creators and learners",

  /* --------------------------------------------------------------- contact */
  // TODO(hi): translate → contact.eyebrow
  "contact.eyebrow": "Contact",
  // TODO(hi): translate → contact.title
  "contact.title": "Talk to the KRISHIMA team",
  // TODO(hi): translate → contact.description
  "contact.description":
    "Questions about the platform, a service or a partnership are welcome. The form below is ready; sending is not connected yet.",
  // TODO(hi): translate → contact.submit
  "contact.submit": "Send message",
  // TODO(hi): translate → contact.privacyNote
  "contact.privacyNote": "We only ask for what is needed to reply. Do not include sensitive personal details.",
  // TODO(hi): translate → contact.unavailableTitle
  "contact.unavailableTitle": "Sending is not available yet",
  // TODO(hi): translate → contact.unavailableWithEmail
  "contact.unavailableWithEmail": "Message sending is not connected. Please write to",
  // TODO(hi): translate → contact.unavailableNoEmail
  "contact.unavailableNoEmail":
    "Message sending is not connected yet, and no support address has been published. Your message has not been sent — please keep it and try again once a channel is announced.",
  // TODO(hi): translate → contact.offlineTitle
  "contact.offlineTitle": "You appear to be offline",
  // TODO(hi): translate → contact.offlineBody
  "contact.offlineBody": "Check your connection and try again. Your message has not been sent.",
  // TODO(hi): translate → contact.fields.role
  "contact.fields.role": "I am a",
  // TODO(hi): translate → contact.fields.rolePlaceholder
  "contact.fields.rolePlaceholder": "Select a category (optional)",
  // TODO(hi): translate → contact.fields.roleOther
  "contact.fields.roleOther": "Something else",
  // TODO(hi): translate → contact.fields.name
  "contact.fields.name": "Your name",
  // TODO(hi): translate → contact.fields.message
  "contact.fields.message": "Your message",
  // TODO(hi): translate → contact.fields.messageHint
  "contact.fields.messageHint": "A few sentences is plenty.",
  // TODO(hi): translate → contact.errors.name
  "contact.errors.name": "Please enter your name.",
  // TODO(hi): translate → contact.errors.message
  "contact.errors.message": "Please write at least a short message (10 characters or more).",
  // TODO(hi): translate → contact.errors.summary
  "contact.errors.summary": "Please correct the highlighted fields.",
  // TODO(hi): translate → contact.side.title
  "contact.side.title": "What to expect",
  // TODO(hi): translate → contact.side.body
  "contact.side.body":
    "This website is the public face of a platform in development. We answer questions about what is being built and when.",
  // TODO(hi): translate → contact.side.helpTitle
  "contact.side.helpTitle": "Looking for guidance?",
  // TODO(hi): translate → contact.side.helpBody
  "contact.side.helpBody": "The help page covers languages, themes, accessibility and how to report a problem.",

  /* ------------------------------------------------------------------ help */
  // TODO(hi): translate → helpPage.eyebrow
  "helpPage.eyebrow": "Help",
  // TODO(hi): translate → helpPage.title
  "helpPage.title": "Using this website",
  // TODO(hi): translate → helpPage.description
  "helpPage.description": "Practical guidance for the pages you can use today.",
  // TODO(hi): translate → helpPage.stillStuck
  "helpPage.stillStuck": "Still stuck? We would rather hear about it.",
  // TODO(hi): translate → helpPage.topics.start.title
  "helpPage.topics.start.title": "Finding your way around",
  // TODO(hi): translate → helpPage.topics.start.body
  "helpPage.topics.start.body":
    "The menu links to the landing page, about, services, how it works and contact. Account categories are under Services.",
  // TODO(hi): translate → helpPage.topics.account.title
  "helpPage.topics.account.title": "Accounts",
  // TODO(hi): translate → helpPage.topics.account.body
  "helpPage.topics.account.body":
    "Account creation is not open yet. Links that are not available are marked as coming soon and do not pretend to work.",
  // TODO(hi): translate → helpPage.topics.languages.title
  "helpPage.topics.languages.title": "Changing language",
  // TODO(hi): translate → helpPage.topics.languages.body
  "helpPage.topics.languages.body":
    "Use the language selector in the header or footer to switch between English and Hindi. Your choice is remembered on this device.",
  // TODO(hi): translate → helpPage.topics.accessibility.title
  "helpPage.topics.accessibility.title": "Accessibility",
  // TODO(hi): translate → helpPage.topics.accessibility.body
  "helpPage.topics.accessibility.body":
    "The site works with a keyboard and screen readers, supports reduced motion, and has light and dark themes.",
  // TODO(hi): translate → helpPage.topics.report.title
  "helpPage.topics.report.title": "Reporting a problem",
  // TODO(hi): translate → helpPage.topics.report.body
  "helpPage.topics.report.body":
    "If something looks wrong or is hard to use, tell us through the contact page. Specific details help us fix it faster.",

  /* ----------------------------------------------------------------- legal */
  // TODO(hi): translate → legal.eyebrow
  "legal.eyebrow": "Legal",
  // TODO(hi): translate → legal.draftNotice
  "legal.draftNotice":
    "Draft — this document has not yet been reviewed and approved by a legal professional. It is not legal advice.",
  // TODO(hi): translate → legal.lastUpdatedLabel
  "legal.lastUpdatedLabel": "Last updated",
  // TODO(hi): translate → legal.privacyPage.title
  "legal.privacyPage.title": "Privacy policy (draft)",
  // TODO(hi): translate → legal.privacyPage.lead
  "legal.privacyPage.lead": "How KRISHIMA intends to handle personal data. This is a draft.",
  // TODO(hi): translate → legal.termsPage.title
  "legal.termsPage.title": "Terms of use (draft)",
  // TODO(hi): translate → legal.termsPage.lead
  "legal.termsPage.lead": "The terms for using KRISHIMA. These are a draft.",
  // TODO(hi): translate → legal.privacy.collect.title
  "legal.privacy.collect.title": "What we collect",
  // TODO(hi): translate → legal.privacy.collect.p
  "legal.privacy.collect.p":
    "When accounts open, we will collect the details needed to create and secure an account, such as a name, contact details and, where a service requires it, verification documents. This draft does not yet list every field.",
  // TODO(hi): translate → legal.privacy.use.title
  "legal.privacy.use.title": "How we use it",
  // TODO(hi): translate → legal.privacy.use.p
  "legal.privacy.use.p":
    "Information is intended to be used to operate the platform, to keep accounts secure, to verify participants where a service requires it, and to meet legal obligations.",
  // TODO(hi): translate → legal.privacy.share.title
  "legal.privacy.share.title": "Sharing",
  // TODO(hi): translate → legal.privacy.share.p
  "legal.privacy.share.p":
    "We do not sell personal data. Sharing with service providers will be limited to what a specific service requires, and will be described here once finalised.",
  // TODO(hi): translate → legal.privacy.rights.title
  "legal.privacy.rights.title": "Your choices",
  // TODO(hi): translate → legal.privacy.rights.p
  "legal.privacy.rights.p":
    "The intended approach is to let you access, correct and delete your information. The exact process is pending legal review.",
  // TODO(hi): translate → legal.privacy.contact.title
  "legal.privacy.contact.title": "Contact",
  // TODO(hi): translate → legal.privacy.contact.p
  "legal.privacy.contact.p":
    "Questions about privacy can be raised through the contact page. A dedicated privacy contact will be published when available.",
  // TODO(hi): translate → legal.terms.use.title
  "legal.terms.use.title": "Using KRISHIMA",
  // TODO(hi): translate → legal.terms.use.p
  "legal.terms.use.p":
    "These terms will govern use of the platform and this website. They are a draft and are not yet in force.",
  // TODO(hi): translate → legal.terms.accounts.title
  "legal.terms.accounts.title": "Accounts",
  // TODO(hi): translate → legal.terms.accounts.p
  "legal.terms.accounts.p":
    "Accounts will be personal to the holder, and the holder will be responsible for keeping access secure.",
  // TODO(hi): translate → legal.terms.content.title
  "legal.terms.content.title": "Content and conduct",
  // TODO(hi): translate → legal.terms.content.p
  "legal.terms.content.p":
    "Listings and published material will be subject to moderation. Prohibited conduct will be described in the final terms.",
  // TODO(hi): translate → legal.terms.liability.title
  "legal.terms.liability.title": "Liability",
  // TODO(hi): translate → legal.terms.liability.p
  "legal.terms.liability.p":
    "Liability terms have not been drafted. Nothing here limits any right you have under applicable law.",
  // TODO(hi): translate → legal.terms.changes.title
  "legal.terms.changes.title": "Changes",
  // TODO(hi): translate → legal.terms.changes.p
  "legal.terms.changes.p":
    "Material changes will be communicated before they take effect. The date at the top of this page will always show the current version.",

  /* ---------------------------------------------------------- how (page) */
  // TODO(hi): translate → howPage.eyebrow
  "howPage.eyebrow": "How it works",
  // TODO(hi): translate → howPage.title
  "howPage.title": "The journey, step by step",
  // TODO(hi): translate → howPage.description
  "howPage.description": "What happens at each stage, and what state it is in today.",
  // TODO(hi): translate → howPage.stepsTitle
  "howPage.stepsTitle": "Four steps",
  // TODO(hi): translate → howPage.statusPlanned
  "howPage.statusPlanned": "Being built — not available yet",
  // TODO(hi): translate → howPage.note
  "howPage.note":
    "No step below involves a payment or a binding agreement yet. When that changes, it will be stated clearly.",
  // TODO(hi): translate → howPage.steps.account.title
  "howPage.steps.account.title": "Create an account",
  // TODO(hi): translate → howPage.steps.account.description
  "howPage.steps.account.description":
    "One identity is created once. From it, a personal workspace exists immediately, and further roles can be added as needed.",
  // TODO(hi): translate → howPage.steps.workspace.title
  "howPage.steps.workspace.title": "Choose a workspace",
  // TODO(hi): translate → howPage.steps.workspace.description
  "howPage.steps.workspace.description":
    "Work as yourself, or join an organization. An organization has its own members, roles and permissions, and its data stays separate from personal data.",
  // TODO(hi): translate → howPage.steps.discover.title
  "howPage.steps.discover.title": "Discover tools and services",
  // TODO(hi): translate → howPage.steps.discover.description
  "howPage.steps.discover.description":
    "Records, information and services are presented according to the roles you hold, so the platform shows what is relevant rather than everything at once.",
  // TODO(hi): translate → howPage.steps.connect.title
  "howPage.steps.connect.title": "Connect and manage activity",
  // TODO(hi): translate → howPage.steps.connect.description
  "howPage.steps.connect.description":
    "Work with other participants, keep a record of what was agreed, and refer back to it later.",

  /* -------------------------------------------------------- roles (page) */
  // TODO(hi): translate → rolesPage.statusNote
  "rolesPage.statusNote": "This experience is being built and is not available yet.",
  // TODO(hi): translate → rolesPage.talkToUs
  "rolesPage.talkToUs": "Tell us what you need",
  // TODO(hi): translate → rolesPage.highlightsTitle
  "rolesPage.highlightsTitle": "What this will include",
  // TODO(hi): translate → rolesPage.needsTitle
  "rolesPage.needsTitle": "What this role needs",
  // TODO(hi): translate → rolesPage.requirementsTitle
  "rolesPage.requirementsTitle": "Verification and requirements",
  // TODO(hi): translate → rolesPage.otherRoles
  "rolesPage.otherRoles": "Other account categories",

  /* ------------------------------------------------------------- not found */
  // TODO(hi): translate → notFound.eyebrow
  "notFound.eyebrow": "404",
  // TODO(hi): translate → notFound.title
  "notFound.title": "This page does not exist",
  // TODO(hi): translate → notFound.description
  "notFound.description": "The address may have changed, or the link may be incorrect. Here are some useful places to continue.",
  // TODO(hi): translate → notFound.home
  "notFound.home": "Go to the home page",
  // TODO(hi): translate → notFound.helpful
  "notFound.helpful": "Helpful pages",
};

import type { Messages } from "@krishima/ui";

/**
 * English (en-IN) catalogue for the public website.
 *
 * Rules for this file:
 *  - Flat, dot-separated keys; no nesting (the runtime is flat by design).
 *  - NO unverified statistics, no invented phone numbers/addresses, no claim of
 *    government partnership or certification anywhere.
 *  - Anything not shipped is written in the future tense and paired with a
 *    "planned" label in the UI, so the copy can never over-promise.
 *  - Hindi must mirror every key exactly (see hi.ts; a unit test enforces it).
 */
export const en: Messages = {
  /* ---------------------------------------------------------------- common */
  "common.language": "Language",
  "common.comingSoon": "coming soon",
  "common.questionsContact": "Questions about this page? Contact us.",

  /* ------------------------------------------------------------------- nav */
  "nav.home": "Home",
  "nav.about": "About",
  "nav.services": "Services",
  "nav.solutions": "Categories",
  "nav.howItWorks": "How it works",
  "nav.contact": "Contact",
  "nav.faq": "FAQ",
  "nav.help": "Help",
  "nav.privacy": "Privacy policy",
  "nav.terms": "Terms of use",
  "nav.homeLabel": "KRISHIMA home",
  "nav.primaryLabel": "Primary",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.skipToContent": "Skip to main content",

  /* ------------------------------------------------------------------- cta */
  "cta.login": "Log in",
  "cta.getStarted": "Get started",
  "cta.exploreServices": "Explore services",

  /* ---------------------------------------------------------- announcement */
  "announcement.launch": "KRISHIMA is in active development — here is what we are building.",
  "announcement.readMore": "Read more",
  "announcement.dismiss": "Dismiss announcement",

  /* ------------------------------------------------------------------ hero */
  "hero.eyebrow": "An agriculture platform for India",
  "hero.title": "Grow smarter. Trade better. Build a stronger future.",
  "hero.description":
    "One connected digital platform for farmers, agricultural businesses, workers, and essential farming services.",
  "hero.supportNote": "Account creation is being built. You can explore everything the platform will offer today.",
  "hero.imageAlt":
    "Two farmers standing in a green wheat field, looking at a laptop together",
  "hero.rolesCaption": "Built for",
  "hero.rolesSummary": "Eight kinds of agricultural work",

  /* -------------------------------------------------------------- platform */
  "platform.eyebrow": "What KRISHIMA is",
  "platform.title": "One platform for the whole agricultural value chain",
  "platform.description":
    "KRISHIMA connects the people and services that agriculture depends on — from the farm to the buyer, and everything in between — in one trusted, multilingual place.",
  "platform.points.identity.title": "One identity, many roles",
  "platform.points.identity.description":
    "A person can be a farmer, a buyer and an equipment owner at the same time. Each role keeps its own data, so nothing is mixed between them.",
  "platform.points.workspaces.title": "Independent workspaces",
  "platform.points.workspaces.description":
    "A personal account and a larger business account can live side by side. Work done in one workspace never leaks into another.",
  "platform.points.trust.title": "Access by permission",
  "platform.points.trust.description":
    "Access is denied by default and granted explicitly, checked both in the application and at the database. Sensitive actions are recorded.",

  /* ----------------------------------------------------------------- roles */
  "roles.eyebrow": "Who it is for",
  "roles.title": "Eight kinds of work, one platform",
  "roles.description":
    "Every participant in agriculture has different needs. Each category below has its own workspace, permissions and tools.",
  "roles.footnote":
    "These are roles a person can hold, not separate accounts. One login can carry several roles, each with its own workspace.",
  "roles.learnMore": "Learn more",

  "roles.farmer.name": "Farmer",
  "roles.farmer.short": "Keep farm records, follow crops and find the services a season needs.",
  "roles.farmer.headline": "Run your farm with clearer records",
  "roles.farmer.long":
    "KRISHIMA is being built so a farmer can keep plot and crop records in one place, follow the season, and find labour, equipment, transport and storage when they are needed — without losing track of what happened last year.",
  "roles.farmer.needs": "Farm and plot records, crop timelines, weather, market information and service discovery.",
  "roles.farmer.requirements": "An account is all that is needed to keep records. Selling produce will require verification when that service launches.",
  "roles.farmer.highlights.h1.title": "Farm records",
  "roles.farmer.highlights.h1.body": "Plots, crops and seasons in one place instead of scattered notes.",
  "roles.farmer.highlights.h2.title": "Crop tracking",
  "roles.farmer.highlights.h2.body": "Follow each crop from sowing through harvest.",
  "roles.farmer.highlights.h3.title": "Market information",
  "roles.farmer.highlights.h3.body": "Understand prices before deciding when to sell.",
  "roles.farmer.highlights.h4.title": "Services nearby",
  "roles.farmer.highlights.h4.body": "Find labour, equipment, transport and storage in one search.",
  "roles.farmer.seo.title": "KRISHIMA for farmers",
  "roles.farmer.seo.description": "Farm records, crop tracking, weather, market information and service discovery in one platform.",

  "roles.buyer.name": "Buyer",
  "roles.buyer.short": "Discover produce and agricultural inputs from verified sellers.",
  "roles.buyer.headline": "Find produce and inputs with confidence",
  "roles.buyer.long":
    "Buyers will be able to browse agricultural produce and inputs, filter by category and location, and see which sellers have completed verification — so a purchase decision rests on facts, not guesswork.",
  "roles.buyer.needs": "A clear catalogue, honest seller verification, and records of what was agreed.",
  "roles.buyer.requirements": "Browsing will be open. Placing orders will require verification once ordering launches.",
  "roles.buyer.highlights.h1.title": "Search that fits agriculture",
  "roles.buyer.highlights.h1.body": "Filter by crop, quantity and location rather than generic keywords.",
  "roles.buyer.highlights.h2.title": "Verified sellers",
  "roles.buyer.highlights.h2.body": "Verification status shown clearly on every listing.",
  "roles.buyer.highlights.h3.title": "Clear quantities and units",
  "roles.buyer.highlights.h3.body": "Controlled units so a quintal never becomes a guess.",
  "roles.buyer.highlights.h4.title": "Records you can refer to",
  "roles.buyer.highlights.h4.body": "What was listed stays on record, unchanged after the fact.",
  "roles.buyer.seo.title": "KRISHIMA for buyers",
  "roles.buyer.seo.description": "Browse agricultural produce and inputs from verified sellers with clear quantities and units.",

  "roles.retailer.name": "Retailer",
  "roles.retailer.short": "Source agricultural stock for a shop or a distribution business.",
  "roles.retailer.headline": "Source stock for your business",
  "roles.retailer.long":
    "Retailers will be able to source produce and inputs in the quantities a shop actually needs, keep a record of suppliers, and present a business identity that buyers and sellers can recognise.",
  "roles.retailer.needs": "Business verification, repeatable sourcing, and a clear record of suppliers.",
  "roles.retailer.requirements": "Business verification will be required before trading, reflecting the trust a shop needs to carry.",
  "roles.retailer.highlights.h1.title": "Business identity",
  "roles.retailer.highlights.h1.body": "A verified business profile, separate from a personal account.",
  "roles.retailer.highlights.h2.title": "Bulk quantities",
  "roles.retailer.highlights.h2.body": "Quantities expressed in units a shop actually trades in.",
  "roles.retailer.highlights.h3.title": "Supplier history",
  "roles.retailer.highlights.h3.body": "Know who supplied what, and when.",
  "roles.retailer.highlights.h4.title": "Organization workspace",
  "roles.retailer.highlights.h4.body": "Staff can work in one business workspace with separate permissions.",
  "roles.retailer.seo.title": "KRISHIMA for retailers",
  "roles.retailer.seo.description": "Source agricultural stock with a verified business identity and clear supplier records.",

  "roles.worker.name": "Worker",
  "roles.worker.short": "Find farm work and keep a record of the work you have done.",
  "roles.worker.headline": "Find work and keep a record of it",
  "roles.worker.long":
    "Workers will be able to see farm work available nearby, apply for it, and keep a record of engagements — a simple history that makes the next opportunity easier to find.",
  "roles.worker.needs": "Work listings that are nearby and real, plus a record of engagements.",
  "roles.worker.requirements": "A phone-verified account. Work history starts building with the first engagement.",
  "roles.worker.highlights.h1.title": "Work nearby",
  "roles.worker.highlights.h1.body": "See work that is within reach, not hundreds of kilometres away.",
  "roles.worker.highlights.h2.title": "Apply once",
  "roles.worker.highlights.h2.body": "One application per job — no duplicate applications.",
  "roles.worker.highlights.h3.title": "Work history",
  "roles.worker.highlights.h3.body": "A record of engagements you can point to.",
  "roles.worker.highlights.h4.title": "Clear terms",
  "roles.worker.highlights.h4.body": "What the work involves and how it is settled, stated up front.",
  "roles.worker.seo.title": "KRISHIMA for farm workers",
  "roles.worker.seo.description": "Find farm work nearby and keep a record of the engagements you complete.",

  "roles.equipment.name": "Equipment owner",
  "roles.equipment.short": "Offer tractors, pumps and machinery to farms that need them.",
  "roles.equipment.headline": "Put your machinery to work",
  "roles.equipment.long":
    "Equipment owners will be able to list machines, set availability, and take bookings without two farmers ever being promised the same machine at the same time.",
  "roles.equipment.needs": "Listings with real availability, and bookings that cannot overlap.",
  "roles.equipment.requirements": "Owner verification will be required before taking bookings.",
  "roles.equipment.highlights.h1.title": "Machine listings",
  "roles.equipment.highlights.h1.body": "Describe what you own and when it is free.",
  "roles.equipment.highlights.h2.title": "No double bookings",
  "roles.equipment.highlights.h2.body": "Overlapping bookings are prevented at the database level.",
  "roles.equipment.highlights.h3.title": "Rental history",
  "roles.equipment.highlights.h3.body": "A record of what was rented and when.",
  "roles.equipment.highlights.h4.title": "Reach nearby farms",
  "roles.equipment.highlights.h4.body": "Machines found by the people close enough to use them.",
  "roles.equipment.seo.title": "KRISHIMA for equipment owners",
  "roles.equipment.seo.description": "List tractors and machinery, set availability and take bookings that cannot overlap.",

  "roles.transporter.name": "Transporter",
  "roles.transporter.short": "Move produce and inputs between farm, market and warehouse.",
  "roles.transporter.headline": "Move what agriculture grows",
  "roles.transporter.long":
    "Transporters will be able to see movement requests that fit their route and capacity, and agree terms before a load is committed.",
  "roles.transporter.needs": "Requests that match a real route, and terms agreed before the load moves.",
  "roles.transporter.requirements": "Vehicle and identity verification will be required before accepting loads.",
  "roles.transporter.highlights.h1.title": "Loads that fit",
  "roles.transporter.highlights.h1.body": "Requests matched to your route and capacity.",
  "roles.transporter.highlights.h2.title": "Terms before movement",
  "roles.transporter.highlights.h2.body": "What is carried and how it is settled, agreed in advance.",
  "roles.transporter.highlights.h3.title": "Delivery records",
  "roles.transporter.highlights.h3.body": "A record of each completed movement.",
  "roles.transporter.highlights.h4.title": "Vehicle verification",
  "roles.transporter.highlights.h4.body": "Verified vehicles build trust on both sides.",
  "roles.transporter.seo.title": "KRISHIMA for transporters",
  "roles.transporter.seo.description": "Find agricultural loads that fit your route and agree terms before moving them.",

  "roles.warehouse.name": "Warehouse",
  "roles.warehouse.short": "Offer storage for produce between harvest and sale.",
  "roles.warehouse.headline": "Offer storage farmers can rely on",
  "roles.warehouse.long":
    "Warehouses will be able to publish capacity, accept storage requests, and keep an accurate record of what is held and for how long.",
  "roles.warehouse.needs": "Accurate capacity, clear storage terms, and a record of what is held.",
  "roles.warehouse.requirements": "Facility verification will be required before accepting produce.",
  "roles.warehouse.highlights.h1.title": "Publish capacity",
  "roles.warehouse.highlights.h1.body": "Show what space is genuinely available.",
  "roles.warehouse.highlights.h2.title": "Storage terms",
  "roles.warehouse.highlights.h2.body": "Duration and conditions stated before produce arrives.",
  "roles.warehouse.highlights.h3.title": "Accurate records",
  "roles.warehouse.highlights.h3.body": "Know what is held, and since when.",
  "roles.warehouse.highlights.h4.title": "No overbooking",
  "roles.warehouse.highlights.h4.body": "Capacity is checked when a request is accepted.",
  "roles.warehouse.seo.title": "KRISHIMA for warehouses",
  "roles.warehouse.seo.description": "Publish storage capacity, accept storage requests and keep accurate records of what is held.",

  "roles.creator.name": "Content creator",
  "roles.creator.short": "Share agricultural knowledge through writing and video.",
  "roles.creator.headline": "Share what you know about farming",
  "roles.creator.long":
    "Creators will be able to publish agricultural knowledge and video learning for people who need it in their own language — practical guidance rather than noise.",
  "roles.creator.needs": "A place to publish, and an audience that can find the work in their language.",
  "roles.creator.requirements": "A verified account. Published material follows a moderation policy.",
  "roles.creator.highlights.h1.title": "Written knowledge",
  "roles.creator.highlights.h1.body": "Practical guidance organised by crop and season.",
  "roles.creator.highlights.h2.title": "Video learning",
  "roles.creator.highlights.h2.body": "Short, useful video for people who learn by watching.",
  "roles.creator.highlights.h3.title": "Local languages",
  "roles.creator.highlights.h3.body": "Knowledge that reaches people in the language they use.",
  "roles.creator.highlights.h4.title": "Moderated publishing",
  "roles.creator.highlights.h4.body": "A clear policy keeps advice trustworthy.",
  "roles.creator.seo.title": "KRISHIMA for content creators",
  "roles.creator.seo.description": "Publish agricultural knowledge and video learning for people in their own language.",

  /* -------------------------------------------------------------- features */
  "features.eyebrow": "Platform features",
  "features.title": "What the platform will bring together",
  "features.description":
    "Ten connected areas, designed to work as one system rather than ten separate apps. Each one is labelled with its real status.",
  "features.planned": "Planned",
  "features.legend": "means the feature is being built and is not usable yet.",

  "features.farmManagement.title": "Farm management",
  "features.farmManagement.description": "Plots, seasons and records kept in one place instead of scattered notes.",
  "features.cropManagement.title": "Crop management",
  "features.cropManagement.description": "Follow each crop from sowing through harvest, with what was done and when.",
  "features.weather.title": "Weather information",
  "features.weather.description": "Local conditions to plan sowing, spraying and harvest around.",
  "features.mandiPrices.title": "Mandi prices",
  "features.mandiPrices.description": "Market prices to inform when and where to sell.",
  "features.marketplace.title": "Agriculture marketplace",
  "features.marketplace.description": "Produce and inputs listed with clear quantities, units and seller verification.",
  "features.equipmentRental.title": "Equipment rental",
  "features.equipmentRental.description": "Tractors and machinery available nearby, with bookings that cannot overlap.",
  "features.employment.title": "Farm employment",
  "features.employment.description": "Work offered and found nearby, with one application per job.",
  "features.transport.title": "Transport services",
  "features.transport.description": "Move produce between farm, market and warehouse with terms agreed first.",
  "features.warehouse.title": "Warehouse services",
  "features.warehouse.description": "Storage with published capacity and accurate records of what is held.",
  "features.knowledge.title": "Knowledge and community",
  "features.knowledge.description": "Practical agricultural guidance and learning, in the languages people actually use.",

  /* ------------------------------------------------------------- ecosystem */
  "ecosystem.eyebrow": "The connected ecosystem",
  "ecosystem.title": "How the participants connect",
  "ecosystem.description":
    "Agriculture is a chain of relationships, not isolated transactions. KRISHIMA is designed so each participant can reach the next without leaving the platform.",
  "ecosystem.hub": "KRISHIMA",
  "ecosystem.nodes.farmer": "Farmer",
  "ecosystem.nodes.buyer": "Buyer",
  "ecosystem.nodes.retailer": "Retailer",
  "ecosystem.nodes.worker": "Worker",
  "ecosystem.nodes.equipment": "Equipment",
  "ecosystem.nodes.transporter": "Transport",
  "ecosystem.nodes.warehouse": "Warehouse",
  "ecosystem.nodes.creator": "Creator",
  "ecosystem.links.farmer.from": "Farmer",
  "ecosystem.links.farmer.relation": "lists produce, hires labour and equipment, and arranges transport and storage.",
  "ecosystem.links.buyer.from": "Buyer",
  "ecosystem.links.buyer.relation": "discovers produce and inputs from verified sellers.",
  "ecosystem.links.retailer.from": "Retailer",
  "ecosystem.links.retailer.relation": "sources stock in the quantities a business needs.",
  "ecosystem.links.worker.from": "Worker",
  "ecosystem.links.worker.relation": "finds work nearby and builds a record of engagements.",
  "ecosystem.links.equipment.from": "Equipment owner",
  "ecosystem.links.equipment.relation": "offers machinery to farms that need it, without double bookings.",
  "ecosystem.links.transporter.from": "Transporter",
  "ecosystem.links.transporter.relation": "moves produce and inputs between farm, market and warehouse.",
  "ecosystem.links.warehouse.from": "Warehouse",
  "ecosystem.links.warehouse.relation": "stores produce between harvest and sale with accurate records.",
  "ecosystem.links.creator.from": "Content creator",
  "ecosystem.links.creator.relation": "shares practical knowledge in the languages people use.",

  /* ------------------------------------------------------------------- how */
  "how.eyebrow": "How it works",
  "how.title": "From account to activity, in four steps",
  "how.description": "A short journey that works the same way for every role.",
  "how.stepLabel": "Step",
  "how.availableNow": "Available now",
  "how.note":
    "The account foundation exists today. The workspaces and services described below are being built — nothing here is presented as live until it is.",
  "how.seeFaq": "See common questions",
  "how.steps.account.title": "Create an account",
  "how.steps.account.description": "One identity, with a personal workspace ready from the start.",
  "how.steps.workspace.title": "Choose a workspace",
  "how.steps.workspace.description": "Work as yourself, or join an organization with its own members and permissions.",
  "how.steps.discover.title": "Discover tools and services",
  "how.steps.discover.description": "Find the records, information and services that fit what you do.",
  "how.steps.connect.title": "Connect and manage activity",
  "how.steps.connect.description": "Work with other participants and keep a record of what was agreed.",

  /* ------------------------------------------------------------ solutions */
  "solutions.farmer.eyebrow": "Farmer solutions",
  "solutions.farmer.title": "The farmer experience we are building",
  "solutions.farmer.description":
    "Records that stay useful across seasons, and services that can be found when they are needed.",
  "solutions.farmer.statusNote": "Every item below is planned. None of these tools is live yet.",
  "solutions.farmer.items.records.title": "Farm records",
  "solutions.farmer.items.records.description": "Plots, crops and seasons kept in one place.",
  "solutions.farmer.items.crops.title": "Crop tracking",
  "solutions.farmer.items.crops.description": "Each crop followed from sowing through harvest.",
  "solutions.farmer.items.weather.title": "Weather",
  "solutions.farmer.items.weather.description": "Local conditions for planning field work.",
  "solutions.farmer.items.market.title": "Market information",
  "solutions.farmer.items.market.description": "Prices to inform when and where to sell.",
  "solutions.farmer.items.harvest.title": "Harvest management",
  "solutions.farmer.items.harvest.description": "What was harvested, and what happened to it.",
  "solutions.farmer.items.services.title": "Service discovery",
  "solutions.farmer.items.services.description": "Labour, equipment, transport and storage in one search.",
  "solutions.seeFarmer": "More for farmers",

  "solutions.business.eyebrow": "Business solutions",
  "solutions.business.title": "What businesses gain from the platform",
  "solutions.business.description":
    "Buyers, retailers, transporters, equipment providers and warehouses all need the same thing: a reliable counterparty and a clear record.",
  "solutions.business.statusNote": "Every item below is planned. None of these tools is live yet.",
  "solutions.business.items.buyers.title": "Buyers",
  "solutions.business.items.buyers.description": "A catalogue with clear quantities and verified sellers.",
  "solutions.business.items.retailers.title": "Retailers",
  "solutions.business.items.retailers.description": "Business identity and repeatable sourcing.",
  "solutions.business.items.transport.title": "Transport companies",
  "solutions.business.items.transport.description": "Loads matched to route and capacity.",
  "solutions.business.items.equipment.title": "Equipment providers",
  "solutions.business.items.equipment.description": "Machinery bookings that cannot overlap.",
  "solutions.business.items.warehouses.title": "Warehouses",
  "solutions.business.items.warehouses.description": "Published capacity with accurate records.",
  "solutions.business.items.partners.title": "Other partners",
  "solutions.business.items.partners.description": "Organizations with their own members, roles and permissions.",
  "solutions.seeBusiness": "More for businesses",

  /* --------------------------------------------------------------- preview */
  "preview.eyebrow": "Marketplace preview",
  "preview.title": "A first look at how listings will work",
  "preview.description":
    "This is a design concept, not live inventory. It shows the shape of a listing: crop, quantity, unit and price.",
  "preview.illustrative": "Illustrative only",
  "preview.illustrativeNote": "Sample content for design purposes. No real listings, sellers or prices.",
  "preview.sampleMeta": "Sample listing",
  "preview.rows.wheat.name": "Wheat",
  "preview.rows.wheat.price": "₹ — sample",
  "preview.rows.paddy.name": "Paddy",
  "preview.rows.paddy.price": "₹ — sample",
  "preview.rows.tomato.name": "Tomato",
  "preview.rows.tomato.price": "₹ — sample",
  "preview.side.title": "How listings will work",
  "preview.side.filters": "Filters by crop, location and quantity.",
  "preview.side.verified": "Seller verification shown on every listing.",
  "preview.side.units": "Controlled units, so a quintal is always a quintal.",
  "preview.side.disclaimer": "Prices will come from real listings once the marketplace launches.",

  /* ------------------------------------------------------------- community */
  "community.eyebrow": "Community and knowledge",
  "community.title": "Learning that reaches the people who need it",
  "community.description":
    "Practical agricultural knowledge is often hard to find in the right language. This area is being designed to change that.",
  "community.statusNote": "Community features are planned. There is no social feed or publishing available yet.",
  "community.pillars.knowledge.title": "Knowledge",
  "community.pillars.knowledge.description": "Practical guidance organised by crop and season, not scattered posts.",
  "community.pillars.video.title": "Video learning",
  "community.pillars.video.description": "Short, useful video for people who learn by watching.",
  "community.pillars.community.title": "Community",
  "community.pillars.community.description": "A place to ask and answer, moderated so advice stays trustworthy.",

  /* ----------------------------------------------------------------- trust */
  "trust.eyebrow": "Trust and security",
  "trust.title": "What is protected today, and what is coming",
  "trust.description":
    "We separate what is actually implemented from what is planned. Nothing below is a certification or a guarantee.",
  "trust.implementedTitle": "Implemented today",
  "trust.plannedTitle": "Planned",
  "trust.implemented.auth.title": "Verified sign-in",
  "trust.implemented.auth.description":
    "Tokens are verified against the identity provider's published keys. Forged, expired and wrongly addressed tokens are rejected.",
  "trust.implemented.access.title": "Deny-by-default access",
  "trust.implemented.access.description":
    "Every protected action needs an explicit permission, checked in the application and enforced again at the database.",
  "trust.implemented.storage.title": "Private document storage",
  "trust.implemented.storage.description":
    "Private files are not publicly listable or downloadable; access is time-limited and deliberate.",
  "trust.implemented.privacy.title": "Careful handling of data",
  "trust.implemented.privacy.description":
    "Logs and error responses are written to avoid exposing personal details, credentials or internal addresses.",
  "trust.planned.kyc.title": "Verification (KYC)",
  "trust.planned.kyc.description":
    "Seller, business, vehicle and facility verification with a review queue. Planned, not live.",
  "trust.planned.audit.title": "Audit trail",
  "trust.planned.audit.description":
    "A record of sensitive actions such as role changes and verification decisions. Planned, not live.",
  "trust.planned.moderation.title": "Moderation",
  "trust.planned.moderation.description":
    "Review of listings and published material. Planned, not live.",
  "trust.disclaimer":
    "KRISHIMA makes no claim of government certification, partnership or formal compliance at this stage. Those would only ever be stated with evidence.",

  /* ------------------------------------------------------------------- faq */
  "faq.eyebrow": "Frequently asked questions",
  "faq.title": "Questions people actually ask",
  "faq.description": "Short, direct answers about accounts, services and what is available today.",
  "faq.pageDescription": "Practical answers about account types, services, availability and support.",
  "faq.moreQuestions": "Still have a question?",
  "faq.contactUs": "Contact us",
  "faq.items.accounts.question": "Are these separate accounts?",
  "faq.items.accounts.answer":
    "No. A farmer, buyer or equipment owner is a role a person holds, not a separate login. One identity can carry several roles, each with its own workspace and permissions.",
  "faq.items.availability.question": "Is the platform available now?",
  "faq.items.availability.answer":
    "The public website is live and the account foundation is built. The agricultural services described here are being built and are labelled as planned wherever they appear.",
  "faq.items.services.question": "Which services will be offered first?",
  "faq.items.services.answer":
    "Farm and crop records, market and weather information, and the marketplace are the first areas in development. Labour, equipment, transport, warehouse and knowledge follow.",
  "faq.items.cost.question": "How much will it cost?",
  "faq.items.cost.answer":
    "Pricing has not been finalised, so we are not quoting figures. When pricing is decided it will be published clearly before anything is charged.",
  "faq.items.support.question": "How do I get help?",
  "faq.items.support.answer":
    "Use the help page for guidance on this website. A support channel for platform accounts will be published when account creation opens.",
  "faq.items.data.question": "What happens to my data?",
  "faq.items.data.answer":
    "Access is denied by default and granted explicitly. Our privacy policy is a draft until it has been legally reviewed, and it is marked as such.",

  /* ------------------------------------------------------------- final cta */
  "finalCta.title": "Be part of building agriculture's digital foundation",
  "finalCta.description":
    "Registration is being built. Until it opens, you can explore the platform and tell us what your work needs.",
  "finalCta.secondary": "Get in touch",
  "finalCta.note": "No payment is required and nothing is charged on this website.",

  /* ---------------------------------------------------------------- footer */
  "footer.tagline": "An agriculture super-application for India, built for the whole value chain.",
  "footer.platform": "Platform",
  "footer.solutions": "Account categories",
  "footer.support": "Help and legal",
  "footer.contact": "Contact",
  "footer.contactUnavailable": "A support channel will be published when accounts open.",
  "footer.rights": "All rights reserved.",
  "footer.platformNote": "KRISHIMA is in active development. Features marked as planned are not yet available.",

  /* ------------------------------------------------------------------ meta */
  "meta.home.title": "KRISHIMA — one platform for Indian agriculture",
  "meta.home.description":
    "KRISHIMA connects farmers, buyers, retailers, workers, equipment owners, transporters, warehouses and creators in one multilingual agriculture platform.",
  "meta.about.title": "About KRISHIMA",
  "meta.about.description": "What KRISHIMA is, the principles it is built on, and where development stands today.",
  "meta.services.title": "Services",
  "meta.services.description": "The ten connected areas KRISHIMA will bring together, with honest status for each.",
  "meta.howItWorks.title": "How it works",
  "meta.howItWorks.description": "From creating an account to managing activity, in four steps.",
  "meta.faq.title": "Frequently asked questions",
  "meta.faq.description": "Answers about account types, service availability, pricing and support.",
  "meta.contact.title": "Contact",
  "meta.contact.description": "Reach the KRISHIMA team about the platform, services or partnership.",
  "meta.help.title": "Help",
  "meta.help.description": "Guidance on using this website, languages, accessibility and reporting a problem.",
  "meta.privacy.title": "Privacy policy (draft)",
  "meta.privacy.description": "How KRISHIMA handles personal data. This policy is a draft pending legal review.",
  "meta.terms.title": "Terms of use (draft)",
  "meta.terms.description": "The terms for using KRISHIMA. These terms are a draft pending legal review.",
  "meta.notFound.title": "Page not found",
  "meta.notFound.description": "The page you were looking for does not exist.",

  /* ----------------------------------------------------------------- about */
  "about.eyebrow": "About",
  "about.title": "Agriculture deserves better software",
  "about.description":
    "KRISHIMA exists to give every participant in Indian agriculture one trusted place to keep records, find services and work with each other.",
  "about.missionTitle": "Why we are building it",
  "about.mission":
    "Agricultural work is connected in reality but fragmented in software. A farmer's records, a buyer's catalogue, a worker's history and a transporter's route all describe the same value chain, yet each usually lives somewhere separate. KRISHIMA is designed as one system so that information and trust can move with the work.",
  "about.principlesTitle": "Principles",
  "about.principles.trust.title": "Safety by construction",
  "about.principles.trust.description": "Access is denied by default, enforced in the database as well as the application.",
  "about.principles.rural.title": "Built for rural India",
  "about.principles.rural.description": "Mobile-first, light on data, and readable on a low-cost phone.",
  "about.principles.modular.title": "One system, modular inside",
  "about.principles.modular.description": "Each domain can change without disturbing the others.",
  "about.principles.languages.title": "Language is not an afterthought",
  "about.principles.languages.description": "English and Hindi at launch, with room for regional languages without redesign.",
  "about.statusTitle": "Where things stand",
  "about.status":
    "The foundation — authentication, access rules, the design system and this website — is built. The agricultural services described across this site are being built and are labelled as planned wherever they appear. We would rather say what is true than look further along than we are.",
  "about.contactCta": "Talk to us",

  /* -------------------------------------------------------------- services */
  "servicesPage.eyebrow": "Services",
  "servicesPage.title": "Everything KRISHIMA will bring together",
  "servicesPage.description":
    "Ten connected areas, designed as one system. Every one is labelled with its real status so you always know what is available.",
  "servicesPage.intro":
    "These services share one identity, one set of access rules and one design. That is what makes them a platform rather than a collection of apps.",
  "servicesPage.listTitle": "The service catalogue",
  "servicesPage.listDescription": "What each area covers, and who it is for.",
  "servicesPage.statusNote": "No service in this catalogue is live yet. Each will be announced when it becomes usable.",
  "servicesPage.rolesTitle": "Find your category",
  "servicesPage.rolesDescription": "Each category has its own page describing what the platform will do for that work.",
  "servicesPage.contactCta": "Ask about a service",
  "servicesPage.audience.farmManagement": "For farmers and farm managers",
  "servicesPage.audience.cropManagement": "For farmers and agronomists",
  "servicesPage.audience.weather": "For everyone working outdoors",
  "servicesPage.audience.mandiPrices": "For farmers, buyers and retailers",
  "servicesPage.audience.marketplace": "For farmers, buyers and retailers",
  "servicesPage.audience.equipmentRental": "For equipment owners and farmers",
  "servicesPage.audience.employment": "For workers and employers",
  "servicesPage.audience.transport": "For transporters and sellers",
  "servicesPage.audience.warehouse": "For warehouses and producers",
  "servicesPage.audience.knowledge": "For creators and learners",

  /* --------------------------------------------------------------- contact */
  "contact.eyebrow": "Contact",
  "contact.title": "Talk to the KRISHIMA team",
  "contact.description":
    "Questions about the platform, a service or a partnership are welcome. The form below is ready; sending is not connected yet.",
  "contact.submit": "Send message",
  "contact.privacyNote": "We only ask for what is needed to reply. Do not include sensitive personal details.",
  "contact.unavailableTitle": "Sending is not available yet",
  "contact.unavailableWithEmail": "Message sending is not connected. Please write to",
  "contact.unavailableNoEmail":
    "Message sending is not connected yet, and no support address has been published. Your message has not been sent — please keep it and try again once a channel is announced.",
  "contact.offlineTitle": "You appear to be offline",
  "contact.offlineBody": "Check your connection and try again. Your message has not been sent.",
  "contact.fields.role": "I am a",
  "contact.fields.rolePlaceholder": "Select a category (optional)",
  "contact.fields.roleOther": "Something else",
  "contact.fields.name": "Your name",
  "contact.fields.message": "Your message",
  "contact.fields.messageHint": "A few sentences is plenty.",
  "contact.errors.name": "Please enter your name.",
  "contact.errors.message": "Please write at least a short message (10 characters or more).",
  "contact.errors.summary": "Please correct the highlighted fields.",
  "contact.side.title": "What to expect",
  "contact.side.body":
    "This website is the public face of a platform in development. We answer questions about what is being built and when.",
  "contact.side.helpTitle": "Looking for guidance?",
  "contact.side.helpBody": "The help page covers languages, themes, accessibility and how to report a problem.",

  /* ------------------------------------------------------------------ help */
  "helpPage.eyebrow": "Help",
  "helpPage.title": "Using this website",
  "helpPage.description": "Practical guidance for the pages you can use today.",
  "helpPage.stillStuck": "Still stuck? We would rather hear about it.",
  "helpPage.topics.start.title": "Finding your way around",
  "helpPage.topics.start.body":
    "The menu links to the landing page, about, services, how it works and contact. Account categories are under Services.",
  "helpPage.topics.account.title": "Accounts",
  "helpPage.topics.account.body":
    "Account creation is not open yet. Links that are not available are marked as coming soon and do not pretend to work.",
  "helpPage.topics.languages.title": "Changing language",
  "helpPage.topics.languages.body":
    "This website is currently available in English. A language selector is present in the header and footer, and additional languages will appear there as they are completed and reviewed — we do not offer a language until its text is actually translated.",
  "helpPage.topics.accessibility.title": "Accessibility",
  "helpPage.topics.accessibility.body":
    "The site works with a keyboard and screen readers, supports reduced motion, and has light and dark themes.",
  "helpPage.topics.report.title": "Reporting a problem",
  "helpPage.topics.report.body":
    "If something looks wrong or is hard to use, tell us through the contact page. Specific details help us fix it faster.",

  /* ----------------------------------------------------------------- legal */
  "legal.eyebrow": "Legal",
  "legal.draftNotice":
    "Draft — this document has not yet been reviewed and approved by a legal professional. It is not legal advice.",
  "legal.lastUpdatedLabel": "Last updated",
  "legal.privacyPage.title": "Privacy policy (draft)",
  "legal.privacyPage.lead": "How KRISHIMA intends to handle personal data. This is a draft.",
  "legal.termsPage.title": "Terms of use (draft)",
  "legal.termsPage.lead": "The terms for using KRISHIMA. These are a draft.",
  "legal.privacy.collect.title": "What we collect",
  "legal.privacy.collect.p":
    "When accounts open, we will collect the details needed to create and secure an account, such as a name, contact details and, where a service requires it, verification documents. This draft does not yet list every field.",
  "legal.privacy.use.title": "How we use it",
  "legal.privacy.use.p":
    "Information is intended to be used to operate the platform, to keep accounts secure, to verify participants where a service requires it, and to meet legal obligations.",
  "legal.privacy.share.title": "Sharing",
  "legal.privacy.share.p":
    "We do not sell personal data. Sharing with service providers will be limited to what a specific service requires, and will be described here once finalised.",
  "legal.privacy.rights.title": "Your choices",
  "legal.privacy.rights.p":
    "The intended approach is to let you access, correct and delete your information. The exact process is pending legal review.",
  "legal.privacy.contact.title": "Contact",
  "legal.privacy.contact.p":
    "Questions about privacy can be raised through the contact page. A dedicated privacy contact will be published when available.",
  "legal.terms.use.title": "Using KRISHIMA",
  "legal.terms.use.p":
    "These terms will govern use of the platform and this website. They are a draft and are not yet in force.",
  "legal.terms.accounts.title": "Accounts",
  "legal.terms.accounts.p":
    "Accounts will be personal to the holder, and the holder will be responsible for keeping access secure.",
  "legal.terms.content.title": "Content and conduct",
  "legal.terms.content.p":
    "Listings and published material will be subject to moderation. Prohibited conduct will be described in the final terms.",
  "legal.terms.liability.title": "Liability",
  "legal.terms.liability.p":
    "Liability terms have not been drafted. Nothing here limits any right you have under applicable law.",
  "legal.terms.changes.title": "Changes",
  "legal.terms.changes.p":
    "Material changes will be communicated before they take effect. The date at the top of this page will always show the current version.",

  /* ---------------------------------------------------------- how (page) */
  "howPage.eyebrow": "How it works",
  "howPage.title": "The journey, step by step",
  "howPage.description": "What happens at each stage, and what state it is in today.",
  "howPage.stepsTitle": "Four steps",
  "howPage.statusPlanned": "Being built — not available yet",
  "howPage.note":
    "No step below involves a payment or a binding agreement yet. When that changes, it will be stated clearly.",
  "howPage.steps.account.title": "Create an account",
  "howPage.steps.account.description":
    "One identity is created once. From it, a personal workspace exists immediately, and further roles can be added as needed.",
  "howPage.steps.workspace.title": "Choose a workspace",
  "howPage.steps.workspace.description":
    "Work as yourself, or join an organization. An organization has its own members, roles and permissions, and its data stays separate from personal data.",
  "howPage.steps.discover.title": "Discover tools and services",
  "howPage.steps.discover.description":
    "Records, information and services are presented according to the roles you hold, so the platform shows what is relevant rather than everything at once.",
  "howPage.steps.connect.title": "Connect and manage activity",
  "howPage.steps.connect.description":
    "Work with other participants, keep a record of what was agreed, and refer back to it later.",

  /* -------------------------------------------------------- roles (page) */
  "rolesPage.statusNote": "This experience is being built and is not available yet.",
  "rolesPage.talkToUs": "Tell us what you need",
  "rolesPage.highlightsTitle": "What this will include",
  "rolesPage.needsTitle": "What this role needs",
  "rolesPage.requirementsTitle": "Verification and requirements",
  "rolesPage.otherRoles": "Other account categories",

  /* ------------------------------------------------------------- not found */
  "notFound.eyebrow": "404",
  "notFound.title": "This page does not exist",
  "notFound.description": "The address may have changed, or the link may be incorrect. Here are some useful places to continue.",
  "notFound.home": "Go to the home page",
  "notFound.helpful": "Helpful pages",
};

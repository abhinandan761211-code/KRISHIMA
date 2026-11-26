import type { Messages } from "@krishima/ui";

/**
 * Hindi (hi-IN) catalogue for the public website.
 *
 * Rules for this file:
 *  - Flat, dot-separated keys; the key set must match en.ts EXACTLY (a unit test
 *    enforces this, so a missing or extra key fails the build).
 *  - Natural, simple Hindi as spoken by farmers and small agricultural businesses —
 *    not formal Sanskritised Hindi. Common English words that are genuinely how
 *    people speak (KYC, QR, GPS) are transliterated rather than invented.
 *  - No unverified statistics, no invented phone numbers or addresses, and no claim
 *    of government partnership or certification anywhere.
 *  - Numbers, units and placeholders ({count}) are preserved; the runtime
 *    interpolates them.
 *  - Do not copy English into a Hindi value as a substitute for translating it.
 */
export const hi: Messages = {
  /* ---------------------------------------------------------------- common */
  "common.language": "भाषा",
  "common.comingSoon": "जल्द उपलब्ध",
  "common.questionsContact": "इस पेज के बारे में कोई सवाल है? हमसे संपर्क करें।",

  /* ------------------------------------------------------------------- nav */
  "nav.home": "होम",
  "nav.about": "हमारे बारे में",
  "nav.services": "सेवाएँ",
  "nav.solutions": "खाता श्रेणियाँ",
  "nav.howItWorks": "यह कैसे काम करता है",
  "nav.contact": "संपर्क",
  "nav.faq": "सामान्य प्रश्न",
  "nav.help": "मदद",
  "nav.privacy": "गोपनीयता नीति",
  "nav.terms": "उपयोग की शर्तें",
  "nav.homeLabel": "KRISHIMA होम",
  "nav.primaryLabel": "मुख्य नेविगेशन",
  "nav.openMenu": "मेन्यू खोलें",
  "nav.closeMenu": "मेन्यू बंद करें",
  "nav.skipToContent": "सीधे मुख्य सामग्री पर जाएँ",

  /* ------------------------------------------------------------------- cta */
  "cta.login": "लॉग इन",
  "cta.getStarted": "शुरू करें",
  "cta.exploreServices": "सेवाएँ देखें",

  /* ---------------------------------------------------------- announcement */
  "announcement.launch": "KRISHIMA अभी बन रहा है — यहाँ देखिए हम क्या तैयार कर रहे हैं।",
  "announcement.readMore": "और पढ़ें",
  "announcement.dismiss": "सूचना हटाएँ",

  /* ------------------------------------------------------------------ hero */
  "hero.eyebrow": "भारत के लिए एक कृषि प्लेटफ़ॉर्म",
  "hero.title": "समझदारी से खेती। बेहतर सौदा। मज़बूत भविष्य।",
  "hero.description":
    "किसानों, कृषि व्यवसायों, मज़दूरों और खेती के ज़रूरी कामों के लिए एक जुड़ा हुआ डिजिटल प्लेटफ़ॉर्म।",
  "hero.supportNote": "खाता बनाने की सुविधा बन रही है। अभी आप देख सकते हैं कि प्लेटफ़ॉर्म आगे क्या देगा।",
  "hero.imageAlt": "हरे गेहूँ के खेत में खड़े दो किसान, साथ में लैपटॉप देखते हुए",
  "hero.rolesCaption": "किसके लिए",
  "hero.rolesSummary": "खेती के आठ तरह के काम",

  /* -------------------------------------------------------------- platform */
  "platform.eyebrow": "KRISHIMA क्या है",
  "platform.title": "पूरी कृषि मूल्य श्रृंखला के लिए एक प्लेटफ़ॉर्म",
  "platform.description":
    "KRISHIMA उन सभी लोगों और सेवाओं को जोड़ती है जिन पर खेती टिकी है — खेत से लेकर खरीदार तक, और बीच की हर ज़रूरत — एक भरोसेमंद, बहुभाषी जगह पर।",
  "platform.points.identity.title": "एक पहचान, कई भूमिकाएँ",
  "platform.points.identity.description":
    "एक व्यक्ति एक ही समय में किसान, खरीदार और मशीन का मालिक हो सकता है। हर भूमिका का अपना डेटा अलग रहता है, ताकि आपस में कुछ न मिले।",
  "platform.points.workspaces.title": "अलग-अलग वर्कस्पेस",
  "platform.points.workspaces.description":
    "निजी खाता और बिज़नेस खाता साथ-साथ चल सकते हैं। एक वर्कस्पेस का काम दूसरे में कभी नहीं मिलता।",
  "platform.points.trust.title": "अनुमति से पहुँच",
  "platform.points.trust.description":
    "पहुँच शुरू में बंद रहती है और साफ़-साफ़ दी जाती है। जाँच ऐप में भी होती है और डेटाबेस में भी। ज़रूरी कामों का रिकॉर्ड रखा जाता है।",

  /* ----------------------------------------------------------------- roles */
  "roles.eyebrow": "किसके लिए है",
  "roles.title": "आठ तरह के काम, एक प्लेटफ़ॉर्म",
  "roles.description":
    "खेती में हर जुड़े व्यक्ति की ज़रूरत अलग होती है। नीचे हर श्रेणी का अपना वर्कस्पेस, अनुमतियाँ और औज़ार हैं।",
  "roles.footnote":
    "ये अलग-अलग खाते नहीं, बल्कि भूमिकाएँ हैं जो एक व्यक्ति रख सकता है। एक ही लॉगिन में कई भूमिकाएँ हो सकती हैं, हर एक का अपना वर्कस्पेस।",
  "roles.learnMore": "और जानें",

  "roles.farmer.name": "किसान",
  "roles.farmer.short": "खेत का हिसाब रखें, फ़सल पर नज़र रखें और मौसम की ज़रूरी सेवाएँ खोजें।",
  "roles.farmer.headline": "साफ़ हिसाब के साथ अपनी खेती चलाएँ",
  "roles.farmer.long":
    "KRISHIMA इस तरह बन रही है कि किसान अपने खेत और फ़सल का हिसाब एक जगह रख सके, मौसम के हिसाब से काम कर सके, और जब ज़रूरत हो तो मज़दूर, मशीन, ढुलाई और भंडारण ढूँढ सके — पिछले साल की बातें भी याद रहें।",
  "roles.farmer.needs": "खेत और भूखंड का रिकॉर्ड, फ़सल की समय-सारिणी, मौसम, मंडी की जानकारी और सेवाओं की खोज।",
  "roles.farmer.requirements":
    "हिसाब रखने के लिए बस एक खाता चाहिए। उपज बेचने के लिए ज़रूरी होगा कि उस सेवा के शुरू होने पर सत्यापन हो जाए।",
  "roles.farmer.highlights.h1.title": "खेत का हिसाब",
  "roles.farmer.highlights.h1.body": "भूखंड, फ़सल और मौसम एक जगह, बिखरी हुई पर्चियों की जगह।",
  "roles.farmer.highlights.h2.title": "फ़सल पर नज़र",
  "roles.farmer.highlights.h2.body": "बोने से लेकर कटाई तक हर फ़सल पर नज़र रखें।",
  "roles.farmer.highlights.h3.title": "मंडी की जानकारी",
  "roles.farmer.highlights.h3.body": "बेचने का समय तय करने से पहले दाम समझें।",
  "roles.farmer.highlights.h4.title": "पास की सेवाएँ",
  "roles.farmer.highlights.h4.body": "मज़दूर, मशीन, ढुलाई और भंडारण एक ही खोज में।",
  "roles.farmer.seo.title": "किसानों के लिए KRISHIMA",
  "roles.farmer.seo.description":
    "खेत का हिसाब, फ़सल पर नज़र, मौसम, मंडी की जानकारी और सेवाओं की खोज — एक ही प्लेटफ़ॉर्म पर।",

  "roles.buyer.name": "खरीदार",
  "roles.buyer.short": "सत्यापित विक्रेताओं से उपज और खेती के सामान खोजें।",
  "roles.buyer.headline": "भरोसे के साथ उपज और सामान खोजें",
  "roles.buyer.long":
    "खरीदार खेती की उपज और सामान देख सकेंगे, श्रेणी और जगह के हिसाब से छाँट सकेंगे, और देख सकेंगे कि कौन-से विक्रेता का सत्यापन पूरा हो चुका है — ताकि खरीद का फ़ैसला अनुमान पर नहीं, तथ्यों पर टिके।",
  "roles.buyer.needs": "साफ़ सूची, ईमानदार सत्यापन, और तय हुई बात का रिकॉर्ड।",
  "roles.buyer.requirements": "देखना खुला रहेगा। ऑर्डर देना शुरू होने पर सत्यापन ज़रूरी होगा।",
  "roles.buyer.highlights.h1.title": "खेती के लायक खोज",
  "roles.buyer.highlights.h1.body": "फ़सल, मात्रा और जगह से छाँटें, आम शब्दों से नहीं।",
  "roles.buyer.highlights.h2.title": "सत्यापित विक्रेता",
  "roles.buyer.highlights.h2.body": "हर सूची पर सत्यापन की स्थिति साफ़ दिखती है।",
  "roles.buyer.highlights.h3.title": "साफ़ मात्रा और इकाई",
  "roles.buyer.highlights.h3.body": "तय इकाइयाँ, ताकि क्विंटल का मतलब कभी बदल न जाए।",
  "roles.buyer.highlights.h4.title": "देखने लायक रिकॉर्ड",
  "roles.buyer.highlights.h4.body": "जो सूची में था वह बाद में भी वैसा ही दर्ज रहता है।",
  "roles.buyer.seo.title": "खरीदारों के लिए KRISHIMA",
  "roles.buyer.seo.description":
    "सत्यापित विक्रेताओं से खेती की उपज और सामान देखें, साफ़ मात्रा और इकाई के साथ।",

  "roles.retailer.name": "दुकानदार",
  "roles.retailer.short": "दुकान या वितरण के काम के लिए कृषि माल जुटाएँ।",
  "roles.retailer.headline": "अपने बिज़नेस के लिए माल जुटाएँ",
  "roles.retailer.long":
    "दुकानदार उपज और सामान उस मात्रा में जुटा सकेंगे जो दुकान को सच में चाहिए, आपूर्तिकर्ताओं का रिकॉर्ड रख सकेंगे, और एक बिज़नेस पहचान दिखा सकेंगे जिसे खरीदार और विक्रेता दोनों पहचानें।",
  "roles.retailer.needs": "बिज़नेस का सत्यापन, बार-बार माल जुटाना, और आपूर्तिकर्ताओं का साफ़ रिकॉर्ड।",
  "roles.retailer.requirements":
    "कारोबार से पहले बिज़नेस का सत्यापन ज़रूरी होगा, क्योंकि दुकान को भरोसा रखना पड़ता है।",
  "roles.retailer.highlights.h1.title": "बिज़नेस पहचान",
  "roles.retailer.highlights.h1.body": "सत्यापित बिज़नेस प्रोफ़ाइल, निजी खाते से अलग।",
  "roles.retailer.highlights.h2.title": "थोक मात्रा",
  "roles.retailer.highlights.h2.body": "मात्रा उन इकाइयों में जो दुकान में सच में चलती हैं।",
  "roles.retailer.highlights.h3.title": "आपूर्ति का इतिहास",
  "roles.retailer.highlights.h3.body": "जानें किसने क्या दिया, और कब।",
  "roles.retailer.highlights.h4.title": "संगठन वर्कस्पेस",
  "roles.retailer.highlights.h4.body": "कर्मचारी एक बिज़नेस वर्कस्पेस में अलग-अलग अनुमतियों के साथ काम कर सकते हैं।",
  "roles.retailer.seo.title": "दुकानदारों के लिए KRISHIMA",
  "roles.retailer.seo.description":
    "सत्यापित बिज़नेस पहचान और साफ़ आपूर्ति रिकॉर्ड के साथ कृषि माल जुटाएँ।",

  "roles.worker.name": "मज़दूर",
  "roles.worker.short": "खेत का काम खोजें और किए गए काम का रिकॉर्ड रखें।",
  "roles.worker.headline": "काम खोजें और उसका रिकॉर्ड रखें",
  "roles.worker.long":
    "मज़दूर पास में उपलब्ध खेत का काम देख सकेंगे, उसके लिए हाँ कह सकेंगे, और अपने काम का रिकॉर्ड रख सकेंगे — एक सीधा इतिहास जिससे अगला मौका ढूँढना आसान हो।",
  "roles.worker.needs": "पास के और सच्चे काम की सूची, साथ में किए गए काम का रिकॉर्ड।",
  "roles.worker.requirements": "फ़ोन से सत्यापित खाता। पहले काम के साथ ही काम का इतिहास बनना शुरू होता है।",
  "roles.worker.highlights.h1.title": "पास म‌ें काम",
  "roles.worker.highlights.h1.body": "वह काम देखें जो पहुँच में है, सैकड़ों किलोमीटर दूर नहीं।",
  "roles.worker.highlights.h2.title": "एक बार आवेदन",
  "roles.worker.highlights.h2.body": "एक नौकरी पर एक ही आवेदन — दोहरा आवेदन नहीं।",
  "roles.worker.highlights.h3.title": "काम का इतिहास",
  "roles.worker.highlights.h3.body": "किए गए काम का रिकॉर्ड, जिसे आप दिखा सकें।",
  "roles.worker.highlights.h4.title": "साफ़ शर्तें",
  "roles.worker.highlights.h4.body": "काम में क्या-क्या होगा और पैसा कैसे मिलेगा — पहले से साफ़।",
  "roles.worker.seo.title": "खेत मज़दूरों के लिए KRISHIMA",
  "roles.worker.seo.description": "पास में खेत का काम खोजें और किए गए काम का रिकॉर्ड रखें।",

  "roles.equipment.name": "मशीन का मालिक",
  "roles.equipment.short": "जिन खेतों को ज़रूरत हो उन्हें ट्रैक्टर, पंप और मशीन दें।",
  "roles.equipment.headline": "अपनी मशीन को काम पर लगाएँ",
  "roles.equipment.long":
    "मशीन के मालिक अपनी मशीनों की सूची बना सकेंगे, उनके खाली रहने का समय बता सकेंगे, और बुकिंग ले सकेंगे — बिना यह डर कि दो किसानों को एक ही समय पर एक ही मशीन का वादा हो जाए।",
  "roles.equipment.needs": "सच्ची उपलब्धता वाली सूची, और ऐसी बुकिंग जो एक साथ न हो।",
  "roles.equipment.requirements": "बुकिंग लेने से पहले मालिक का सत्यापन ज़रूरी होगा।",
  "roles.equipment.highlights.h1.title": "मशीन की सूची",
  "roles.equipment.highlights.h1.body": "बताएँ कि आपके पास क्या है और वह कब खाली है।",
  "roles.equipment.highlights.h2.title": "दोहरी बुकिंग नहीं",
  "roles.equipment.highlights.h2.body": "एक ही समय की बुकिंग डेटाबेस के स्तर पर रोकी जाती है।",
  "roles.equipment.highlights.h3.title": "किराए का इतिहास",
  "roles.equipment.highlights.h3.body": "क्या किराए पर दिया और कब — इसका रिकॉर्ड।",
  "roles.equipment.highlights.h4.title": "आसपास के खेतों तक पहुँच",
  "roles.equipment.highlights.h4.body": "मशीन उन्हें मिले जो उसे इस्तेमाल कर सकते हैं।",
  "roles.equipment.seo.title": "मशीन के मालिकों के लिए KRISHIMA",
  "roles.equipment.seo.description":
    "ट्रैक्टर और मशीनों की सूची बनाएँ, उपलब्धता बताएँ और ऐसी बुकिंग लें जो एक साथ न हों।",

  "roles.transporter.name": "ट्रांसपोर्टर",
  "roles.transporter.short": "उपज और सामान खेत, मंडी और गोदाम के बीच पहुँचाएँ।",
  "roles.transporter.headline": "खेती का उत्पाद आगे पहुँचाएँ",
  "roles.transporter.long":
    "ट्रांसपोर्टर अपने रास्ते और क्षमता के हिसाब से ढुलाई के अनुरोध देख सकेंगे, और माल ले जाने से पहले शर्तें तय कर सकेंगे।",
  "roles.transporter.needs": "ऐसे अनुरोध जो सच में रास्ते में पड़ें, और माल चलने से पहले तय शर्तें।",
  "roles.transporter.requirements": "माल लेने से पहले वाहन और पहचान का सत्यापन ज़रूरी होगा।",
  "roles.transporter.highlights.h1.title": "अनुकूल भार",
  "roles.transporter.highlights.h1.body": "आपके रास्ते और क्षमता के हिसाब से अनुरोध।",
  "roles.transporter.highlights.h2.title": "चलने से पहले शर्तें",
  "roles.transporter.highlights.h2.body": "क्या जाएगा और पैसा कैसे मिलेगा — पहले से तय।",
  "roles.transporter.highlights.h3.title": "डिलीवरी का रिकॉर्ड",
  "roles.transporter.highlights.h3.body": "हर पूरी हुई ढुलाई का रिकॉर्ड।",
  "roles.transporter.highlights.h4.title": "वाहन का सत्यापन",
  "roles.transporter.highlights.h4.body": "सत्यापित वाहन दोनों तरफ़ भरोसा बढ़ाते हैं।",
  "roles.transporter.seo.title": "ट्रांसपोर्टरों के लिए KRISHIMA",
  "roles.transporter.seo.description":
    "अपने रास्ते के अनुकूल कृषि भार खोजें और ले जाने से पहले शर्तें तय करें।",

  "roles.warehouse.name": "गोदाम",
  "roles.warehouse.short": "कटाई से बिक्री तक उपज के भंडारण की सुविधा दें।",
  "roles.warehouse.headline": "ऐसा भंडारण दें जिस पर किसान भरोसा करें",
  "roles.warehouse.long":
    "गोदाम अपनी जगह की उपलब्धता बता सकेंगे, भंडारण के अनुरोध ले सकेंगे, और यह सही रिकॉर्ड रख सकेंगे कि क्या रखा है और कब से।",
  "roles.warehouse.needs": "सही जगह की जानकारी, साफ़ भंडारण शर्तें, और रखे माल का रिकॉर्ड।",
  "roles.warehouse.requirements": "उपज लेने से पहले सुविधा का सत्यापन ज़रूरी होगा।",
  "roles.warehouse.highlights.h1.title": "जगह की जानकारी दें",
  "roles.warehouse.highlights.h1.body": "दिखाएँ कि सच में कितनी जगह खाली है।",
  "roles.warehouse.highlights.h2.title": "भंडारण शर्तें",
  "roles.warehouse.highlights.h2.body": "उपज आने से पहले समय और शर्तें बता दें।",
  "roles.warehouse.highlights.h3.title": "सही रिकॉर्ड",
  "roles.warehouse.highlights.h3.body": "जानें क्या रखा है, और कब से।",
  "roles.warehouse.highlights.h4.title": "जगह से ज़्यादा बुकिंग नहीं",
  "roles.warehouse.highlights.h4.body": "अनुरोध लेते समय जगह की जाँच होती है।",
  "roles.warehouse.seo.title": "गोदामों के लिए KRISHIMA",
  "roles.warehouse.seo.description":
    "भंडारण की जगह बताएँ, भंडारण अनुरोध लें और रखे माल का सही रिकॉर्ड रखें।",

  "roles.creator.name": "कंटेंट क्रिएटर",
  "roles.creator.short": "लिखकर और वीडियो से खेती की जानकारी साझा करें।",
  "roles.creator.headline": "खेती के अपने अनुभव साझा करें",
  "roles.creator.long":
    "क्रिएटर खेती की जानकारी और वीडियो से सीखने की सामग्री उन लोगों तक पहुँचा सकेंगे जिन्हें वह अपनी भाषा में चाहिए — काम की बात, शोर नहीं।",
  "roles.creator.needs": "प्रकाशित करने की जगह, और ऐसे लोग जो उनकी भाषा में उनका काम ढूँढ सकें।",
  "roles.creator.requirements": "सत्यापित खाता। प्रकाशित सामग्री पर एक समीक्षा नियम लागू होता है।",
  "roles.creator.highlights.h1.title": "लिखी जानकारी",
  "roles.creator.highlights.h1.body": "फ़सल और मौसम के हिसाब से काम की सलाह।",
  "roles.creator.highlights.h2.title": "वीडियो से सीखना",
  "roles.creator.highlights.h2.body": "देखकर सीखने वालों के लिए छोटा, काम का वीडियो।",
  "roles.creator.highlights.h3.title": "स्थानीय भाषाएँ",
  "roles.creator.highlights.h3.body": "जानकारी उसी भाषा में पहुँचे जो लोग बोलते हैं।",
  "roles.creator.highlights.h4.title": "समीक्षा के बाद प्रकाशन",
  "roles.creator.highlights.h4.body": "एक साफ़ नियम सलाह को भरोसेमंद रखता है।",
  "roles.creator.seo.title": "कंटेंट क्रिएटर के लिए KRISHIMA",
  "roles.creator.seo.description":
    "खेती की जानकारी और वीडियो से सीखने की सामग्री लोगों की अपनी भाषा में प्रकाशित करें।",

  /* -------------------------------------------------------------- features */
  "features.eyebrow": "प्लेटफ़ॉर्म की सुविधाएँ",
  "features.title": "प्लेटफ़ॉर्म क्या-क्या एक साथ लाएगा",
  "features.description":
    "दस जुड़े हुए क्षेत्र, जो दस अलग ऐप की तरह नहीं बल्कि एक ही व्यवस्था की तरह काम करेंगे। हर एक पर उसकी असली स्थिति लिखी है।",
  "features.planned": "प्रस्तावित",
  "features.legend": "का मतलब है कि सुविधा बन रही है और अभी इस्तेमाल के लायक नहीं है।",

  "features.farmManagement.title": "खेत का प्रबंधन",
  "features.farmManagement.description": "भूखंड, मौसम और हिसाब एक जगह, बिखरी पर्चियों की जगह।",
  "features.cropManagement.title": "फ़सल का प्रबंधन",
  "features.cropManagement.description": "बोने से कटाई तक हर फ़सल पर नज़र, साथ में क्या किया और कब।",
  "features.weather.title": "मौसम की जानकारी",
  "features.weather.description": "बोने, छिड़काव और कटाई की योजना बनाने के लिए स्थानीय मौसम।",
  "features.mandiPrices.title": "मंडी भाव",
  "features.mandiPrices.description": "कब और कहाँ बेचना है, यह तय करने के लिए बाज़ार भाव।",
  "features.marketplace.title": "कृषि बाज़ार",
  "features.marketplace.description": "साफ़ मात्रा, इकाई और विक्रेता के सत्यापन के साथ उपज और सामान।",
  "features.equipmentRental.title": "मशीन किराए पर",
  "features.equipmentRental.description": "आसपास उपलब्ध ट्रैक्टर और मशीन, ऐसी बुकिंग के साथ जो एक साथ न हों।",
  "features.employment.title": "खेत में रोज़गार",
  "features.employment.description": "पास में काम दें और खोजें, एक नौकरी पर एक ही आवेदन।",
  "features.transport.title": "ढुलाई की सेवाएँ",
  "features.transport.description": "खेत, मंडी और गोदाम के बीच उपज ले जाएँ, शर्तें पहले तय करके।",
  "features.warehouse.title": "गोदाम की सेवाएँ",
  "features.warehouse.description": "जगह की जानकारी और रखे माल के सही रिकॉर्ड के साथ भंडारण।",
  "features.knowledge.title": "जानकारी और समुदाय",
  "features.knowledge.description": "खेती की काम की सलाह और सीखना, उसी भाषा में जो लोग सच में बोलते हैं।",

  /* ------------------------------------------------------------- ecosystem */
  "ecosystem.eyebrow": "जुड़ा हुआ तंत्र",
  "ecosystem.title": "जुड़े लोग आपस में कैसे जुड़ते हैं",
  "ecosystem.description":
    "खेती अलग-अलग सौदों का नहीं, रिश्तों की एक श्रृंखला है। KRISHIMA इस तरह बनाई गई है कि हर जुड़ा व्यक्ति प्लेटफ़ॉर्म छोड़े बिना अगले तक पहुँच सके।",
  "ecosystem.hub": "KRISHIMA",
  "ecosystem.nodes.farmer": "किसान",
  "ecosystem.nodes.buyer": "खरीदार",
  "ecosystem.nodes.retailer": "दुकानदार",
  "ecosystem.nodes.worker": "मज़दूर",
  "ecosystem.nodes.equipment": "मशीन",
  "ecosystem.nodes.transporter": "ढुलाई",
  "ecosystem.nodes.warehouse": "गोदाम",
  "ecosystem.nodes.creator": "क्रिएटर",
  "ecosystem.links.farmer.from": "किसान",
  "ecosystem.links.farmer.relation":
    "उपज की सूची बनाता है, मज़दूर और मशीन बुलाता है, ढुलाई और भंडारण का इंतज़ाम करता है।",
  "ecosystem.links.buyer.from": "खरीदार",
  "ecosystem.links.buyer.relation": "सत्यापित विक्रेताओं से उपज और सामान खोजता है।",
  "ecosystem.links.retailer.from": "दुकानदार",
  "ecosystem.links.retailer.relation": "माल उस मात्रा में जुटाता है जो बिज़नेस को चाहिए।",
  "ecosystem.links.worker.from": "मज़दूर",
  "ecosystem.links.worker.relation": "पास में काम खोजता है और किए गए काम का रिकॉर्ड बनाता है।",
  "ecosystem.links.equipment.from": "मशीन का मालिक",
  "ecosystem.links.equipment.relation": "जिन्हें ज़रूरत हो उन्हें मशीन देता है, बिना दोहरी बुकिंग के।",
  "ecosystem.links.transporter.from": "ट्रांसपोर्टर",
  "ecosystem.links.transporter.relation": "उपज और सामान खेत, मंडी और गोदाम के बीच पहुँचाता है।",
  "ecosystem.links.warehouse.from": "गोदाम",
  "ecosystem.links.warehouse.relation": "कटाई से बिक्री तक उपज सही रिकॉर्ड के साथ रखता है।",
  "ecosystem.links.creator.from": "कंटेंट क्रिएटर",
  "ecosystem.links.creator.relation": "काम की जानकारी उसी भाषा में साझा करता है जो लोग बोलते हैं।",

  /* ------------------------------------------------------------------- how */
  "how.eyebrow": "यह कैसे काम करता है",
  "how.title": "खाते से काम तक, चार कदमों में",
  "how.description": "एक छोटी यात्रा, जो हर भूमिका के लिए एक जैसी है।",
  "how.stepLabel": "कदम",
  "how.availableNow": "अभी उपलब्ध",
  "how.note":
    "खाते की बुनियाद आज मौजूद है। नीचे बताए गए वर्कस्पेस और सेवाएँ बन रहे हैं — जब तक बन न जाएँ, इन्हें चालू नहीं बताया जाता।",
  "how.seeFaq": "आम सवाल देखें",
  "how.steps.account.title": "खाता बनाएँ",
  "how.steps.account.description": "एक पहचान, साथ में शुरू से तैयार निजी वर्कस्पेस।",
  "how.steps.workspace.title": "वर्कस्पेस चुनें",
  "how.steps.workspace.description":
    "अपने नाम से काम करें, या ऐसे संगठन से जुड़ें जिसके अपने सदस्य और अनुमतियाँ हों।",
  "how.steps.discover.title": "औज़ार और सेवाएँ खोजें",
  "how.steps.discover.description": "वह हिसाब, जानकारी और सेवाएँ खोजें जो आपके काम से मेल खाएँ।",
  "how.steps.connect.title": "जुड़ें और काम संभालें",
  "how.steps.connect.description": "दूसरे लोगों के साथ काम करें और तय हुई बात का रिकॉर्ड रखें।",

  /* ------------------------------------------------------------ solutions */
  "solutions.farmer.eyebrow": "किसान के लिए समाधान",
  "solutions.farmer.title": "किसान का अनुभव जो हम बना रहे हैं",
  "solutions.farmer.description":
    "ऐसा हिसाब जो मौसम-दर-मौसम काम आए, और ऐसी सेवाएँ जो ज़रूरत के समय मिल जाएँ।",
  "solutions.farmer.statusNote": "नीचे हर बात प्रस्तावित है। इनमें से कोई औज़ार अभी चालू नहीं है।",
  "solutions.farmer.items.records.title": "खेत का हिसाब",
  "solutions.farmer.items.records.description": "भूखंड, फ़सल और मौसम एक ही जगह।",
  "solutions.farmer.items.crops.title": "फ़सल पर नज़र",
  "solutions.farmer.items.crops.description": "हर फ़सल बोने से कटाई तक।",
  "solutions.farmer.items.weather.title": "मौसम",
  "solutions.farmer.items.weather.description": "खेत के काम की योजना के लिए स्थानीय मौसम।",
  "solutions.farmer.items.market.title": "मंडी की जानकारी",
  "solutions.farmer.items.market.description": "कब और कहाँ बेचें, यह तय करने के लिए भाव।",
  "solutions.farmer.items.harvest.title": "कटाई का प्रबंधन",
  "solutions.farmer.items.harvest.description": "क्या कटा, और उसका क्या हुआ।",
  "solutions.farmer.items.services.title": "सेवाओं की खोज",
  "solutions.farmer.items.services.description": "मज़दूर, मशीन, ढुलाई और भंडारण एक ही खोज में।",
  "solutions.seeFarmer": "किसानों के लिए और",

  "solutions.business.eyebrow": "बिज़नेस के लिए समाधान",
  "solutions.business.title": "बिज़नेस को प्लेटफ़ॉर्म से क्या मिलता है",
  "solutions.business.description":
    "खरीदार, दुकानदार, ट्रांसपोर्टर, मशीन देने वाले और गोदाम — सबको एक ही चीज़ चाहिए: भरोसेमंद सामने वाला और साफ़ रिकॉर्ड।",
  "solutions.business.statusNote": "नीचे हर बात प्रस्तावित है। इनमें से कोई औज़ार अभी चालू नहीं है।",
  "solutions.business.items.buyers.title": "खरीदार",
  "solutions.business.items.buyers.description": "साफ़ मात्रा और सत्यापित विक्रेताओं वाली सूची।",
  "solutions.business.items.retailers.title": "दुकानदार",
  "solutions.business.items.retailers.description": "बिज़नेस पहचान और बार-बार माल जुटाना।",
  "solutions.business.items.transport.title": "ट्रांसपोर्ट कंपनियाँ",
  "solutions.business.items.transport.description": "रास्ते और क्षमता के हिसाब से भार।",
  "solutions.business.items.equipment.title": "मशीन देने वाले",
  "solutions.business.items.equipment.description": "ऐसी मशीन बुकिंग जो एक साथ न हों।",
  "solutions.business.items.warehouses.title": "गोदाम",
  "solutions.business.items.warehouses.description": "जगह की जानकारी और सही रिकॉर्ड।",
  "solutions.business.items.partners.title": "अन्य साझेदार",
  "solutions.business.items.partners.description": "ऐसे संगठन जिनके अपने सदस्य, भूमिकाएँ और अनुमतियाँ हों।",
  "solutions.seeBusiness": "बिज़नेस के लिए और",

  /* --------------------------------------------------------------- preview */
  "preview.eyebrow": "बाज़ार की झलक",
  "preview.title": "सूचियाँ कैसे काम करेंगी, इसकी पहली झलक",
  "preview.description":
    "यह एक डिज़ाइन का नमूना है, सच में रखा माल नहीं। यह दिखाता है कि सूची कैसी दिखेगी: फ़सल, मात्रा, इकाई और भाव।",
  "preview.illustrative": "केवल उदाहरण",
  "preview.illustrativeNote": "डिज़ाइन के लिए नमूना सामग्री। कोई सच्ची सूची, विक्रेता या भाव नहीं।",
  "preview.sampleMeta": "नमूना सूची",
  "preview.rows.wheat.name": "गेहूँ",
  "preview.rows.wheat.price": "₹ — उदाहरण",
  "preview.rows.paddy.name": "धान",
  "preview.rows.paddy.price": "₹ — उदाहरण",
  "preview.rows.tomato.name": "टमाटर",
  "preview.rows.tomato.price": "₹ — उदाहरण",
  "preview.side.title": "सूचियाँ कैसे काम करेंगी",
  "preview.side.filters": "फ़सल, जगह और मात्रा से छाँटें।",
  "preview.side.verified": "हर सूची पर विक्रेता का सत्यापन दिखेगा।",
  "preview.side.units": "तय इकाइयाँ, ताकि क्विंटल हमेशा क्विंटल ही रहे।",
  "preview.side.disclaimer": "बाज़ार शुरू होने पर भाव सच्ची सूचियों से आएँगे।",

  /* ------------------------------------------------------------- community */
  "community.eyebrow": "समुदाय और जानकारी",
  "community.title": "सीखना उन तक पहुँचे जिन्हें इसकी ज़रूरत है",
  "community.description":
    "खेती की काम की जानकारी सही भाषा में मिलना अक्सर मुश्किल होता है। यह हिस्सा उसे बदलने के लिए बनाया जा रहा है।",
  "community.statusNote": "समुदाय की सुविधाएँ प्रस्तावित हैं। अभी कोई सामाजिक फ़ीड या प्रकाशन उपलब्ध नहीं है।",
  "community.pillars.knowledge.title": "जानकारी",
  "community.pillars.knowledge.description": "फ़सल और मौसम के हिसाब से काम की सलाह, बिखरी पोस्ट नहीं।",
  "community.pillars.video.title": "वीडियो से सीखना",
  "community.pillars.video.description": "देखकर सीखने वालों के लिए छोटा, काम का वीडियो।",
  "community.pillars.community.title": "समुदाय",
  "community.pillars.community.description": "पूछने और जवाब देने की जगह, समीक्षा के साथ ताकि सलाह भरोसेमंद रहे।",

  /* ----------------------------------------------------------------- trust */
  "trust.eyebrow": "भरोसा और सुरक्षा",
  "trust.title": "आज क्या सुरक्षित है, और क्या आने वाला है",
  "trust.description":
    "हम अलग-अलग बताते हैं कि सच में क्या बन चुका है और क्या प्रस्तावित है। नीचे कोई प्रमाणपत्र या गारंटी नहीं है।",
  "trust.implementedTitle": "आज लागू",
  "trust.plannedTitle": "प्रस्तावित",
  "trust.implemented.auth.title": "सत्यापित लॉगिन",
  "trust.implemented.auth.description":
    "टोकन पहचान देने वाली सेवा की सार्वजनिक कुंजियों से जाँचे जाते हैं। नकली, पुराने और गलत पते वाले टोकन अस्वीकार किए जाते हैं।",
  "trust.implemented.access.title": "पहुँच शुरू में बंद",
  "trust.implemented.access.description":
    "हर सुरक्षित काम के लिए साफ़ अनुमति चाहिए, जो ऐप में जाँची जाती है और डेटाबेस में फिर से लागू होती है।",
  "trust.implemented.storage.title": "निजी दस्तावेज़ भंडारण",
  "trust.implemented.storage.description":
    "निजी फ़ाइलें सबके लिए सूचीबद्ध या डाउनलोड करने लायक नहीं हैं; पहुँच समय-सीमित और सोच-समझकर दी जाती है।",
  "trust.implemented.privacy.title": "जानकारी को सँभालकर रखना",
  "trust.implemented.privacy.description":
    "लॉग और गड़बड़ी के संदेश ऐसे लिखे जाते हैं कि निजी बातें, कुंजियाँ या अंदरूनी पते सामने न आएँ।",
  "trust.planned.kyc.title": "सत्यापन (KYC)",
  "trust.planned.kyc.description":
    "विक्रेता, बिज़नेस, वाहन और सुविधा का सत्यापन, जाँच की कतार के साथ। प्रस्तावित है, चालू नहीं।",
  "trust.planned.audit.title": "ऑडिट रिकॉर्ड",
  "trust.planned.audit.description":
    "भूमिका बदलने और सत्यापन के फ़ैसले जैसे ज़रूरी कामों का रिकॉर्ड। प्रस्तावित है, चालू नहीं।",
  "trust.planned.moderation.title": "समीक्षा",
  "trust.planned.moderation.description": "सूचियों और प्रकाशित सामग्री की जाँच। प्रस्तावित है, चालू नहीं।",
  "trust.disclaimer":
    "KRISHIMA इस समय सरकारी प्रमाणन, साझेदारी या औपचारिक अनुपालन का कोई दावा नहीं करती। ऐसी बात कभी भी सबूत के साथ ही कही जाएगी।",

  /* ------------------------------------------------------------------- faq */
  "faq.eyebrow": "अक्सर पूछे जाने वाले सवाल",
  "faq.title": "वे सवाल जो लोग सच में पूछते हैं",
  "faq.description": "खाते, सेवाओं और आज क्या उपलब्ध है — इस पर छोटे, सीधे जवाब।",
  "faq.pageDescription": "खाते के प्रकार, सेवाएँ, उपलब्धता और सहायता पर काम के जवाब।",
  "faq.moreQuestions": "अभी भी कोई सवाल है?",
  "faq.contactUs": "हमसे संपर्क करें",
  "faq.items.accounts.question": "क्या ये अलग-अलग खाते हैं?",
  "faq.items.accounts.answer":
    "नहीं। किसान, खरीदार या मशीन का मालिक होना इस बात पर निर्भर है कि व्यक्ति क्या काम करता है — ये अलग लॉगिन नहीं हैं। एक पहचान में कई भूमिकाएँ हो सकती हैं, हर एक के अपने वर्कस्पेस और अनुमतियाँ।",
  "faq.items.availability.question": "क्या प्लेटफ़ॉर्म अभी उपलब्ध है?",
  "faq.items.availability.answer":
    "सार्वजनिक वेबसाइट चालू है और खाते की बुनियाद बन चुकी है। यहाँ बताई गई कृषि सेवाएँ बन रही हैं, और जहाँ भी दिखें वहाँ प्रस्तावित बताई गई हैं।",
  "faq.items.services.question": "सबसे पहले कौन-सी सेवाएँ मिलेंगी?",
  "faq.items.services.answer":
    "खेत और फ़सल का हिसाब, मंडी और मौसम की जानकारी, और बाज़ार — ये पहले बन रहे हैं। उसके बाद मज़दूरी, मशीन, ढुलाई, गोदाम और जानकारी।",
  "faq.items.cost.question": "इसका कितना खर्च होगा?",
  "faq.items.cost.answer":
    "कीमत अभी तय नहीं हुई, इसलिए हम कोई आँकड़ा नहीं बता रहे। जब कीमत तय होगी, पैसा लेने से पहले साफ़-साफ़ बता दी जाएगी।",
  "faq.items.support.question": "मदद कैसे मिलेगी?",
  "faq.items.support.answer":
    "इस वेबसाइट के बारे में मार्गदर्शन के लिए मदद पेज देखें। खाता बनना शुरू होने पर प्लेटफ़ॉर्म खातों के लिए सहायता का ज़रिया भी बता दिया जाएगा।",
  "faq.items.data.question": "मेरी जानकारी का क्या होता है?",
  "faq.items.data.answer":
    "पहुँच शुरू में बंद रहती है और साफ़-साफ़ दी जाती है। हमारी गोपनीयता नीति तब तक ड्राफ़्ट है जब तक उसकी कानूनी जाँच न हो जाए, और उसे ड्राफ़्ट ही बताया गया है।",

  /* ------------------------------------------------------------- final cta */
  "finalCta.title": "कृषि की डिजिटल बुनियाद बनाने में शामिल हों",
  "finalCta.description":
    "पंजीकरण बन रहा है। जब तक वह खुले, आप प्लेटफ़ॉर्म देख सकते हैं और बता सकते हैं कि आपके काम को क्या चाहिए।",
  "finalCta.secondary": "संपर्क करें",
  "finalCta.note": "किसी भी भुगतान की ज़रूरत नहीं है और इस वेबसाइट पर कोई पैसा नहीं लिया जाता।",

  /* ---------------------------------------------------------------- footer */
  "footer.tagline": "भारत के लिए एक कृषि सुपर-ऐप, पूरी मूल्य श्रृंखला के लिए बनाया गया।",
  "footer.platform": "प्लेटफ़ॉर्म",
  "footer.solutions": "खाता श्रेणियाँ",
  "footer.support": "मदद और कानूनी",
  "footer.contact": "संपर्क",
  "footer.contactUnavailable": "खाते खुलने पर सहायता का ज़रिया बता दिया जाएगा।",
  "footer.rights": "सर्वाधिकार सुरक्षित।",
  "footer.platformNote": "KRISHIMA अभी बन रही है। जो सुविधाएँ प्रस्तावित बताई गई हैं वे अभी उपलब्ध नहीं हैं।",

  /* ------------------------------------------------------------------ meta */
  "meta.home.title": "KRISHIMA — भारतीय कृषि के लिए एक प्लेटफ़ॉर्म",
  "meta.home.description":
    "KRISHIMA किसानों, खरीदारों, दुकानदारों, मज़दूरों, मशीन के मालिकों, ट्रांसपोर्टरों, गोदामों और क्रिएटरों को एक बहुभाषी कृषि प्लेटफ़ॉर्म पर जोड़ती है।",
  "meta.about.title": "KRISHIMA के बारे में",
  "meta.about.description": "KRISHIMA क्या है, किन सिद्धांतों पर बनी है, और आज विकास कहाँ तक पहुँचा है।",
  "meta.services.title": "सेवाएँ",
  "meta.services.description": "दस जुड़े क्षेत्र जिन्हें KRISHIMA एक साथ लाएगी, हर एक की सच्ची स्थिति के साथ।",
  "meta.howItWorks.title": "यह कैसे काम करता है",
  "meta.howItWorks.description": "खाता बनाने से काम संभालने तक, चार कदमों में।",
  "meta.faq.title": "अक्सर पूछे जाने वाले सवाल",
  "meta.faq.description": "खाते के प्रकार, सेवाओं की उपलब्धता, कीमत और सहायता पर जवाब।",
  "meta.contact.title": "संपर्क",
  "meta.contact.description": "प्लेटफ़ॉर्म, सेवाओं या साझेदारी के बारे में KRISHIMA टीम से संपर्क करें।",
  "meta.help.title": "मदद",
  "meta.help.description": "इस वेबसाइट के इस्तेमाल, भाषाओं, सुगमता और गड़बड़ी बताने पर मार्गदर्शन।",
  "meta.privacy.title": "गोपनीयता नीति (ड्राफ़्ट)",
  "meta.privacy.description": "KRISHIMA निजी जानकारी कैसे सँभालती है। यह नीति कानूनी जाँच तक ड्राफ़्ट है।",
  "meta.terms.title": "उपयोग की शर्तें (ड्राफ़्ट)",
  "meta.terms.description": "KRISHIMA इस्तेमाल करने की शर्तें। ये शर्तें कानूनी जाँच तक ड्राफ़्ट हैं।",
  "meta.notFound.title": "पेज नहीं मिला",
  "meta.notFound.description": "जो पेज आप खोज रहे थे वह मौजूद नहीं है।",

  /* ----------------------------------------------------------------- about */
  "about.eyebrow": "हमारे बारे में",
  "about.title": "खेती को बेहतर सॉफ़्टवेयर मिलना चाहिए",
  "about.description":
    "KRISHIMA इसलिए है कि भारतीय खेती से जुड़े हर व्यक्ति को हिसाब रखने, सेवाएँ खोजने और एक-दूसरे के साथ काम करने की एक भरोसेमंद जगह मिले।",
  "about.missionTitle": "हम इसे क्यों बना रहे हैं",
  "about.mission":
    "खेती का काम असल में जुड़ा हुआ है, पर सॉफ़्टवेयर में बिखरा हुआ है। किसान का हिसाब, खरीदार की सूची, मज़दूर का इतिहास और ट्रांसपोर्टर का रास्ता — सब एक ही मूल्य श्रृंखला की बात करते हैं, फिर भी हर एक अलग जगह रहता है। KRISHIMA एक ही व्यवस्था के रूप में बनाई गई है, ताकि जानकारी और भरोसा काम के साथ चल सकें।",
  "about.principlesTitle": "सिद्धांत",
  "about.principles.trust.title": "बनावट में ही सुरक्षा",
  "about.principles.trust.description": "पहुँच शुरू में बंद, और डेटाबेस के साथ-साथ ऐप में भी लागू।",
  "about.principles.rural.title": "गाँव-देहात के लिए बनाया",
  "about.principles.rural.description": "मोबाइल पहले, कम डेटा, और सस्ते फ़ोन पर पढ़ने लायक।",
  "about.principles.modular.title": "एक व्यवस्था, अंदर से अलग-अलग",
  "about.principles.modular.description": "हर हिस्सा बदल सकता है, बिना बाकी को छेड़े।",
  "about.principles.languages.title": "भाषा बाद की बात नहीं",
  "about.principles.languages.description":
    "शुरू में अंग्रेज़ी और हिंदी, और क्षेत्रीय भाषाओं के लिए बिना डिज़ाइन बदले जगह।",
  "about.statusTitle": "अभी स्थिति क्या है",
  "about.status":
    "बुनियाद — लॉगिन, पहुँच के नियम, डिज़ाइन सिस्टम और यह वेबसाइट — बन चुकी है। इस साइट पर बताई गई कृषि सेवाएँ बन रही हैं और जहाँ भी दिखें वहाँ प्रस्तावित बताई गई हैं। हम आगे से बढ़कर दिखने के बजाय सच कहना पसंद करते हैं।",
  "about.contactCta": "हमसे बात करें",

  /* -------------------------------------------------------------- services */
  "servicesPage.eyebrow": "सेवाएँ",
  "servicesPage.title": "KRISHIMA जो कुछ एक साथ लाएगी",
  "servicesPage.description":
    "दस जुड़े क्षेत्र, एक ही व्यवस्था के रूप में। हर एक पर उसकी सच्ची स्थिति लिखी है, ताकि आपको हमेशा पता रहे कि क्या उपलब्ध है।",
  "servicesPage.intro":
    "इन सेवाओं की एक पहचान, पहुँच के एक नियम और एक ही डिज़ाइन है। इसी से ये एक प्लेटफ़ॉर्म बनती हैं, अलग ऐप का ढेर नहीं।",
  "servicesPage.listTitle": "सेवाओं की सूची",
  "servicesPage.listDescription": "हर क्षेत्र क्या कवर करता है, और किसके लिए है।",
  "servicesPage.statusNote": "इस सूची में कोई सेवा अभी चालू नहीं है। जब भी कोई इस्तेमाल लायक बनेगी, उसकी घोषणा की जाएगी।",
  "servicesPage.rolesTitle": "अपनी श्रेणी खोजें",
  "servicesPage.rolesDescription": "हर श्रेणी का अपना पेज है, जो बताता है कि प्लेटफ़ॉर्म उस काम के लिए क्या करेगी।",
  "servicesPage.contactCta": "किसी सेवा के बारे में पूछें",
  "servicesPage.audience.farmManagement": "किसानों और खेत प्रबंधकों के लिए",
  "servicesPage.audience.cropManagement": "किसानों और कृषि विशेषज्ञों के लिए",
  "servicesPage.audience.weather": "खुले में काम करने वाले सबके लिए",
  "servicesPage.audience.mandiPrices": "किसानों, खरीदारों और दुकानदारों के लिए",
  "servicesPage.audience.marketplace": "किसानों, खरीदारों और दुकानदारों के लिए",
  "servicesPage.audience.equipmentRental": "मशीन के मालिकों और किसानों के लिए",
  "servicesPage.audience.employment": "मज़दूरों और काम देने वालों के लिए",
  "servicesPage.audience.transport": "ट्रांसपोर्टरों और बेचने वालों के लिए",
  "servicesPage.audience.warehouse": "गोदामों और उत्पादकों के लिए",
  "servicesPage.audience.knowledge": "क्रिएटरों और सीखने वालों के लिए",

  /* --------------------------------------------------------------- contact */
  "contact.eyebrow": "संपर्क",
  "contact.title": "KRISHIMA टीम से बात करें",
  "contact.description":
    "प्लेटफ़ॉर्म, किसी सेवा या साझेदारी के बारे में सवाल का स्वागत है। नीचे का फ़ॉर्म तैयार है; भेजना अभी जुड़ा नहीं है।",
  "contact.submit": "संदेश भेजें",
  "contact.privacyNote": "हम सिर्फ़ वही पूछते हैं जो जवाब देने के लिए ज़रूरी है। कृपया निजी जानकारी न लिखें।",
  "contact.unavailableTitle": "भेजना अभी उपलब्ध नहीं है",
  "contact.unavailableWithEmail": "संदेश भेजना जुड़ा नहीं है। कृपया लिखें",
  "contact.unavailableNoEmail":
    "संदेश भेजना अभी जुड़ा नहीं है, और कोई सहायता पता प्रकाशित नहीं हुआ। आपका संदेश नहीं भेजा गया — कृपया उसे सँभालकर रखें और जब ज़रिया बताया जाए तब दोबारा कोशिश करें।",
  "contact.offlineTitle": "लगता है आप ऑफ़लाइन हैं",
  "contact.offlineBody": "अपना इंटरनेट जाँचें और दोबारा कोशिश करें। आपका संदेश नहीं भेजा गया।",
  "contact.fields.role": "मैं हूँ",
  "contact.fields.rolePlaceholder": "श्रेणी चुनें (वैकल्पिक)",
  "contact.fields.roleOther": "कुछ और",
  "contact.fields.name": "आपका नाम",
  "contact.fields.message": "आपका संदेश",
  "contact.fields.messageHint": "कुछ वाक्य काफ़ी हैं।",
  "contact.errors.name": "कृपया अपना नाम लिखें।",
  "contact.errors.message": "कृपया कम से कम एक छोटा संदेश लिखें (10 अक्षर या ज़्यादा)।",
  "contact.errors.summary": "कृपया चिह्नित जगहें ठीक करें।",
  "contact.side.title": "क्या उम्मीद रखें",
  "contact.side.body":
    "यह वेबसाइट एक बनते हुए प्लेटफ़ॉर्म का सार्वजनिक चेहरा है। हम बताते हैं कि क्या बन रहा है और कब।",
  "contact.side.helpTitle": "मार्गदर्शन चाहिए?",
  "contact.side.helpBody": "मदद पेज में भाषाएँ, थीम, सुगमता और गड़बड़ी बताने का तरीका दिया है।",

  /* ------------------------------------------------------------------ help */
  "helpPage.eyebrow": "मदद",
  "helpPage.title": "इस वेबसाइट का इस्तेमाल",
  "helpPage.description": "आज आप जिन पेजों का इस्तेमाल कर सकते हैं, उनके लिए काम का मार्गदर्शन।",
  "helpPage.stillStuck": "अभी भी अटके हैं? हमें बताइए, हम सुनना पसंद करेंगे।",
  "helpPage.topics.start.title": "रास्ता ढूँढना",
  "helpPage.topics.start.body":
    "मेन्यू में होम, हमारे बारे में, सेवाएँ, यह कैसे काम करता है और संपर्क के लिंक हैं। खाता श्रेणियाँ सेवाएँ के नीचे हैं।",
  "helpPage.topics.account.title": "खाते",
  "helpPage.topics.account.body":
    "खाता बनाना अभी खुला नहीं है। जो लिंक उपलब्ध नहीं हैं उन पर 'जल्द उपलब्ध' लिखा है और वे काम करने का दिखावा नहीं करते।",
  "helpPage.topics.languages.title": "भाषा बदलना",
  "helpPage.topics.languages.body":
    "यह वेबसाइट अभी अंग्रेज़ी में उपलब्ध है। भाषा चुनने वाला बटन हेडर और फुटर में मौजूद है, और जैसे-जैसे भाषाएँ पूरी होकर जाँची जाएँगी, वहाँ दिखने लगेंगी — हम किसी भाषा को तब तक नहीं देते जब तक उसका पाठ सच में अनुवादित न हो।",
  "helpPage.topics.accessibility.title": "सुगमता",
  "helpPage.topics.accessibility.body":
    "यह साइट कीबोर्ड और स्क्रीन रीडर के साथ चलती है, कम गति वाले उपकरणों का सम्मान करती है, और इसमें हल्की और गहरी थीम हैं।",
  "helpPage.topics.report.title": "गड़बड़ी बताना",
  "helpPage.topics.report.body":
    "अगर कुछ गलत लगे या इस्तेमाल में दिक्कत हो, तो संपर्क पेज से हमें बताएँ। साफ़ जानकारी से हम जल्दी ठीक कर पाते हैं।",

  /* ----------------------------------------------------------------- legal */
  "legal.eyebrow": "कानूनी",
  "legal.draftNotice":
    "ड्राफ़्ट — इस दस्तावेज़ की कानूनी विशेषज्ञ से जाँच और स्वीकृति अभी नहीं हुई है। यह कानूनी सलाह नहीं है।",
  "legal.lastUpdatedLabel": "आखिरी बार अपडेट",
  "legal.privacyPage.title": "गोपनीयता नीति (ड्राफ़्ट)",
  "legal.privacyPage.lead": "KRISHIMA निजी जानकारी कैसे सँभालना चाहती है। यह एक ड्राफ़्ट है।",
  "legal.termsPage.title": "उपयोग की शर्तें (ड्राफ़्ट)",
  "legal.termsPage.lead": "KRISHIMA इस्तेमाल करने की शर्तें। ये एक ड्राफ़्ट हैं।",
  "legal.privacy.collect.title": "हम क्या लेते हैं",
  "legal.privacy.collect.p":
    "जब खाते खुलेंगे, हम वही जानकारी लेंगे जो खाता बनाने और उसे सुरक्षित रखने के लिए ज़रूरी है, जैसे नाम, संपर्क विवरण और, जहाँ कोई सेवा माँगे, सत्यापन के दस्तावेज़। यह ड्राफ़्ट अभी हर जानकारी नहीं गिनाता।",
  "legal.privacy.use.title": "हम इसका इस्तेमाल कैसे करते हैं",
  "legal.privacy.use.p":
    "जानकारी प्लेटफ़ॉर्म चलाने, खाते सुरक्षित रखने, जहाँ सेवा माँगे वहाँ लोगों का सत्यापन करने, और कानूनी ज़िम्मेदारियाँ निभाने के लिए इस्तेमाल की जाएगी।",
  "legal.privacy.share.title": "साझा करना",
  "legal.privacy.share.p":
    "हम निजी जानकारी बेचते नहीं। सेवा देने वालों के साथ साझा करना सिर्फ़ उतना ही होगा जितना किसी सेवा के लिए ज़रूरी है, और अंतिम रूप तय होने पर यहाँ लिखा जाएगा।",
  "legal.privacy.rights.title": "आपके विकल्प",
  "legal.privacy.rights.p":
    "इरादा यह है कि आप अपनी जानकारी देख, सुधार और हटा सकें। सही तरीका कानूनी जाँच के बाद तय होगा।",
  "legal.privacy.contact.title": "संपर्क",
  "legal.privacy.contact.p":
    "गोपनीयता से जुड़े सवाल संपर्क पेज से पूछे जा सकते हैं। गोपनीयता के लिए अलग संपर्क तब बताया जाएगा जब उपलब्ध हो।",
  "legal.terms.use.title": "KRISHIMA का इस्तेमाल",
  "legal.terms.use.p": "ये शर्तें प्लेटफ़ॉर्म और इस वेबसाइट के इस्तेमाल पर लागू होंगी। ये ड्राफ़्ट हैं और अभी लागू नहीं हैं।",
  "legal.terms.accounts.title": "खाते",
  "legal.terms.accounts.p": "खाते खाताधारक के अपने होंगे, और पहुँच सुरक्षित रखना उनकी ज़िम्मेदारी होगी।",
  "legal.terms.content.title": "सामग्री और आचरण",
  "legal.terms.content.p":
    "सूचियाँ और प्रकाशित सामग्री समीक्षा के अधीन होंगी। क्या नहीं करना है, यह अंतिम शर्तों में लिखा जाएगा।",
  "legal.terms.liability.title": "ज़िम्मेदारी",
  "legal.terms.liability.p":
    "ज़िम्मेदारी की शर्तें अभी नहीं बनीं। यहाँ कुछ भी लागू कानून से आपको मिले किसी अधिकार को सीमित नहीं करता।",
  "legal.terms.changes.title": "बदलाव",
  "legal.terms.changes.p":
    "बड़े बदलाव लागू होने से पहले बताए जाएँगे। इस पेज पर ऊपर दी तारीख़ हमेशा मौजूदा संस्करण दिखाएगी।",

  /* ---------------------------------------------------------- how (page) */
  "howPage.eyebrow": "यह कैसे काम करता है",
  "howPage.title": "यात्रा, कदम-दर-कदम",
  "howPage.description": "हर चरण में क्या होता है, और आज उसकी स्थिति क्या है।",
  "howPage.stepsTitle": "चार कदम",
  "howPage.statusPlanned": "बन रहा है — अभी उपलब्ध नहीं",
  "howPage.note":
    "नीचे किसी भी कदम में अभी कोई भुगतान या पक्का सौदा नहीं है। जब ऐसा होगा, साफ़-साफ़ बता दिया जाएगा।",
  "howPage.steps.account.title": "खाता बनाएँ",
  "howPage.steps.account.description":
    "एक पहचान एक बार बनती है। उससे निजी वर्कस्पेस तुरंत मिल जाता है, और ज़रूरत के हिसाब से और भूमिकाएँ जोड़ी जा सकती हैं।",
  "howPage.steps.workspace.title": "वर्कस्पेस चुनें",
  "howPage.steps.workspace.description":
    "अपने नाम से काम करें, या किसी संगठन से जुड़ें। संगठन के अपने सदस्य, भूमिकाएँ और अनुमतियाँ होती हैं, और उसका डेटा निजी डेटा से अलग रहता है।",
  "howPage.steps.discover.title": "औज़ार और सेवाएँ खोजें",
  "howPage.steps.discover.description":
    "हिसाब, जानकारी और सेवाएँ आपकी भूमिकाओं के हिसाब से दिखाई जाती हैं, ताकि प्लेटफ़ॉर्म सब कुछ एक साथ न दिखाए, बल्कि जो काम का हो वह दिखाए।",
  "howPage.steps.connect.title": "जुड़ें और काम संभालें",
  "howPage.steps.connect.description":
    "दूसरे लोगों के साथ काम करें, तय हुई बात का रिकॉर्ड रखें, और बाद में उसे फिर देख सकें।",

  /* -------------------------------------------------------- roles (page) */
  "rolesPage.statusNote": "यह अनुभव बन रहा है और अभी उपलब्ध नहीं है।",
  "rolesPage.talkToUs": "बताएँ आपको क्या चाहिए",
  "rolesPage.highlightsTitle": "इसमें क्या-क्या होगा",
  "rolesPage.needsTitle": "इस भूमिका को क्या चाहिए",
  "rolesPage.requirementsTitle": "सत्यापन और शर्तें",
  "rolesPage.otherRoles": "दूसरी खाता श्रेणियाँ",

  /* ------------------------------------------------------------- not found */
  "notFound.eyebrow": "404",
  "notFound.title": "यह पेज मौजूद नहीं है",
  "notFound.description":
    "पता बदल गया हो सकता है, या लिंक गलत हो सकता है। आगे बढ़ने के लिए यहाँ कुछ काम की जगहें हैं।",
  "notFound.home": "होम पेज पर जाएँ",
  "notFound.helpful": "काम के पेज",
};

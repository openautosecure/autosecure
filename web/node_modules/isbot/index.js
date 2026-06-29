var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createIsbot: () => createIsbot,
  createIsbotFromList: () => createIsbotFromList,
  getPattern: () => getPattern,
  isbot: () => isbot,
  isbotMatch: () => isbotMatch,
  isbotMatches: () => isbotMatches,
  isbotNaive: () => isbotNaive,
  isbotPattern: () => isbotPattern,
  isbotPatterns: () => isbotPatterns,
  list: () => list
});
module.exports = __toCommonJS(index_exports);

// src/patterns.json
var patterns_default = [
  " daum[ /]",
  " deusu/",
  "(?:^|[^g])news(?!sapphire)",
  "(?<! (?:channel/|google/))google(?!(wv|app|/google| pixel))",
  "(?<! cu)bots?(?:\\b|_)",
  "(?<!(?:lib))http",
  "(?<!cam)scan",
  "24x7",
  ";\\s\\w+;$",
  "@[a-z][\\w-]+\\.",
  "\\(\\)",
  "\\.com\\b",
  "\\b\\w+\\.ai",
  "\\bbw/",
  "\\bdlc\\b",
  "\\bort/",
  "\\bperl\\b",
  "\\btime/",
  "\\|",
  "^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)",
  "^[\\w\\-]+/[\\w]+$",
  "^[^ ]{50,}$",
  "^\\d+\\b",
  "^\\W",
  "^\\w*search\\b",
  "^\\w+/[\\w\\(\\)]*$",
  "^\\w+/\\d\\.\\d\\s\\([\\w@]+\\)$",
  "^active",
  "^ad muncher",
  "^amaya",
  "^apache/",
  "^avsdevicesdk/",
  "^azure",
  "^biglotron",
  "^blackbox exporter",
  "^bot",
  "^clamav[ /]",
  "^claude-code/",
  "^client/",
  "^cobweb/",
  "^custom",
  "^ddg[_-]android",
  "^discourse",
  "^dispatch/\\d",
  "^downcast/",
  "^duckduckgo",
  "^email",
  "^exodusmovement",
  "^facebook",
  "^getright/",
  "^gozilla/",
  "^hobbit",
  "^hotzonu",
  "^hwcdn/",
  "^igetter/",
  "^jeode/",
  "^jetty/",
  "^jigsaw",
  "^microsoft bits",
  "^movabletype",
  "^mozilla/\\d\\.\\d\\s[\\w\\.-]+$",
  "^mozilla/\\d\\.\\d\\s\\((?:compatible;)?(?:\\s?[\\w\\d-.]+\\/\\d+\\.\\d+)?\\)$",
  "^navermailapp",
  "^netsurf",
  "^offline",
  "^openai/",
  "^owler",
  "^php",
  "^postman",
  "^ps_daily/",
  "^python",
  "^rank",
  "^read",
  "^reed",
  "^remove\\.bg/",
  "^rest",
  "^rss",
  "^snapchat",
  "^sora ",
  "^space bison",
  "^stape/",
  "^svn",
  "^swcd ",
  "^taringa",
  "^thumbor/",
  "^track",
  "^w3c",
  "^webbandit/",
  "^webcopier",
  "^wget",
  "^whatsapp",
  "^wordpress",
  "^xenu link sleuth",
  "^yahoo",
  "^yandex",
  "^zdm/\\d",
  "^zoom marketplace/",
  "abuse",
  "advisor",
  "agent\\b",
  "analyzer",
  "archive",
  "ask jeeves/teoma",
  "attracta",
  "audit",
  "bluecoat drtr",
  "browsex",
  "burpcollaborator",
  "capture",
  "catch",
  "check\\b",
  "checker",
  "chrome-lighthouse",
  "chromeframe",
  "classifier",
  "cloudflare",
  "collapsify\\b",
  "convertify",
  "cookiehubverify/",
  "crawl",
  "cursor/",
  "cypress/",
  "dareboost",
  "datanyze",
  "dejaclick",
  "detect",
  "dmbrowser",
  "download",
  "exaleadcloudview",
  "feed",
  "fetcher",
  "firephp",
  "foregenix",
  "functionize",
  "grab",
  "productfinder",
  "hardenize\\b",
  "headless",
  "hotjar",
  "httrack",
  "hubspot marketing grader",
  "ibisbrowser",
  "infrawatch",
  "insight",
  "inspect",
  "iplabel",
  "java(?!;)",
  "library",
  "linkcheck",
  "linktiger",
  "mail\\.ru/",
  "manager",
  "manus-user/",
  "marketgoo/",
  "measure",
  "monitor\\b",
  "neustar wpm",
  "node\\b",
  "nutch",
  "offbyone",
  "openvas",
  "optimize",
  "pageburst",
  "pagespeed",
  "parser",
  "phantomjs",
  "pingdom",
  "playwright",
  "powermarks",
  "preview",
  "proxy",
  "ptst[ /]\\d",
  "readable/",
  "retriever",
  "rexx;",
  "rigor",
  "rss\\b",
  "scrape",
  "securityheaders",
  "selenium",
  "server",
  "silktide",
  "sindup/",
  "sogou",
  "sparkler/",
  "speedcurve",
  "spider",
  "splash",
  "statuscake",
  "supercleaner",
  "synapse",
  "synthetic",
  "testlocally",
  "tools",
  "torrent",
  "transcoder",
  "upday/",
  "url",
  "validator",
  "virtuoso",
  "wappalyzer",
  "watchtowr",
  "webglance",
  "webkit2png",
  "whatcms/",
  "xtate/"
];

// src/pattern.ts
var fullPattern = " daum[ /]| deusu/|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(wv|app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<!cam)scan|24x7|;\\s\\w+;$|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\b\\w+\\.ai|\\bbw/|\\bdlc\\b|\\bort/|\\bperl\\b|\\btime/|\\||^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[\\w\\-]+/[\\w]+$|^[^ ]{50,}$|^\\d+\\b|^\\W|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^\\w+/\\d\\.\\d\\s\\([\\w@]+\\)$|^active|^ad muncher|^amaya|^apache/|^avsdevicesdk/|^azure|^biglotron|^blackbox exporter|^bot|^clamav[ /]|^claude-code/|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^exodusmovement|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\((?:compatible;)?(?:\\s?[\\w\\d-.]+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^ps_daily/|^python|^rank|^read|^reed|^remove\\.bg/|^rest|^rss|^snapchat|^sora |^space bison|^stape/|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|abuse|advisor|agent\\b|analyzer|archive|ask jeeves/teoma|attracta|audit|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|collapsify\\b|convertify|cookiehubverify/|crawl|cursor/|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|exaleadcloudview|feed|fetcher|firephp|foregenix|functionize|grab|productfinder|hardenize\\b|headless|hotjar|httrack|hubspot marketing grader|ibisbrowser|infrawatch|insight|inspect|iplabel|java(?!;)|library|linkcheck|linktiger|mail\\.ru/|manager|manus-user/|marketgoo/|measure|monitor\\b|neustar wpm|node\\b|nutch|offbyone|openvas|optimize|pageburst|pagespeed|parser|phantomjs|pingdom|playwright|powermarks|preview|proxy|ptst[ /]\\d|readable/|retriever|rexx;|rigor|rss\\b|scrape|securityheaders|selenium|server|silktide|sindup/|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|testlocally|tools|torrent|transcoder|upday/|url|validator|virtuoso|wappalyzer|watchtowr|webglance|webkit2png|whatcms/|xtate/";

// src/index.ts
var naivePattern = /bot|crawl|http|lighthouse|scan|search|spider/i;
var pattern;
function getPattern() {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  try {
    pattern = new RegExp(fullPattern, "i");
  } catch (error) {
    pattern = naivePattern;
  }
  return pattern;
}
var isNonEmptyString = (value) => typeof value === "string" && value !== "";
var list = patterns_default;
function isbot(userAgent) {
  return isNonEmptyString(userAgent) && getPattern().test(userAgent);
}
var isbotNaive = (userAgent) => isNonEmptyString(userAgent) && naivePattern.test(userAgent);
var createIsbot = (customPattern) => (userAgent) => isNonEmptyString(userAgent) && customPattern.test(userAgent);
var createIsbotFromList = (list2) => {
  const pattern2 = new RegExp(list2.join("|"), "i");
  return (userAgent) => isNonEmptyString(userAgent) && pattern2.test(userAgent);
};
var isbotMatch = (userAgent) => {
  var _a, _b;
  return (_b = (_a = userAgent == null ? void 0 : userAgent.match(getPattern())) == null ? void 0 : _a[0]) != null ? _b : null;
};
var isbotMatches = (userAgent) => list.map((part) => {
  var _a;
  return (_a = userAgent == null ? void 0 : userAgent.match(new RegExp(part, "i"))) == null ? void 0 : _a[0];
}).filter(isNonEmptyString);
var isbotPattern = (userAgent) => {
  var _a;
  return userAgent ? (_a = list.find((pattern2) => new RegExp(pattern2, "i").test(userAgent))) != null ? _a : null : null;
};
var isbotPatterns = (userAgent) => userAgent ? list.filter((pattern2) => new RegExp(pattern2, "i").test(userAgent)) : [];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createIsbot,
  createIsbotFromList,
  getPattern,
  isbot,
  isbotMatch,
  isbotMatches,
  isbotNaive,
  isbotPattern,
  isbotPatterns,
  list
});

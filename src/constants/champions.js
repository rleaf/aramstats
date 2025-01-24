/* 
   3/13/24
   Newest champ: Smolder
   0: Champion id, 1: For code, 2: For humans 
*/

const names = [
   [266, "Aatrox", "Aatrox"],
   [799, "Ambessa", "Ambessa"],
   [103, "Ahri", "Ahri"],
   [84, "Akali", "Akali"],
   [166, "Akshan", "Akshan"],
   [12, "Alistar", "Alistar"],
   [32, "Amumu", "Amumu"],
   [34, "Anivia", "Anivia"],
   [1, "Annie", "Annie"],
   [523, "Aphelios", "Aphelios"],
   [22, "Ashe", "Ashe"],
   [136, "AurelionSol", "Aurelion Sol"],
   [893, "Aurora", "Aurora"],
   [268, "Azir", "Azir"],
   [432, "Bard", "Bard"],
   [200, "Belveth", "Bel'Veth"],
   [53, "Blitzcrank", "Blitzcrank"],
   [63, "Brand", "Brand"],
   [201, "Braum", "Braum"],
   [233, "Briar", "Briar"],
   [51, "Caitlyn", "Caitlyn"],
   [164, "Camille", "Camille"],
   [69, "Cassiopeia", "Cassiopeia"],
   [31, "Chogath", "Cho'Gath"],
   [42, "Corki", "Corki"],
   [122, "Darius", "Darius"],
   [131, "Diana", "Diana"],
   [119, "Draven", "Draven"],
   [36, "DrMundo", "Dr. Mundo"],
   [245, "Ekko", "Ekko"],
   [60, "Elise", "Elise"],
   [28, "Evelynn", "Evelynn"],
   [81, "Ezreal", "Ezreal"],
   [9, "Fiddlesticks", "Fiddlesticks"],
   [114, "Fiora", "Fiora"],
   [105, "Fizz", "Fizz"],
   [3, "Galio", "Galio"],
   [41, "Gangplank", "Gangplank"],
   [86, "Garen", "Garen"],
   [150, "Gnar", "Gnar"],
   [79, "Gragas", "Gragas"],
   [104, "Graves", "Graves"],
   [887, "Gwen", "Gwen"],
   [120, "Hecarim", "Hecarim"],
   [74, "Heimerdinger", "Heimerdinger"],
   [910, "Hwei", "Hwei"],
   [420, "Illaoi", "Illaoi"],
   [39, "Irelia", "Irelia"],
   [427, "Ivern", "Ivern"],
   [40, "Janna", "Janna"],
   [59, "JarvanIV", "Jarvan IV"],
   [24, "Jax", "Jax"],
   [126, "Jayce", "Jayce"],
   [202, "Jhin", "Jhin"],
   [222, "Jinx", "Jinx"],
   [145, "Kaisa", "Kai'Sa"],
   [429, "Kalista", "Kalista"],
   [43, "Karma", "Karma"],
   [30, "Karthus", "Karthus"],
   [38, "Kassadin", "Kassadin"],
   [55, "Katarina", "Katarina"],
   [10, "Kayle", "Kayle"],
   [141, "Kayn", "Kayn"],
   [85, "Kennen", "Kennen"],
   [121, "Khazix", "Kha'Zix"],
   [203, "Kindred", "Kindred"],
   [240, "Kled", "Kled"],
   [96, "KogMaw", "Kog'Maw"],
   [897, "KSante", "K'Sante"],
   [7, "Leblanc", "LeBlanc"],
   [64, "LeeSin", "Lee Sin"],
   [89, "Leona", "Leona"],
   [876, "Lillia", "Lillia"],
   [127, "Lissandra", "Lissandra"],
   [236, "Lucian", "Lucian"],
   [117, "Lulu", "Lulu"],
   [99, "Lux", "Lux"],
   [54, "Malphite", "Malphite"],
   [90, "Malzahar", "Malzahar"],
   [57, "Maokai", "Maokai"],
   [11, "MasterYi", "Master Yi"],
   [800, "Mel", "Mel"],
   [902, "Milio", "Milio"],
   [21, "MissFortune", "Miss Fortune"],
   [62, "MonkeyKing", "Wukong"],
   [82, "Mordekaiser", "Mordekaiser"],
   [25, "Morgana", "Morgana"],
   [950, "Naafiri", "Naafiri"],
   [267, "Nami", "Nami"],
   [75, "Nasus", "Nasus"],
   [111, "Nautilus", "Nautilus"],
   [518, "Neeko", "Neeko"],
   [76, "Nidalee", "Nidalee"],
   [895, "Nilah", "Nilah"],
   [56, "Nocturne", "Nocturne"],
   [20, "Nunu", "Nunu & Willump"],
   [2, "Olaf", "Olaf"],
   [61, "Orianna", "Orianna"],
   [516, "Ornn", "Ornn"],
   [80, "Pantheon", "Pantheon"],
   [78, "Poppy", "Poppy"],
   [555, "Pyke", "Pyke"],
   [246, "Qiyana", "Qiyana"],
   [133, "Quinn", "Quinn"],
   [497, "Rakan", "Rakan"],
   [33, "Rammus", "Rammus"],
   [421, "RekSai", "Rek'Sai"],
   [526, "Rell", "Rell"],
   [888, "Renata", "Renata Glasc"],
   [58, "Renekton", "Renekton"],
   [107, "Rengar", "Rengar"],
   [92, "Riven", "Riven"],
   [68, "Rumble", "Rumble"],
   [13, "Ryze", "Ryze"],
   [360, "Samira", "Samira"],
   [113, "Sejuani", "Sejuani"],
   [235, "Senna", "Senna"],
   [147, "Seraphine", "Seraphine"],
   [875, "Sett", "Sett"],
   [35, "Shaco", "Shaco"],
   [98, "Shen", "Shen"],
   [102, "Shyvana", "Shyvana"],
   [27, "Singed", "Singed"],
   [14, "Sion", "Sion"],
   [15, "Sivir", "Sivir"],
   [72, "Skarner", "Skarner"],
   [901, "Smolder", "Smolder"],
   [37, "Sona", "Sona"],
   [16, "Soraka", "Soraka"],
   [50, "Swain", "Swain"],
   [517, "Sylas", "Sylas"],
   [134, "Syndra", "Syndra"],
   [223, "TahmKench", "Tahm Kench"],
   [163, "Taliyah", "Taliyah"],
   [91, "Talon", "Talon"],
   [44, "Taric", "Taric"],
   [17, "Teemo", "Teemo"],
   [412, "Thresh", "Thresh"],
   [18, "Tristana", "Tristana"],
   [48, "Trundle", "Trundle"],
   [23, "Tryndamere", "Tryndamere"],
   [4, "TwistedFate", "Twisted Fate"],
   [29, "Twitch", "Twitch"],
   [77, "Udyr", "Udyr"],
   [6, "Urgot", "Urgot"],
   [110, "Varus", "Varus"],
   [67, "Vayne", "Vayne"],
   [45, "Veigar", "Veigar"],
   [161, "Velkoz", "Vel'Koz"],
   [711, "Vex", "Vex"],
   [254, "Vi", "Vi"],
   [234, "Viego", "Viego"],
   [112, "Viktor", "Viktor"],
   [8, "Vladimir", "Vladimir"],
   [106, "Volibear", "Volibear"],
   [19, "Warwick", "Warwick"],
   [498, "Xayah", "Xayah"],
   [101, "Xerath", "Xerath"],
   [5, "XinZhao", "Xin Zhao"],
   [157, "Yasuo", "Yasuo"],
   [777, "Yone", "Yone"],
   [83, "Yorick", "Yorick"],
   [350, "Yuumi", "Yuumi"],
   [154, "Zac", "Zac"],
   [238, "Zed", "Zed"],
   [221, "Zeri", "Zeri"],
   [115, "Ziggs", "Ziggs"],
   [26, "Zilean", "Zilean"],
   [142, "Zoe", "Zoe"],
   [143, "Zyra", "Zyra"]
]

// ID mapping to ddragon url for image assets
const imageName = {
   266: "Aatrox",
   799: "Ambessa",
   103: "Ahri",
   84: "Akali",
   166: "Akshan",
   12: "Alistar",
   32: "Amumu",
   34: "Anivia",
   1: "Annie",
   523: "Aphelios",
   22: "Ashe",
   136: "AurelionSol",
   893: "Aurora",
   268: "Azir",
   432: "Bard",
   200: "Belveth",
   53: "Blitzcrank",
   63: "Brand",
   201: "Braum",
   233: "Briar",
   51: "Caitlyn",
   164: "Camille",
   69: "Cassiopeia",
   31: "Chogath",
   42: "Corki",
   122: "Darius",
   131: "Diana",
   119: "Draven",
   36: "DrMundo",
   245: "Ekko",
   60: "Elise",
   28: "Evelynn",
   81: "Ezreal",
   9: "Fiddlesticks",
   114: "Fiora",
   105: "Fizz",
   3: "Galio",
   41: "Gangplank",
   86: "Garen",
   150: "Gnar",
   79: "Gragas",
   104: "Graves",
   887: "Gwen",
   120: "Hecarim",
   74: "Heimerdinger",
   910: "Hwei",
   420: "Illaoi",
   39: "Irelia",
   427: "Ivern",
   40: "Janna",
   59: "JarvanIV",
   24: "Jax",
   126: "Jayce",
   202: "Jhin",
   222: "Jinx",
   145: "Kaisa",
   429: "Kalista",
   43: "Karma",
   30: "Karthus",
   38: "Kassadin",
   55: "Katarina",
   10: "Kayle",
   141: "Kayn",
   85: "Kennen",
   121: "Khazix",
   203: "Kindred",
   240: "Kled",
   96: "KogMaw",
   897: "KSante",
   7: "Leblanc",
   64: "LeeSin",
   89: "Leona",
   876: "Lillia",
   127: "Lissandra",
   236: "Lucian",
   117: "Lulu",
   99: "Lux",
   54: "Malphite",
   90: "Malzahar",
   57: "Maokai",
   11: "MasterYi",
   800: "Mel",
   902: "Milio",
   21: "MissFortune",
   62: "MonkeyKing",
   82: "Mordekaiser",
   25: "Morgana",
   950: "Naafiri",
   267: "Nami",
   75: "Nasus",
   111: "Nautilus",
   518: "Neeko",
   76: "Nidalee",
   895: "Nilah",
   56: "Nocturne",
   20: "Nunu",
   2: "Olaf",
   61: "Orianna",
   516: "Ornn",
   80: "Pantheon",
   78: "Poppy",
   555: "Pyke",
   246: "Qiyana",
   133: "Quinn",
   497: "Rakan",
   33: "Rammus",
   421: "RekSai",
   526: "Rell",
   888: "Renata",
   58: "Renekton",
   107: "Rengar",
   92: "Riven",
   68: "Rumble",
   13: "Ryze",
   360: "Samira",
   113: "Sejuani",
   235: "Senna",
   147: "Seraphine",
   875: "Sett",
   35: "Shaco",
   98: "Shen",
   102: "Shyvana",
   27: "Singed",
   14: "Sion",
   15: "Sivir",
   72: "Skarner",
   901: "Smolder",
   37: "Sona",
   16: "Soraka",
   50: "Swain",
   517: "Sylas",
   134: "Syndra",
   223: "TahmKench",
   163: "Taliyah",
   91: "Talon",
   44: "Taric",
   17: "Teemo",
   412: "Thresh",
   18: "Tristana",
   48: "Trundle",
   23: "Tryndamere",
   4: "TwistedFate",
   29: "Twitch",
   77: "Udyr",
   6: "Urgot",
   110: "Varus",
   67: "Vayne",
   45: "Veigar",
   161: "Velkoz",
   711: "Vex",
   254: "Vi",
   234: "Viego",
   112: "Viktor",
   8: "Vladimir",
   106: "Volibear",
   19: "Warwick",
   498: "Xayah",
   101: "Xerath",
   5: "XinZhao",
   157: "Yasuo",
   777: "Yone",
   83: "Yorick",
   350: "Yuumi",
   154: "Zac",
   238: "Zed",
   221: "Zeri",
   115: "Ziggs",
   26: "Zilean",
   142: "Zoe",
   143: "Zyra",
}

// ID mapping for the URL. Very similar to the imageName, but Monkeyking -> Wukong
const urlName = {
   266: "Aatrox",
   799: "Ambessa",
   103: "Ahri",
   84: "Akali",
   166: "Akshan",
   12: "Alistar",
   32: "Amumu",
   34: "Anivia",
   1: "Annie",
   523: "Aphelios",
   22: "Ashe",
   136: "AurelionSol",
   893: "Aurora",
   268: "Azir",
   432: "Bard",
   200: "Belveth",
   53: "Blitzcrank",
   63: "Brand",
   201: "Braum",
   233: "Briar",
   51: "Caitlyn",
   164: "Camille",
   69: "Cassiopeia",
   31: "Chogath",
   42: "Corki",
   122: "Darius",
   131: "Diana",
   119: "Draven",
   36: "DrMundo",
   245: "Ekko",
   60: "Elise",
   28: "Evelynn",
   81: "Ezreal",
   9: "Fiddlesticks",
   114: "Fiora",
   105: "Fizz",
   3: "Galio",
   41: "Gangplank",
   86: "Garen",
   150: "Gnar",
   79: "Gragas",
   104: "Graves",
   887: "Gwen",
   120: "Hecarim",
   74: "Heimerdinger",
   910: "Hwei",
   420: "Illaoi",
   39: "Irelia",
   427: "Ivern",
   40: "Janna",
   59: "JarvanIV",
   24: "Jax",
   126: "Jayce",
   202: "Jhin",
   222: "Jinx",
   145: "Kaisa",
   429: "Kalista",
   43: "Karma",
   30: "Karthus",
   38: "Kassadin",
   55: "Katarina",
   10: "Kayle",
   141: "Kayn",
   85: "Kennen",
   121: "Khazix",
   203: "Kindred",
   240: "Kled",
   96: "KogMaw",
   897: "KSante",
   7: "Leblanc",
   64: "LeeSin",
   89: "Leona",
   876: "Lillia",
   127: "Lissandra",
   236: "Lucian",
   117: "Lulu",
   99: "Lux",
   54: "Malphite",
   90: "Malzahar",
   57: "Maokai",
   11: "MasterYi",
   800: "Mel",
   902: "Milio",
   21: "MissFortune",
   62: "Wukong",
   82: "Mordekaiser",
   25: "Morgana",
   950: "Naafiri",
   267: "Nami",
   75: "Nasus",
   111: "Nautilus",
   518: "Neeko",
   76: "Nidalee",
   895: "Nilah",
   56: "Nocturne",
   20: "Nunu",
   2: "Olaf",
   61: "Orianna",
   516: "Ornn",
   80: "Pantheon",
   78: "Poppy",
   555: "Pyke",
   246: "Qiyana",
   133: "Quinn",
   497: "Rakan",
   33: "Rammus",
   421: "RekSai",
   526: "Rell",
   888: "Renata",
   58: "Renekton",
   107: "Rengar",
   92: "Riven",
   68: "Rumble",
   13: "Ryze",
   360: "Samira",
   113: "Sejuani",
   235: "Senna",
   147: "Seraphine",
   875: "Sett",
   35: "Shaco",
   98: "Shen",
   102: "Shyvana",
   27: "Singed",
   14: "Sion",
   15: "Sivir",
   72: "Skarner",
   901: "Smolder",
   37: "Sona",
   16: "Soraka",
   50: "Swain",
   517: "Sylas",
   134: "Syndra",
   223: "TahmKench",
   163: "Taliyah",
   91: "Talon",
   44: "Taric",
   17: "Teemo",
   412: "Thresh",
   18: "Tristana",
   48: "Trundle",
   23: "Tryndamere",
   4: "TwistedFate",
   29: "Twitch",
   77: "Udyr",
   6: "Urgot",
   110: "Varus",
   67: "Vayne",
   45: "Veigar",
   161: "Velkoz",
   711: "Vex",
   254: "Vi",
   234: "Viego",
   112: "Viktor",
   8: "Vladimir",
   106: "Volibear",
   19: "Warwick",
   498: "Xayah",
   101: "Xerath",
   5: "XinZhao",
   157: "Yasuo",
   777: "Yone",
   83: "Yorick",
   350: "Yuumi",
   154: "Zac",
   238: "Zed",
   221: "Zeri",
   115: "Ziggs",
   26: "Zilean",
   142: "Zoe",
   143: "Zyra",
}

// ID mapping for humans. Includes non alphabetic characters and spaces such as DrMundo -> Dr. Mundo, Ksante -> K'Sante
const humanName = {
   266: "Aatrox",
   799: "Ambessa",
   103: "Ahri",
   84: "Akali",
   166: "Akshan",
   12: "Alistar",
   32: "Amumu",
   34: "Anivia",
   1: "Annie",
   523: "Aphelios",
   22: "Ashe",
   136: "Aurelion Sol",
   893: "Aurora",
   268: "Azir",
   432: "Bard",
   200: "Bel'Veth",
   53: "Blitzcrank",
   63: "Brand",
   201: "Braum",
   233: "Briar",
   51: "Caitlyn",
   164: "Camille",
   69: "Cassiopeia",
   31: "Cho'Gath",
   42: "Corki",
   122: "Darius",
   131: "Diana",
   119: "Draven",
   36: "Dr. Mundo",
   245: "Ekko",
   60: "Elise",
   28: "Evelynn",
   81: "Ezreal",
   9: "Fiddlesticks",
   114: "Fiora",
   105: "Fizz",
   3: "Galio",
   41: "Gangplank",
   86: "Garen",
   150: "Gnar",
   79: "Gragas",
   104: "Graves",
   887: "Gwen",
   120: "Hecarim",
   74: "Heimerdinger",
   910: "Hwei",
   420: "Illaoi",
   39: "Irelia",
   427: "Ivern",
   40: "Janna",
   59: "Jarvan IV",
   24: "Jax",
   126: "Jayce",
   202: "Jhin",
   222: "Jinx",
   145: "Kai'Sa",
   429: "Kalista",
   43: "Karma",
   30: "Karthus",
   38: "Kassadin",
   55: "Katarina",
   10: "Kayle",
   141: "Kayn",
   85: "Kennen",
   121: "Kha'Zix",
   203: "Kindred",
   240: "Kled",
   96: "Kog'Maw",
   897: "K'Sante",
   7: "LeBlanc",
   64: "Lee Sin",
   89: "Leona",
   876: "Lillia",
   127: "Lissandra",
   236: "Lucian",
   117: "Lulu",
   99: "Lux",
   54: "Malphite",
   90: "Malzahar",
   57: "Maokai",
   11: "Master Yi",
   800: "Mel",
   902: "Milio",
   21: "Miss Fortune",
   62: "Wukong",
   82: "Mordekaiser",
   25: "Morgana",
   950: "Naafiri",
   267: "Nami",
   75: "Nasus",
   111: "Nautilus",
   518: "Neeko",
   76: "Nidalee",
   895: "Nilah",
   56: "Nocturne",
   20: "Nunu & Willump",
   2: "Olaf",
   61: "Orianna",
   516: "Ornn",
   80: "Pantheon",
   78: "Poppy",
   555: "Pyke",
   246: "Qiyana",
   133: "Quinn",
   497: "Rakan",
   33: "Rammus",
   421: "Rek'Sai",
   526: "Rell",
   888: "Renata Glasc",
   58: "Renekton",
   107: "Rengar",
   92: "Riven",
   68: "Rumble",
   13: "Ryze",
   360: "Samira",
   113: "Sejuani",
   235: "Senna",
   147: "Seraphine",
   875: "Sett",
   35: "Shaco",
   98: "Shen",
   102: "Shyvana",
   27: "Singed",
   14: "Sion",
   15: "Sivir",
   72: "Skarner",
   901: "Smolder",
   37: "Sona",
   16: "Soraka",
   50: "Swain",
   517: "Sylas",
   134: "Syndra",
   223: "Tahm Kench",
   163: "Taliyah",
   91: "Talon",
   44: "Taric",
   17: "Teemo",
   412: "Thresh",
   18: "Tristana",
   48: "Trundle",
   23: "Tryndamere",
   4: "Twisted Fate",
   29: "Twitch",
   77: "Udyr",
   6: "Urgot",
   110: "Varus",
   67: "Vayne",
   45: "Veigar",
   161: "Vel'Koz",
   711: "Vex",
   254: "Vi",
   234: "Viego",
   112: "Viktor",
   8: "Vladimir",
   106: "Volibear",
   19: "Warwick",
   498: "Xayah",
   101: "Xerath",
   5: "Xin Zhao",
   157: "Yasuo",
   777: "Yone",
   83: "Yorick",
   350: "Yuumi",
   154: "Zac",
   238: "Zed",
   221: "Zeri",
   115: "Ziggs",
   26: "Zilean",
   142: "Zoe",
   143: "Zyra"
}

// Used for URL
const urlToId = {
   "aatrox": 266,
   "ambessa": 799,
   "ahri": 103,
   "akali": 84,
   "akshan": 166,
   "alistar": 12,
   "amumu": 32,
   "anivia": 34,
   "annie": 1,
   "aphelios": 523,
   "ashe": 22,
   "aurelionsol": 136,
   "aurora": 893,
   "azir": 268,
   "bard": 432,
   "belveth": 200,
   "blitzcrank": 53,
   "brand": 63,
   "braum": 201,
   "briar": 233,
   "caitlyn": 51,
   "camille": 164,
   "cassiopeia": 69,
   "chogath": 31,
   "corki": 42,
   "darius": 122,
   "diana": 131,
   "draven": 119,
   "drmundo": 36,
   "ekko": 245,
   "elise": 60,
   "evelynn": 28,
   "ezreal": 81,
   "fiddlesticks": 9,
   "fiora": 114,
   "fizz": 105,
   "galio": 3,
   "gangplank": 41,
   "garen": 86,
   "gnar": 150,
   "gragas": 79,
   "graves": 104,
   "gwen": 887,
   "hecarim": 120,
   "heimerdinger": 74,
   "hwei": 910,
   "illaoi": 420,
   "irelia": 39,
   "ivern": 427,
   "janna": 40,
   "jarvaniv": 59,
   "jax": 24,
   "jayce": 126,
   "jhin": 202,
   "jinx": 222,
   "kaisa": 145,
   "kalista": 429,
   "karma": 43,
   "karthus": 30,
   "kassadin": 38,
   "katarina": 55,
   "kayle": 10,
   "kayn": 141,
   "kennen": 85,
   "khazix": 121,
   "kindred": 203,
   "kled": 240,
   "kogmaw": 96,
   "ksante": 897,
   "leblanc": 7,
   "leesin": 64,
   "leona": 89,
   "lillia": 876,
   "lissandra": 127,
   "lucian": 236,
   "lulu": 117,
   "lux": 99,
   "malphite": 54,
   "malzahar": 90,
   "maokai": 57,
   "masteryi": 11,
   "milio": 902,
   "missfortune": 21,
   "wukong": 62,
   "mordekaiser": 82,
   "morgana": 25,
   "naafiri": 950,
   "nami": 267,
   "nasus": 75,
   "nautilus": 111,
   "neeko": 518,
   "nidalee": 76,
   "nilah": 895,
   "nocturne": 56,
   "nunu": 20,
   "olaf": 2,
   "orianna": 61,
   "ornn": 516,
   "pantheon": 80,
   "poppy": 78,
   "pyke": 555,
   "qiyana": 246,
   "quinn": 133,
   "rakan": 497,
   "rammus": 33,
   "reksai": 421,
   "rell": 526,
   "renata": 888,
   "renekton": 58,
   "rengar": 107,
   "riven": 92,
   "rumble": 68,
   "ryze": 13,
   "samira": 360,
   "sejuani": 113,
   "senna": 235,
   "seraphine": 147,
   "sett": 875,
   "shaco": 35,
   "shen": 98,
   "shyvana": 102,
   "singed": 27,
   "sion": 14,
   "sivir": 15,
   "skarner": 72,
   "smolder": 901,
   "sona": 37,
   "soraka": 16,
   "swain": 50,
   "sylas": 517,
   "syndra": 134,
   "tahmkench": 223,
   "taliyah": 163,
   "talon": 91,
   "taric": 44,
   "teemo": 17,
   "thresh": 412,
   "tristana": 18,
   "trundle": 48,
   "tryndamere": 23,
   "twistedfate": 4,
   "twitch": 29,
   "udyr": 77,
   "urgot": 6,
   "varus": 110,
   "vayne": 67,
   "veigar": 45,
   "velkoz": 161,
   "vex": 711,
   "vi": 254,
   "viego": 234,
   "viktor": 112,
   "vladimir": 8,
   "volibear": 106,
   "warwick": 19,
   "xayah": 498,
   "xerath": 101,
   "xinzhao": 5,
   "yasuo": 157,
   "yone": 777,
   "yorick": 83,
   "yuumi": 350,
   "zac": 154,
   "zed": 238,
   "zeri": 221,
   "ziggs": 115,
   "zilean": 26,
   "zoe": 142,
   "zyra": 143,
}

const table = {
   'AurelionSol': 'Aurelion Sol',
   'Belveth': "Bel'Veth",
   'Chogath': "Cho'Gath",
   'DrMundo': 'Dr. Mundo',
   'Fiddlesticks': 'FiddleSticks',
   'JarvanIV': 'Jarvan IV',
   "KSante": "K'Sante",
   "Kaisa": "Kai'Sa",
   'Khazix': "Kha'Zix",
   'KogMaw': "Kog'Maw",
   'Leblanc': 'LeBlanc',
   'LeeSin': 'Lee Sin',
   'MasterYi': 'Master Yi',
   'MissFortune': 'Miss Fortune',
   'MonkeyKing': 'Wukong',
   'Nunu': 'Nunu & Willump',
   'RekSai': "Rek'Sai",
   'Renata': 'Renata Glasc',
   'TahmKench': 'Tahm Kench',
   'TwistedFate': 'Twisted Fate',
   'Velkoz': "Vel'Koz",
   'XinZhao': 'Xin Zhao',
}

export default {
   names,
   table,
   imageName,
   humanName,
   urlToId,
   urlName
}
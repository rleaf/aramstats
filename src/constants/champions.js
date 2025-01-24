/* 
   DISCORD:
      ryli.

   LAST UPDATE:
      Smolder
      3/13/24

   LINKS:
      1. https://leagueoflegends.fandom.com/wiki/Champion_classes
      2. https://web.archive.org/web/20170527192754/http://euw.leagueoflegends.com/en/news/game-updates/gameplay/taking-another-look-subclasses
      3. https://discord.com/channels/187652476080488449/379429593829867521/857402334316724265
      4. https://www.reddit.com/r/summonerschool/comments/8ao9vg/champion_subclasses_and_understanding_their/
   
   INFO:
      1. Comments signify change catering to ARAM meta.
      3. There's a lot of intersection to account for champ versatility
      4. Because of above, some class representations will be inaccurate. If someone likes *only* playing poke Ashe,
         they will have high representation for 'Marksman' games because Ashe is ['Artillery', 'Marksman']. // Ashe is back to 'Marksman' only, but I'm leaving this for clarity.
      4.1 Rn I think versatility > "small" loss of accuracy.
      5. Added 'Mage' subclass.

   CONTROLLER:
      CATCHER:
         Catchers specialize in locking down opponents or, in some cases, entire battlefields by creating intense zones of threat that only foolish enemies would dare wade through. Although not as reliant on their friends as Enchanters, the fragile Catchers greatly benefit from allied presence - both to deter incoming danger and to help capitalize on targets they've locked down.
      ENCHANTER:
         Enchanters focus on amplifying their allies' effectiveness by directly augmenting them and defending them from incoming threats. Enchanters themselves are often quite fragile and bring relatively low damage to the table, meaning they really only shine when grouped together with others.

   FIGHTER:
      JUGGERNAUT:
         Juggernauts are the most durable of all the classes and are best suited to take on the most aggressive opponents. They are somewhat fragile and can be very difficult to kill.Divers are the more mobile portion of the Fighter class. Divers excel at singling out high-priority targets to blitz toward, immediately forcing those targets (and their teammates) to deal with the diver’s presence. Divers are not as durable as the tanks or juggernauts of the world, but Divers can take their fair share of punishment while bringing enough damage to be a real kill threat if left unchecked.  
      DIVERS:
         Divers are the more mobile portion of the Fighter class. Divers excel at singling out high-priority targets to blitz toward, immediately forcing those targets (and their teammates) to deal with the diver’s presence. Divers are not as durable as the tanks or juggernauts of the world, but Divers can take their fair share of punishment while bringing enough damage to be a real kill threat if left unchecked.

   MAGE:
      BURST:
         Burst Mages aim to single out vulnerable targets by locking them down and following up with a devastating barrage of damage from range. They are strongest when using their full suite of spells executed perfectly to maximum effect, and most vulnerable when they cannot deliver.
      BATTLEMAGE:
         Battlemages (also known as Warlocks) get into the middle of the fray, seeking to wreak havoc upon the entire enemy team with their overwhelming sustained area damage. Due to their relatively short (but not melee) combat ranges and the need to burn down their opponents over time, Battle Mages have significant defensive capabilities that range from sustaining endlessly to literally defying death for a short period of time.
      ARTILLERY:
         Artillery Mages are the masters of range, and they leverage that advantage to whittle down their opponents over time from great distances. In turn, Artillery Mages are severely punished when enemies finally succeed in closing in on them, due to their extreme fragility and limited mobility.

   MARKSMAN:
      MARKSMAN:
         Marksmen are tremendously vulnerable to burst damage, due to their fragility, and tend to be exceptionally weak early in the game, requiring high amounts of gold, mostly via minion kills (or CS: Creep Score) to acquire powerful, but expensive, damage-focused items. Due to their potent reach and DPS, marksmen are particularly strong against more durable opponents, namely fighters and tanks, but fall quickly to the burst damage of assassins and mages.

   SLAYER:
      ASSASSIN:
         Assassins specialize in infiltrating enemy lines with their unrivaled mobility to quickly dispatch high-priority targets. Due to their mostly melee nature, Assassins must put themselves into dangerous positions in order to execute their targets. Luckily, they often have defensive tricks up their sleeves that, if used cleverly, allow them to effectively avoid incoming damage.
      SKIRMISHER:
         Skirmishers (also known as Duelists) aim to shred through any nearby enemy that approaches. Because Skirmishers lack high-end burst damage or reliable ways of closing in on high-priority targets, they are instead armed with situationally powerful defensive tools to survive in the fray, along with extreme sustained damage to cut down even the most durable targets.

   TANK:
      VANGUARD:
         Vanguards are offensive tanks. Vanguards lead the charge for their team and specialize at bringing the action. Their explosive team fight initiation seeks to catch enemies out of position while allowing allies to follow-up to devastating effect.
      WARDEN:
         Wardens are defensive tanks. Wardens stand steadfast, seeking to hold the line by persistently locking down any on-comers who try to pass them. Wardens keep their allies out of harm’s way and allow them to safely deal with enemies caught in the fray.

   SPECIALIST:
      SPECIALIST:
         Specialists are a diverse group of champions who do not "fit into a neat little box" in regards to other class/subclass specifications. The majority of these champions were once part of other sub-classes but were reclassified in the V7.10 update, including a large number of champions from the former Zoner subclass of Controller. As a consequence, many Specialists exhibit "zone control" either as a dominant or secondary attribute, including many of the pre-7.10 Specialists.
*/

export default {
   /* id: [asset_name, human_name, [classes]] */
   266: ["Aatrox", "Aatrox", ["Juggernaut"]],
   799: ["Ambessa", "Ambessa", ["Diver, Skirmisher"]],
   103: ["Ahri", "Ahri", ["Battlemage"]],                   /* Burst -> Battlemage */
   84:  ["Akali", "Akali", ["Assassin"]],
   166: ["Akshan", "Akshan", ["Marksman", "Assassin"]],
   12:  ["Alistar", "Alistar", ["Vanguard", "Warden"]],
   32:  ["Amumu", "Amumu", ["Vanguard"]],
   34:  ["Anivia", "Anivia", ["Battlemage"]],
   1:   ["Annie", "Annie", ["Burst"]],
   523: ["Aphelios", "Aphelios", ["Marksman"]],
   22:  ["Ashe", "Ashe", ["Marksman"]],
   136: ["AurelionSol", "Aurelion Sol", ["Battlemage"]],
   893: ["Aurora", "Aurora", ["Mage"]],
   268: ["Azir", "Azir", ["Specialist"]],
   432: ["Bard", "Bard", ["Catcher"]],
   200: ["Belveth", "Bel'Veth", ["Skirmisher"]],
   53:  ["Blitzcrank", "Blitzcrank", ["Catcher"]],
   63:  ["Brand", "Brand", ["Mage"]],                       /* Burst -> Mage */
   201: ["Braum", "Braum", ["Warden"]],
   233: ["Briar", "Briar", ["Juggernaut"]],                 /* -Assassin */
   51:  ["Caitlyn", "Caitlyn", ["Marksman"]],
   164: ["Camille", "Camille", ["Diver"]],
   69:  ["Cassiopeia", "Cassiopeia", ["Battlemage"]],
   31:  ["Chogath", "Cho'Gath", ["Warden"]],                /* Specialist -> Warden */
   42:  ["Corki", "Corki", ["Artillery"]],                  /* Marksman */
   122: ["Darius", "Darius", ["Juggernaut"]],
   131: ["Diana", "Diana", ["Assassin", "Diver"]],
   119: ["Draven", "Draven", ["Marksman"]],
   36:  ["DrMundo", "Dr. Mundo", ["Juggernaut"]],
   245: ["Ekko", "Ekko", ["Diver"]],                        /* Assassin -> Diver */
   60:  ["Elise", "Elise", ["Diver", "Mage"]],              /* +Mage */
   28:  ["Evelynn", "Evelynn", ["Assassin"]],
   81:  ["Ezreal", "Ezreal", ["Marksman"]],
   9:   ["Fiddlesticks", "Fiddlesticks", ["Specialist"]],
   114: ["Fiora", "Fiora", ["Skirmisher"]],
   105: ["Fizz", "Fizz", ["Assassin"]],
   3:   ["Galio", "Galio", ["Warden", "Vanguard"]],         /* +Vanguard */
   41:  ["Gangplank", "Gangplank", ["Specialist"]],
   86:  ["Garen", "Garen", ["Juggernaut"]],
   150: ["Gnar", "Gnar", ["Specialist", "Vanguard"]],       /* +Vanguard*/
   79:  ["Gragas", "Gragas", ["Vanguard"]],
   104: ["Graves", "Graves", ["Specialist", "Marksman"]],   /* +Marksman */
   887: ["Gwen", "Gwen", ["Skirmisher"]],
   120: ["Hecarim", "Hecarim", ["Diver", "Vanguard"]],
   74:  ["Heimerdinger", "Heimerdinger", ["Mage"]],         /* Specialist -> Mage */
   910: ["Hwei", "Hwei", ["Mage"]],                         /* Artillery -> Mage */
   420: ["Illaoi", "Illaoi", ["Juggernaut"]],
   39:  ["Irelia", "Irelia", ["Diver"]],
   427: ["Ivern", "Ivern", ["Catcher", "Enchanter"]],       /* +Enchanter */
   40:  ["Janna", "Janna", ["Enchanter"]],
   59:  ["JarvanIV", "Jarvan IV", ["Diver", "Vanguard"]],   /* +Vanguard */
   24:  ["Jax", "Jax", ["Skirmisher"]],
   126: ["Jayce", "Jayce", ["Artillery"]],
   202: ["Jhin", "Jhin", ["Marksman", "Catcher"]],
   222: ["Jinx", "Jinx", ["Marksman"]],
   145: ["Kaisa", "Kai'Sa", ["Marksman", "Artillery"]],     /* +Artillery */
   429: ["Kalista", "Kalista", ["Marksman"]],
   43:  ["Karma", "Karma", ["Mage", "Enchanter"]],          /* Burst -> Mage */
   30:  ["Karthus", "Karthus", ["Battlemage"]],
   38:  ["Kassadin", "Kassadin", ["Assassin"]],
   55:  ["Katarina", "Katarina", ["Assassin", "Specialist"]], /* +Specialist */
   10:  ["Kayle", "Kayle", ["Marksman", "Enchanter"]],       /* Specialist -> (Marksman, Enchanter) */
   141: ["Kayn", "Kayn", ["Skirmisher"]],
   85:  ["Kennen", "Kennen", ["Specialist", "Burst"]],       /* +Burst */
   121: ["Khazix", "Kha'Zix", ["Assassin"]],
   203: ["Kindred", "Kindred", ["Marksman"]],
   240: ["Kled", "Kled", ["Skirmisher", "Vanguard"]],        /* +Vanguard */
   96:  ["KogMaw", "Kog'Maw", ["Marksman", "Artillery"]],    /* +Artillery */
   897: ["KSante", "K'Sante", ["Warden", "Skirmisher"]],
   7:   ["Leblanc", "LeBlanc", ["Burst"]],
   64:  ["LeeSin", "Lee Sin", ["Diver", "Skirmisher"]],       /* +Skirmisher */
   89:  ["Leona", "Leona", ["Vanguard"]],
   876: ["Lillia", "Lillia", ["Skirmisher"]],
   127: ["Lissandra", "Lissandra", ["Mage"]],
   236: ["Lucian", "Lucian", ["Marksman"]],
   117: ["Lulu", "Lulu", ["Enchanter"]],
   99:  ["Lux", "Lux", ["Burst", "Artillery"]],
   54:  ["Malphite", "Malphite", ["Vanguard", "Burst"]],     /* +Burst */
   90:  ["Malzahar", "Malzahar", ["Battlemage"]],
   57:  ["Maokai", "Maokai", ["Vanguard"]],
   11:  ["MasterYi", "Master Yi", ["Skirmisher", "Assassin"]], /* +Assassin */
   800: ["Mel", "Mel", ["Burst"]],
   902: ["Milio", "Milio", ["Enchanter"]], 
   21:  ["MissFortune", "Miss Fortune", ["Artillery", "Marksman"]], /* +Artillery */
   62:  ["MonkeyKing", "Wukong", ["Diver", "Skirmisher"]],
   82:  ["Mordekaiser", "Mordekaiser", ["Juggernaut"]],
   25:  ["Morgana", "Morgana", ["Catcher", "Mage"]],           /* +Mage */
   950: ["Naafiri", "Naafiri", ["Assassin"]],                  /* -Fighter */
   267: ["Nami", "Nami", ["Enchanter"]],
   75:  ["Nasus", "Nasus", ["Juggernaut", "Mage"]],             /* +Mage */
   111: ["Nautilus", "Nautilus", ["Vanguard", "Warden"]],      /* +Warden */
   518: ["Neeko", "Neeko", ["Burst", "Catcher"]],
   76:  ["Nidalee", "Nidalee", ["Artillery"]],                   /* +Artillery */   
   895: ["Nilah", "Nilah", ["Skirmisher"]],
   56:  ["Nocturne", "Nocturne", ["Assassin", "Diver"]],        /* +Diver */
   20:  ["Nunu", "Nunu & Willump", ["Vanguard", "Burst"]],        /* +Burst */
   2:   ["Olaf", "Olaf", ["Juggernaut"]],                        /* Diver -> Juggernaut */
   61:  ["Orianna", "Orianna", ["Mage"]],                       /* Burst -> Mage */
   516: ["Ornn", "Ornn", ["Vanguard"]],
   80:  ["Pantheon", "Pantheon", ["Diver"]],
   78:  ["Poppy", "Poppy", ["Warden"]],
   555: ["Pyke", "Pyke", ["Assassin", "Catcher"]],
   246: ["Qiyana", "Qiyana", ["Assassin"]],
   133: ["Quinn", "Quinn", ["Marksman"]],                       /* Specialist -> Marksman */
   497: ["Rakan", "Rakan", ["Catcher"]],
   33:  ["Rammus", "Rammus", ["Vanguard"]],
   421: ["RekSai", "Rek'Sai", ["Diver", "Assassin"]],             /* +Assassin */
   526: ["Rell", "Rell", ["Vanguard"]],
   888: ["Renata", "Renata Glasc", ["Enchanter"]],
   58:  ["Renekton", "Renekton", ["Diver"]],
   107: ["Rengar", "Rengar", ["Assassin", "Diver"]],
   92:  ["Riven", "Riven", ["Skirmisher", "Diver"]],              /* +Diver */
   68:  ["Rumble", "Rumble", ["Battlemage"]],
   13:  ["Ryze", "Ryze", ["Battlemage"]],
   360: ["Samira", "Samira", ["Marksman", "Diver"]],              /* +Diver */
   113: ["Sejuani", "Sejuani", ["Vanguard"]],
   235: ["Senna", "Senna", ["Marksman", "Enchanter"]],
   147: ["Seraphine", "Seraphine", ["Mage", "Enchanter"]],        /* +Mage */
   875: ["Sett", "Sett", ["Juggernaut"]],
   35:  ["Shaco", "Shaco", ["Assassin", "Mage"]],                 /* +Mage */
   98:  ["Shen", "Shen", ["Vanguard", "Warden"]],
   102: ["Shyvana", "Shyvana", ["Juggernaut", "Burst"]],          /* +Burst */
   27:  ["Singed", "Singed", ["Specialist", "Battlemage"]],       /* +Battlemage */
   14:  ["Sion", "Sion", ["Vanguard"]],
   15:  ["Sivir", "Sivir", ["Marksman"]],
   72:  ["Skarner", "Skarner", ["Diver", "Warden"]],             /* +Warden */
   901: ["Smolder", "Smolder", ["Marksman", "Mage"]],            /* +Mage */
   37:  ["Sona", "Sona", ["Enchanter"]],
   16:  ["Soraka", "Soraka", ["Enchanter"]],
   50:  ["Swain", "Swain", ["Battlemage"]],
   517: ["Sylas", "Sylas", ["Skirmisher", "Diver"]],              /* +Diver */
   134: ["Syndra", "Syndra", ["Burst", "Catcher"]],               /* +Catcher */
   223: ["TahmKench", "Tahm Kench", ["Warden", "Vanguard"]],      /* +Vanguard */
   163: ["Taliyah", "Taliyah", ["Mage"]],                         /* Burst -> Mage */
   91:  ["Talon", "Talon", ["Assassin"]],
   44:  ["Taric", "Taric", ["Enchanter", "Warden"]],
   17:  ["Teemo", "Teemo", ["Specialist"]],
   412: ["Thresh", "Thresh", ["Catcher", "Warden"]],              /* +Warden */
   18:  ["Tristana", "Tristana", ["Marksman"]],
   48:  ["Trundle", "Trundle", ["Juggernaut", "Catcher"]],         /* +Catcher */
   23:  ["Tryndamere", "Tryndamere", ["Skirmisher", "Diver"]],    /* +Diver */
   4:   ["TwistedFate", "Twisted Fate", ["Mage", "Marksman"]],    /* Burst -> (Mage, Marksman) */
   29:  ["Twitch", "Twitch", ["Marksman"]],
   77:  ["Udyr", "Udyr", ["Juggernaut"]],
   6:   ["Urgot", "Urgot", ["Juggernaut"]],
   110: ["Varus", "Varus", ["Marksman", "Artillery"]],
   67:  ["Vayne", "Vayne", ["Marksman"]],
   45:  ["Veigar", "Veigar", ["Burst", "Catcher"]],               /* +Catcher */
   161: ["Velkoz", "Vel'Koz", ["Artillery"]],
   711: ["Vex", "Vex", ["Burst"]],
   254: ["Vi", "Vi", ["Diver"]],
   234: ["Viego", "Viego", ["Skirmisher"]],
   112: ["Viktor", "Viktor", ["Mage"]],                            /* Battlemage -> Mage */
   8:   ["Vladimir", "Vladimir", ["Battlemage"]],
   106: ["Volibear", "Volibear", ["Juggernaut"]],
   19:  ["Warwick", "Warwick", ["Diver", "Skirmisher"]],          /* +Skirmisher */
   498: ["Xayah", "Xayah", ["Marksman"]],                         /* +Skirmisher */
   101: ["Xerath", "Xerath", ["Artillery"]],
   5:   ["XinZhao", "Xin Zhao", ["Diver"]],
   157: ["Yasuo", "Yasuo", ["Skirmisher"]],
   777: ["Yone", "Yone", ["Skirmisher"]],                         /* -Assassin */
   83:  ["Yorick", "Yorick", ["Juggernaut"]],
   350: ["Yuumi", "Yuumi", ["Enchanter", "Mage"]],                /* +Mage (Artillery?) */
   154: ["Zac", "Zac", ["Vanguard"]],
   238: ["Zed", "Zed", ["Assassin"]],
   221: ["Zeri", "Zeri", ["Marksman"]],
   115: ["Ziggs", "Ziggs", ["Artillery"]],
   26:  ["Zilean", "Zilean", ["Burst", "Enchanter"]],             /* Specialist -> (Burst, Enchanter) */
   142: ["Zoe", "Zoe", ["Burst"]],
   143: ["Zyra", "Zyra", ["Catcher", "Mage"]]                     /* +Mage */
}

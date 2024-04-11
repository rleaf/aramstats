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

/* classProfile: [
   { class: 'Controller', Total: 0, Enchanter: 0, Catcher: 0},
   { class: 'Fighter', Total: 0, Juggernaut: 0, Diver: 0},
   { class: 'Mage', Total: 0, Mage: 0, Burst: 0, Battlemage: 0, Artillery: 0},
   { class: 'Marksman', Total: 0, Marksman: 0},
   { class: 'Slayer', Total: 0, Assassin: 0, Skirmisher: 0},
   { class: 'Tank', Total: 0, Vanguard: 0, Warden: 0},
   { class: 'Specialist', Total: 0, Specialist: 0}
] */

export default {
   266: ['Juggernaut'],
   103: ['Battlemage'], /* Burst -> Battlemage */
   84: ['Assassin'],
   166: ['Marksman', 'Assassin'],
   12: ['Vanguard', 'Warden'],
   32: ['Vanguard'],
   34: ['Battlemage'],
   1: ['Burst'],
   523: ['Marksman'],
   22: ['Marksman'],
   136: ['Battlemage'],
   268: ['Specialist'],
   432: ['Catcher'],
   200: ['Skirmisher'],
   53: ['Catcher'],
   63: ['Mage'], /* Burst -> Mage */
   201: ['Warden'],
   233: ['Juggernaut'], /* -Assassin */
   51: ['Marksman'],
   164: ['Diver'],
   69: ['Battlemage'],
   31: ['Warden'], /* Specialist -> Warden */
   42: ['Artillery'], /* Marksman -> Artillery */
   122: ['Juggernaut'],
   131: ['Assassin', 'Diver'],
   36: ['Juggernaut'],
   119: ['Marksman'],
   245: ['Diver'], /* Assassin -> Diver */
   60: ['Diver', 'Mage'], /* +Mage */
   28: ['Assassin'],
   81: ['Marksman'],
   9: ['Specialist'],
   114: ['Skirmisher'],
   105: ['Assassin'],
   3: ['Warden', 'Vanguard'], /* +Vanguard */
   41: ['Specialist'],
   86: ['Juggernaut'],
   150: ['Specialist', 'Vanguard'], /* +Vanguard*/
   79: ['Vanguard'],
   104: ['Specialist', 'Marksman'], /* +Marksman */
   887: ['Skirmisher'],
   120: ['Diver', 'Vanguard'],
   74: ['Mage'], /* Specialist -> Mage */
   910: ['Mage'], /* Artillery -> Mage */
   420: ['Juggernaut'],
   39: ['Diver'],
   427: ['Catcher', 'Enchanter'], /* +Enchanter */
   40: ['Enchanter'],
   59: ['Diver', 'Vanguard'], /* +Vanguard */
   24: ['Skirmisher'],
   126: ['Artillery'],
   202: ['Marksman', 'Catcher'],
   222: ['Marksman'],
   897: ['Warden', 'Skirmisher'],
   145: ['Marksman', 'Artillery'], /* +Artillery */
   429: ['Marksman'],
   43: ['Mage', 'Enchanter'], /* Burst -> Mage */
   30: ['Battlemage'],
   38: ['Assassin'],
   55: ['Assassin', 'Specialist'], /*  +Specialist */
   10: ['Marksman', 'Enchanter'], /* Specialist -> (Marksman, Enchanter) */
   141: ['Skirmisher'],
   85: ['Specialist', 'Burst'], /* +Burst */
   121: ['Assassin'],
   203: ['Marksman'],
   240: ['Skirmisher', 'Vanguard'], /* +Vanguard */
   96: ['Marksman', 'Artillery'], /* +Artillery */
   7: ['Burst'],
   64: ['Diver', 'Skirmisher'], /* +Skirmisher */
   89: ['Vanguard'],
   876: ['Skirmisher'],
   127: ['Mage'],
   236: ['Marksman'],
   117: ['Enchanter'],
   99: ['Burst', 'Artillery'],
   54: ['Vanguard', 'Burst'], /* +Burst */
   90: ['Battlemage'],
   57: ['Vanguard'],
   11: ['Skirmisher', 'Assassin'], /* +Assassin */
   902: ['Enchanter'],
   21: ['Artillery', 'Marksman'], /* +Artillery */
   82: ['Juggernaut'],
   25: ['Catcher', 'Mage'], /* +Mage */
   950: ['Assassin'], /* -Fighter */
   267: ['Enchanter'],
   75: ['Juggernaut', 'Mage'], /* +Mage */
   111: ['Vanguard', 'Warden'], /* +Warden */
   518: ['Burst', 'Catcher'],
   76: ['Artillery'], /* Specialist -> Artillery */
   895: ['Skirmisher'],
   56: ['Assassin', 'Diver'], /* +Diver */
   20: ['Vanguard', 'Burst'], /* +Burst */
   2: ['Juggernaut'], /* Diver -> Juggernaut */
   61: ['Mage'], /* Burst -> Mage */
   516: ['Vanguard'],
   80: ['Diver'],
   78: ['Warden'],
   555: ['Assassin', 'Catcher'],
   246: ['Assassin'],
   133: ['Marksman'], /* Specialist -> Marksman */
   497: ['Catcher'],
   33: ['Vanguard'],
   421: ['Diver', 'Assassin'], /* +Assassin */
   526: ['Vanguard'],
   888: ['Enchanter'],
   58: ['Diver'],
   107: ['Assassin', 'Diver'],
   92: ['Skirmisher', 'Diver'], /* +Diver */
   68: ['Battlemage'],
   13: ['Battlemage'],
   360: ['Marksman', 'Specialist'], /* +Specialist */
   113: ['Vanguard'],
   235: ['Marksman', 'Enchanter'],
   147: ['Mage', 'Enchanter'], /* +Mage */
   875: ['Juggernaut'],
   35: ['Assassin', 'Mage'], /* +Mage */
   98: ['Vanguard', 'Warden'], /* +Vanguard */
   102: ['Juggernaut', 'Burst'], /* +Burst */
   27: ['Specialist', 'Battlemage'], /* +Battlemage */
   14: ['Vanguard'],
   15: ['Marksman'],
   72: ['Diver', 'Warden'], /* +Warden */
   901: ['Marksman', 'Mage'], /* +Mage */
   37: ['Enchanter'],
   16: ['Enchanter'],
   50: ['Battlemage'],
   517: ['Skirmisher', 'Diver'], /* +Diver */
   134: ['Burst', 'Catcher'], /* +Catcher */
   223: ['Warden', 'Vanguard'], /* +Vanguard */
   163: ['Mage'], /* Battlemage -> Mage */
   91: ['Assassin'],
   44: ['Enchanter', 'Warden'],
   17: ['Specialist'],
   412: ['Catcher', 'Warden'], /* +Warden */
   18: ['Marksman'],
   48: ['Juggernaut', 'Catcher'], /* +Catcher */
   23: ['Skirmisher', 'Diver'], /* +Diver */
   4: ['Artillery'], /* Burst -> Artillery */
   29: ['Marksman'],
   77: ['Juggernaut'],
   6: ['Juggernaut'],
   110: ['Marksman', 'Artillery'],
   67: ['Marksman'],
   45: ['Burst', 'Catcher'], /* +Catcher */
   161: ['Artillery'],
   711: ['Burst'],
   254: ['Diver'],
   234: ['Skirmisher'],
   112: ['Mage'], /* Battlemage -> Mage */
   8: ['Battlemage'],
   106: ['Juggernaut'],
   19: ['Diver', 'Skirmisher'], /* +Skirmisher */
   62: ['Diver', 'Skirmisher'], /* +Skirmisher */
   498: ['Marksman'],
   101: ['Artillery'],
   5: ['Diver'],
   157: ['Skirmisher'],
   777: ['Skirmisher'], /* -Assassin */
   83: ['Juggernaut'],
   350: ['Enchanter', 'Mage'], /* +Mage (Artillery?) */
   154: ['Vanguard'],
   238: ['Assassin'],
   221: ['Marksman'],
   115: ['Artillery'],
   26: ['Burst', 'Enchanter'], /* Specialist -> (Burst, Enchanter) */
   142: ['Burst'],
   143: ['Catcher', 'Mage'] /* +Mage */
}
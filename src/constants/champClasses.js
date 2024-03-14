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

export const classBook = {
   aatrox: ['Juggernaut'],
   ahri: ['Battlemage'], /* Burst -> Battlemage */
   akali: ['Assassin'],
   akshan: ['Marksman', 'Assassin'],
   alistar: ['Vanguard', 'Warden'],
   amumu: ['Vanguard'],
   anivia: ['Battlemage'],
   annie: ['Burst'],
   aphelios: ['Marksman'],
   ashe: ['Marksman'],
   aurelionsol: ['Battlemage'],
   azir: ['Specialist'],
   bard: ['Catcher'],
   belveth: ['Skirmisher'],
   blitzcrank: ['Catcher'],
   brand: ['Mage'], /* Burst -> Mage */
   braum: ['Warden'],
   briar: ['Juggernaut'], /* -Assassin */
   caitlyn: ['Marksman'],
   camille: ['Diver'],
   cassiopeia: ['Battlemage'],
   chogath: ['Warden'], /* Specialist -> Warden */
   corki: ['Artillery'], /* Marksman -> Artillery */
   darius: ['Juggernaut'],
   diana: ['Assassin', 'Diver'],
   drmundo: ['Juggernaut'],
   draven: ['Marksman'],
   ekko: ['Diver'], /* Assassin -> Diver */
   elise: ['Diver', 'Mage'], /* +Mage */
   evelynn: ['Assassin'],
   ezreal: ['Marksman'],
   fiddlesticks: ['Specialist'],
   fiora: ['Skirmisher'],
   fizz: ['Assassin'],
   galio: ['Warden', 'Vanguard'], /* +Vanguard */
   gangplank: ['Specialist'],
   garen: ['Juggernaut'],
   gnar: ['Specialist', 'Vanguard'], /* +Vanguard*/
   gragas: ['Vanguard'],
   graves: ['Specialist', 'Marksman'], /* +Marksman */
   gwen: ['Skirmisher'],
   hecarim: ['Diver', 'Vanguard'],
   heimerdinger: ['Mage'], /* Specialist -> Mage */
   hwei: ['Mage'], /* Artillery -> Mage */
   illaoi: ['Juggernaut'],
   irelia: ['Diver'],
   ivern: ['Catcher', 'Enchanter'], /* +Enchanter */
   janna: ['Enchanter'],
   jarvaniv: ['Diver', 'Vanguard'], /* +Vanguard */
   jax: ['Skirmisher'],
   jayce: ['Artillery'],
   jhin: ['Marksman', 'Catcher'],
   jinx: ['Marksman'],
   ksante: ['Warden', 'Skirmisher'],
   kaisa: ['Marksman', 'Artillery'], /* +Artillery */
   kalista: ['Marksman'],
   karma: ['Mage', 'Enchanter'], /* Burst -> Mage */
   karthus: ['Battlemage'],
   kassadin: ['Assassin'],
   katarina: ['Assassin', 'Specialist'], /*  +Specialist */ 
   kayle: ['Marksman', 'Enchanter'], /* Specialist -> (Marksman, Enchanter) */
   kayn: ['Skirmisher'],
   kennen: ['Specialist', 'Burst'], /* +Burst */
   khazix: ['Assassin'],
   kindred: ['Marksman'],
   kled: ['Skirmisher', 'Vanguard'], /* +Vanguard */
   kogmaw: ['Marksman', 'Artillery'], /* +Artillery */
   leblanc: ['Burst'],
   leesin: ['Diver', 'Skirmisher'], /* +Skirmisher */
   leona: ['Vanguard'],
   lillia: ['Skirmisher'],
   lissandra: ['Mage'],
   lucian: ['Marksman'],
   lulu: ['Enchanter'],
   lux: ['Burst', 'Artillery'],
   malphite: ['Vanguard', 'Burst'], /* +Burst */
   malzahar: ['Battlemage'],
   maokai: ['Vanguard'],
   masteryi: ['Skirmisher', 'Assassin'], /* +Assassin */
   milio: ['Enchanter'],
   missfortune: ['Artillery', 'Marksman'], /* +Artillery */
   monkeyking: ['Diver'],
   mordekaiser: ['Juggernaut'],
   morgana: ['Catcher', 'Mage'], /* +Mage */
   naafiri: ['Assassin'], /* -Fighter */
   nami: ['Enchanter'],
   nasus: ['Juggernaut', 'Mage'], /* +Mage */
   nautilus: ['Vanguard', 'Warden'], /* +Warden */
   neeko: ['Burst', 'Catcher'],
   nidalee: ['Artillery'], /* Specialist -> Artillery */
   nilah: ['Skirmisher'],
   nocturne: ['Assassin', 'Diver'], /* +Diver */
   nunu: ['Vanguard', 'Burst'], /* +Burst */
   olaf: ['Juggernaut'], /* Diver -> Juggernaut */
   orianna: ['Mage'], /* Burst -> Mage */
   ornn: ['Vanguard'],
   pantheon: ['Diver'],
   poppy: ['Warden'],
   pyke: ['Assassin', 'Catcher'],
   qiyana: ['Assassin'],
   quinn: ['Marksman'], /* Specialist -> Marksman */
   rakan: ['Catcher'],
   rammus: ['Vanguard'],
   reksai: ['Diver', 'Assassin'], /* +Assassin */
   rell: ['Vanguard'],
   renata: ['Enchanter'],
   renekton: ['Diver'],
   rengar: ['Assassin', 'Diver'],
   riven: ['Skirmisher', 'Diver'], /* +Diver */
   rumble: ['Battlemage'],
   ryze: ['Battlemage'],
   samira: ['Marksman', 'Specialist'], /* +Specialist */
   sejuani: ['Vanguard'],
   senna: ['Marksman', 'Enchanter'],
   seraphine: ['Mage', 'Enchanter'], /* +Mage */
   sett: ['Juggernaut'],
   shaco: ['Assassin', 'Mage'], /* +Mage */
   shen: ['Vanguard', 'Warden'], /* +Vanguard */
   shyvana: ['Juggernaut', 'Burst'], /* +Burst */
   singed: ['Specialist', 'Battlemage'], /* +Battlemage */
   sion: ['Vanguard'],
   sivir: ['Marksman'],
   skarner: ['Diver', 'Warden'], /* +Warden */
   smolder: ['Marksman', 'Mage'], /* +Mage */
   sona: ['Enchanter'],
   soraka: ['Enchanter'],
   swain: ['Battlemage'],
   sylas: ['Skirmisher', 'Diver'], /* +Diver */
   syndra: ['Burst', 'Catcher'], /* +Catcher */
   tahmkench: ['Warden', 'Vanguard'], /* +Vanguard */
   taliyah: ['Mage'], /* Battlemage -> Mage */
   talon: ['Assassin'],
   taric: ['Enchanter', 'Warden'],
   teemo: ['Specialist'],
   thresh: ['Catcher', 'Warden'], /* +Warden */
   tristana: ['Marksman'],
   trundle: ['Juggernaut', 'Catcher'], /* +Catcher */
   tryndamere: ['Skirmisher', 'Diver'], /* +Diver */
   twistedfate: ['Artillery'], /* Burst -> Artillery */
   twitch: ['Marksman'],
   udyr: ['Juggernaut'],
   urgot: ['Juggernaut'],
   varus: ['Marksman', 'Artillery'],
   vayne: ['Marksman'],
   veigar: ['Burst', 'Catcher'], /* +Catcher */
   velkoz: ['Artillery'],
   vex: ['Burst'],
   vi: ['Diver'],
   viego: ['Skirmisher'],
   viktor: ['Mage'], /* Battlemage -> Mage */
   vladimir: ['Battlemage'],
   volibear: ['Juggernaut'],
   warwick: ['Diver', 'Skirmisher'], /* +Skirmisher */
   wukong: ['Diver', 'Skirmisher'], /* +Skirmisher */
   xayah: ['Marksman'],
   xerath: ['Artillery'],
   xinzhao: ['Diver'],
   yasuo: ['Skirmisher'],
   yone: ['Skirmisher'], /* -Assassin */
   yorick: ['Juggernaut'],
   yuumi: ['Enchanter', 'Mage'], /* +Mage (Artillery?) */
   zac: ['Vanguard'],
   zed: ['Assassin'],
   zeri: ['Marksman'],
   ziggs: ['Artillery'],
   zilean: ['Burst', 'Enchanter'], /* Specialist -> (Burst, Enchanter) */
   zoe: ['Burst'],
   zyra: ['Catcher', 'Mage'], /* +Mage */
}
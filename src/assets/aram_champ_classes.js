/* Affiliated links to this topic. 
   1. https://leagueoflegends.fandom.com/wiki/Champion_classes
   2. https://web.archive.org/web/20170527192754/http://euw.leagueoflegends.com/en/news/game-updates/gameplay/taking-another-look-subclasses
   3. https://discord.com/channels/187652476080488449/379429593829867521/857402334316724265
   4. https://www.reddit.com/r/summonerschool/comments/8ao9vg/champion_subclasses_and_understanding_their/


   
   CLASSES

   controller
      Enchanter
      Catcher
   fighter
      Juggernaut
      Diver
   Mage
      Burst
      Battlemage
      Artillery
   Marksman
   slayer
      Assassin
      Skirmisher
   tank
      Vanguard
      Warden
   Specialist
*/

export const classBook = {
   aatrox: ['Juggernaut'],
   ahri: ['Burst'],
   akali: ['Assassin'],
   akshan: ['Marksman', 'Assassin'],
   alistar: ['Vanguard', 'Warden'],
   amumu: ['Vanguard'],
   anivia: ['Battlemage'],
   annie: ['Burst'],
   aphelios: ['Marksman'],
   ashe: ['Mage'], /* aram. Marksman -> Mage */
   aurelionsol: ['Battlemage'],
   azir: ['Specialist'],
   bard: ['Catcher'],
   belveth: ['Skirmisher'],
   blitzcrank: ['Catcher'],
   brand: ['Mage'], /* aram, Burst -> Mage */
   braum: ['Warden'],
   caitlyn: ['Marksman'],
   camille: ['Diver'],
   cassiopeia: ['Battlemage'],
   chogath: ['Warden'], /* aram. Specialist -> Warden */
   corki: ['Artillery'], /* aram. Marksman -> Artillery */
   darius: ['Juggernaut'],
   diana: ['Assassin', 'Diver'],
   drmundo: ['Juggernaut'],
   draven: ['Marksman'],
   ekko: ['Assassin'],
   elise: ['Diver', 'Mage'], /* aram. +Mage */
   evelynn: ['Assassin'],
   ezreal: ['Marksman'],
   fiddlesticks: ['Specialist'],
   fiora: ['Skirmisher'],
   fizz: ['Assassin'],
   galio: ['Warden'],
   gangplank: ['Specialist'],
   garen: ['Juggernaut'],
   gnar: ['Specialist', 'Vanguard'], /* aram. +Vanguard*/
   gragas: ['Vanguard'],
   graves: ['Specialist', 'Marksman'], /* aram. +Marksman */
   gwen: ['Skirmisher'],
   hecarim: ['Diver', 'Vanguard'],
   heimerdinger: ['Mage'], /* aram. Specialist -> Mage */
   illaoi: ['Juggernaut'],
   irelia: ['Diver'],
   ivern: ['Catcher'],
   janna: ['Enchanter'],
   jarvaniv: ['Diver', 'Vanguard'], /* aram. +Vanguard */
   jax: ['Skirmisher'],
   jayce: ['Artillery'],
   jhin: ['Marksman', 'Catcher'],
   jinx: ['Marksman'],
   ksante: ['Warden', 'Skirmisher'],
   kaisa: ['Marksman', 'Artillery'], /* aram. +Artillery */
   kalista: ['Marksman'],
   karma: ['Mage', 'Enchanter'], /* aram. Burst -> Mage */
   karthus: ['Battlemage'],
   kassadin: ['Assassin'],
   katarina: ['Assassin', 'Specialist'], /* aram. ???????????????? +Specialist */ 
   kayle: ['Marksman', 'Enchanter'], /* aram. Specialist -> (Marksman, Enchanter) */
   kayn: ['Skirmisher'],
   kennen: ['Specialist'],
   khazix: ['Mage', 'Specialist'], /* aram. +Mage */
   kindred: ['Marksman'],
   kled: ['Skirmisher', 'Vanguard'], /* aram. +Vanguard */
   kogmaw: ['Marksman', 'Artillery'], /* aram. +Artillery */
   leblanc: ['Burst'],
   leesin: ['Diver'],
   leona: ['Vanguard'],
   lillia: ['Skirmisher'],
   lissandra: ['Mage'],
   lucian: ['Marksman'],
   lulu: ['Enchanter'],
   lux: ['Burst', 'Artillery'],
   malphite: ['Vanguard', 'Burst'], /* aram. ....+Burst */
   malzahar: ['Battlemage'],
   maokai: ['Vanguard'],
   masteryi: ['Skirmisher', 'Assassin'], /* aram. +Assassin */
   missfortune: ['Artillery', 'Marksman'], /* aram. +Artillery */
   monkeyking: ['Diver'],
   mordekaiser: ['Juggernaut'],
   morgana: ['Catcher', 'Mage'], /* aram. +Mage */
   nami: ['Enchanter'],
   nasus: ['Juggernaut', 'Mage'], /* aram. +Mage */
   nautilus: ['Vanguard', 'Warden'], /* aram. +Warden */
   neeko: ['Burst', 'Catcher'],
   nidalee: ['Specialist'],
   nilah: ['Skirmisher'],
   nocturne: ['Assassin', 'Diver'], /* aram. +Diver */
   nunu: ['Vanguard', 'Burst'], /* aram. ...+Burst */
   olaf: ['Diver'],
   orianna: ['Mage'], /* aram. Burst -> Mage */
   ornn: ['Vanguard'],
   pantheon: ['Diver'],
   poppy: ['Warden'],
   pyke: ['Assassin', 'Catcher'],
   qiyana: ['Assassin'],
   quinn: ['Marksman'], /* aram. Specialist -> Marksman */
   rakan: ['Catcher'],
   rammus: ['Vanguard'],
   reksai: ['Diver', 'Assassin'], /* aram. +Assassin */
   rell: ['Vanguard'],
   renata: ['Enchanter'],
   renekton: ['Diver'],
   rengar: ['Assassin', 'Diver'],
   riven: ['Skirmisher'],
   rumble: ['Battlemage'],
   ryze: ['Battlemage'],
   samira: ['Marksman', 'Specialist'], /* aram. +Specialist */
   sejuani: ['Vanguard'],
   senna: ['Marksman', 'Enchanter'],
   seraphine: ['Mage', 'Enchanter'], /* aram. +Mage */
   sett: ['Juggernaut'],
   shaco: ['Assassin', 'Mage'], /* aram. +Mage */
   shen: ['Vanguard', 'Warden'], /* aram. +Vanguard */
   shyvana: ['Juggernaut', 'Burst'], /* aram. +Burst */
   singed: ['Specialist', 'Battlemage'], /* aram. +Battlemage */
   sion: ['Vanguard'],
   sivir: ['Marksman'],
   skarner: ['Diver', 'Warden'], /* aram. +Warden */
   sona: ['Enchanter'],
   soraka: ['Enchanter'],
   swain: ['Battlemage'],
   sylas: ['Skirmisher', 'Diver'], /* aram. +Diver */
   syndra: ['Burst'],
   tahmkench: ['Warden', 'Vanguard'], /* aram. +Vanguard */
   taliyah: ['Mage'], /* aram. Battlemage -> Mage */
   talon: ['Assassin'],
   taric: ['Enchanter', 'Warden'],
   teemo: ['Specialist'],
   thresh: ['Catcher', 'Warden'], /* aram. +Warden */
   tristana: ['Marksman'],
   trundle: ['Juggernaut', 'Catcher'], /* aram. +Catcher */
   tryndamere: ['Skirmisher', 'Diver'], /* aram. +Diver */
   twistedfate: ['Mage'],
   twitch: ['Marksman'],
   udyr: ['Juggernaut'],
   urgot: ['Juggernaut'],
   varus: ['Marksman', 'Artillery'],
   vayne: ['Marksman'],
   veigar: ['Burst', 'Catcher'], /* aram. +Catcher */
   velkoz: ['Artillery'],
   vex: ['Burst'],
   vi: ['Diver'],
   viego: ['Skirmisher'],
   viktor: ['Mage'], /* aram. Battlemage -> Mage */
   vladimir: ['Battlemage'],
   volibear: ['Juggernaut'],
   warwick: ['Diver'],
   wukong: ['Diver'],
   xayah: ['Marksman'],
   xerath: ['Artillery'],
   xinzhao: ['Diver'],
   yasuo: ['Skirmisher'],
   yone: ['Skirmisher'], /* aram. -Assassin */
   yorick: ['Juggernaut'],
   yuumi: ['Enchanter', 'Mage'], /* aram. +Mage (Artillery?) */
   zac: ['Vanguard'],
   zed: ['Assassin'],
   zeri: ['Marksman'],
   ziggs: ['Artillery'],
   zilean: ['Specialist'],
   zoe: ['Burst'],
   zyra: ['Catcher', 'Mage'], /* aram. +Mage */
}
// 'controller': {
//    'Enchanter': [],
//    'Catcher': []
// },
// 'fighter': {
//    'Juggernaut': [],
//    'Diver': []
// },
// 'Mage': {
//    'vanilla': [],
//    'Burst': [],
//    'Battlemage': [],
//    'Artillery': []
// },
// 'Marksman': [],
// 'slayer': {
//    'Assassin': [],
//    'Skirmisher': []
// },
// 'tank': {
//    'Vanguard': [],
//    'Warden': []
// },
// 'Specialist': []
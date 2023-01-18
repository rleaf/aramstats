/* 
   LINKS
   1. https://leagueoflegends.fandom.com/wiki/Champion_classes
   2. https://web.archive.org/web/20170527192754/http://euw.leagueoflegends.com/en/news/game-updates/gameplay/taking-another-look-subclasses
   3. https://discord.com/channels/187652476080488449/379429593829867521/857402334316724265
   4. https://www.reddit.com/r/summonerschool/comments/8ao9vg/champion_subclasses_and_understanding_their/
   

   INFO
   1. Try to stay true to the class definitions in [1]
   2. There's going to be a lot of intersection to account for champ versatility
	   (galio & tk are both wardens and vanguards, when really a champ should fit to one subclass per class)
   3. Because of above, some class representations will be more inaccurate. Ie: If someone likes *only* playing poke ashe,
	   they will have high representation for 'Marksman' games because ashe is ['Mage', 'Marksman'].
	   Rn I think versatility > "small" loss of accuracy.
   4. Everywhere there is a comment signifies a change catering to aram meta.
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
   ashe: ['Mage', 'Marksman'], /* Marksman -> Mage */
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
   missfortune: ['Artillery', 'Marksman'], /* +Artillery */
   monkeyking: ['Diver'],
   mordekaiser: ['Juggernaut'],
   morgana: ['Catcher', 'Mage'], /* +Mage */
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
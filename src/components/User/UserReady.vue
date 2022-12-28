<script>
import Champion from '../Champion.vue'

export default {
   components: {
      Champion
   },
   data() {
      return {
         profile: {
            IconId: `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/${this.userInfo[0].profileIconId}.png`,
            name: this.userInfo[0].name
         },
      }
   },

   mounted() {
      this.userInfo.shift()
   },

   props: {
      userInfo: Object
   }

}
</script>

<template>
   <div class="user-ready-main">
      <!-- {{ this.userInfo }} -->
      <div class="profile-landing">
         <div class="profile-name">
            <img class="pfp" :src=profile.IconId  alt="">
            {{ this.profile.name }}
         </div>
      </div>
      <div class="headers">
         <div>Champion</div>
         <div>Total Games</div>
         <div>Wins</div>
         <div>avg Dmg</div>
         <div>avg Heal</div>
         <div>avg DT</div>
         <div>avg KDA</div>
         <div>avg Gold</div>
         <div>Triple Kills</div>
         <div>Quadra Kills</div>
         <div>Penta Kills</div>
      </div>
      <div>
         <Champion v-for="champ in this.userInfo"
            :key="champ.championName"
            :champion=champ
         />
      </div>
   </div>
</template>

<style scoped>
.headers {
   padding-left: 46px;
   padding-bottom: 8px;
   display: flex;
   align-items: center;
   /* gap: 1%; */

}

.headers > div {
   width: 109px;
   font-weight: bold;
   color: var(--light2);
}

.user-ready-main {
      /* margin: 0 15vw 0 15vw; */
      margin-left: auto;
      margin-right: auto;
      max-width: 1200px;

   }

   .profile-landing {
      /* background: #363636; */
      border-radius: 3px;
      width: 100%;
      height: 200px;
   }

   .profile-name {
      display: flex;
      justify-content: left;
      align-items: center;
      gap: 10px;
      padding-top: 45px;
      padding-left: 45px;
      font-size: 1.5rem;
      color: white;
   }

   .pfp {
      border-radius: 100%;
      width: 75px;
   }
</style>
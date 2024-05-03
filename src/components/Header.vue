<script>
import updates from '../constants/updates'
export default {
   data() {
      return {
         msg: updates[0].title,
      }
   }
}
</script>

<template>
   <div class="header-main">
      <RouterLink to="/updates">{{ this.msg }}</RouterLink>
   </div>
   <!-- <div class="header-main red"></div> -->
</template>

<style scoped>
   .header-main {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      /* background: var(--alpha-06); */
      background: linear-gradient(90deg, rgba(94, 150, 167, 0.5), rgba(32, 107, 129, 0.5));
      background-size: 400% 400%;
      /* background: rgba(36, 82, 32, 0.5); */
      /* background: rgba(94, 150, 167, 0.5); */
      animation: gradient 5s ease infinite;
      color: var(--color-font);
      font-size: 0.85rem;
   }

   .red {
      background: var(--loss);
   }
   
   a, p {
      color: var(--color-font);
   }

   @keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>
<script>
import Experience from '@/experience/Experience'

export default {
   data() {
      return {
         experience: null,
      }
   },

   beforeMount() {
      if (!localStorage.getItem('experience')) {
         localStorage.setItem('experience', 1)
      }
   },

   mounted() {
      if (+localStorage.getItem('experience') === 1) {
         this.renderExperience()
      } else {
         this.$refs.check.setAttribute('checked', '')
      }
   },

   unmounted() {
      if (this.experience) this.experience.remove()
   },
   
   methods: {
      toggleExperience() {
         if (+localStorage.getItem('experience') === 1) {
            this.$refs.check.setAttribute('checked', '')
            localStorage.setItem('experience', 0)
            this.experience.remove()
            this.experience = null
         } else {
            this.$refs.check.removeAttribute('checked')
            localStorage.setItem('experience', 1)
            this.renderExperience()
         }
      },
      
      renderExperience() {
         this.experience = new Experience(document.querySelector('.webgl'), false)
      }
   },
}


</script>

<template>
   <canvas class="webgl"></canvas>
   <div class="experience-toggle">
      <input ref="check" id='one' type='checkbox' @click="this.toggleExperience()"/>
      <label for='one'>
         <span></span>
         Disable experience
      </label>
   </div>
</template>

<style scoped>

.webgl {
   position: fixed;
   top: 0;
   left: 0;
   z-index: -50;
}

.experience-toggle {
   position: absolute;
   bottom: 2vh;
   left: 2vw;
}

/*
   Credit: https://codepen.io/dylanraga/pen/Qwqbab
*/

.experience-toggle * {
   box-sizing: border-box;
   user-select: none;
}

.experience-toggle input[type='checkbox']{
   height: 0;
   width: 0;
}

input[type='checkbox'] + label {
  position: relative;
  display: flex;
  /* margin: .6em 0; */
  align-items: center;
  color: var(--color-font-faded);
  font-size: 0.9rem;
  transition: color 250ms cubic-bezier(.4,.0,.23,1);
}

input[type='checkbox'] + label > span{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  width: 1em;
  height: 1em;
  background: transparent;
  border: 2px solid #9E9E9E;
  border-radius: 2px;
  cursor: pointer;  
  transition: all 250ms cubic-bezier(.4,.0,.23,1);
}

input[type='checkbox']:checked + label > span{
  border: .5em solid var(--ice-blue);
  animation: shrink-bounce 200ms cubic-bezier(.4,.0,.23,1);
}

input[type='checkbox']:checked + label > span:before{
  content: "";
  position: absolute;
  top: .5em;
  left: .12em;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  transform: rotate(45deg);
  transform-origin: 0% 100%;
  animation: checkbox-check 125ms 250ms cubic-bezier(.4,.0,.23,1) forwards;
}

@keyframes shrink-bounce{
  0%{
    transform: scale(1);
  }
  33%{    
    transform: scale(.85);
  }
  100%{
    transform: scale(1);    
  }
}

@keyframes checkbox-check{
  0%{
    width: 0;
    height: 0;
    border-color: #212121;
    transform: translate3d(0,0,0) rotate(45deg);
  }
  33%{
    width: .2em;
    height: 0;
    transform: translate3d(0,0,0) rotate(45deg);
  }
  100%{    
    width: .2em;
    height: .5em;    
    border-color: #212121;
    transform: translate3d(0,-.5em,0) rotate(45deg);
  }
}
</style>
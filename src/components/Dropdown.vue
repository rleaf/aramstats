<script>
export default {
   data() {
      return {
         optionsShown: false,
         placeholder: 'RG'
      }
   },
   
   props: {
      options: {
         type: Array,
         required: true,
         default: [],
      },
   },

   methods: {
      showOptions() {
         this.optionsShown = true
      },
      selectOption(option) {
         this.placeholder = option         
         this.optionsShown = false
         this.$emit('regionEmit', option)
      },
      exit() {
         this.optionsShown = false
      }
   },
}
</script>

<template>
   <div class="dropdown-container">
      <button class="drop" @click="showOptions()" @blur="exit()">{{ `${this.placeholder}` }}</button>
      <div class="dropdown-content" v-show="optionsShown">
         <div class="dropdown-item" @mousedown="selectOption(option)"
         v-for="(option, index) in options" :key="index">
            {{ option.toUpperCase() || '-' }}
         </div>
      </div>
   </div>
</template>

<style scoped>
.dropdown-container {
      display: inline-block;
      width: 80px;
      cursor: pointer;
   }

button {
   width: 100%;
   font-family: var(--font-main);
   color: var(--color-font);
   background: transparent;
   font-size: 1rem;
   border-radius: 5px;
   border: none;
   padding: 1rem;
}

.dropdown-content {
   position: absolute;
   background: var(--tint200);
   margin-top: 2px;
   border-radius: 5px;
   width: inherit;
   display: block;
}

.dropdown-item {
   padding: 0.5rem 1rem 0.5rem 1rem;
   color: var(--color-font);
}

.dropdown-container button:hover {
   cursor: pointer;
}
.dropdown-item:hover {
   background: var(--tint300);
   border-radius: 5px;
   
}
</style>
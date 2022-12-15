<script>
export default {
   data() {
      return {
         optionsShown: false,
         selected: '',
         placeholder: 'Region'
      }
   },
   
   props: {
      options: {
         type: Array,
         required: true,
         default: [],
      },
   },

   mounted() {

   },
   
   methods: {
      showOptions() {
         this.optionsShown = true
      },
      selectOption(option) {
         this.selected = option
         this.placeholder = option.region         
         this.optionsShown = false
         this.$emit('regionEmit', this.selected.region)
      },
      exit() {
         this.optionsShown = false
      }
   },
}
</script>

<template>
   <div class="dropdown-container">
      <button class="drop" @focus="showOptions()" @blur="exit()">{{ `${this.placeholder}` }}</button>
      <div class="dropdown-content" v-show="optionsShown">
         <div class="dropdown-item" @mousedown="selectOption(option)"
         v-for="(option, index) in options" :key="index">
            {{ option.region || '-' }}
         </div>
      </div>
   </div>
</template>

<style scoped>
.dropdown-container {
      display: inline-block;
      width: 80px;
   }

button {
   width: 100%;
   font-family: var(--font-main);
   background: transparent;
   font-size: 1rem;
   border-radius: 5px;
   border: none;
   padding: 1rem;
}

.dropdown-content {
   position: absolute;
   background: var(--light1);
   border-radius: 5px;
   width: inherit;
   display: block;
}

.dropdown-item {
   padding: 0.5rem 1rem 0.5rem 1rem;
}

.dropdown-item:hover {
   background: var(--light2);
   border-radius: 5px;
}
</style>
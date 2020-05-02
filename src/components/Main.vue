<template>
  <div class="main">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Welcome to the main vue'
      }
    }
  }
</script>

<style>
  .main {
    font-size: 30px;
    color: #000000;
  }
</style>
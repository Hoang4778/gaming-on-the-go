<template>
  <h1>404 Not found!</h1>
  <h3>Please go back to <router-link to="/">Homepage</router-link>!</h3>
</template>

<script>
export default {};
</script>

<style scoped>
h1 {
  text-align: center;
  margin: 40vh 0 2rem;
}
h3 {
  text-align: center;
}
a {
  text-decoration: none;
  color: hsl(265, 79%, 40%);
}
</style>
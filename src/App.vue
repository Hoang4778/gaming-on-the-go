<template>
  <Navbar />
  <main>
    <router-view />
  </main>
  <Footer />
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
export default {
  components: { Navbar, Footer },
};
</script>

<style scoped>
main {
  min-height: 100vh;
}
</style>
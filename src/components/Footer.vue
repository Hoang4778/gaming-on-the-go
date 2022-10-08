<template>
  <footer>
    <img src="../assets/Gaming-on-the-go-logo.png" alt="page-logo" />
    <div id="contact">
      <p>Contact us at:</p>
      <p><i class="fa-solid fa-phone"></i> 3795550038</p>
      <p><i class="fa-solid fa-envelope"></i> customer.service@gotg .com</p>
      <p>&copy; 2022 Gaming on the go. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  setup() {},
};
</script>

<style scoped>
footer {
  width: 100%;
  min-height: 8rem;
  background-color: hsl(265, 79%, 40%);
  color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
footer > img {
  height: 5rem;
}
#contact {
  line-height: 1.5rem;
}
@media (max-width: 500px) {
  footer {
    flex-direction: column;
    padding: 1rem 0;
  }
  #contact {
    text-align: center;
  }
}
</style>
<template>
  <div id="container">
    <h1>About us</h1>
    <h3>
      At <span>Gaming On The Go</span>, we only sell top-notch laptops from
      various brands that parter with us for many years.
    </h3>
    <img
      src="../assets/gaming-laptop-best-deals-banner-v1.webp"
      alt="promo-pic"
    />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  padding: 1rem;
}
h3 > span {
  color: hsl(265, 79%, 40%);
}
img {
  width: 80%;
  height: auto;
}
</style>
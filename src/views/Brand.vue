<template>
  <div v-if="brandShowcase" id="container">
    <img :src="brandShowcase.Logo" :alt="brand" id="brand-logo" />
    <div id="subbrand-logos">
      <div
        v-for="(subbrandSrc, subbrandName) in brandShowcase.SubbrandLogos"
        :key="subbrandName"
        class="subbrand"
      >
        <router-link
          :to="{
            name: 'products',
            params: { subbrand: subbrandName, brand: brand },
          }"
        >
          <img :src="subbrandSrc" :alt="subbrandName" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from "@firebase/firestore";
import { firestore } from "@/firebase/config";
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
export default {
  props: ["brand"],
  setup(props) {
    const brandShowcase = ref(null);

    watchEffect(async () => {
      const sglDoc = await getDoc(doc(firestore, "products", props.brand));
      brandShowcase.value = sglDoc.data();
    });

    watchEffect(() => {
      window.scrollTo(0, 0);
    });

    return {
      brandShowcase,
    };
  },
};
</script>

<style scoped>
#container {
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
#brand-logo {
  width: 40%;
  height: 40%;
}
#subbrand-logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}
.subbrand {
  width: 20rem;
}
.subbrand a img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
@media (max-width: 1000px) {
  #brand-logo {
    width: 50%;
    height: 50%;
  }
}
@media (max-width: 600px) {
  #brand-logo {
    width: 60%;
    height: 60%;
  }
}
@media (max-width: 500px) {
  #brand-logo {
    width: 70%;
    height: 70%;
  }
}
</style>
<template>
  <div id="carousel" ref="carouselLength" v-if="carousel">
    <img
      :src="carouselSrc"
      :alt="carouselName"
      v-for="(carouselSrc, carouselName) in carousel"
      :key="carouselName"
      class="carousel-img"
      ref="images"
      :style="{ transform: step }"
    />
    <span class="material-symbols-outlined arrow-back" @click="forwardSlide">
      arrow_forward_ios
    </span>
    <span class="material-symbols-outlined arrow-forward" @click="forwardSlide">
      arrow_forward_ios
    </span>
  </div>
  <div v-if="brandLogos">
    <h1 id="brand-title">We partner with:</h1>
    <div id="brand-logos">
      <div v-for="(imgSrc, imgName) in brandLogos" :key="imgName" class="logo">
        <router-link :to="{ name: 'brand', params: { brand: imgName } }">
          <img :src="imgSrc" :alt="imgName" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, onSnapshot } from "@firebase/firestore";
import { firestore } from "@/firebase/config";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
export default {
  setup() {
    const carousel = ref(null);
    const brandLogos = ref(null);
    const carouselLength = ref(null);
    const images = ref(null);
    const step = ref("");
    let slideNum = 0;
    let count = 0;

    onSnapshot(collection(firestore, "pageImages"), (snap) => {
      let images = snap.docs.map((item) => {
        return { images: { ...item.data() }, name: item.id };
      });
      images.forEach((element) => {
        if (element.name == "Carousel") {
          carousel.value = element.images;
        } else if (element.name == "BrandLogos") {
          brandLogos.value = element.images;
        }
      });
    });

    watch(carousel, () => {
      for (let img in carousel.value) {
        slideNum++;
      }
    });

    function forwardSlide() {
      if (count == slideNum - 1) {
        count = 0;
      } else {
        count++;
      }
      step.value = `translateX(-${count * carouselLength.value.offsetWidth}px)`;
    }

    function backSlide() {
      if (count == 0) {
        count = slideNum - 1;
      } else {
        count--;
      }
      step.value = `translateX(-${count * carouselLength.value.offsetWidth}px)`;
    }

    return {
      carousel,
      brandLogos,
      forwardSlide,
      backSlide,
      carouselLength,
      images,
      step,
    };
  },
};
</script>

<style scoped>
#carousel {
  width: 50%;
  min-height: 10rem;
  margin: 3rem auto;
  position: relative;
  display: flex;
  overflow: hidden;
}
.carousel-img {
  width: 100%;
  height: auto;
  flex-shrink: 0;
  transition: all 0.5s ease;
}
.material-symbols-outlined {
  position: absolute;
  color: white;
  font-size: 1.2rem;
  border: 1px solid white;
  border-radius: 50%;
}
.arrow-back {
  top: 45%;
  left: 1rem;
  transform: rotate(180deg);
}
.arrow-forward {
  top: 45%;
  right: 1rem;
}
.arrow-back:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.5);
}
.arrow-forward:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.5);
}
#brand-logos {
  margin: 2rem 10rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  gap: 1rem;
}
.logo {
  width: 100%;
}
.logo a img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
#brand-title {
  text-align: center;
}
@media (max-width: 1000px) {
  #brand-logos {
    grid-template-columns: 1fr 1fr;
    margin: 2rem 7rem;
  }
}
@media (max-width: 700px) {
  #brand-logos {
    margin: 2rem 3rem;
  }
}
@media (max-width: 500px) {
  #carousel {
    width: 70%;
  }
  #brand-logos {
    grid-template-columns: 1fr;
  }
  .arrow-back {
    left: 0.2rem;
  }
  .arrow-forward {
    right: 0.2rem;
  }
}
</style>
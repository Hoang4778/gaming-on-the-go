<template>
  <div id="container">
    <div id="order">
      <div id="order-list">
        <div v-for="(item, itemName) in cart" :key="item">
          <p>{{ itemName }}</p>
          <p>{{ item.quantity }}</p>
          <p>{{ item.price }}</p>
        </div>
      </div>
      <h3>
        <span>Subtotal:</span><span>{{ subtotal }}</span>
      </h3>
      <p>Shipping fee: $10</p>
      <h3><span>Final total:</span>{{ subtotal + 10 }}</h3>
    </div>
    <form id="payment">
      <h2>Just to confirm:</h2>
      <label>Address</label>
      <input type="text" ref="address" />
      <div v-for="(number, i) in userPhone" :key="number">
        <input type="checkbox" :value="number" :name="`num${i}`" />
        <label :for="`num${i}`">{{ number }}</label>
      </div>
      <div>
        <p>Payment method:</p>
        <div>
          <input type="radio" id="method1" value="cod" name="method" />
          <label for="method1">Cash on delivery</label>
        </div>
        <div>
          <input type="radio" id="method2" value="card" name="method" />
          <label for="method2">Card</label>
        </div>
      </div>
      <div>
        <input type="text" placeholder="Card number" />
        <input type="text" />
        <input type="text" placeholder="CVV" />
      </div>
      <button type="submit">Place order</button>
    </form>
  </div>
</template>

<script>
import { useStore } from "vuex";
export default {
  setup(props) {
    const store = useStore();
    const cart = JSON.parse(localStorage.getItem("cartItems"));
  },
};
</script>

<style scoped>
#container {
  margin: 2rem 0;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
}
#order {
  justify-self: right;
  padding-right: 1rem;
  border-right: 1px solid black;
}
#payment {
  justify-self: left;
  padding-left: 1rem;
}
</style>
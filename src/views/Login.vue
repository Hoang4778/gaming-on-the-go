<template>
  <div id="welcome" v-if="user">
    <h1>Welcome back, {{ user }}!</h1>
    <h3>
      Back to where we were in <span>{{ counter }}</span>
    </h3>
  </div>
  <div id="container" v-else>
    <h1>Welcome back!</h1>
    <form @submit.prevent="signin">
      <input
        type="text"
        placeholder="Enter your email"
        id="email"
        ref="email"
      />
      <input
        type="password"
        placeholder="Enter your password"
        id="password"
        ref="password"
      />
      <router-link to="/user/reset-password" @click="handleReset"
        >Forgot your password?</router-link
      >
      <button type="submit" ref="submit">Sign in</button>
    </form>
    <h3 v-if="err" id="error">{{ err }}</h3>
    <p id="signup">
      Are you new to our store?
      <router-link to="/signup">Create an account</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth, firestore } from "@/firebase/config";
import { collection, getDocs, query, where } from "@firebase/firestore";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const user = ref(null);
    const counter = ref(3);
    const email = ref(null);
    const password = ref(null);
    const err = ref(null);
    const submit = ref(null);

    if (store.state.nickname) {
      router.back();
    }

    function signin() {
      if (submit.value.disabled == false) {
        err.value = null;
        let emailInput = email.value.value;
        let passwordInput = password.value.value;
        if (!emailInput) {
          err.value = "Please type in your email";
        } else if (!passwordInput) {
          err.value = "Please type in your password";
        } else {
          submit.value.disabled = true;
          submit.value.textContent = "Signing in...";
          submit.value.style.opacity = "0.5";
          submit.value.style.cursor = "not-allowed";
          signInWithEmailAndPassword(auth, emailInput, passwordInput)
            .then(async () => {
              const q = query(
                collection(firestore, "users"),
                where("email", "==", emailInput)
              );
              const doc = await getDocs(q);
              doc.forEach((element) => {
                user.value = element.data().username;
              });
              localStorage.setItem("username", user.value);
              store.commit("updateUsername", user.value);
              setInterval(() => {
                counter.value--;
                if (counter.value == 0) {
                  router.back();
                }
              }, 1000);
            })
            .catch((error) => {
              err.value = error.message;
              submit.value.disabled = false;
              submit.value.textContent = "Sign in";
              submit.value.removeAttribute("style");
            });
        }
      }
    }

    function handleReset() {
      if (email.value.value) {
        localStorage.setItem("verifiedEmail", email.value.value);
      }
    }

    return {
      user,
      counter,
      email,
      password,
      signin,
      err,
      submit,
      handleReset,
    };
  },
};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
form {
  border: 2px solid hsl(265, 79%, 40%);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  font-size: 1.2rem;
  padding: 0.5rem;
  border: none;
  width: 20rem;
}
input:focus {
  outline: none;
}
button {
  font-size: 1.2rem;
  padding: 1rem;
  background-color: hsl(265, 79%, 40%);
  color: white;
  cursor: pointer;
  border: none;
}
form > a {
  text-decoration: none;
  color: hsl(265, 79%, 40%);
}
form > a:hover {
  text-decoration: underline;
}
#signup {
  text-align: center;
}
#signup > a {
  text-decoration: none;
  color: hsl(265, 79%, 40%);
}
#signup > a:hover {
  text-decoration: underline;
}
#welcome {
  text-align: center;
  margin: 40vh 0;
}
#welcome > h3 > span {
  color: hsl(265, 79%, 40%);
}
#error {
  color: red;
}
</style>
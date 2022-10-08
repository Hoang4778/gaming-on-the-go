<template>
  <div v-if="newUser" id="new-user">
    <h1>Welcome, {{ newUser }}!</h1>
    <h3 id="redirect">
      Back to where we were in <span id="counter">{{ counter }}</span>
    </h3>
  </div>
  <div id="container" v-else>
    <h1>Welcome, new gamer!</h1>
    <form @submit.prevent="signup">
      <input
        type="text"
        placeholder="Enter your username"
        ref="username"
        @input="checkUsername"
      />
      <p v-if="usernameMatch" id="username-match">
        <span class="material-symbols-outlined"> error </span>
        {{ usernameMatch }}
      </p>
      <div id="email">
        <input
          type="text"
          placeholder="Enter your email"
          ref="email"
          @input="checkEmail"
        />
        <span
          class="material-symbols-outlined email-icon"
          :class="{ 'email-check': emailCheck }"
        >
          check_circle
        </span>
      </div>
      <p id="email-match" v-if="emailMatch">
        <span class="material-symbols-outlined"> error </span> {{ emailMatch }}
      </p>
      <input
        type="password"
        placeholder="Enter your password"
        ref="password"
        @input="checkPassword"
      />
      <ul id="password-req">
        Password must contain:
        <li :class="{ 'password-check-1': passwordCheck1 }">
          <span class="material-symbols-outlined"> check_circle </span>
          <span>at least 6 characters</span>
        </li>
        <li :class="{ 'password-check-2': passwordCheck2 }">
          <span class="material-symbols-outlined"> check_circle </span>
          <span>at least 1 capital letter</span>
        </li>
      </ul>
      <div id="password-match">
        <input
          type="password"
          placeholder="Confirm your password"
          ref="confirmPassword"
          @input="checkMatchedPassword"
        />
        <span
          class="material-symbols-outlined match"
          :class="{ 'password-match': passwordMatch }"
        >
          check_circle
        </span>
      </div>
      <button type="submit" ref="submit">Sign up</button>
    </form>
    <h3 v-if="err">
      <span class="material-symbols-outlined"> error </span> {{ err }}
    </h3>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth, firestore } from "@/firebase/config";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";
import { useRouter } from "vue-router";

export default {
  setup() {
    const username = ref(null);
    const email = ref(null);
    const emailRegex = /\w{3,}@\w+\.\w{2,}/;
    const emailCheck = ref(false);
    const password = ref(null);
    const passwordRegex1 = /.{6,}/;
    const passwordRegex2 = /[A-Z]+/;
    const passwordCheck1 = ref(false);
    const passwordCheck2 = ref(false);
    const confirmPassword = ref(null);
    const passwordMatch = ref(false);
    const store = useStore();
    const newUser = ref(null);
    const err = ref(null);
    const submit = ref(null);
    const usernameMatch = ref(null);
    const emailMatch = ref(null);
    const router = useRouter();
    const counter = ref(3);

    async function checkUsername() {
      const q = query(
        collection(firestore, "users"),
        where("username", "==", username.value.value)
      );
      const res = await getDocs(q);
      if (res.empty == false) {
        usernameMatch.value = "Username has been taken";
      } else {
        usernameMatch.value = null;
      }
    }

    async function checkEmail() {
      emailCheck.value = emailRegex.test(email.value.value);
      const q = query(
        collection(firestore, "users"),
        where("email", "==", email.value.value)
      );
      const res = await getDocs(q);
      if (res.empty == false) {
        emailMatch.value = "Email has been taken";
      } else {
        emailMatch.value = null;
      }
    }

    function checkPassword() {
      passwordCheck1.value = passwordRegex1.test(password.value.value);
      passwordCheck2.value = passwordRegex2.test(password.value.value);
    }

    function checkMatchedPassword() {
      if (confirmPassword.value.value == password.value.value) {
        passwordMatch.value = true;
      } else {
        passwordMatch.value = false;
      }
    }

    async function signup() {
      if (submit.value.disabled == false) {
        err.value = null;
        let nameInput = username.value.value;
        let emailInput = email.value.value;
        let passwordInput = password.value.value;
        let confirnInput = confirmPassword.value.value;
        if (!nameInput) {
          err.value = "Please type in your username";
        } else if (!emailInput) {
          err.value = "Please type in your email";
        } else if (!passwordInput) {
          err.value = "Please type in your password";
        } else if (!confirnInput) {
          err.value = "Please confirm your password";
        } else {
          submit.value.disabled = true;
          submit.value.textContent = "Signing you up...";
          submit.value.style.opacity = "0.5";
          submit.value.style.cursor = "not-allowed";
          await addDoc(collection(firestore, "users"), {
            username: nameInput,
            email: emailInput,
            password: passwordInput,
          });
          createUserWithEmailAndPassword(auth, emailInput, passwordInput)
            .then(() => {
              newUser.value = nameInput;
            })
            .catch((error) => {
              err.value = error.message;
              submit.value.disabled = false;
              submit.value.textContent = "Sign up";
              submit.value.removeAttribute("style");
            });
          localStorage.setItem("username", nameInput);
          store.commit("updateUsername", nameInput);
          scrollTo(0, 0);
          setInterval(() => {
            counter.value--;
            if (counter.value == 0) {
              router.back();
            }
          }, 1000);
        }
      }
    }

    return {
      username,
      email,
      emailCheck,
      checkEmail,
      password,
      passwordCheck1,
      passwordCheck2,
      checkPassword,
      confirmPassword,
      passwordMatch,
      checkMatchedPassword,
      signup,
      newUser,
      err,
      submit,
      checkUsername,
      usernameMatch,
      emailMatch,
      counter,
    };
  },
};
</script>

<style scoped>
#container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
form {
  width: 22rem;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: stretch;
  padding: 1rem;
  gap: 1rem;
  border: 2px solid hsl(265, 79%, 40%);
  border-radius: 0.5rem;
}
#username-match {
  color: red;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
input {
  width: 100%;
  font-size: 1.2rem;
  padding: 0.5rem;
  border: none;
}
input:focus {
  outline: none;
}
#email {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
#email-match {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: red;
}
.email-icon,
.match {
  display: none;
  color: green;
}
.email-check {
  display: block;
}
#password-req {
  line-height: 1.5rem;
  align-self: flex-start;
}
#password-req > li {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.password-check-1,
.password-check-2 {
  color: green;
}
#password-match {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
}
.password-match {
  display: block;
}
button {
  width: 100%;
  font-size: 1.2rem;
  padding: 1rem;
  background-color: hsl(265, 79%, 40%);
  color: white;
  cursor: pointer;
  border: none;
}
#new-user {
  text-align: center;
  margin: 40vh 0 0;
}
#redirect {
  text-align: center;
}
#counter {
  color: hsl(265, 79%, 40%);
}
h3 {
  color: red;
}
</style>
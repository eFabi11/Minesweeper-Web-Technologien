<template>
  <div :style="{ backgroundColor: '#f5f5f5' }">
    <section class="container mt-4 active">
    <h2>User Registration</h2>
    <p>Register with your email or sign in using Google.</p>

    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary btn-block"
        @click="register">
        Register
      </button>
    </form>
    <p v-if="error" class="text-danger mt-2">{{ error }}</p>
    <div class="mt-4">
      <p>Or</p>
      <button
        type="submit"
        class="btn btn-primary btn-block"
        @click="signIn">
        Sign In
      </button>
      <button
        class="btn btn-danger btn-block"
        @click="signInWithGoogle">
        <i class="fab fa-google"></i> Sign in with Google
      </button>
    </div>
    </section>
  </div>
</template>

<script>
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    register() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
          console.log("Successfully registered user:", auth.currentUser);
          this.$emit('singed-in');
      })
      .catch((error) => {
          console.error("Error registering user:", error.code);
          alert(error.message);
      });
    },
    signIn() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        console.log("Successfully signed in user:", auth.currentUser);
        this.$emit('singed-in');
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            this.error = "Invalid email format. Please enter a valid email address.";
            break;
          case "auth/user-not-found":
            this.error = "User not found. Please check your email and password.";
            break;
          case "auth/wrong-password":
            this.error = "Incorrect password. Please enter the correct password.";
            break;
          case "auth/invalid-credential":
            this.error = "Invalid credentials. Please enter a correct E-Mail and Password.";
            break;
        }
      });
    },
    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
      .then(() => {
        console.log("Successfully signed in with Google:", getAuth().currentUser);
        this.$emit('singed-in');
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error.code);
        alert(error.message);
      });
    }
  }
};
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Bitter');
    @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

    /* General styles */
    * {
        font-family: 'Bitter', 'Arial', sans-serif;
        text-align: center;
    }

    /* Active section styling */
    section.active {
        border: 2px solid #007bff;
        background-color: rgba(0, 123, 255, 0.04);
    }

    .container {
        background-color: rgba(255, 255, 255, 0.75);
        padding: 60px;
        border-radius: 100px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #007bff;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 20px;
      text-align: center;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .btn-block {
      width: 100%;
    }

    button {
      transition: transform 0.2s;
    }

    button:hover {
      transform: scale(1.05);
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
        .container {
            padding: 30px;
        }
    }

    @media (max-width: 576px) {
        .container {
            padding: 20px;
        }
    }
</style>

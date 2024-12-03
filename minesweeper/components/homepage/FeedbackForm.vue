<template>
  <div>
    <h2>Feedback</h2>
        <form id="feedbackForm" action="/submit-feedback" method="POST">
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea class="form-control" id="message" name="message" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-success">Submit</button>
        </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedback: ''
    };
  },
  methods: {
    submitFeedback() {
      if (this.feedback) {
        alert("Thank you for your feedback!");
        this.feedback = ''; // Clear feedback after submission
      } else {
        alert("Please provide feedback before submitting.");
      }
    }
  }
};
</script>

<style scoped>

    /* Heading */
    h2 {
        color: #007bff;
        margin-top: 15px;
    }

</style>

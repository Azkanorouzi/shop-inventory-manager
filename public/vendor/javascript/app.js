// Form validations
const form = document.querySelector("#formD");
const submitBtn = document.querySelector("#formSubmit");

form.addEventListener("submit", (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
  }

  form.classList.add("was-validated");
});

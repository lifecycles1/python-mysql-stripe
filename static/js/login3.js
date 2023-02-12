function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

let prism = document.querySelector(".rec-prism");

function showSignup() {
  prism.style.transform = "translateZ(-100px) rotateY( -90deg)";
}
function showLogin() {
  prism.style.transform = "translateZ(-100px)";
}
function showForgotPassword() {
  prism.style.transform = "translateZ(-100px) rotateY( -180deg)";
}

function showSubscribe() {
  prism.style.transform = "translateZ(-100px) rotateX( -90deg)";
}

function showContactUs() {
  prism.style.transform = "translateZ(-100px) rotateY( 90deg)";
}

function showThankYou(event) {
  elId = event.target.id;
  // switch case prevents form from rotating if any of the fields are empty
  switch (elId) {
    case "id-contact":
      if (document.getElementById("contact_form_name").value.trim() == "" || document.getElementById("contact_form_email").value.trim() == "" || document.getElementById("contact_form_message").value.trim() == "") {
        alert("Please fill out all fields");
        return;
      }
      break;
    case "id-sign_up":
      if (document.getElementById("sign_up_email").value.trim() == "" || document.getElementById("sign_up_pass").value.trim() == "" || document.getElementById("sign_up_pass2").value.trim() == "") {
        alert("Please fill out all fields");
        return;
      }
      break;
    case "id-forgot_pass":
      if (document.getElementById("forgot_pass_email").value.trim() == "") {
        alert("Please fill out all fields");
        return;
      }
      break;
    case "id-sign-in":
      if (document.getElementById("signin-email").value.trim() == "" || document.getElementById("signin-password").value.trim() == "") {
        alert("Please fill out all fields");
        return;
      }
      break;
    case "id-subscribe":
      if (document.getElementById("subscribe-email").value.trim() == "") {
        alert("Please fill out all fields");
        return;
      }
      break;
  }
  prism.style.transform = "translateZ(-100px) rotateX( 90deg)";
}

$(document).on("submit", "#subscribe", function (e) {
  e.preventDefault();
  document.getElementById("sse_msg").innerText = "";
  if ($("#subscribe-email").val().trim() == "") {
    return;
  }
  $.ajax({
    type: "POST",
    url: "/",
    data: {
      form: "subscribe",
      email: $("#subscribe-email").val(),
    },
    success: function (res) {
      document.getElementById("sse_msg").innerText = res.data;
    },
  });
});

$(document).on("submit", "#signin", async function (e) {
  e.preventDefault();
  document.getElementById("sse_msg").innerText = "";
  thankumsg = document.getElementById("thank-u-msg");
  thankumsg.style.display = "none";
  if ($("#signin-email").val().trim() == "" || $("#signin-password").val().trim() == "") {
    return;
  }
  // await sleep(2000);
  // sending an ajax request to the server
  $.ajax({
    type: "POST",
    url: "/",
    data: {
      form: "sign_in",
      email: $("#signin-email").val(),
      password: $("#signin-password").val(),
    },
    success: async function (res) {
      if (res.data == "success") {
        // if success adds normal class and sleeps until the animation is done
        thankumsg.innerText = "Thank you!";
        thankumsg.classList.remove("login-denied");
        thankumsg.classList.add("thank-you-msg");
        thankumsg.style.display = "block";
        await sleep(4000);
        window.location.reload();
      } else if (res.data == "fail") {
        thankumsg.innerText = "Login failed!";
        thankumsg.classList.remove("thank-you-msg");
        thankumsg.classList.add("login-denied");
        thankumsg.style.display = "block";
      }
    },
  });
});

$(document).on("submit", "#forgot_password", function (e) {
  e.preventDefault();
  document.getElementById("sse_msg").innerText = "";
  thankumsg = document.getElementById("thank-u-msg");
  thankumsg.style.display = "none";
  if ($("#forgot_pass_email").val().trim() == "") {
    return;
  }
  $.ajax({
    type: "POST",
    url: "/",
    data: {
      form: "forgot_password",
      email: $("#forgot_pass_email").val(),
    },
    success: function (res) {
      if (res.data == "success") {
        thankumsg.innerText = "Thank you!";
        thankumsg.classList.remove("login-denied");
        thankumsg.classList.add("thank-you-msg");
        thankumsg.style.display = "block";
        document.getElementById("sse_msg").innerText = "An email has been sent";
      } else if (res.data == "fail") {
        thankumsg.innerText = "Incorrect email!";
        thankumsg.classList.remove("thank-you-msg");
        thankumsg.classList.add("login-denied");
        thankumsg.style.display = "block";
        document.getElementById("sse_msg").innerText = "";
      }
    },
  });
});

$(document).on("submit", "#sign_up", function (e) {
  e.preventDefault();
  document.getElementById("sse_msg").innerText = "";
  thankumsg = document.getElementById("thank-u-msg");
  thankumsg.style.display = "none";
  if ($("#sign_up_pass").val().trim() == "" || $("#sign_up_pass2").val().trim() == "" || $("#sign_up_email").val().trim() == "") {
    return;
  }
  if ($("#sign_up_pass").val() != $("#sign_up_pass2").val()) {
    alert("Passwords do not match");
    return;
  }
  $.ajax({
    type: "POST",
    url: "/",
    data: {
      form: "sign_up",
      email: $("#sign_up_email").val(),
      password: $("#sign_up_pass").val(),
    },
    success: async function (res) {
      if (res.data == "success") {
        // if success adds normal class and sleeps until the animation is done
        thankumsg.innerText = "Thank you!";
        thankumsg.classList.remove("login-denied");
        thankumsg.classList.add("thank-you-msg");
        thankumsg.style.display = "block";
        await sleep(4000);
        window.location.reload();
      } else if (res.data == "fail") {
        thankumsg.innerText = "User exists!";
        thankumsg.classList.remove("thank-you-msg");
        thankumsg.classList.add("login-denied");
        thankumsg.style.display = "block";
      }
    },
  });
});

$(document).on("submit", "#contact_form", function (e) {
  e.preventDefault();
  document.getElementById("sse_msg").innerText = "";
  if ($("#contact_form_name").val().trim() == "" || $("#contact_form_email").val().trim() == "" || $("#contact_form_message").val().trim() == "") {
    return;
  }
  $.ajax({
    type: "POST",
    url: "/",
    data: {
      form: "contact_form",
      name: $("#contact_form_name").val(),
      email: $("#contact_form_email").val(),
      message: $("#contact_form_message").val(),
    },
    success: function (res) {
      if (res.data == "success") {
        document.getElementById("sse_msg").innerText = "We will get back to you as soon as possible!";
      }
    },
  });
});

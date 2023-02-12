$("form :input").on("change", function () {
  if (
    document.getElementById("from_date").value.length > 0 &&
    document.getElementById("to_date").value.length > 0 &&
    document.getElementById("rooms").options[document.getElementById("rooms").selectedIndex].value.length > 0 &&
    document.getElementById("adults").options[document.getElementById("adults").selectedIndex].value.length > 0 &&
    document.getElementById("children").options[document.getElementById("children").selectedIndex].value.length > 0
  ) {
    $(".submit-btn").removeAttr("disabled");
    $(".submit-btn").addClass("enabled-button");
  } else {
    $(".submit-btn").attr("disabled", "disabled");
    // $(".submit-btn").css("background-color", "grey");
  }
});

////////// 1st call - default on page load - Get Stripe publishable key
fetch("/config")
  .then((result) => {
    return result.json();
  })
  .then((data) => {
    // Initialize Stripe.js
    const stripe = Stripe(data.publicKey);
    /////////// 2nd call - button submit call - subsequently, when the user clicks the "Book Now" button
    $(".submit-btn").click(function (e) {
      e.preventDefault();
      booking_data = {
        from_date: document.getElementById("from_date").value,
        to_date: document.getElementById("to_date").value,
        hotel_name: document.getElementById("hotel_name").innerHTML,
        rooms: document.getElementById("rooms").options[document.getElementById("rooms").selectedIndex].value,
        adults: document.getElementById("adults").options[document.getElementById("adults").selectedIndex].value,
        children: document.getElementById("children").options[document.getElementById("children").selectedIndex].value,
      };
      // // Get Checkout Session ID
      fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking_data),
      })
        .then((result) => {
          return result.json();
        })
        .then((data) => {
          console.log("before redirect to checkout", data);
          // Redirect to Stripe Checkout
          return stripe.redirectToCheckout({ sessionId: data.sessionId });
        })
        .then((res) => {
          console.log("redirect response", res);
        });
    });
  });

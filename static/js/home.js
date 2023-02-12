var hotels = [
  {
    name: "Hotel Arma Executive",
    image: "/static/assets/images.jpg",
    address: "Khar West, Mumbai, Maharashtra, India",
    stars: "&#11088;&#11088;&#11088;&#11088;",
    price: "$900",
  },
  {
    name: "Oritel Service Apartments",
    image: "/static/assets/images (4).jpg",
    address: "Navi Mumbai, Maharashtra 400703, India",
    stars: "&#11088;&#11088;&#11088;",
    price: "$600",
  },
  {
    name: "Hotel Grande 51",
    image: "/static/assets/images (3).jpg",
    address: "Mumbai, Maharashtra 400049, India",
    stars: "&#11088;&#11088;&#11088;&#11088;",
    price: "$800",
  },
  {
    name: "Bliss Comfort",
    image: "/static/assets/images (2).jpg",
    address: "Jari mari, Bandra Kurla Complex",
    stars: "&#11088;&#11088;&#11088;",
    price: "$700",
  },
  {
    name: "Lake Bloom Residency",
    image: "/static/assets/images (1).jpg",
    address: "Anheri East Chandevali, Powai",
    stars: "&#11088;&#11088;&#11088;",
    price: "$700",
  },
  {
    name: "Twinkle Apartments",
    image: "/static/assets/download (14).jpg",
    address: "Marol Maroshi Road Andheri (East)",
    stars: "&#11088;&#11088;&#11088;",
    price: "$900",
  },
  {
    name: "Hotel Sai Residency Vasai",
    image: "/static/assets/download (13).jpg",
    address: "Saki Vihar Road, Powai",
    stars: "&#11088;&#11088;&#11088;&#11088;",
    price: "$700",
  },
  {
    name: "Meluha The Fern",
    image: "/static/assets/download (12).jpg",
    address: "11 padma nagar, Mumbai, Malad West",
    stars: "&#11088;&#11088;&#11088;",
    price: "$900",
  },
  {
    name: "Hotel Royal Annex",
    image: "/static/assets/download (11).jpg",
    address: "101, New link road, Andheri West",
    stars: "&#11088;&#11088;&#11088;&#11088;&#11088;",
    price: "$900",
  },
  {
    name: "Ashiana Apartments",
    image: "/static/assets/download (10).jpg",
    address: "Sativali Road, Vasai East",
    stars: "&#11088;&#11088;&#11088;&#11088;",
    price: "$850",
  },
  {
    name: "Hotel Vasantashram",
    image: "/static/assets/download (9).jpg",
    address: "Central Avenue, Hiranandani Gardens",
    stars: "&#11088;&#11088;&#11088;&#11088;",
    price: "$800",
  },
  {
    name: "Hotel Supreme",
    image: "/static/assets/download (8).jpg",
    address: "25 Andheri Kurla Road, Andheri East",
    stars: "&#11088;&#11088;&#11088;&#11088;&#11088;",
    price: "$1000",
  },
  {
    name: "Fortune Park Lake",
    image: "/static/assets/download (7).jpg",
    address: "Shakti Complex, Andheri E Mumbai",
    stars: "&#11088;&#11088;&#11088;&#11088;&#11088;",
    price: "$1000",
  },
  {
    name: "Hotel Rajvikas Residency",
    image: "/static/assets/download (6).jpg",
    address: "Vashantashram, Crawford Market Mumbai",
    stars: "&#11088;&#11088;&#11088;",
    price: "$550",
  },
  {
    name: "Hotel Panchratna",
    image: "/static/assets/download (5).jpg",
    address: "4, Panday Road, South Mumbai, Colaba",
    stars: "&#11088;&#11088;&#11088;",
    price: "$500",
  },
  {
    name: "Hotel Grand Hometel",
    image: "/static/assets/download (4).jpg",
    address: "Eastern Express Highway, Thane West",
    stars: "&#11088; &#11088; &#11088;",
    price: "$600",
  },
  {
    name: "Avion Hotel",
    image: "/static/assets/download (3).jpg",
    address: "JNPT Township, Uran Uran, Raigad",
    stars: "&#11088;&#11088;&#11088;&#11088;",
    price: "$750",
  },
  {
    name: "Aura Hotel Malad",
    image: "/static/assets/download (2).jpg",
    address: "220/221, Old Panvel MG road",
    stars: "&#11088;&#11088;&#11088;",
    price: "$800",
  },
  {
    name: "Hotel Ace Residency",
    image: "/static/assets/download (1).jpg",
    address: "Vile Parle East, Mumbai Domestic Airport",
    stars: "&#11088;&#11088;&#11088;&#11088;",
    price: "$1000",
  },
];

window.onscroll = function () {
  // change navbar opacity on scroll and add box-shadow
  navContainer = document.getElementById("nav-container");
  if (window.scrollY > 180) {
    navContainer.style.backgroundColor = "rgb(7, 173, 144, 0.8)";
    navContainer.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.75)";
  } else if (window.scrollY < 180) {
    navContainer.style.backgroundColor = "rgb(7, 173, 144)";
    navContainer.style.boxShadow = "none";
  }
  // show scroll-to-top button on scroll
  if (window.scrollY > 500) {
    document.getElementById("scroll-to-top").style.display = "block";
  } else if (window.scrollY < 500) {
    document.getElementById("scroll-to-top").style.display = "none";
  }
  // hide dropdown on any scroll
  $(".nav-dropdown").hide("slow");
};

// setup pagination in "pagination" element with twbsPagination plugin and at the same time display all data (html string) in "container" element
pageSize = 4;
var totalPages = Math.ceil(hotels.length / pageSize);
// jquery library twbsPagination plugin
$(".pagination").twbsPagination({
  totalPages: totalPages,
  visiblePages: 3,
  prev: "Prev",
  activeClass: "active",
  onPageClick: function (event, page) {
    var html = "";
    for (var i = (page - 1) * pageSize; i < page * pageSize && i < hotels.length; i++) {
      html += `<div class="thumbnail">
        <div class="name">${hotels[i].name}</div>
        <div class="test image-holder">
          <img class="image" src="${hotels[i].image}" width="300" height="200" alt="image" />
          <button class="book-now">Book Now</button>
        </div>
        <div class="address">${hotels[i].address}</div>
        <div class="price">${hotels[i].price}</div>
        <div class="stars">${hotels[i].stars}</div>
        </div>`;
      $("#container")
        .html(html)
        .on("click", ".test", function (e) {
          var hotel_name = e.target.parentNode.parentNode.children[0].innerHTML;
          window.location.replace(`/reservations/${hotel_name}`);
        });
    }
  },
});

// toggle visibility of dropdown
$("#right-nav-logout").click(function () {
  if ($(".nav-dropdown").is(":hidden")) {
    $(".nav-dropdown").show("slow");
  } else {
    $(".nav-dropdown").slideUp("fast");
  }
});

//hide dropdown when clicked outside
$(document).click(function () {
  $(".nav-dropdown").hide();
});

//stop propagation of click event (to prevent hiding dropdown when clicked inside)
$("#right-nav-logout")
  .add(".nav-dropdown")
  .on("click", function (e) {
    e.stopPropagation();
  });

// scroll to top
$("#scroll-to-top").click(function () {
  $("html").animate({ scrollTop: 0 }, "slow");
});

$("#left-nav-logo").click(function () {
  window.location.replace("/");
});

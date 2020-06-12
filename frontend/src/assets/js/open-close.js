$(".header-name-group").addClass("text-center");

$(".open").on("click", (event) => {
  $(".body-discuss .row .message").css("height", "auto");
  $(".body-discuss .row .message").css("top", "70px");
  $(".open").addClass("d-none");
  $(".content").removeClass("col-12").addClass("col-8");
  $(".send").css("display", "block");
  $(".body-discuss .row .message .input-message .form-control").css(
    "display",
    "block"
  );
});

$(".close").on("click", (event) => {
  $(".body-discuss .row .message").css("height", "60px");
  $(".body-discuss .row .message").css("top", "0px");
  $(".open").removeClass("d-none");
  $(".content").removeClass("col-8").addClass("col-12");
  $(".send").css("display", "none");
  $(".body-discuss .row .message .input-message .form-control").css(
    "display",
    "none"
  );
});


const backButt = document.querySelector(".back");
if (backButt) {
  backButt.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = '../../explore/explore.html';
  })
}
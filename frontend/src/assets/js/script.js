document.getElementById("user").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "profile.html";
})

document.getElementById("notify").addEventListener("click", function(e) {
    e.preventDefault();
    $(function() {
        $('[data-toggle="popover"]').popover();
    })
})

document.querySelectorAll("#index .card").forEach(function(card){
    card.addEventListener("click", function(e) {
        e.preventDefault();
        window.location.href = "groupDetailsUserView.html";
    })
})

document.querySelectorAll("#dashboard .card").forEach(function(card){
    card.addEventListener("click", function(e) {
        e.preventDefault();
        window.location.href = "groupDetailsMemberView.html";
    })
})

document.querySelectorAll("#build .card").forEach(function(card){
    card.addEventListener("click", function(e) {
        e.preventDefault();
        window.location.href = "groupDetailsAdminView.html";
    })
})


const settings = document.getElementById("settings");
if (settings) settings.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "settings.html";
})

const createButt = document.getElementById("createButt");
if (createButt) createButt.addEventListener("click", function(e) {
    e.preventDefault();
    $('#createForm').modal('show');
})

const editProfileButt = document.getElementById("editProfileButt");
if (editProfileButt) editProfileButt.addEventListener("click", function(e){
    e.preventDefault();
    $('#editProfileForm').modal('show');
})

const quitGroupButt = document.getElementById("quitGroupButt");
if (quitGroupButt) quitGroupButt.addEventListener("click", function(e) {
    e.preventDefault();
    $('#quitGroupForm').modal('show');
})

const quitYesButt = document.getElementById("quitYesButt");
if (quitYesButt) quitYesButt.addEventListener("click", function(e) {
    e.preventDefault();
    $('#quitGroupForm').modal('hide');
    $('#commentForm').modal('show');

})

const ratings = document.querySelector('#rating');
if (ratings) ratings.addEventListener('click', function (e) {
    let action = 'add';
    let cnt = 0;
    for (const span of this.children) {
        if (action == 'add') cnt++;
        span.classList[action]('active');
        if (span === e.target) { 
            action = 'remove';
        }
    }
    console.log(cnt);
});

const groups = document.querySelectorAll('.gotochat');
if (groups) groups.forEach(function(group) {
    group.addEventListener('click', function (e) {
        window.location.href = 'dark-mode.html';
    }) 
})
$(document).ready(function() {
  $(".button-collapse").sideNav();
  $('.modal-trigger').leanModal();


  // Register and Login forms
  $('#registerScreen').hide();

  $('#registerLoginBtn').on('click', function() {
    $('#loginScreen').hide();
    $('#registerScreen').show();
  });

  $('.cancelButton').on('click', function() {
    setInterval(function() {
      $('#loginScreen').show();
      $('#registerScreen').hide();
    }, 1000)
  })
});

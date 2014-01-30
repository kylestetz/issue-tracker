$( function() {

  $('.triangle').click( function() {
    $(this).parents('.repo').find('.repo-contents').toggleClass('collapsed');
    $(this).toggleClass('open');
  });

});
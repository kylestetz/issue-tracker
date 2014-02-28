$( function() {

  $('.triangle, .repo-title-text').click( function(e) {
    if(e.shiftKey && $(this).parent().find('.triangle').is('.open')) {
      $('.repo-contents').toggleClass('collapsed', true);
      $('.triangle').toggleClass('open', false);
    } else {
      $(this).parents('.repo').find('.repo-contents').toggleClass('collapsed');
      $(this).parent().find('.triangle').toggleClass('open');
    }
  });

});
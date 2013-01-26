(function() {

  // Filter archive posts
  var fb = $('.filter-bar');
  if ($(fb).length) {
    $('li', fb).click(function(){
      $('li.active', fb).removeClass('active');
      $(this).addClass('active');
      var tag = $(this).data('tag');
      if (tag == 'all') {
        $('.archive-post-teaser').show();
      }
      else{
        $('article:not(.tag-' + tag + ')').hide();
        $('article.tag-' + tag).show();
      }
    })
  }

  // Validate contact form
  if ($('#bkw-contact-form').length) {
    $('#bkw-contact-form').attr('action', 'https://docs.google.com/spreadsheet/formResponse?formkey=dE9ENGlHVVpNblAtR0ZHZ2dkNkJ0bUE6MQ&amp;ifq');
    $('#bkw-contact-form').validate();
  }
}());

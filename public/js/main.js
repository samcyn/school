var handler = StripeCheckout.configure({
  key: 'pk_test_HzO2Lk8elyziiKyWokzrsf0m',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: function (token) {
    var paymentForm = $("#paymentForm");
   
    var formData = paymentForm.serialize() + '&stripeToken=' + token.id + '&stripeTokenType=' + token.type;

    $.ajax({
      url: paymentForm.attr('action'),
      type: paymentForm.attr('method'),
      data: formData,
      success: function (data) {
        paymentForm[0].reset();
      },
      error: function (xhr, err) {
        
      },
    });

  }
});


// Close Checkout on page navigation:
window.addEventListener('popstate', function () {
  handler.close();
});

var app = { 
  carouselCTRL: function () {
    $('.multi-item-carousel').carousel({
      interval: false
    });

    // for every slide in carousel, copy the next slide's item in the slide.
    // Do the same for the next, next item.
    $('.multi-item-carousel .item').each(function () {
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      //next.children(':first-child').clone().appendTo($(this));

      if (next.next().length > 0) {
        next.next().children(':first-child').clone().appendTo($(this));
      } else {
        $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
      }

      /*testimonial*/
    });
  },
  formSumbitController: function (e, title, price) {
    e.preventDefault();

    handler.open({
      name: 'Univelcity',
      description: title,
      amount: Number(price),
    });
  }
}

// export default app;

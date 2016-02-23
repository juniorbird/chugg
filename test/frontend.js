casper.on("remote.message", function(msg) {
    this.echo("Console: " + msg);
});

// http://docs.casperjs.org/en/latest/events-filters.html#page-error
casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
    // maybe make it a little fancier with the code from the PhantomJS equivalent
});

// http://docs.casperjs.org/en/latest/events-filters.html#resource-error
casper.on("resource.error", function(resourceError) {
    this.echo("ResourceError: " + JSON.stringify(resourceError, undefined, 4));
});

// http://docs.casperjs.org/en/latest/events-filters.html#page-initialized
casper.on("page.initialized", function(page) {
    // CasperJS doesn't provide `onResourceTimeout`, so it must be set through
    // the PhantomJS means. This is only possible when the page is initialized
    page.onResourceTimeout = function(request) {
        console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
    };
});

casper.on( 'page.initialized', function(){
  this.evaluate(function(){
      var isFunction = function(o) {
        return typeof o == 'function';
      };

      var bind,
        slice = [].slice,
        proto = Function.prototype,
        featureMap;

      featureMap = {
        'function-bind': 'bind'
      };

      function has(feature) {
        var prop = featureMap[feature];
        return isFunction(proto[prop]);
      }

      // check for missing features
      if (!has('function-bind')) {
        // adapted from Mozilla Developer Network example at
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
        bind = function bind(obj) {
          var args = slice.call(arguments, 1),
            self = this,
            nop = function() {
            },
            bound = function() {
              return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
            };
          nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
          bound.prototype = new nop();
          return bound;
        };
        proto.bind = bind;
      }
  });
});

casper.test.begin('Displays page', 2, function suite(test) {
  casper.start('http://localhost:3000', function () {

    test.assertTitle('Chugg', 'Chugg is expected homepage title');
    casper.waitForSelector('#App', function () {
      test.assertExists('div#Gulpview', 'Gulpview is on page');
    });
    // casper.wait(3000, function () {
    //   this.capture('chugg2.png', {
    //     top: 0,
    //     left: 0,
    //     width: 800,
    //     height: 600
    //   });
    // });
  });


  casper.run(function () {
    test.done();
  });
});

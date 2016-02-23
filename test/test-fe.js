// Polyfill for bind from http://stackoverflow.com/questions/25359247/casperjs-bind-issue
// Artjom B. is the author of PhantomJS
// This is required to run on Wade's system, but not Tiffany's
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

//-------------------------------------------------------------------
// Actual tests start here
casper.test.begin('Chugg Front-End Tests', 5, function suite(test) {
	casper.start('http://localhost:3000', function() {
		test.assertTitle("Chugg", "Chugg title detected");
	})

	.then(function() {
		// Waiting for selector is probably not necessary.
		casper.waitForSelector('#Packagejson', function() {
			// Test for the package.json editor instance
			test.assertExists('div[id="Packagejson"]', "package.json editor detected");
			// Test for the specific package.json text
			test.assertSelectorHasText('#Packagejson', '{\n"name": "<enter the name of your project here>",\n\t  "version": "1.0.0",\n\t"description": "<enter a description of your project here>",\n\t "main": "index.js",\n\t"scripts": {\n\t\t"prestart": "npm run task",\n\t\t"start": "node server/server.js",\n\t\t"start-dev": "npm run task",\n\t\t"task": "gulp"\n\t  },\n\t"dependencies": {\n\t"babel-preset-es2015": "^6.0.15",\n\t\t"babel-preset-react": "^6.0.15",\n\t\t"babelify": "^7.2.0",\n\t\t"browserify": "^10.2.4",\n\t\t"gulp": "^3.9.0",\n\t\t"react": "^0.14",\n\t\t"react-dom": "^0.14.0",\n\t\t"vinyl-source-stream": "^1.1.0"\n\t\t},\n\t"devDependencies": {\n\t\t"body-parser": "^1.15.0",\n\t\t"gulp-nodemon": "^2.0.6",\n\t\t"gulp-notify": "^2.2.0",\n\t\t"watchify": "^3.2.2"\n\t},\n\t"author": "<your name here>",\n\t"license": "ISC"\n\t}');
		});
	})

	.then(function() {
		// Clicks the 'closure compiler' button
		this.click('input[class="closure"]');
		// Tests if the closure compiler is required
		test.assertTextExists("var closureCompiler = require('gulp-closure-compiler');", 'Closure compiler required');
		// Tests if the gulp task has been added
		test.assertTextExists("compilerPath: 'bower_components/closure-compiler/lib/vendor/compiler.jar', ", 'Closure compiler task added');
	})

	.run(function() {
		test.done();
	});

});
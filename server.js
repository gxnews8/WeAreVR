var express  = require( 'express' ),
    // mongoose = require( 'mongoose' ),
    // bp       = require('body-parser'),
    path     = require( 'path' ),
    root     = __dirname,
    port     = process.env.PORT || 8000,
    app      = express();
app.use( express.static( path.join( root, './' )));
app.use( express.static( path.join( root, 'node_modules' )));
// app.use(bp.json())
app.listen( port, function() {
  console.log( `server running on port ${ port }` );
});

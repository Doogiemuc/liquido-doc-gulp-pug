
//BUGFIX for https://github.com/parcel-bundler/parcel/issues/333
// jQuery disables setting itself on the window global in a CommonJS environment (which Parcel is). See https://github.com/jquery/jquery/blob/master/src/wrapper.js#L29 and https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/exports/global.js#L30-L32.
/*
const jQuery = require("jquery")
window.$ = window.jQuery = jQuery
*/
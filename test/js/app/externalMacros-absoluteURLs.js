/* jshint esversion: 6 */
"use strict";

var $ = require( 'jquery' );
var Qunit = require( 'qunit' );
var zpt = require( '../../../js/app/main.js' );

var dictionary = { 
    template: '/test/externalMacros-definitions.html'
};
var zptParser = zpt.buildParser({
    root: document.body,
    dictionary: dictionary,
    declaredRemotePageUrls: [ dictionary.template ]
    //declaredRemotePageUrls: [ 'externalMacros-definitions2.html', 'externalMacros-definitions3.html' ]
});

zptParser.init(
    function(){
        zptParser.run();
        runTests();
    }
);

function runTests(){
    
QUnit.test( "Simple macros test", function( assert ) {
    var t1 = `
        <p>
    Before use macro
</p>
<b style="display: none;" data-muse-macro="copyright/externalMacros-definitions.html">
    Macro goes here
</b>
<p data-mmacro="copyright">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    In the middle of 2 macros
</p>
<b style="display: none;" data-muse-macro="copyright/externalMacros-definitions.html">
    Macro goes here
</b>
<p data-mmacro="copyright">
    Copyright 2009, <em>Foo, Bar, and Associates</em> Inc.
</p>
<p>
    After use macro
</p>
        `;
    assertHtml( assert, '#t1', t1 );
});

}

function assertHtml( assert, id1, id2 ){
    assert.equal( 
        $( id1 ).text().replace(/\s+/g, ""), 
        $( id2 ).text().replace(/\s+/g, ""), 
        "Passed!" ); 
}

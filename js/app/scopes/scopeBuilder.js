/* 
    scopeBuilder singleton class
*/
"use strict";

var $ = require( 'jquery' );
var context = require( '../context.js' );
var Scope = require( './scope.js' );
var utils = require( '../utils.js' );

module.exports = (function() {
    
    var keyLength = 6;
    
    var build = function( parserOptions, target, parser, dictionaryExtension ) {

        var scope = new Scope( 
            parserOptions.dictionary, 
            dictionaryExtension, 
            true 
        );
        
        if ( parserOptions.command == 'partialRender' ){
            updateForPartialRender( parserOptions, target, scope, parser );
        }
        
        return scope;
    };
    
    var updateForPartialRender = function( parserOptions, target, scope, parser ) {
        
        // Get root key
        var rootMap = markAllRoots( parserOptions );
        var rootKeyTag = getRootKeyTag();
        var root = getRoot( parserOptions, target, rootMap );
        var rootKey =  root.getAttribute( rootKeyTag );
        
        var talDefineTag = context.getTags().talDefine;
        var talAutoDefineTag = context.getTags().talAutoDefine;
        
        var node = target.parentNode;
        var c = 0;
        var itemsList = [];
        
        do {
            // Add talDefine
            var talDefine = node.getAttribute( talDefineTag );
            if ( talDefine ){
                itemsList.push( talDefine );
            }
            
            // Add talAutoDefine
            var talAutoDefine = node.getAttribute( talAutoDefineTag );
            if ( talAutoDefine ){
                itemsList.push( talAutoDefine );
            }
            
            var nodeKey = node.getAttribute( rootKeyTag );
            if ( nodeKey && nodeKey === rootKey ){
                return processListOfDefines( parser, scope, itemsList );
            }
            
            node = node.parentNode;
            
        } while ( node.nodeType != 9 && ++c < 100 );
        
        throw 'Error trying to update scope in partial render: root not found!';
    };
    
    var processListOfDefines = function( parser, scope, itemsList ){
        
        for ( var c = itemsList.length - 1; c >= 0; c-- ) {
            var talDefine = itemsList[ c ];
            parser.processDefine( 
                scope, 
                talDefine, 
                true
            );
        }
    };
    
    var getRoot = function( parserOptions, target, rootMap ){
        
        if ( ! $.isArray( parserOptions.root ) ){ 
            return parserOptions.root;
        }
        
        var rootKeyTag = getRootKeyTag();
        var node = target;
        var c = 0;
        do {
            var rootKey =  node.getAttribute( rootKeyTag );
            if ( rootKey ){
                return rootMap[ rootKey ];
            }

            node = node.parentNode;

        } while ( node.nodeType != 9 && ++c < 100 );
        
        throw 'Error trying to get root: not found!';
    };
    
    var markAllRoots = function( parserOptions ){

        var rootMap = {};
        var root = parserOptions.root;

        // Is multiroot?
        if ( $.isArray( root ) ){ 
            // There are several roots
            for ( var c = 0; c < root.length; c++ ) {
                markAsRoot( root[ c ], rootMap );
            }
        } else {
            // There is only one root
            markAsRoot( root, rootMap );
        }

        return rootMap;
    };
    
    var markAsRoot = function( node, rootMap ){
        
        // Build the key
        var key = buildKey();

        // Put a copy of scope into the cache
        rootMap[ key ] = node;

        // Save the key as an attribute of the node
        node.setAttribute( getRootKeyTag(), key );
    };
    
    var buildKey = function(){
        return utils.generateId( keyLength );
    };
    
    var getRootKeyTag = function(){
        return context.getTags().rootKey;
    };
    
    return {
        build: build
    };
})();

/*
    TALDefine class
*/
"use strict";

var context = require( '../../context.js' );
var ExpressionTokenizer = require( '../../expressions/expressionTokenizer.js' );

var TALDefine = function( stringToApply, defineItemsToApply ) {
    
    var string = stringToApply;
    var defineItems = defineItemsToApply;
    
    var process = function( scope, node, forceGlobal ){
        
        // Update scope
        for ( var i = 0; i < defineItems.length; i++ ) {
            var defineItem = defineItems[ i ];
            scope.set( 
                    defineItem.name, 
                    defineItem.expression.evaluate( scope ), 
                    forceGlobal || defineItem.global );
        }
    };
    
    var toString = function(){
        return "TALDefine: " + string;
    };
    
    return {
        process: process,
        toString: toString
    };
};

TALDefine.id = 'tal:define';

TALDefine.build = function( string ) {
    
    var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var defineItems = [];
    var expressionString = string.trim();
    var tokens = new ExpressionTokenizer( 
            expressionString, 
            context.getConf().defineDelimiter, 
            true );

    while ( tokens.hasMoreTokens() ) {
        var variable = tokens.nextToken().trim();
        var space = variable.indexOf( context.getConf().inDefineDelimiter );
        if ( space == -1 ) {
            throw 'Bad variable definition: ' + variable;
        }

        var token1 = variable.substring( 0, space );
        var token2 = variable.substring( space + 1 ).trim();
        var global = context.getConf().globalVariableExpressionPrefix === token1;
        var name;
        var valueExpression;

        if ( ! global ) {
            name = token1;
            valueExpression = token2.trim();
        } else {
            space = token2.indexOf( context.getConf().inDefineDelimiter );
            name = token2.substring( 0, space );
            valueExpression = token2.substring( space + 1 ).trim();
        }

        defineItems.push({
            name: name,
            expression: expressionBuilder.build( valueExpression ),
            global: global
        });
    }
    
    return new TALDefine( string, defineItems );
};

TALDefine.buildString = function( name, expression, global ) {
    
    var result = name + context.getConf().inDefineDelimiter + expression;
    
    if ( global ){
        result += context.getConf().inDefineDelimiter + global;
    }

    return result;
};

TALDefine.appendStrings = function() {
    
    var result = arguments[ 0 ];
    
    for ( var c = 1; c < arguments.length; ++c ){
        var string = arguments[ c ];
        if ( string ){
            result = result? result + context.getConf().defineDelimiter + string: string;
        }
    }
    
    return result;
};

TALDefine.updateAttribute = function( node, currentDefine, newVarName, newVarValue ){

    var tags = context.getTags();
    var macroDefine = node.getAttribute( tags.talDefine );
    var newDefine = newVarValue?
        TALDefine.buildString( newVarName, newVarValue ):
        undefined;
    var fullDefine = TALDefine.appendStrings( currentDefine, macroDefine, newDefine );

    // Copy talDefine attribute from use-macro tag to the macro tag
    if ( fullDefine ) {
        node.setAttribute( tags.talDefine, fullDefine );
    }
};

module.exports = TALDefine;
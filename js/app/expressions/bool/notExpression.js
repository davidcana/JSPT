/*
    NotExpression class
*/
"use strict";

var context = require( '../../context.js' );
var evaluateHelper = require( '../evaluateHelper.js' );

var NotExpression = function( expressionToApply ) {
    
    var expression = expressionToApply;
    
    var evaluate = function( scope ){
        return ! evaluateHelper.evaluateBoolean( scope, expression );
    };

    return {
        evaluate: evaluate
    };
};

NotExpression.removePrefix = true;
NotExpression.getPrefix = function() {
    return context.getConf().notExpression;
};
NotExpression.getId = NotExpression.getPrefix;

NotExpression.build = function( string ) {
    var expressionBuilder = require( '../expressionBuilder.js' );
    
    var expression = expressionBuilder.build(
        string, 
        NotExpression.prefix );
    
    return new NotExpression( expression );
}

module.exports = NotExpression;
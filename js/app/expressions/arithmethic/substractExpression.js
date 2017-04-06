/*
    SubstractExpression class
*/
"use strict";

var context = require( '../../context.js' );
var arithmethicHelper = require( './arithmethicHelper.js' );

var SubstractExpression = function( expressionListToApply ) {
    
    var expressionList = expressionListToApply;
    
    var evaluate = function( scope ){

        return arithmethicHelper.evaluate( 
            scope,
            expressionList, 
            SubstractExpression.mathOperation, 
            function( total, value ){
                return total - value;
            } );
    };
    
    return {
        evaluate: evaluate
    };
};

SubstractExpression.removePrefix = true;
SubstractExpression.getPrefix = function() {
    return context.getConf().subExpression;
};
SubstractExpression.mathOperation = 'substract';
SubstractExpression.getId = SubstractExpression.mathOperation;

SubstractExpression.build = function( string ) {
    
    var expressionList = arithmethicHelper.build( 
            string,
            SubstractExpression.mathOperation );

    return new SubstractExpression( expressionList );
}

module.exports = SubstractExpression;
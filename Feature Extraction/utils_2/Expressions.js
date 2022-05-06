const esprima = require('esprima')
const estraverse = require('estraverse')
const fs = require('fs')

// const file_name = 'samples/malicious_samples/javascript-malware-collection-master/2016/20160310/20160310_0e45766c507b4fe1190c9d70056df209.js'
// const file_ = fs.readFileSync(file_name, 'utf8')
// const ast = esprima.parseScript(


function Expressions(ast){
    const newObj = {
        array_expr_prim_elem: 0,
        call_expr_str_arg: 0,
        obj_expr_prim_elem : 0,
        eval: 0,

    }

    estraverse.traverse(ast, {
        
        enter: (node,parent) =>{
           
            if(node.type === "CallExpression"){
                if(node?.callee?.name === 'eval'){
                    newObj['eval'] = 1
                }
            }
            
        },
        

        leave: (node, parent)=>{
            console.log(node);
             // 10 - [x] Any call expression that have a string passed as args
             if(node.type === "CallExpression"){
                newObj['call_expr_str_arg'] = callExprStrArg(node) 
            }
            
            // 16 [x] - Object expressions property values
            if(node.type === "ObjectExpression"){
                const properties = node?.properties;
                for(const property of properties){
                    const value = property?.value?.value
                    newObj['obj_expr_prim_elem'] = objExprPropValue(value)
                    
                }
               
           
            }
            if(node.type === "ArrayExpression"){
                // console.log(node);
                newObj['array_expr_prim_elem'] = arrayExprPrimElem(node)
            }


            if(node.type === "NewExpression"){
                newObj['array_expr_prim_elem'] = newExprArray(node)
            
            }
            
         }
                   
    })
    // console.log(newObj);
    return newObj
}

// [x] 10 -  Call Expression with string as args
/**
 * @description Takes a node and check if the argument type is a string
 * @param {Array} body Array of nodes
 * @returns {Number} either 1 if true 0 otherwise
 */ 

 function callExprStrArg(node){
    let count = 0
    const args = node?.arguments
    for(const arg of args){
        if (arg?.value !== undefined && 
            typeof arg?.value === 'string' 
            || typeof arg?.value === 'number' ){
            count++
        }   
    }
    return count
  
}

// 16 [x] - Object expressions property values
/**
 * @description Checks if the property value of an object is a string
 * @param {Node} value The property value of a node
 * @returns {Number} either 1 if true 0 otherwise
 */
function objExprPropValue(value){
    if(typeof value === 'string' || typeof value === 'number'){
        return 1
    }
    return 0
}

 


/**
 * @description Takes a node and check if the value of a var assignment
 * is an array expression
 * @param {Node} node A node from the ast
 * @returns {Number} either 1 if true 0 otherwise
 */

// Array Expression assignment
function arrayExprAssig(node){
    const expr = node?.expression?.right?.type === 'ArrayExpression'
    return 1 ? expr : 0
   
}


/**
 * @description Takes a node and check the elements of the array
 * @param {Node} node A node from the ast
 * @returns either 1 if true 0 otherwise
 */
function arrayExprPrimElem(node){
    let count = 0
    const elements = node?.elements
    for(const element of elements){
        const value = element?.value
        if (typeof value === 'number' ||
            typeof value === 'string'){
                count++      
        }
    }
    return count || 0

}


function newExprArray(node){
    let count = 0
    if(node?.callee?.name === "Array"){
        const args = node?.arguments
        for(const arg of args){
            if(typeof arg.value === 'string' || 
                typeof arg.value === 'number'){
                count++
            }     
        }
    
    }
    return count
}

   


console.log(Expressions(ast));
module.exports = {Expressions}


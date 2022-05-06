const acorn = require('acorn')
const estraverse = require('estraverse')
const fs = require('fs')

// const file_name = '/Users/maxsueltrajano/Desktop/FYP/Malicious JavaScript Code Project/Component_2-Feature_Extraction/javascript-malware-collection-master/1936/19360611/19360611_23f5eaf84cedb0998e31b34a5f81e4ef.js'
// const file_ = fs.readFileSync(file_name, 'utf8')
// const ast = acorn.parse(file_, {ecmaVersion: 2020})


function Expressions(ast){
    const args_array = []
    const newObj = {
        concatenation: 0,
        eval: 0,

    }

    estraverse.traverse(ast, {
        
        enter: (node,parent) =>{
         
        //    console.log(node);
            if(node.type === "CallExpression"){
                if(node?.callee?.name === 'eval'){
                    newObj['eval'] += 1
                }
            }
            if(node.type === "VariableDeclarator"){
                if(node?.init?.name === 'eval'){
                    newObj['eval'] += 1
                }
            }

            if(node.type === 'Literal'){
                if(node?.value === 'eval'){
                    newObj['eval'] += 1
                }
            }

            
                
        },

        

        leave: (node, parent)=>{
            if(node.type === "BinaryExpression"){
                if (node.operator === "+"){
                    newObj["concatenation"] += 1
                }
            }
            
            // 16 [x] - Object expressions property values
            // if(node.type === "ObjectExpression"){
            //     const properties = node?.properties;
            //     for(const property of properties){
            //         const value = property?.value?.value
            //         newObj['obj_expr_prim_elem'] += objExprPropValue(value)
                    
            //     }      
           
            // }

            // if(node.type === "ArrayExpression"){
            //     // console.log(node);
            //     newObj['array_expr_prim_elem'] += arrayExprPrimElem(node)
            // }

            
         }
                   
    })
    // for (const property in newObj){
    //     if(newObj[property] > 1){
    //        newObj[property] = 1
    //     }
    // }
 
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
            count = 1
        }   
    }
    return count || 0
  
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
                count = 1     
        }
    }
    return count || 0

}



// console.log(Expressions(ast));

module.exports = {Expressions}



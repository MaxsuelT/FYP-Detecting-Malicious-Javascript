const acorn = require('acorn')
const estraverse = require('estraverse')
const fs = require('fs')

const ast = acorn.parse(
    `
        const array1 = ['1', '2', '3']
        const array2 = ['4', '5', '6']
        const array3 = array1.concat(arra2)

        const array4 = ['h', 'e', 'l', 'l', 'o']
        const joined = array4.join('')

        const array5 = ['Smith', 'name', 'my']
        const reversed = array5.reverse()

        const array6 =  ['Fire', 'Water', 'Wind', 'earth']
        const sliced = array6.slice(1,3)

        array6.splice(3,0,'darkness')

        array6.push('light')

        array6.toString()

    `
, {ecmaVersion: 2020})


const Arrays = (ast) =>{
    const array_methods = [
        'concat', 'join', 'reverse', 'slice', 'splice', 'push',
        'toString' 

    ]

    const featureObj = {
       arrayManipulation: 0,
    }
    
    estraverse.traverse(ast, {
       
        enter: (node) =>{
            if(node.type === 'CallExpression'){
                const name = node?.callee?.property?.name
                if(array_methods.includes(name)){
                    featureObj["arrayManipulation"] += 1
                }
    
            }
        }
    
    })

    return featureObj
}

// console.log(Arrays(ast));

module.exports = {
    Arrays
}

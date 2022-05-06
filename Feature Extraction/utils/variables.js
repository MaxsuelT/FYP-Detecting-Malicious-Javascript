const acorn = require('acorn')
const estraverse = require('estraverse')
const fs = require('fs')



const file_name = '/Users/maxsueltrajano/Desktop/FYP/Malicious JavaScript Code Project/Component_2-Feature_Extraction/javascript-malware-collection-master/2016/20161130/20161130_0a07b489183e9f81b854f18ae770cdf2.js'
const file_ = fs.readFileSync(file_name, 'utf8')
const ast = acorn.parse(
    `
        // const a = 'Hello'
        // let b = "The lazy dog."
        // c = "document.write"
        // d = "0x68 0x69"
        // eval('1 + '1)

        // const f = 'hi'

        const g = []
`
, {ecmaVersion: 2020})



const blacklist = [
    'activexobject', 'window', 'document', "document.write",'wscript',
     'wscript.shell', 'wscript.createobject', 'expandEnvironmentstrings', 'msxml2.xmlhttp'
    ]

/*
    Data Obfuscation:
    
    Convert a variable of constant into the computation
    retults of one or several variables or constant

    String splitting: split strings into several 
    strings then concatenate them

    Therefore, we should keep track of the variable
    that have a string assigned to them

    We need to understand the ways you
    can assign a value to a variable

    var = global scope
    let, const = block scoped

*/

// check for variable concatenation

function Variables(ast){
    // let obfs_count = 0
    // let literals_count = 0
    const literal_Values = []
    const newObj = {
        varWithCallExpression: 0,
        varWithNewExpression: 0,
        varWithThisExpression: 0,
        varWithLiteralString: 0,
        varWithObjExpression: 0,
        varWithArrayExpression: 0,
        varConcatenation: 0,
        dom_operations: 0,
    }
    estraverse.traverse(ast, {
        enter: (node) =>{
            
            if(node.type === "VariableDeclarator"){
                const type = node?.init?.type
                if(type){
                    if(type === "NewExpression"){
                        newObj["varWithNewExpression"] += 1
                    }

                    if(type === "CallExpression"){
                        newObj["varWithCallExpression"] += 1
                    }

                    if(type === "MemberExpression"){
                        if(node?.init?.object?.type === "ThisExpression"){
                            newObj["varWithThisExpression"] += 1
                        }
                    }   

                    if(type === "Literal"){
                        const value = typeof node?.init?.value;
                        if(value === "string"){
                            newObj["varWithLiteralString"] += 1
                        }
                    }

                    if(type === "ObjectExpression"){
                        newObj["varWithObjExpression"] += 1
                    }

                    if(type === "BinaryExpression"){
                        newObj["varConcatenation"] += 1
                    }
                    
                    if(type === "ArrayExpression"){
                        newObj["varWithArrayExpression"] += 1
                    }
                }
            }
        },
        leave: (node, parent)=>{
            // console.log(node);

             if(node.type === 'Identifier'){
                newObj['dom_operations'] += domOperations(node)
             }   
        }

    })

    return newObj
}

/**
 * @description Checks if the value assigned to a variable is a string
 * @param {Node} node A node 
 * @returns {Number} returns 1 if true 0 otherwise
 */
// TODO 
// could be string, array of strings, obj with strings

function domOperations(node){
    const str = node?.value || node?.name
    if(typeof str === 'string'){
        const str_ = str.toLowerCase()
        if(blacklist.includes(str_)){
            return 1
        }
            
    }
    return 0
}


// console.log(Variables(ast))


module.exports = {
    Variables
}


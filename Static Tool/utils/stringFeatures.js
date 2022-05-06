const acorn = require('acorn')
const estraverse = require('estraverse')
// const fs = require('fs')

// const file_name = '/Users/maxsueltrajano/Desktop/FYP/Malicious JavaScript Code Project/Component_2-Feature_Extraction/javascript-malware-collection-master 2/malware/19360611/19360611_23f5eaf84cedb0998e31b34a5f81e4ef.js'
// const file_ = fs.readFileSync(file_name, 'utf8')
// const ast = acorn.parse(
//     `
//         const b = "hi"
//         const a = "1"
    
//     `
    
// ,{ecmaVersion: 2020, loc: false})


/**
 * @description Responsible for the following features:
 * [file_length avg_string_length]
 * @param {Object} ast Takes an AST parsed by esprima
 * @param {Promise} file The contents of a file
 * @returns a new object containing features extracted from files
 */


const strFeatures = (ast) =>{
    const arr = []
    let num_strings = 0
    const newObj = {
        stringCount : 0,
        avg_str_length: 0
    }
    

    estraverse.traverse(ast, {
        leave: (node) =>{
            if(node.type === "Literal"){
                if(typeof node?.value === 'string'){
                    newObj["stringCount"] += 1 
                    num_strings++
                    arr.push(node.value)
                }
            }
        }            
    })

    newObj['avg_str_length'] = getStrLen(num_strings, arr)
    
    return  newObj

}


/**
 * @description Count the number of characters in a string and 
 * find the average length of such string
 * @param {Object} obj Check if object has any strings
 * @param {Array} arr Contains an array of strings
 * @returns The average length of each string in the array
 */
function getStrLen (count, arr){
    let avg_str_length;
    if(count){
        avg_str_length =  Number(arr.map(word => word.length).reduce((acc , word) =>{
            return acc + word
         },0) / arr.length).toFixed(2)
    }else{
        avg_str_length = 0
    }
    return parseFloat(avg_str_length)
}


// console.log(strFeatures(ast));


module.exports = {
    strFeatures
}

// console.log(isStringLiteral(ast, file_));

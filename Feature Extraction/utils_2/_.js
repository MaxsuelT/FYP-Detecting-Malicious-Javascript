const esprima = require('esprima')
const acorn = require('acorn')
const fs = require('fs')
const path = require('path')
const expressions = require('./utils/Expressions')
const variables = require('./utils/variables')
const functions = require('./utils/functions')
const strmth = require('./utils/StringMethods')


const dir_benign = '/Users/maxsueltrajano/Desktop/FYP/Malicious JavaScript Code Project/Component_1-Data_Collection/js_files'
const dir_malicious = getPath(__dirname, "samples/mal_samples")
const jsonFile_benign = getPath(__dirname,'/results/benign_results_28_12.json')
const jsonFile_malicious = getPath(__dirname,'/results/results_27_12_malicious_nomal.json')


/**
 * @description Joins the specified path arguments into one path
 * @param {String} dir Root directory of the file
 * @param {String} path_to_file Path to the file
 * @returns {String} formatted path
*/
function getPath(dir, path_to_file){
    return path.join(dir, path_to_file)
}

/**
 * @description Asynchronously read the contents of a directory.
 * @async
 * @param {String} dir Directory root
 * @returns {Promise} The contents of a directory as an array of strings
 */

let countFiles = 0;
let countError = 0;

function redDir(dir){
    return new Promise((resolve, reject) =>{
        fs.readdir(dir, (error, files) =>{
            if (error) {
                reject(error)
            }
            else{
                resolve({data: {dir, files}})
            }
    
        })    
    })   
}

/**
 * @description Asynchronously read the contents of a file
 * @async
 * @param {String} filepath 
 * @returns {Promise} The contents of a file
 */
function readFile(filepath){
    countFiles++
    return new Promise((resolve, reject) =>{
        fs.readFile(filepath, 'utf8', (error, content) =>{
            if (error){
                reject(error)
            }
            else{
                resolve(content)
            }
        })
    })   
}

/**
 * @description Asynchronously read the contents of all files from the directory
 * @async
 * @param {Promise} promiseObj Receives promise object from readFile 
 * @returns {Promise} The contents of all files from readFile
 */

function readFiles(promiseObj){
    const dir = promiseObj.data.dir
    const files = promiseObj.data.files
    files.shift()
    
    return new Promise((resolve, reject) =>{
        const newPromiseObj = []
        const promises  = files.map(filename => {
            const filePath = getPath(dir, filename)
            return readFile(filePath)
            .then((content) =>{
                newPromiseObj.push({
                    filename,
                    content
                })
            })
            .catch(error =>{
                reject(error)
            })
        })
        Promise.all(promises)
        .then(() =>{
            resolve(newPromiseObj)
        })
    })
    
}

/**
 * @description Extract the features from the contents of a file
 * @async
 * @param {Promise} promiseObj The contents of the files 
 * @returns {Promise} An array of feature objects
 */

function featureExtraction(promiseObj){
    return new Promise((resolve) =>{   
        const promises = promiseObj.map((file) =>{
            try{
                const ast = acorn.parse(file.content, 
                    {ecmaVersion: 2020})
                // const ast = esprima.parseScript(file.content,
                //     {tolerant : true})
                // non-promise-based modules => fix it
                const obj1 = functions.Functions(ast) 
                const obj2 = expressions.Expressions(ast)
                const obj3 = variables.Variables(ast)
                const obj4 = strmth.StringMethods(ast)
                const objCombined = {...obj1, ...obj2, ...obj3, ...obj4} 
                const finalObj = Object.fromEntries(Object.entries(objCombined).sort())
                console.log(`filename => ${file.filename}`);
                console.log(finalObj);
                return finalObj
            }
            catch(error){
                countError++
                const errorObj = {}
                errorObj.fileName = `Unable to read file => ${file.filename}`
                errorObj.msg = error.message
                // Debugging
                console.log(errorObj);
                // push into an array to check how many had an error
                // log the error
            }
        }).filter(value => value != undefined)  


         resolve(promises)
    })
       
}

/**
 * @description Write the array of features objects to file
 * @async
 * @param {Promise} promiseObj Array of feature objects from FeatureExtraction
 * @returns {JSON} JSON object of features
 */
function dumpJson(promiseObj){
    return new Promise((resolve, reject) =>{
        resolve(fs.writeFile(jsonFile_benign, JSON.stringify(promiseObj),'utf8', (error)=>{
            if (error) reject(error)
            })
        )
    })

  
}



redDir(dir_benign)
.then(readFiles)
.then(featureExtraction)
.then(dumpJson)
.then(() =>{
    console.log('Total number of files: ', countFiles);
    console.log('Files successfuly parsed: ', countFiles - countError);
    console.log(`Error: ${Number(countError/ countFiles).toFixed(2)} %`);
})
.catch(error => console.log(error))

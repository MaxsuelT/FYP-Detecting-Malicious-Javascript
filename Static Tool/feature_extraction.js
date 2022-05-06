const fs = require('fs')
const path = require('path')
const acorn = require('acorn')

const arrays = require('./utils/Arrays')
const expressions = require('./utils/Expressions_new')
const variables = require('./utils/variables')
const units = require('./utils/syntacticUnits')
const strmth = require('./utils/StringMethods')
const strFts = require('./utils/stringFeatures')
const functions = require('./utils/Functions')


const myArgs = process.argv.slice(2)


const dir_benign = __dirname + '/' +  myArgs[0]
const jsonFile_benign = path.join('results', '/example_features.json')

console.log(`Features extracted! You file has been saved at 
${myArgs[0] + "_ready_"}`);


let countFiles = 0;
let countError = 0;

async function listDir(dir){
    const pathDir = []
    try{
        const files = await fs.promises.readdir(dir, 'utf8')
        for(const file of files){
            const path_ = path.join(dir, file)
            pathDir.push(path_)
           
        }
    }
    catch (e){
        console.log(e);
    }


    return pathDir.slice(1)
 
}

async function readDir(promiseObj){
    // console.log(promiseObj);
    const paths = []
    try{
        for(const file of promiseObj){
            const filename = await fs.promises.readdir(file, 'utf8')
            filename.map(path_ => {
                const pt_ = path.join(file, path_)
                paths.push(pt_)
            })
        }
  
    }
    catch (e){
        console.log(e);
    }

    return paths
}

async function readFile(filePaths){
    countFiles = filePaths.length
    const promises = []
    for(const file of filePaths){
        const filename = file.split('/').pop()
        const content = await fs.promises.readFile(file, 'utf-8')
        promises.push({
            filename,
            content
        })
        featureExtraction([{filename, content}]) 
    }
    
    // const results = await Promise.all(promises)
    // return results

}


async function featureExtraction(promiseObj){
        return new Promise((resolve) =>{   
            const promises = promiseObj.map((file) =>{
                try{
                    const ast = acorn.parse(file.content, 
                        {ecmaVersion: 2020, sourceType: 'module'})
                    
                    const obj0 = units.syntacticUnitsExtractor(ast)
                    const obj1 = functions.Functions(ast)
                    const obj2 = arrays.Arrays(ast)
                    const obj3 = expressions.Expressions(ast)
                    const obj4 = variables.Variables(ast)
                    const obj5 = strmth.StringMethods(ast)
                    const obj6 = strFts.strFeatures(ast)

                    const objCombined = {
                        file_length : file.content.length,
                        ...obj0,
                        ...obj1, ...obj2, ...obj3, 
                        ...obj4, ...obj5, ...obj6 } 

                    const finalObj = Object.fromEntries(Object.entries(objCombined).sort())
                    console.log(`filename => ${file.filename}`);
                    console.log(finalObj);
                    dumpJson(finalObj)
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

async function dumpJson(promiseObj){
    fs.appendFile(jsonFile_benign, JSON.stringify(promiseObj) + ',','utf8', (error)=>{
            if (error) reject(error)
    
    })
 

}


listDir(dir_benign)
// .then(readDir)
.then(readFile)
// .then(featureExtraction)
// .then(prepareJson)
// .then(dumpJson)
.then(() =>{
    console.log('Total number of files: ', countFiles);
    console.log('Files successfuly parsed: ', countFiles - countError);
    console.log(`Error: ${Number(countError/ countFiles).toFixed(2)} %`);
})
.catch(error =>{
    console.log(error);

})



const acorn = require('acorn')
const estraverse = require('estraverse')
const fs = require('fs')



// const file_name = "/Users/maxsueltrajano/Desktop/FYP/Malicious JavaScript Code Project/Component_2-Feature_Extraction/javascript-malware-collection-master/2017/20170507/20170507_0d258992733e8a397617eae0cbb08acc.js"
// const file_ = fs.readFileSync(file_name, 'utf8')
// const ast = acorn.parse(
//     `
//     // var p26 = new Array ();
//     // function f85 (g55 , w27 ) {
//     //     p26 [ g55 ] = w27 ;
//     // };
//     //  function w25 ( h51 ) {
//     //     return h51 ;
//     //  };
//     //  f85(763 , w25 ("s"));

//     var arr = [" evil_code "];
//     function foo (x){
//         eval(x)
//     };
//     foo ("Hello");
//     foo(20)
//     foo(true)

// `
// , {ecmaVersion: 2020})


function Functions(ast){
    const newObj = {
        funcSelfInvoking: 0,
        funcArgsCallExpression:0,
        funcArgsPrimitiveVal: 0,
        funcReturnString: 0,

    }

    
    estraverse.traverse(ast, {
        enter: (node, parent) =>{
            if(node.type === "FunctionExpression"){
                if(parent?.type === "CallExpression"){
                    newObj["funcSelfInvoking"] += 1
                    
                }
                const body = node.body?.body
                for (const args of body){
                    const value = args?.argument?.value
                    if(typeof value === "string"){
                        newObj["funcReturnString"] += 1
                    }
                }
            }


            if(node.type === "FunctionDeclaration"){
                const body = node?.body?.body;
                for(const elem of body){
                    // console.log(elem);
                    if(elem.type === "VariableDeclaration"){
                        const declarations = elem?.declarations;
                        for(const dec of declarations ){
                            if(typeof dec?.init?.value === "string"){
                                newObj["funcReturnString"] += 1
                            }

                            
                        }
                    }
                }
            }

            if(node.type === "CallExpression"){
                const args = node?.arguments
                for(const arg of args){
                    if(arg?.type === "CallExpression" ){
                        newObj["funcArgsCallExpression"] += 1
                    }
                    if(arg?.type === "Literal"){
                        const value = arg?.value 
                        if(typeof value === "string" ||
                            typeof value === "number" ||
                            typeof value === "boolean" ||
                            typeof value === ""
                        )
                        newObj["funcArgsPrimitiveVal"] += 1
                        
                    }
                }
                    

                
            }

       
        },
        leave: (node, parent)=>{
            
        }

    })

    return newObj
}



// console.log(Functions(ast))


module.exports = {
    Functions
}
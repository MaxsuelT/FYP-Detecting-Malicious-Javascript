const acorn = require('acorn')
const estraverse = require('estraverse')
const fs = require('fs')

// const file_name = '/Users/maxsueltrajano/Desktop/FYP/Malicious JavaScript Code Project/Component_2-Feature_Extraction/javascript-malware-collection-master 2/malware/19360611/19360611_23f5eaf84cedb0998e31b34a5f81e4ef.js'
// const file_ = fs.readFileSync(file_name, 'utf8')
// const ast = acorn.parse(file_, {ecmaVersion: 2020, loc: false})

const used_types = [
    'FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression',
    'WhileStatement', 'ForOfStatement', 'ForInStatement', 'DoWhileStatement',
    'ForStatement', 'TryStatement', 'CatchClause', 'ArrayExpression',
    'ObjectExpression', 'ThrowStatement', 'IfStatement', 'SwitchStatement',
    'Program'  , 'ImportDefaultSpecifier', 'ImportDeclaration',
    'ImportSpecifier', 'ExportDefaultDeclaration',
    'ImportNamespaceSpecifier', 'ExportNamedDeclaration', 
    'ExportSpecifier', 'ExportAllDeclaration', 'SwitchCase',
    'ClassBody', 'ClassDeclaration', 'ClassExpression' ,'Super','MethodDefinition',
    'ArrayPattern','ObjectPattern','RestElement','AssignmentPattern',
    'TemplateLiteral', 'TemplateElement', 'TaggedTemplateExpression',
    'ReturnStatement', 'YieldExpression','BreakStatement', 'ContinueStatement',
    'ConditionalExpression', 'AssignmentExpression', 'MemberExpression', 
    'SequenceExpression','NewExpression','UpdateExpression', 'UnaryExpression'
    ,'ChainExpression', 'CallExpression', 'AwaitExpression',
    'ExpressionStatement', 'BlockStatement', 'EmptyStatement', 
    'LabeledStatement' , 'DebuggerStatement' 


]

             

function syntacticUnitsExtractor(ast, ){
    const nodeTypes = {}
    estraverse.traverse(ast,{
        leave: (node) =>{
            if(node.type === 'FunctionDeclaration' || 
                node.type === 'FunctionExpression' || 
                node.type ==='ArrowFunctionExpression'){  
               const function_type = 'Functions'
               if(!nodeTypes.hasOwnProperty(function_type)){ 
                    nodeTypes[function_type] = 1
                }else{
                    nodeTypes[function_type]++
                }
           }

           if(node.type === 'WhileStatement' ||
              node.type === 'ForOfStatement' ||
              node.type === 'ForInStatement' ||
              node.type === 'DoWhileStatement' ||
              node.type === 'ForStatement'){
                const loop_type = 'Loops'
                if(!nodeTypes.hasOwnProperty(loop_type)){ 
                    nodeTypes[loop_type] = 1
                }else{
                    nodeTypes[loop_type]++
                }
                
           }
           
           if(node.type === 'TryStatement' ||
              node.type === 'CatchClause' ||
              node.type === 'ThrowStatement'){
                const exception_type = 'Exceptions'
                if(!nodeTypes.hasOwnProperty(exception_type)){ 
                    nodeTypes[exception_type] = 1
                }else{
                    nodeTypes[exception_type]++
                }

              }
           
            if(node.type === 'ArrayExpression' ||
               node.type === 'ObjectExpression'){
                const object_type = 'ObjectExpressions'
                if(!nodeTypes.hasOwnProperty(object_type)){ 
                    nodeTypes[object_type] = 1
                }else{
                    nodeTypes[object_type]++
                }
            }

            if(node.type === 'IfStatement' ||
               node.type === 'SwitchStatement' ||
               node.type === 'SwitchCase'||
               node.type === 'ConditionalExpression'){
                
                const flow_type = 'ControlFlow'
                if(!nodeTypes.hasOwnProperty(flow_type)){ 
                    nodeTypes[flow_type] = 1
                }else{
                    nodeTypes[flow_type]++
                }
            
            }

        
            if(node.type === 'ImportDefaultSpecifier' ||
                node.type === 'ImportDeclaration' ||
                node.type === 'ImportSpecifier' ||
                node.type === 'ImportNamespaceSpecifier'){
                const import_type = 'Imports'
                if(!nodeTypes.hasOwnProperty(import_type)){ 
                    nodeTypes[import_type] = 1
                }else{
                    nodeTypes[import_type]++
                }
            }

            if(node.type === 'ExportDefaultDeclaration' ||
               node.type === 'ExportNamedDeclaration' ||
               node.type === 'ExportSpecifier' || 
               node.type === "ExportAllDeclaration"){
                const export_type = 'Exports'
                if(!nodeTypes.hasOwnProperty(export_type)){ 
                    nodeTypes[export_type] = 1
                }else{
                    nodeTypes[export_type]++
                }
                    
            }

            if(
                node.type === 'Class' || 
                node.type === 'ClassBody'||
                node.type === 'ClassDeclaration' ||
                node.type === 'ClassExpression' ||
                node.type === 'Super' ||
                node.type === 'MethodDefinition'
                ){
                const class_type = 'ClassDeclaration'
                if(!nodeTypes.hasOwnProperty(class_type)){ 
                    nodeTypes[class_type] = 1
                }else{
                    nodeTypes[class_type]++
                }
                
            }


            if( node.type === 'ArrayPattern' ||
                node.type === 'ObjectPattern' ||
                node.type === 'RestElement' ||
                node.type === 'AssignmentPattern'){
                    const pattern_type = 'Pattern'
                    if(!nodeTypes.hasOwnProperty(pattern_type)){ 
                        nodeTypes[pattern_type] = 1
                    }else{
                        nodeTypes[pattern_type]++
                    }
                    
            }

            if( node.type === 'TemplateLiteral' ||
                node.type === 'TemplateElement' ||
                node.type === 'TaggedTemplateExpression'){
                    const templateType = 'TemplateLiteral'
                    if(!nodeTypes.hasOwnProperty(templateType)){ 
                        nodeTypes[templateType] = 1
                    }else{
                        nodeTypes[templateType]++
                        
                    }
                    
            }

            // return, yield

            if( node.type === 'ReturnStatement' ||
                node.type === 'YieldExpression'
            ){
                const returnType = 'Return'
                if(!nodeTypes.hasOwnProperty(returnType)){ 
                    nodeTypes[returnType] = 1
                }else{
                    nodeTypes[returnType]++
                }
                    
            }

            // if( node.type === 'VariableDeclaration' ||
            //     node.type === 'VariableDeclarator'
            // ){
            //     const variableType = 'Variable'
            //     if(!nodeTypes.hasOwnProperty(variableType)){ 
            //         nodeTypes[variableType] = 1
            //     }else{
            //         nodeTypes[variableType]++
            //     }

            // }

            if( node.type === 'BreakStatement' ||
                node.type === 'ContinueStatement'
            ){
                const loopControlFlowType = 'LoopControlFlow'
                if(!nodeTypes.hasOwnProperty(loopControlFlowType)){ 
                    nodeTypes[loopControlFlowType] = 1
                }else{
                    nodeTypes[loopControlFlowType]++
                }
            }


            if( node.type === 'AssignmentExpression' ||
                node.type === 'MemberExpression' ||
                node.type === 'SequenceExpression' ||
                node.type === 'NewExpression' ||
                node.type === 'UpdateExpression' ||
                node.type === 'ThisExpression' ||
                node.type === 'UnaryExpression' ||
                node.type === 'ChainExpression' ||
                node.type === 'CallExpression' ||
                node.type === 'AwaitExpression'

            ){

                    const expressionType = 'Expressions'
                    if(!nodeTypes.hasOwnProperty(expressionType)){ 
                        nodeTypes[expressionType] = 1
                    }else{
                        nodeTypes[expressionType]++
                    }

            }

            if( node.type === 'ExpressionStatement'||
                node.type === 'BlockStatement' ||
                node.type === 'EmptyStatement' ||
                node.type === 'LabeledStatement' ||
                node.type === 'DebuggerStatement' 
            ){

                const statementType  = 'Statements'
                    if(!nodeTypes.hasOwnProperty(statementType)){ 
                        nodeTypes[statementType] = 1
                    }else{
                        nodeTypes[statementType]++
                    }


            }

            


            if(!used_types.includes(node.type)){
                if(!nodeTypes.hasOwnProperty(node.type)){
                    nodeTypes[node.type] = 1
                }else{
                    nodeTypes[node.type]++
                } 
            }
          
        }
    
    })

    // for(const property in nodeTypes){
    //     if(nodeTypes[property] > 1){
    //         nodeTypes[property] = 1
    //     }else{
    //         nodeTypes[property] = 0
    //     }
    // }
    
    return nodeTypes 
}



module.exports = {
    syntacticUnitsExtractor
}


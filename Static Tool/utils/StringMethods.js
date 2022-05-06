const acorn = require('acorn')
const estraverse = require('estraverse')
const fs = require('fs')

// const path = 'samples/malicious_samples/javascript-malware-collection-master/2016/20160224/20160224_bb87034b6133be17bd3c53a97eb6b080.js'
// const file = fs.readFileSync(path, 'utf-8')

// const ast = acorn.parse(
//     `
//         const b = "hello there".charAt(2)
//         const c = 'How are you?'.charCodeAt(4)
//         const d = a.concat(" ", 'Smith')
//         const e = String.fromCharCode(104, 105)
//         const f = "Evil Code".replace('Evil', 'Very very evil')
//         const g = 'The quick brown fox jumps over the lazy dog.'.slice(31)
//         const h = 'The quick brown fox jumps over the lazy dog.'.split(' ')
//         const i = "University".substring(2,4)
        
//      `
// , {ecmaVersion: 2020})


/*
    String Methods: The important string methods that allows  manipulate strings
    String methods: String.prototype.charAt(index)
                    String.prototype.charCodeAt(index)
                    String.prototype.concat(str [, ...strN ])
                    String.fromCharCode(num1 [, ...[, numN]])
                    String.prototype.replace(searchFor, replaceWith)
                    String.prototype.slice(beginIndex[, endIndex])
                    String.prototype.split([sep [, limit] ])
                    String.prototype.substring(indexStart [, indexEnd])

  
*/

function StringMethods(ast){
    const method_names = [
        'charAt', 'charCodeAt', 'concat', 'fromCharCode',
        'replace', 'slice', 'split', 'substring']
    const newObj = {
        encodingObfuscation: 0
    }

    estraverse.traverse(ast, {
       

        leave: (node, parent) => {
            
            if(node.type === "Identifier"){

                newObj["encodingObfuscation"] += strMethods(node, method_names)

            }
        },

    })
    
    return newObj
}

function strMethods(node, arr){
    if(arr.includes(node?.name)){
        return 1
    }
    return 0
   
}


// console.log(StringMethods(ast));

module.exports = {StringMethods}


// const a = new String('John')
// const b = "hello there".charAt(2)
// const c = 'How are you?'.charCodeAt(4)
// const d = a.concat(" ", 'Smith')
// const e = String.fromCharCode(104, 105)
// const f = "Evil Code".replace('Evil', 'Very very evil')
// const g = 'The quick brown fox jumps over the lazy dog.'.slice(31)
// const h = 'The quick brown fox jumps over the lazy dog.'.split(' ')
// const i = "University".substring(2,4)
// console.log(a, b, c);
// console.log(d);
// console.log(e);
// console.log(f);
// console.log(g);
// console.log(h[2]);
// console.log(i);
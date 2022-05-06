# Features

Description of the features used in the prototype

1. [x] Length in Characters = The length of a script in characters.
   
2. [x] % whitespace: The percentage of the script that is whitespace.

<!-- no longer in use -->
3. [x] Strings = The number of strings in a script.
  
4. [x] Avg. string length : The average number of characters per string in a script.

<!-- replaced by binary operations -->
5. [x] (Number) of concatenations = The number of concatenations in a file
<!-- not useful -->
6. [x] minified: check if a file is packed

<!-- requires control flow code -->
7. [X] Number of dead functions = dead code added for obfuscation
   
8. [x] function returns a string 

<!-- ! Post prototype -->
<!-- * working => unusedfunctions  -->
9. [x] Function that returns another function: Number of function that returns another function
    
10. [x] calls expressions : Number of function calls that have strings passed as arguments

11. [x] Variables with string assigment : the number of variables in the global scope that have a string assignment 

12. [x] Variables with 'this' keyword assignment: the number of variables with the 'this' assignment 

13. [x] Binary expression: the number of binary expressions, where the operator is a plus sign (concatenation of strings)   

14. [x] Syntatic Analysis => ObjectExpression: the number of Object expressions in the file 

15. [x] Syntatic Analysis => ArrayExpression: the number of Array expressions in the file

16. [x] Object expressions property values: the number of objects expressions with str as their property values  

17. [x] Encoding Obfuscation count: the number of property values that are encoded

18. [x] Encoding Obfuscation pattern: Naive approach to detecting encoding obfuscation pattern by using the Encoding Obfuscation count

19. [x] This expression: might be clashing with var this

20. [x] eval: the must unsecure function in javascript


--------
Last set of features
21. [ ]  
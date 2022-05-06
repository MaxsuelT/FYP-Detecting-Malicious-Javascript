### Goal 
- Find a set of features that can be used to distinguish between benign and malicious JavaScript

### Task
- Extract syntactic entities and structural patterns that are predictive of malicious intent
  
### How
- Using different JavaScript libraries to parse and traverse the Abstract Syntax Tree (AST)

### Steps
    
    1. For every file in a folder
    2. Iterate over that file
    3. Look for the relevant syntax elements or patterns:
     1 (found) otherwise 0 (not found)
    4. Save the data to a JSON file
    5. Repeat steps 1,2,3,4
        until there are no files left

### Results
- Features that will be used to build a dataset in the next component Dataset Preparation

### Progress since Prototype

- Prototype: Simple set of features based on manual inspection. E.g. whether functions are returning strings

- Interim Report: More complex set of features -> Syntactic units(JS keywords) and malicious patterns(object concatenation)

- Presentation: Added array manipulation methods(commonly found in malicious patterns) e.g. array.reverse


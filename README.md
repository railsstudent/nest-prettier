# NestJS Schematics for Prettier    

Update .prettierrc and generate template for the "prettier/prettier" eslint rule. Then, developer can copy the rule to .eslintrc.js in NestJS application.

## Installation

```bash
nest add nest-prettier
```

or use ```npm``` to install the library directly
```bash
npm install --save-dev nest-prettier
```

Example output of the schematics:

``` bash
 nest add nest-prettier
✔ Package installation in progress... ☕
Starting library setup...
? Eslint file format. javascript
? What is the print width per line? 120
? Specify the number of spaces per indentation-level. 2
? Indent lines with tabs instead of spaces. No
? Print semicolons at the ends of statements. Yes
? Use single quotes instead of double quotes. Yes
? Change when properties in objects are quoted. as-needed
? Print trailing commas wherever possible in multi-line comma-separated syntactic structures. es5
? Print spaces between brackets in object literals. Yes
? Include parentheses around a sole arrow function parameter. always
? Prettier can restrict itself to only format files that contain a special comment, called a pragma, at the 
top of the file. This is very useful when gradually transitioning large, unformatted codebases to prettier. 
No
? Prettier can insert a special @format marker at the top of files specifying that the file has been 
formatted with prettier. This works well when used in tandem with the --require-pragma option. No
    Found prettier@2.7.1, do not add dependency
    Found eslint-config-prettier@8.5.0, do not add dependency
    Found eslint-plugin-prettier@4.2.1, do not add dependency
    .prettierrc is overwritten
    Does not support .eslintrc.js
    Append plugin and rule from ./eslintrc-prettier.template to .eslintrc.js. Then, delete the template file.
UPDATE .prettierrc (258 bytes)
UPDATE eslintrc-prettier.template (424 bytes)
✔ Packages installed successfully.
```

.prettierrc

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 120,
  "bracketSpacing": true,
  "useTabs": false,
  "arrowParens": "always",
  "quoteProps": "as-needed",
  "requirePragma": false,
  "insertPragma": false
}
```

eslint-prettier.template
```javascript
extends: ['plugin:prettier/recommended']
rules: {
    'prettier/prettier': ['error', {
        'singleQuote': true, 
        'trailingComma': 'es5', 
        'tabWidth': 2, 
        'semi': true, 
        'printWidth': 120, 
        'bracketSpacing': true, 
        'useTabs': false,
        'arrowParens': 'always',
        'quoteProps': 'as-needed',
        'requirePragma': false,
        'insertPragma': false, 
    }]
}
```

Copy ```plugin:prettier/recommended``` and 


```javascript
'prettier/prettier': ['error', {
        'singleQuote': true, 
        'trailingComma': 'es5', 
        'tabWidth': 2, 
        'semi': true, 
        'printWidth': 120, 
        'bracketSpacing': true, 
        'useTabs': false,
        'arrowParens': 'always',
        'quoteProps': 'as-needed',
        'requirePragma': false,
        'insertPragma': false, 
  }]
```

to .eslintrc.js

```javascript
  ....
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ...
  rules: {
    ...
    'prettier/prettier': ['error', {'singleQuote': false, 'trailingComma': 'es5', 'tabWidth': 2, 'semi': true, 'printWidth': 120, 'bracketSpacing': true, 'useTabs': false }]
  },
```

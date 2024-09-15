export const getRustCompletion = (range: monaco.IRange, monaco: any) => {
    return [
        // Keywords
        {
            label: 'fn',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'fn ${1:function_name}(${2:parameters}) -> ${3:ReturnType} {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a function',
            detail: "Rust function definition",
            range: range
        },
        {
            label: 'let',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'let ${1:variable_name} = ${2:expression};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a variable',
            detail: "Rust variable declaration",
            range: range
        },
        {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'if ${1:condition} {\n\t$0\n} else {\n\t\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Conditional statement',
            detail: "Rust conditional statement",
            range: range
        },
        {
            label: 'match',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'match ${1:expression} {\n\t${2:pattern} => ${3:result},\n\t_ => ${4:default_result},\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Pattern matching statement',
            detail: "Rust match expression",
            range: range
        },
        {
            label: 'loop',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'loop {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Infinite loop',
            detail: "Rust infinite loop",
            range: range
        },
        {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'for ${1:item} in ${2:iterator} {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop',
            detail: "Rust for loop",
            range: range
        },
        {
            label: 'while',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'while ${1:condition} {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'While loop',
            detail: "Rust while loop",
            range: range
        },

        // Macros
        {
            label: 'println!',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'println!("${1:}");',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Prints text to the console',
            detail: "Rust macro for printing to console",
            range: range
        },
        {
            label: 'vec!',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'vec![${1:elements}]',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Creates a vector',
            detail: "Rust macro for creating a vector",
            range: range
        },
        {
            label: 'format!',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'format!("${1:format_string}", ${2:arguments})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Formats text',
            detail: "Rust macro for formatting strings",
            range: range
        },

        // Structs
        {
            label: 'struct',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'struct ${1:StructName} {\n\t${2:field_name}: ${3:FieldType},\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a struct',
            detail: "Rust struct definition",
            range: range
        },
        {
            label: 'impl',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'impl ${1:StructName} {\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Implements methods for a struct',
            detail: "Rust impl block for a struct",
            range: range
        },

        // Enums
        {
            label: 'enum',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'enum ${1:EnumName} {\n\t${2:Variant1},\n\t${3:Variant2},\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines an enum',
            detail: "Rust enum definition",
            range: range
        },

        // Traits
        {
            label: 'trait',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'trait ${1:TraitName} {\n\tfn ${2:method_name}(${3:&self});\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a trait',
            detail: "Rust trait definition",
            range: range
        },
        {
            label: 'impl trait for',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'impl ${1:TraitName} for ${2:StructName} {\n\tfn ${3:method_name}(${4:&self}) {\n\t\t$0\n\t}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Implements a trait for a struct',
            detail: "Rust trait implementation for a struct",
            range: range
        },

        // Types
        {
            label: 'Vec',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Vec<${1:T}>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A contiguous growable array type',
            detail: "Rust Vec type",
            range: range
        },
        {
            label: 'Option',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Option<${1:T}>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A type that represents either Some(T) or None',
            detail: "Rust Option type",
            range: range
        },
        {
            label: 'Result',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Result<${1:T}, ${2:E}>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A type that represents either Ok(T) or Err(E)',
            detail: "Rust Result type",
            range: range
        },

        // Error handling
        {
            label: 'unwrap',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'unwrap()',
            documentation: 'Unwraps an Option or Result, panicking if it is None or Err',
            detail: "Rust unwrap method",
            range: range
        },
        {
            label: 'expect',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'expect("${1:Error message}")',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Unwraps an Option or Result, panicking with a custom error message if it is None or Err',
            detail: "Rust expect method",
            range: range
        },

        // Smart pointers
        {
            label: 'Box',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Box::new(${1:value})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A pointer to data on the heap',
            detail: "Rust Box type",
            range: range
        },
        {
            label: 'Rc',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Rc::new(${1:value})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'A reference-counted pointer',
            detail: "Rust Rc type",
            range: range
        },
        {
            label: 'Arc',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Arc::new(${1:value})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'An atomic reference-counted pointer',
            detail: "Rust Arc type",
            range: range
        },

        // Lifetimes
        {
            label: 'lifetime',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "'${1:a}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a lifetime',
            detail: "Rust lifetime",
            range: range
        },
        {
            label: 'static lifetime',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "'static",
            documentation: 'Indicates that the data has a static lifetime',
            detail: "Rust static lifetime",
            range: range
        },
    ];
}

export const getStylusCompletion = (range: monaco.IRange, monaco: any) => {
    return [
        {
            label: '#[external]',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '#[external]\n',
            documentation: 'Defines external methods for the contract',
            detail: "Stylus external attribute",
            range: range
        },
        {
            label: '#[entrypoint]',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '#[entrypoint]\n',
            documentation: 'Marks the struct as an entry point for the contract',
            detail: "Stylus entrypoint attribute",
            range: range
        },
        {
            label: '#![cfg_attr]',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '#![cfg_attr(not(feature = "export-abi"), no_main)]\n',
            documentation: 'Config attribute for conditional compilation',
            detail: "Stylus configuration attribute",
            range: range
        },

        // Struct and sol_storage
        {
            label: 'sol_storage!',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'sol_storage! {\n\t#[entrypoint]\n\tpub struct ${1:StructName} {\n\t\t${2:FieldType} ${3:field_name};\n\t}\n}\n',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines persistent storage using Solidity ABI',
            detail: "Stylus sol_storage macro",
            range: range
        },
        {
            label: 'pub struct',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'pub struct ${1:StructName} {\n\t${2:FieldType} ${3:field_name};\n}\n',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a public struct',
            detail: "Rust-like struct definition in Stylus",
            range: range
        },

        // External methods
        {
            label: 'pub fn',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'pub fn ${1:function_name}(&${2:self}) -> ${3:ReturnType} {\n\t$0\n}\n',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Defines a public function within a contract',
            detail: "Stylus function definition",
            range: range
        },
        {
            label: 'fn set_number',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'pub fn set_number(&mut self, new_number: U256) {\n\tself.number.set(new_number);\n}\n',
            documentation: 'Sets a number in storage to a user-specified value',
            detail: "Stylus set_number function",
            range: range
        },
        {
            label: 'fn mul_number',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'pub fn mul_number(&mut self, new_number: U256) {\n\tself.number.set(new_number * self.number.get());\n}\n',
            documentation: 'Multiplies and sets the number in storage',
            detail: "Stylus mul_number function",
            range: range
        },
        {
            label: 'fn sub_number',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'pub fn sub_number(&mut self, new_number: U256) {\n\tself.number.set(new_number + self.number.get());\n}\n',
            documentation: 'Subtracts and sets the number in storage',
            detail: "Stylus sub_number function",
            range: range
        },
        {
            label: 'fn increment',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'pub fn increment(&mut self) {\n\tlet number = self.number.get();\n\tself.set_number(number + U256::from(1));\n}\n',
            documentation: 'Increments the number in storage',
            detail: "Stylus increment function",
            range: range
        },

        // Imports
        {
            label: 'use stylus_sdk',
            kind: monaco.languages.CompletionItemKind.Module,
            insertText: 'use stylus_sdk::{${1:module_name}, prelude::*};\n',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Imports modules from the Stylus SDK',
            detail: "Stylus SDK import",
            range: range
        },
        {
            label: 'use alloc',
            kind: monaco.languages.CompletionItemKind.Module,
            insertText: 'extern crate alloc;\n\nuse alloc::vec::Vec;\n',
            documentation: 'Imports the alloc crate and Vec type',
            detail: "Stylus alloc import",
            range: range
        },

        // Global allocator
        {
            label: 'static ALLOC',
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: 'static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;\n',
            documentation: 'Defines a static allocator for efficient WASM allocation',
            detail: "Stylus global allocator",
            range: range
        },

        // WASM configuration
        {
            label: '#[global_allocator]',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '#[global_allocator]\nstatic ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;\n',
            documentation: 'Specifies the global allocator for WASM',
            detail: "Stylus WASM allocator",
            range: range
        },
        {
            label: '#![no_main]',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: '#![no_main]\n',
            documentation: 'Disables the generation of the main function',
            detail: "Stylus no_main configuration",
            range: range
        },

        // Custom types and constants
        {
            label: 'U256',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'U256',
            documentation: '256-bit unsigned integer type',
            detail: "Stylus U256 type",
            range: range
        },
        {
            label: 'MINI_ALLOC',
            kind: monaco.languages.CompletionItemKind.Constant,
            insertText: 'mini_alloc::MiniAlloc::INIT',
            documentation: 'Initializer for the MiniAlloc allocator',
            detail: "Stylus MiniAlloc constant",
            range: range
        },
    ];
}
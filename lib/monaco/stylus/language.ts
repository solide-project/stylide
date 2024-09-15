const LanguageConfiguration = {
    comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"],
    },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
    ],
    autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: "<", close: ">" },
    ]
};

export const MonarchDefinitions = {
    defaultToken: "invalid",

    keywords: [
        "abstract",
        "alignof",
        "as",
        "become",
        "box",
        "break",
        "const",
        "continue",
        "crate",
        "do",
        "else",
        "enum",
        "extern",
        "false",
        "final",
        "fn",
        "for",
        "if",
        "impl",
        "in",
        "let",
        "loop",
        "macro",
        "match",
        "mod",
        "move",
        "mut",
        "offsetof",
        "override",
        "priv",
        "proc",
        "pub",
        "pure",
        "ref",
        "return",
        "Self",
        "self",
        "sizeof",
        "static",
        "struct",
        "super",
        "trait",
        "true",
        "type",
        "typeof",
        "unsafe",
        "unsized",
        "use",
        "virtual",
        "where",
        "while",
        "yield",

        // keywords for macros
        "macro_rules",
        "block",
        "expr",
        "ident",
        "item",
        "pat",
        "path",
        "stmt",
        "meta",
        "tt",
        "ty"
    ],

    typeKeywords: [
        "array", "bool", "char", "f32", "f64", "i16", "i32", "i64", "i8",
        "isize", "pointer", "slice", "str", "tuple", "u16", "u32", "u64", "u8",
        "usize", "Vec", "String"
    ],

    operators: [
        "=", ">", "<", "!", "~", "?", ":",
        "==", "<=", ">=", "!=", "&&", "||", "++", "--",
        "+", "-", "*", "/", "&", "|", "^", "%", "<<",
        ">>", ">>>", "+=", "-=", "*=", "/=", "&=", "|=",
        "^=", "%=", "<<=", ">>=", ">>>="
    ],

    symbols: /[=><!~?:&|+\-*\/^%]+/,
    escapes: /\\(?:[abfnrtv\\""]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // identifiers and keywords
            [/[a-z_$][\w$]*/, {
                cases: {
                    "@keywords": "keyword",
                    "@typeKeywords": "keyword.type",
                    "@default": "identifier"
                }
            }],
            [/[A-Z][\w$]*/, "type.identifier"],  // to show class names nicely

            // whitespace
            { include: "@whitespace" },

            // delimiters and operators
            [/[{}()\[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],

            [/@symbols/, {
                cases: {
                    "@operators": "operator",
                    "@default": ""
                }
            }],

            [/#!?\[[^]*\]/, "annotation"],
            [/#!?.*$/, "annotation.invalid"],

            // numbers
            [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, "number.float"],
            [/0[xX][0-9a-fA-F_]*[0-9a-fA-F][Ll]?/, "number.hex"],
            [/0[0-7_]*[0-7][Ll]?/, "number.octal"],
            [/0[bB][0-1_]*[0-1][Ll]?/, "number.binary"],
            [/\d+[lL]?/, "number"],

            // delimiter: after number because of .\d floats
            [/[;,.]/, "delimiter"],

            // strings
            [/"([^"\\]|\\.)*$/, "string.invalid"],  // non-teminated string
            [/"/, "string", "@string"],

            // characters
            [/"[^\\"]"/, "string"],
            [/(")(@escapes)(")/, ["string", "string.escape", "string"]],
            [/"/, "string.invalid"]
        ],

        whitespace: [
            [/[ \t\r\n]+/, "white"],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"]
        ],

        comment: [
            [/[^\/*]+/, "comment"],
            [/\/\*/, "comment", "@push"],
            [/\/\*/, "comment.invalid"],
            ["\\*/", "comment", "@pop"],
            [/[\/*]/, "comment"]
        ],

        string: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"/, "string", "@pop"]
        ]
    }
};
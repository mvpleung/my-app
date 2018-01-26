module.exports = {
    // required to lint *.vue files
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "parserOptions": { //语法支持
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    plugins: [
        'vue'
    ],
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        //禁止直接使用 Object.prototypes 的内置属性
        "no-prototype-builtins": 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // 强制使用有效的 JSDoc 注释
        "valid-jsdoc": 1,
        "space-before-function-paren": 0,
        "no-inner-declarations": 0,
        "no-extend-native": 0, // 可以使用扩展方法
        "no-const-assign": 2,//禁止修改const声明的变量
        "no-constant-condition": 2,//禁止在条件中使用常量表达式 if(true) if(1)
        "no-dupe-keys": 2,//在创建对象字面量时不允许键重复 {a:1,a:1}
        "no-dupe-args": 2,//函数参数不能重复
        "no-duplicate-case": 2,//switch中的case标签不能重复
        "no-else-return": 2,//如果if语句里面有return,后面不能跟else语句
        "no-empty-label": 2,//禁止使用空label
        "no-extra-bind": 2,//禁止不必要的函数绑定
        "no-extra-boolean-cast": 2,//禁止不必要的bool转换
        "no-extra-parens": 2,//禁止非必要的括号
        "no-extra-semi": 2,//禁止多余的冒号
        "no-fallthrough": 1,//禁止switch穿透
        "no-func-assign": 2,//禁止重复的函数声明
        "no-implicit-coercion": 1,//禁止隐式转换
        "no-invalid-regexp": 2,//禁止无效的正则表达式
        "no-invalid-this": 2,//禁止无效的this，只能用在构造器，类，对象字面量
        "no-irregular-whitespace": 2,//不能有不规则的空格
        "no-lone-blocks": 2,//禁止不必要的嵌套块
        "no-loop-func": 1,//禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
        "no-mixed-requires": [0, false],//声明时不能混用声明类型
        "linebreak-style": [0, "windows"],//换行风格
        "no-sparse-arrays": 2,//禁止稀疏数组， [1,,2]
        "no-unneeded-ternary": 2,//禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
        "no-unused-vars": [2, { "vars": "all", "args": "after-used" }],//不能有声明后未被使用的变量或参数
        "default-case": 2,//switch语句最后必须有default
        "quotes": [
            "error",
            "single"
        ]
    }
}
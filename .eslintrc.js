
/**
 * http://eslint.cn/docs/rules/
 * https://github.com/yannickcr/eslint-plugin-react
 * https://github.com/benmosher/eslint-plugin-import
 */

module.exports = {
    "extends": [
        "eslint:recommended"
    ],
    "plugins": [
        "react",
        "import"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "es6": true,
        "browser": true,
        "node": true,
        "commonjs": true,
        "worker": true,
        "amd": true,
        "mocha": true,
        "jest": true,
        "jquery": true,
        "serviceworker": true
    },
    "settings": {
        "import/ignore": [
            "node_modules"
        ]
    },
    "rules": {
        "indent": ["error", 2],
        "linebreak-style": ["error", "unix"],
        "semi": ['error', 'always'],
        "quotes": ["error", "single"],
        "no-var": "error",
        "no-trailing-spaces": "error",
        "jsx-quotes": ["error", "prefer-double"],
        "react/display-name": 1,
        "react/forbid-prop-types": 1,
        "react/jsx-boolean-value": 1,
        "react/jsx-closing-bracket-location": 1,
        "react/jsx-curly-spacing": 1,
        "react/jsx-equals-spacing": 1,
        "react/jsx-handler-names": 1,
        "react/jsx-indent-props": [2, 2],
        "react/jsx-indent": [2, 2],
        "react/jsx-key": 1,
        "react/jsx-max-props-per-line": [1, {"when": "multiline"}],
        "react/jsx-no-bind": 0,
        "react/jsx-no-duplicate-props": 1,
        "react/jsx-no-literals": [2, {"noStrings": false}],
        "react/jsx-no-undef": 1,
        "react/jsx-pascal-case": 1,
        "react/sort-prop-types": 1,
        "react/jsx-sort-props": 1,
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "react/no-danger": 1,
        "react/no-deprecated": 1,
        "react/no-did-mount-set-state": 1,
        "react/no-did-update-set-state": 1,
        "react/no-direct-mutation-state": 1,
        "react/no-is-mounted": 1,
        "react/no-multi-comp": 1,
        "react/no-set-state": 1,
        "react/no-string-refs": 1,
        "react/no-unknown-property": 1,
        "react/prefer-es6-class": 1,
        "react/prop-types": 1,
        "react/react-in-jsx-scope": 1,
        "react/self-closing-comp": 1,
        "react/sort-comp": 1,
        "react/jsx-wrap-multilines": 1,

        "import/extensions": 2
    }
};
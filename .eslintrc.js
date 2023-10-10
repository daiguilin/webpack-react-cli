module.exports = {
    // 继承 react-app 规则
    extends: ["react-app"],//需要安装eslint-config-react-app包
    parserOptions: {
       babelOptions:{
        presets:[
            ["babel-preset-react-app",false],
            "babel-preset-react-app/prod"
        ]
       }
    }
};
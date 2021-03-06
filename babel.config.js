// //项目发布阶段需要用到的babel插件
let transformRemoveConsolePlugin = []
// //判断是开发还是发布阶段
if (process.env.NODE_ENV === 'production') {
  transformRemoveConsolePlugin.push('transform-remove-console');
}


module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [...transformRemoveConsolePlugin]
}

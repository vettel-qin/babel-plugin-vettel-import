# babel-plugin-vettel-import

按需加载 babel 插件

# Usage

```
  npm install babel-plugin-vettel-import --save-dev
```

使用方式一：在  .babelrc 里进行配置(推荐):

// .babelrc

```
{
  "plugins": [
    ["vettel-import", {"library": "@vettel/picker"}]
  ]
}
```

使用方式二：在 webpack 里进行配置：

```
module: {
  rules: [{
    test: /\.js$/,
    loader: "babel-loader",
+   options: {
+     plugins: [
+       ["vettel-import", { "library": "@vettel/picker" }],
+     ]
+   }
  }]
},
```

# Example

```
  import { Picker } from '@vettel/picker';
```

上述代码经过此插件转换后等同于下列代码，从而实现按需加载

```
import Picker from '@vettel/picker/lib/picker';
```

# 源码分析

```
const babel = require('@babel/core');//babel核心解析库
const t = require('@babel/types');//babel类型转化库

let importPlugin = {
  visitor: {
    ImportDeclaration(path, ref = {}){
      let {opts} = ref;
      let {node} = path;
      let source = node.source.value;
      let specifiers = node.specifiers;
      // 确认导入库 是否是 .babelrc library属性指定库 以及 如果不是默认导入 才进行按需导入加载
      if(opts.library === node.source.value && !t.isImportDefaultSpecifier(specifiers[0])){
        specifiers = specifiers.map(specifier=>{
          return t.importDeclaration(
            [t.importDefaultSpecifier(specifier.local)],
            t.stringLiteral(`${source}/lib/${specifier.local.name}`)
          )
        });
        path.replaceWithMultiple(specifiers);
      }
    }
  }
}

module.exports = function () {
  return importPlugin
};
```

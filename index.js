//实现模块的按需加载

const babel = require('@babel/core');//babel核心解析库
const t = require('@babel/types');//babel类型转化库

let importPlugin = {
    visitor: {
        ImportDeclaration(path, ref = {}){
            let {opts} = ref;
            let {node} = path;
            let source = node.source.value;
            let specifiers = node.specifiers;
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
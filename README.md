# Just Todo
这是在学习 Jokcy 的课程：[Vue+Webpack打造todo应用](https://www.imooc.com/learn/935) 时照着写的一个小工具，这个课程可以很好的了解一些loader和webpack的使用知识。

过程中有一些因为与课程使用版本不一致导致的依赖报错啥的，这里都解决了，可以参考源码。

## Demo
<a target="_blank" href="https://beltxman.com/todolist" title="vue demo todolist">Just Todo</a>

## 小修改：
- 当没有待办事项时，根据筛选条件不同显示不同的提示语。
- 配置文件加入注释，加入目录清理和例外配置
- 利用oss插件讲静态文件上传CDN
- 修改部分样式

## 测试：

```bash
git clone git@github.com:hsu1943/justTodo.git

cd justTodo

npm install

npm run dev
```

补充配置 `/config/index.js`里 `oss` 相关信息，后即可打包并上传`oss`：

```bash
npm run build
```

## 主要版本：

- vue: 2.6.10
- webpack: 4.35.3
- webpack-dev-server: 3.7.2

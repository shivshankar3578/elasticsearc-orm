# Elasticsearch Orm
这个是一个针对于Elasticsearch的Orm框架，通过一些基本的api，来实现增删改查，后续功能有待完善。敬请期待。
## 开始
```javascript
	var ESOrm = require("elasticsearch-orm");
	var esInstance = new ESOrm({
		"domain":"127.0.0.1",
		"port":"9200"
	});
```

## node支持版本
node 6.0.0+

## 主要功能
1. 连接ES库
2. 注册ES索引和类型
3. 对数据进行增删改查

## 使用文档
#### 注册索引和类型
通过*register*方法，可以
```javascript
var TestType =	esInstance.regster("testtype",{
	"index":"yourindex",
	"type":"yourtype"
});
```
在注册索引和类型的时候，可以传入这个类型的映射关系
```javascript
var TestType = esInstance.register("testtype",{
	"index":"yourindex",
	"type":"yourtype"
},{
	"name":{"type":"string"},
	"age":{"type":"long"},
	"birthday":{"type":"date"},
	"id":{"type":"string","index":"not_analyzed"}
});
```
当传入了索引的映射类型后，orm会自动检测index和type有没有建立，如果没有建立，就会自动按照指定的配置创建映射。如果没有传入映射关系，orm就不会执行自动创建。
```javascript
	esInstance.register("testtype",{
	"index":"yourindex",
	"type":"yourtype"
},{
	"name":{"type":"string"},
	"age":{"type":"long"},
	"birthday":{"type":"date"},
	"id":{"type":"string","index":"not_analyzed"}
}).ready(() => {
	console.log('ready');
});
```

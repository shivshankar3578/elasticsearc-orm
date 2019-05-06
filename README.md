
# elasticsearch-orm - A basic Elasticsearch query API

[![npm package](https://nodei.co/npm/elasticsearch-orm.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/elasticsearch-orm/)

## Installation

```bash
  Npm install elasticsearch-orm
```

## table of Contents

- [Create Connection] (#user-content-Create Connection)
- [Index related] (#user-content-index related)
- [Document related] (#user-content-document related)
- [Query related] (#user-content-query related)
- [Use Aggregate] (#user-content-Use Aggregation)
- [Paging related] (#user-content-page related)
- [Settings] (#user-content-setting)
- [Cluster related interface] (#user-content-cluster related interface)
- [Query API] (#user-content-Query api)
- [Aggregate API] (#user-content-aggregate api)

---


## Create a connection

```js
  Const orm = require('elasticsearch-orm');
  Const instance = orm({
      'domain': '127.0.0.1',
      'port': 9200
  });

  Instance.on('connected',() =>{
      Console.log('Connected successfully');
  });

  Instance.on('error',(e) =>{
    Console.log('connection exception', e);
  });
```
## Index related

### Create an index

Generate an index type

```js
  
  Const demoIndex = instance.register('demoIndex',{
      'index': 'demoindex',
      'type': 'demotype'
    },{
        'title':{
            'type': 'text'
        },
        'age':{
            'type': 'integer'
        },
        'location':{
            'type': 'geo_point'
        }
      },{
        'number_of_shards': 2,
        'number_of_replicas': 4
      });

```
Synchronous index: If the index has not been created, it will create an index according to mappings and settings `. If the index has been created, it will automatically determine which mappings are new, and add these new mappings ` to the index. . The sync method returns a Promise object, so you can use the await keyword.


```js
   Await demoIndex.sync();
```

### Index Health Value
```js
    Const health = await demoIndex.health();
```
### Index Status
```js
    Const stat = await demoIndex.stat();
```
### Index Statistics
```js
    Const state = await demoIndex.state();
```
### Setting index aliases
```js
    Const result = await demoIndex.alias(['alias_name']);
```
### Deleting an alias
```js
    Const result = await demoIndex.removeAlias(['alias_name']);
```
### Refresh
```js
    Const result = await demoIndex.refresh();
```
### Flush
```js
    Const result = await demoIndex.flush();
```
### Forced merger
```js
    Const result = await demoIndex.forceMerge();
```
### Test word breaker
```js
    Const result = await demoIndex.analyze('I love Beijing Tiananmen', 'ik_max_word');
```
### Open an index
```js
    Const result = await demoIndex.open();
```

### Close an index
```js
    Const result = await demoIndex.close();
```

## Document related
### Creating a document
The create method returns a Promise object, which can be used to return the newly created document ID using the await keyword.
```js
Let id = await demoIndex.create({
    'title': 'Demo Title',
    'age',12,
    'location':{
      'lon': 100.1,
      'lat': 40.2
    }
  });
```

Specify document ID to create document
```js
  Await demoIndex.create({
    'title': 'Demo Title',
    'age',12,
    'location':{
      'lon': 100.1,
      'lat': 40.2
    }
  },'document_id');
```
Specify document routing
```js
  Await demoIndex.create({
    'title': 'Demo Title',
    'age',12,
    'location':{
      'lon': 100.1,
      'lat': 40.2
    }
  },'document_id','routing_hash');
```
Specify parent node
```js
  Await demoIndex.create({
    'title': 'Title',
    'age':123
    },null,null,{
      'parent': 'parent_id'
    })
```
### Update document
```js
  Await demoIndex.update('docuemnt_id',{
    'title': "Demo Title 2",
    'age': 13
  })
```
Specify document routing
```js
  Await demoIndex.update('document_id',{
    'title': 'Demo Title 2',
    'age': 14
    },'routing_hash')
```
### Deleting documents
```js
  Await demoIndex.delete(id);
  Await demoIndex.delete(['id1','id2'])
```
### Getting documents by id
If the id does not exist, an error will be returned
```js
  Let doc = await demoIndex.get(id);
```

## Query related
### Building a simple query
```js
    Let ret = await demoIndex.query();
```
The ret object returns a sub-object, one is list, which is the _source array that extracts the result, and the other is orgResult, which is the original content returned by es
### Query conditions
Single query condition, please refer to [Query API] (#user-content-Query api) for a list of all query conditions.
```js
  Let ret = await demoIndex.term('age',12).query();
```
Multiple query conditions
```js
  Let ret = await demoIndex
      .term('age',12)
      .match('title','')
      .query();
```
Must,should,not
```js
  Const Condition = require("elasticsearch-orm").Condition;
  Let ret = await demoIndex
    .must(new Condition().term('age',12))
    .should(new Condition().match('title','Tiel'))
    .not(new Condition().exists('age'))
    .query();

```
Filter query
```js
  Const Condition = require("elasticsearch-orm").Condition;
  Let ret = await demoIndex
            .filter(new Condition().matchAll())
            .query();
```
### Building nested queries
```js
Const Condition = require("elasticsearch-orm").Condition;
Let condition = new Condition();
Condition.term('age',12)
    .match('title','Title')
    .not(new Conditio()
    .range('age',0,10));
Let ret = await demoIndex
    .should(condition)
    .exists('location')
    .query();
```

## Using Aggregation
### Using basic aggregation
The result of the aggregation can be obtained by the original return value of the orgResult object. For the complete aggregation API, please refer to [Aggregate API] (#user-content-aggregation api)
```js
  Const Aggs = require('elasticsearch-orm').Aggs;
  Let ret = await demoIndex
      .exists('age')
      .aggs(new Aggs('avg_age').avg('age'))
      .query();
```
### Aggregated child aggregation
```js
  Const Aggs = require('elasticsearch-orm').Aggs;
  Let aggs = new Aggs('test_aggs').terms('title');
  Aggs.aggs(new Aggs('sub_aggs').valueCount('age'));
  Let ret = await demoIndex
      .exist('age')
      .aggs(aggs)
      .query();
```
## Pagination related
### Pagination
```js
  Let ret = await demoIndex
      .from(0)
      .size(15)
      .query();
```
### Using scrolling
Initiate a scroll
```js
    Await demoIndex.query({
        'scroll': '1m'
    })
```
Perform scrolling
```js
    Await demoIndex.scroll(scrollId,{
        'scroll': '1m'
    });
```
Clear a scroll
```js
    Await demoIndex.clearScroll(scrollId);
```
### Sorting
```js
  Let ret = await demoIndex
      .sort('age','asc')
      .sort('title','asc','min')
      .query();
```
or
```js
  Let ret = await demoIndex
      .sort({
          'age':{
              'order': 'desc',
              'mode': 'min'
          }
      })
      .query();
```
## Settings
If debug is set to true, the request body, url, and return value for each request will be printed.
```js
  Let instance = orm({
    'domain': '127.0.0.1',
    'port': 9200
  });
  Instance.set("debug",true);
```
Can set the debug method
```js
  Instance.set("log",console.log);
```
Set request timeout in milliseconds (default is 30s)
```js
  Instance.set('timeout',5000);
```
## Cluster related interface
### Get cluster health value
```js
    Const health = await instance.health();
```
### Get cluster status
```js
    Const state = await instance.state();
```
### Get cluster statistics
```js
    Const stat = await instance.stat();
```
### Getting an index list
```js
    Const result = await instance.indices();
```
### Node Information
```js
    Const result = await instance.nodes();
```
### Node Status
```js
    Const result = await instance.nodeStat('node_id');
```
### Close a node
```js
    Const result = await instance.shutDown('node_id');
```

## Query API
### Text matching
#### match Query
```js
  Let condition = new Condition();
  Condition.match('title','content1 content2');
  Condition.match('title','content1 content2',{
    'operator': 'and'
    });
```
The generated query json is
```json
  {
    "match":{
        "title": "content1 content2",
        "operator":"and"
    }
  }
```
The field argument can be an array
```js
  Condition.match(['title','description'],'content1 content2');
  Condition.match(['title','description'],'content1 content2',{
      'type': 'best_fields'
    });
```
The generated query json is
```json
  {
    "multi_match":{
        "query": "content1 content2",
        "type": "best_fields",
        "fields":["title","description"]
    }
  }
```
#### Phrase query matchPhrase and matchPhrasePrefix
```js
condition.matchPhrase('title','content1 content2');
condition.matchPrasePrefix('title','content1 content2');
condition.matchPhrase('title','content1 content2',{
  'analyzer': 'test_analyzer'
  });
```
Generate query json
```json
  {
    "match_phrase":{
      "title":{
        "query": "content1 content2",
        "analyzer": "test_analyzer"
      }
    }
  }
  {
    "match_phrase_prefix":{
      "title":{
        "query": "content1 content2"
      }
    }
  }
```
### The exact value
#### term Query
```js
Condition.term('age',13);
Condition.term('age',[13,15]);
```
Generate query json
```json
  {
    "term":{
        "age": 13
    }
  }
  {
    "terms":{
        "age": [13,15]
    }
  }
```
#### exists Query
```js
Condition.exists('age');
Condition.exists(['age','title']);
```
Generate json
```json
{
  "exists":{
    "field":"age"
  }
}
{
  "exists":{
    "fields":["age","title"]
  }
}
```
#### range Query
```js
Condition.range('age',1);
Condition.range('age',1,10);
Condition.range('age',null,10);
Condition.range('age',1,10,true,false);
```
Generate json
```json
  {
    "range":{
        "age":{
            "gt": 1
        }
    }
  }
  {
    "range":{
        "age":{
            "gt": 1,
            "lt": 10
        }
    }
  }
  {
    "range":{
        "age":{
            "lt": 10
        }
    }
  }
  {
    "range":{
        "age":{
            "gte": 1,
            "lt": 10
        }
    }
  }
```
Use the Range object
```js
const Range = require('elasticsearch-orm').Range();
let range = new Range(1);
range = new Range(1,10);
range = new Range(1,10,false,true);
range = new Range().gt(1,true).lt(10,false);
condition.range(range);
```
#### prefix、wildcard 和fuzzy
```js
condition.prefix('title','Tre');
condition.wildcard('title','Tre*hao');
condition.fuzzy('title',{
  'value':'ki',
  'boost':1.0
})
```
Generate json file
```json
{
  "prefix":{
    "title":"Tre"
  }
}
{
  "wildcard":{
    "title":"Tre*hao"
  }
}
{
  "fuzzy":{
    "title":{
        "value":"ki",
        "boost":1.0
    }
  }
}
```
### Location query
#### geoShape
```js
condition.geoShape('location','circle',
  [{
  'lon':100.0,
  'lat':41.0
  }],
  {
    'radius':"100m",
    "relation":"within"
    })
```
Generate json
```json
  {
    "geo_shape":{
        "location":{
            "shape":{
              "type":"circle",
              "coordinates":[{
                "lon":100.0,
                "lat":41.0
              }],
              "relation":"within"
            }
        }
    }
  }
```
#### geoDistance
```js
  condition.geoDistance('location',{
    'lon':100.0,
    'lat':31.0
    },'100m');
```
Generate json
```json
  {
    "geo_distance":{
      "distance":"100m",
      "location":{
        "lon":100.0,
        "lat":31.0
      }
    }
  }
```
#### geoPolygon
```js
condition.geoPolygon('location',[{
  'lon':100.0,
  'lat':41.1
  },{
    'lon':101.0,
    'lat':42.1
   },{
     'lot':102.3,
     'lat':42.4
    }])
```
Generate json
```json
{
  "geo_polygon":{
      "location":{
          "points":[{
                  "lon":100.0,
                  "lat":41.1
                },{
                  "lon":101.0,
                  "lat":42.1
                },{
                  "lot":102.3,
                  "lat":42.4
                }]
      }
  }
}
```
#### geoBoundingBox
```js
  condition.geoBoundingBox('location',{
    'top_left':{
        'lon':100.1,
        'lat':31.3
    },
    'bottom_right':{
      'lon':100.3,
      'lat':32.1
    }
    });
```
Generate json
```json
{
  "geo_bounding_box":{
    "location":{
        "top_left":{
          "lon":100.0,
          "lat":31.3
        },
        "bottom_right":{
          "lon":103.3,
          "lat":31.3
        }
    }
  }
}
```
### Relational query
#### hasParent
```js
  condition.hasParent('parentType',new Condition().matchAll(),{
    'score':1
    });
```
Generate json
```json
  {
    "has_parent":{
      "parent_type":"parentType",
      "query":{
          "match_all":{}
      }
    }
  }
```
#### hasChild
```js
  condition.hasChild('childType',new Condition().matchAll(),{
    'min_children':10
    });
```
Generate json
```json
  {
    "has_child":{
      "type":"childType",
      "query":{
        "match_all":{}
      }
    }
  }
```
#### parentId
```js
condition.parentId('parent_id_1','type');
```
Generate json
```json
{
  "parent_id":{
    "type":"type",
    "id":"parent_id_1"
  }
}
```

## Aggregation API
### Basic numerical aggregation
```js
  const Aggs = require('elasticsearch-orm').Aggs;
  aggs = new Aggs('test').avg('age');
  aggs = new Aggs('test').cardinality('age');
  aggs = new Aggs('test').max('age');
  aggs = new Aggs('test').min('age');
  aggs = new Aggs('test').sum('age');
  aggs = new Aggs('test').valueCount('age');
  aggs = new Aggs('test').stats('age');
  aggs = new Aggs('test').percentiles('age');
  aggs = new Aggs('test').percentileRanks('age');

```
### Packet aggregation
#### terms
```js
aggs = new Aggs('test').terms('age',{
  'order':{
      'field':"age",
      'type':'desc'
  },
  'size':10
  })
```
#### histogram
```js
aggs = new Aggs('test').histogram('age',10);
```
#### dateHistogram
```js
aggs= new Aggs('test').dateHistogram('date','month',{
  'format':"yyyy-MM",
  'offset':'+1h'
  });
```
#### dateRange
```js
const Range = require('elasticsearch-orm').Range;
aggs = new Aggs('test').dateRange('date',[new Range()],{
  'format':"yyyy-MM"
});
```
#### range
```js
aggs = new Aggs('test').ranges('age',[new Range(1,10)]);
```
#### filter
```js
aggs = new Aggs('test').filter('age',new Condition().matchAll());
```
#### missing
```js
aggs = new Aggs('test').missing('age')

```
#### sampler
```js
aggs =new Aggs('test').sampler(100,{
  'max_doc_per_value':10
});
```
#### children
```js
  aggs = new Aggs('test').children('childrenType');
```
#### significantTerms
```js
  aggs = new Aggs('test').significantTerms('age');
```
### Geographically related aggregation
#### geoBounds
```js
aggs = new Aggs('test').geoBounds('location',{
  'wrap_longtitude':true
})
```

#### geoDistance
```js
aggs = new Aggs('test').geoDistance('location',{
  'lon':100.0,
  'lat':13.1
},[new Range(1,10)],{
  'unit':'m'
  });
```
#### geoCentroid
```js
aggs = new Aggs('test').geoCentroid('location');
```
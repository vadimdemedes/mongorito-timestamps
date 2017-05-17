# mongorito-timestamps [![Build Status](https://travis-ci.org/vadimdemedes/mongorito-timestamps.svg?branch=master)](https://travis-ci.org/vadimdemedes/mongorito-timestamps)

> Plugin to add "created" and "updated" timestamps for Mongorito models.


## Installation

```
$ npm install --save mongorito-timestamps
```


## Usage

```js
const {Database, Model} = require('mongorito');
const timestamps = require('mongorito-timestamps');

class Post extends Model {}

const db = new Database('localhost/blog');
await db.connect();

db.use(timestamps());
db.register(Post);

const post = new Post({title: 'Hello'});
await post.save();

post.get('created_at');
//=> 2017-05-17T18:02:06.612Z

post.get('updated_at');
//=> same as `created_at`

post.set({title: 'World'});
await post.save();

post.get('created_at');
//=> same as previous `created_at`

post.get('updated_at');
//=> 2017-05-17T18:02:06.971Z
```


## API

### timestamps([options])

Configures and returns a `timestamps` plugin. Accepts an optional `options` object to customize field names and a function, which generates the timestamps.

#### options

##### createdAt

Type: `string`<br>
Default: `created_at`

Name of the field, which stores the date when the document was created. This field doesn't change after the initial creation.

##### updatedAt

Type: `string`<br>
Default: `updated_at`

Name of the field, which stores the date when the document was updated. This field changes on every save of the document.

##### getTimestamp

Type: `function`<br>
Default:

```js
const getTimestamp = () => new Date();
```

Function, which generates a timestamp.


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes)

# Express Mongo Session Store

Use a mongodb instance to store session data. It uses [Mongo-Start]('https://www.npmjs.com/package/mongo-start') to provide the mongo connection. Just have the required config for connecting to your mongodb instance and there you go.

```
var session = require('express-session');
var MongoStore = require('express-mongo-session')(session);
 
app.use(session({
    secret: 'foo',
    store: new MongoStore(options)
}));
```
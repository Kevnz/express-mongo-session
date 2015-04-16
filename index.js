'use strict';

var mongo = require('mongo-start'),
    util = require('util'),
    Session = require('express-session');

var MongoStore = function(options) {
    options = options || {};
    Session.Store.call(this, options);
    

    this._collection = (options.collection) ? options.collection : 'sessions';

    this._db = mongo(this._collection)

};

util.inherits(MongoStore, Session.Store);

MongoStore.prototype.set = function(sid, sess, fn) {
    var collection = this._db;
    collection.findOne({ _sessionid: sid }, function(err, session_data) {
            if (err) {
                fn && fn(err);
            } else {
                sess._sessionid = sid;
                var method = 'insert';
                if (session_data) {
                    sess.lastAccess = new Date()
                    method = 'save';
                }
                collection[method](sess, function(err, document) {
                    if (err) {
                    } else { 
                        fn && fn(null, sess);
                    }
                });
            }
    });
};

MongoStore.prototype.get = function(sid, fn) {
    var collection = this._db;
    collection.findOne({ _sessionid: sid }, function(err, session_data) {
        if (err) {
            fn && fn(err);
        } else { 
            if (session_data) {
                session_data = cleanSessionData(session_data);
            }
            fn && fn(null, session_data);
        }
    });
};

MongoStore.prototype.destroy = function(sid, fn) {
    this._db.remove({ _sessionid: sid }, function() {
            fn && fn();
        });
};

MongoStore.prototype.length = function(fn) {
    this._db.count(function(count) {
        fn && fn(null, count);
    });
};

MongoStore.prototype.all = function() {
    var arr = [];
    this._db.find(function(err, cursor) {
            cursor.each(function(d) {
                d = cleanSessionData(d);
                arr.push(d);
            });
            fn && fn(null, arr);
        });
};

MongoStore.prototype.clear = function(fn) {
    this._db.remove(function() {
        fn && fn();
    });
};

var cleanSessionData = function(json) {
    var data = {};
    for (var i in json) {
        data[i] = json[i];
        if (data[i] instanceof Object) {
            if ('low_' in data[i] || 'high_' in data[i]) {
                data[i] = data[i].toNumber();
            }
        }
        
    }
    return data;
};

module.exports = MongoStore;
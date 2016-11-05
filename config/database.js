module.exports = {
    development: {
        driver:   'mongodb',
        url:      'mongodb://localhost:27017/toDo'
    },
    test: {
        driver:   'mongodb',
        url:      'mongodb://localhost:27017/test'
    },
    production: {
        driver:   'mongodb',
        url:      'mongodb://localhost/APPNAME-production'
    }
};

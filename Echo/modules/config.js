
var Config = {
    push_server: {
        host: "192.168.130.24",
        port: 3001,
        actions: {
            push: {
                path: "/push",
                method: "POST"
            },
            put_cert: {
                path: "/put_cert",
                method: "PUT"
            }
        }
    },
    database: {
        driver: require('./MongoDbms').MongoDbms,
        host: "localhost",
        port: 27017,
        db_name: "echo"
    }
};

exports.Config = Config;




const zookeeper = require('node-zookeeper-client');

const client = zookeeper.createClient('localhost:2181');
const path = "/token";
let tokenData = "0"; //initial value of the token

const client2 = zookeeper.createClient('localhost:2181');

client2.once('disconnected', function (...args: any[]) {
    console.log('disconnected to ZooKeeper 2', args);
});

client.once('connected', function() {
    console.log('Connected to ZooKeeper.');
    console.log(client2);

    // Create a znode for the token if it doesn't exist
    // client.create(path, Buffer.from(tokenData), function(error: Error) {
    //     if (error) {
    //         console.log('Failed to create node: %s due to: %s.', path, error);
    //     } else {
    //         console.log('Node: %s is successfully created.', path);
    //     } 
    // });

    // Function to increment the token
    function incrementToken() {
        client2.getData(path, function (error: Error, data: Buffer) {
            if (error) {
                console.log('Failed to get data from node: %s due to: %s.', path, error);
                return;
            }

            tokenData = (parseInt(data.toString()) + 1).toString();
            console.log('got token data', tokenData);
            // client.setData(path, Buffer.from(tokenData), -1, function(error: Error, stat: any) {
            //     if (error) {
            //         console.log('Failed to set data of node: %s due to: %s.', path, error);
            //         return;
            //     }
            //     console.log('client 1 Token incremented to: ' + tokenData);
            // });
            client2.setData(path, Buffer.from(tokenData), -1, function(error: Error, stat: any) {
              if (error) {
                  console.log('Failed to set data of node: %s due to: %s.', path, error);
                  return;
              }
              console.log('client 2 Token incremented to: ' + tokenData);
          });
        });
    }

    incrementToken();
});
client.connect();

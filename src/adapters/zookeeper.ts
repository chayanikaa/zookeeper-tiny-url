import { hostname } from 'os';
import * as zookeeper from 'node-zookeeper-client';

// all of this could be enclosed in a config/globals section
const path = "/urls/range-id";
let previousResultPath: string | null;
let currentResultPath: string | null;
let tokenData = "-1"; //initial value of the token
let client: any;

export const connectZookeeper = () => {
  return new Promise((resolve, reject) => { 
    client = zookeeper.createClient('tiny-url-zookeeper:2181');
    client.connect();
    client.once('connected', function () {
      console.log('Connected to ZooKeeper.');
      resolve(null);
    });
  })
}

export const createDefaultToken = () => { 
  // Create a znode for the token if it doesn't exist
  client.create('/urls', Buffer.from(tokenData), function(error: Error) {
    if (error) {
        console.log('Failed to create node: %s due to: %s.', path, error);
    } else {
        console.log('Node: %s is successfully created.', path);
    }
  });
}

const cleanupCurrentToken = () => {
  if (!previousResultPath) { 
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    client.remove(previousResultPath, -1, (error: Error) => {
      if (error) {
          console.log('Failed to delete node: %s due to: %s.', previousResultPath, error);
          return reject(error);
      }
      resolve(previousResultPath);
      console.log('Node: %s is deleted.', previousResultPath);
  });

  });
}

// Persistent Sequential mode in Apache ZooKeeper does provide a mechanism that can be used to prevent race conditions in distributed systems.
// By generating unique, sequentially - numbered znodes, ZooKeeper ensures ordered and exclusive access,
// a concept critical in avoiding simultaneous conflicting updates or reads(race conditions).
// Additionally, because these znodes are persistent, they can help maintain this ordered state consistently across multiple sessions and client crashes,
// further enhancing the system's resilience against race conditions.
export const getNextToken: () => Promise<number> = () => {
  previousResultPath = currentResultPath;
  console.log(hostname())
  return new Promise((resolve, reject) => {
    client.create(path, Buffer.from(hostname()), zookeeper.CreateMode.PERSISTENT_SEQUENTIAL, (error: Error, resultPath: string) => {
      if (error) {
          console.log('Failed to create node: %s due to: %s.', path, error);
          return reject(error);
      }
      
      currentResultPath = resultPath;
      console.log('Node: %s is created.', resultPath);
      resolve(+resultPath.replace(path, ''));
      cleanupCurrentToken();
    });
  });
  
}




# aws-pubsub

## Introduction
Target of this small library is to quickly have a possibility to do 
realtime-communication between multiple clients and/or servers i.e. for 
a chat-application.
The Lib is usable in nodejs applications and in the browser aswell.

## Prerequisites
To use this library you need a AWSAppSync Realtime API endpoint with an
valid API-Key.
In your AWS Account just switch to AppSync service and create such an API:

![](https://raw.githubusercontent.com/simon1389/aws-pubsub/master/desc1.png)

![](https://raw.githubusercontent.com/simon1389/aws-pubsub/master/desc2.png)

After creating you need the endpoint URL and you have to create an API-Key.
You need that information to call the `configure` method of the lib.

![](https://raw.githubusercontent.com/simon1389/aws-pubsub/master/desc3.png)

## Usage
```
pubsub.configure({
    aws_appsync_graphqlEndpoint:
        'https://xxxxxxxxxxxxxxxx.appsync-api.eu-central-1.amazonaws.com/graphql',
    aws_appsync_region: 'eu-central-1',
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxx',
});

pubsub.subscribe(
    'myChannel',
    (data) => {
        console.log('received data', data);
    },
    (error) => {
        // error handling
    },
);

pubsub.publish(
    'myChannel',
    JSON.stringify({ name: 'A Friend', message: 'Hello World from a friend' }),
)
```
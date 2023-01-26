// @ts-ignore
import { API, graphqlOperation } from '@aws-amplify/api';

let gotConfigured = false;

//Used as prefix for every subscribe/publish call to be able to distinguish between i.e. environments
let PREFIX = '';

const subscribeDoc = /* GraphQL */ `
    subscription Subscribe($name: String!) {
        subscribe(name: $name) {
            data
            name
        }
    }
`;

const publishDoc = /* GraphQL */ `
    mutation Publish($data: AWSJSON!, $name: String!) {
        publish(data: $data, name: $name) {
            data
            name
        }
    }
`;

/**
 * @param  {string} name the name of the channel
 * @param  {Object} data the data to publish to the channel
 */
export async function publish(name: string, data: unknown) {
    if (!gotConfigured) {
        throw new Error('Publishing without configuration. Please call "configure" first')
    }

    return API.graphql(graphqlOperation(publishDoc, {name: PREFIX + name, data}));
}

/**
 * @param  {string} name the name of the channel
 * @param  {next} next callback function that will be called with subscription payload data
 * @param  {function} [error] optional function to handle errors
 * @returns {Observable} an observable subscription object
 */
export function subscribe(name: string, next: (data: unknown, provider?: unknown, value?: unknown) => void, error) {
    if (!gotConfigured) {
        throw new Error('Subscribing without configuration. Please call "configure" first')
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return API.graphql(graphqlOperation(subscribeDoc, { name: PREFIX + name })).subscribe({
        next: ({ provider, value }) => {
            next(value.data.subscribe, provider, value);
        },
        error: error || console.log,
    });
}

/**
 * Has to be called before calling publish or subscribe
 */
export function configure(config: {
    aws_appsync_graphqlEndpoint: string,
    aws_appsync_region: string,
    aws_appsync_authenticationType: string,
    aws_appsync_apiKey: string,
}, prefix?:string) {
    API.configure(config);
    if (prefix) {
        PREFIX = prefix;
    }
    gotConfigured = true;
}

export abstract class PubSub {
    static publish = publish;
    static subscribe = subscribe;
    static configure = configure;
}
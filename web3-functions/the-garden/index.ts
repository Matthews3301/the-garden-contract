import {
  Web3Function,
  Web3FunctionEventContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Interface } from "@ethersproject/abi";
import ky from "ky";
import CryptoJS from "crypto-js";

const THE_GARDEN_ABI = [
  "event IpfsHashAccepted(string ipfsHash, uint256 ipfsHashIndex, address acceptor)",
];

const processError = (message: string) => {
  console.error(message);
  return { canExec: false, message };
}

Web3Function.onRun(async (context: Web3FunctionEventContext) => {
  const { userArgs, secrets, log } = context;

  /* 
  * 1. GET EVENT DATA, INCLUDING IPFS HASH
  */

  const theGarden = new Interface(THE_GARDEN_ABI);
  const event = theGarden.parseLog(log);
  const { ipfsHash, ipfsHashIndex, acceptor } = event.args;

  if (!ipfsHash || ipfsHash === '') {
    return processError(`No IPFS hash available`);
  }

  /* 
  * 2. GET HASH CONTENT FROM IPFS
  */

  let hashContent: any;
  try {
    hashContent = await ky
        // .get(`https://ipfs.io/ipfs/${ipfsHash}`, { timeout: 5_000, retry: 0 })
      .get(`https://gateway.lighthouse.storage/ipfs/${ipfsHash}`, { timeout: 5_000, retry: 0 })
  } catch (error) {
    return processError(`Error retrieving IPFS content: ${error}`);
  }

  if (!hashContent) {
    return processError(`No hash content available`);
  }

  /* 
  * 3. GET X AUTH HEADERS
  */

  const endpointURL = `https://api.twitter.com/2/tweets`;
  const oauth_token = await secrets.get('OAUTH_TOKEN');
  const oauth_token_secret = await secrets.get('OAUTH_TOKEN_SECRET');
  const consumer_key = await secrets.get('CONSUMER_KEY');
  const consumer_secret = await secrets.get('CONSUMER_SECRET');

  if (!oauth_token || !oauth_token_secret || !consumer_key || !consumer_secret) {
    return processError(`Missing secrets`);
  }

  const generateOAuthSignature = (
    method: string,
    url: string,
    parameters: object,
    consumerSecret: string,
    tokenSecret = ''
  ) => {
    const parameterString = Object.keys(parameters)
        .sort()
        .map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
        .join('&');

    const baseString = [
        method.toUpperCase(),
        encodeURIComponent(url),
        encodeURIComponent(parameterString)
    ].join('&');

    const signingKey = encodeURIComponent(consumerSecret) + '&' + encodeURIComponent(tokenSecret);

    // const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
    const signature = CryptoJS.HmacSHA1(baseString, signingKey)
      .toString(CryptoJS.enc.Base64);

    return signature;
  }

  const parameters = {
    oauth_consumer_key: consumer_key,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_token: oauth_token,
    oauth_version: '1.0',
  };

  const parametersWithSignature = {
    ...parameters,
    oauth_signature: generateOAuthSignature(
      'POST',
      endpointURL,
      parameters,
      consumer_secret,
      oauth_token_secret
    )
  }
  const authHeader = 'OAuth ' + Object.keys(parametersWithSignature)
      .map((key: string) => `${encodeURIComponent(key)}="${encodeURIComponent(parametersWithSignature[key])}"`)
      .join(', ');


  /* 
  * 4. POST TO X
  */

  const data = {
    "text": hashContent
  };

  let xResponse;
  try {
    if (!userArgs.test) {
      xResponse = await ky
        .post(endpointURL, {
          timeout: 5_000,
          retry: 0,
          headers: {
            Authorization: authHeader,
            'user-agent': "v2CreateTweetJS",
            'content-type': "application/json",
            'accept': "application/json"
          },
          json: data
        })
        .json();

    }
  } catch (error) {
    return processError(`Error posting to X: ${error}`);
  }

  return {
    canExec: true,
    callData: [],
  };
});

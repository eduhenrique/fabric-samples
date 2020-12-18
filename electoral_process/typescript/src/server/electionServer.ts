var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Setting for Hyperledger Fabric
const { Wallets, FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// const ccpPath = path.resolve(__dirname, '..',  'connection-be1.json');
// const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// ccp.peers['peer0.be1.burakcan-network.com'].tlsCACerts.pem = fs.readFileSync(path.resolve(__dirname, '..', ccp.peers['peer0.be1.burakcan-network.com'].tlsCACerts.path), 'utf8');
// ccp.certificateAuthorities['ca.be1.burakcan-network.com'].tlsCACerts.pem = fs.readFileSync(path.resolve(__dirname, '..', ccp.certificateAuthorities['ca.be1.burakcan-network.com'].tlsCACerts.path), 'utf8');


// load the network configuration
console.log('before');
const ccpPath = path.resolve(__dirname, '..', '..', '..', '..','test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
console.log('I FORGET');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
console.log('THAT');


app.get('/api/queryAllElections', async function (req, res) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get('appUser');
        if (!userExists) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();        
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('electoral_process');

        const result = await contract.evaluateTransaction('queryAllElections');
        console.log(`Resultado RichQuery ALL Elections - ` +`${result.toString()}\n`);

        // Evaluate the specified transaction.
        // const result = await contract.evaluateTransaction('queryAllProducts');
        // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});

app.get('/api/queryAllPositionsByElection', async function (req, res) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet'); // the wallet path is only correct when this is runned at the same folder that the wallet.
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get('appUser');
        if (!userExists) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();        
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('electoral_process');

        const result = await contract.evaluateTransaction('queryAllPositionsByElection', 'ELECTION0');
        console.log(`Resultado RichQuery ALL Positions - ` +`${result.toString()}\n`);
        
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});

// app.post('/api/addproduct/', async function (req, res) {
//     try {

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.resolve(__dirname, '.', 'wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const userExists = await wallet.get('appUser');
//         if (!userExists) {
//             console.log('An identity for the user "appUser" does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             return;
//         }

//         // Create a new gateway for connecting to our peer node.
//         const gateway = new Gateway();
//         await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('channeldemo');

//         // Get the contract from the network.
//         const contract = network.getContract('becc');

//         // Submit the specified transaction.
//         await contract.submitTransaction('createProduct', req.body.productnumber, req.body.brand, req.body.price, req.body.count);
//         console.log('Transaction has been submitted');
//         res.send('Transaction has been submitted');

//         // Disconnect from the gateway.
//         await gateway.disconnect();

//     } catch (error) {
//         console.error(`Failed to submit transaction: ${error}`);
//         process.exit(1);
//     }
// })

// app.put('/api/changeprice/:product_number', async function (req, res) {
//     try {

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.resolve(__dirname, '.', 'wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         const userExists = await wallet.get('appUser');
//         if (!userExists) {
//             console.log('An identity for the user "appUser" does not exist in the wallet');
//             console.log('Run the registerUser.js application before retrying');
//             return;
//         }

//         // Create a new gateway for connecting to our peer node.
//         const gateway = new Gateway();
//         await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork('channeldemo');

//         // Get the contract from the network.
//         const contract = network.getContract('becc');

//         // Submit the specified transaction.
//         await contract.submitTransaction('changeProductPrice', req.params.product_number, req.body.price);
//         console.log('Transaction has been submitted');
//         res.send('Transaction has been submitted');

//         // Disconnect from the gateway.
//         await gateway.disconnect();

//     } catch (error) {
//         console.error(`Failed to submit transaction: ${error}`);
//         process.exit(1);
//     }	
// })

app.listen(8080, 'localhost');
console.log('Running on http://localhost:8080');

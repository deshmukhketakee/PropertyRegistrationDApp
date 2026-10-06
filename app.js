// ==========================================
// PROPERTY REGISTRATION DAPP
// ==========================================

// Your deployed smart contract on Sepolia
const CONTRACT_ADDRESS =
    "0xe034ACE489dA667d9E4Ac2997199F71e848cdf26";


// ==========================================
// CONTRACT ABI
// ==========================================

const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_propertyId",
                "type": "uint256"
            }
        ],
        "name": "approveTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_location",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "registerProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_propertyId",
                "type": "uint256"
            }
        ],
        "name": "rejectTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_propertyId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "requestTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "ownershipHistory",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "properties",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "location",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "exists",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },

    {
        "inputs": [],
        "name": "registrar",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },

    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "transferRequests",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "propertyId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "currentOwner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "exists",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "rejected",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let provider;
let signer;
let contract;
let currentAccount;


// ==========================================
// CONNECT WALLET
// ==========================================

document.getElementById("connectWallet").onclick =
    connectWallet;


async function connectWallet() {

    try {

        if (!window.ethereum) {

            alert("Please install MetaMask.");

            return;
        }

        // Create provider
        provider =
            new ethers.BrowserProvider(
                window.ethereum
            );

        // Request wallet connection
        await provider.send(
            "eth_requestAccounts",
            []
        );

        // Check current network
        let network =
            await provider.getNetwork();

        console.log(
            "Current Chain ID:",
            network.chainId.toString()
        );

        // Sepolia Chain ID = 11155111
        if (network.chainId !== 11155111n) {

            console.log(
                "Wrong network. Switching to Sepolia..."
            );

            try {

                await window.ethereum.request({

                    method:
                        "wallet_switchEthereumChain",

                    params: [
                        {
                            // Sepolia Chain ID
                            chainId: "0xaa36a7"
                        }
                    ]

                });

            } catch (switchError) {

                console.error(
                    "Network switch error:",
                    switchError
                );

                alert(
                    "Please switch MetaMask to Sepolia network."
                );

                return;
            }

            // Re-create provider after switching
            provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );

            // Check network again
            network =
                await provider.getNetwork();

            console.log(
                "New Chain ID:",
                network.chainId.toString()
            );
        }

        // Make sure we are actually on Sepolia
        if (network.chainId !== 11155111n) {

            alert(
                "Wrong network. Please select Sepolia."
            );

            return;
        }

        // Get signer
        signer =
            await provider.getSigner();

        // Get connected account
        currentAccount =
            await signer.getAddress();

        // Create contract connection
        contract =
            new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );

        // Show connected wallet
        document.getElementById(
            "walletAddress"
        ).innerText =
            "Connected: " + currentAccount;

        console.log(
            "Wallet connected:",
            currentAccount
        );

        console.log(
            "Connected to Sepolia"
        );

        console.log(
            "Contract:",
            CONTRACT_ADDRESS
        );

    } catch (error) {

        console.error(error);

        alert(
            "Wallet connection failed: " +
            error.message
        );
    }
}


// ==========================================
// REGISTER PROPERTY
// ==========================================

document.getElementById("registerProperty").onclick =
    registerProperty;


async function registerProperty() {

    try {

        if (!contract) {

            alert("Connect wallet first.");

            return;
        }

        // Check network before transaction
        const network =
            await provider.getNetwork();

        if (network.chainId !== 11155111n) {

            alert(
                "Please switch MetaMask to Sepolia."
            );

            return;
        }

        const id =
            document.getElementById(
                "propertyId"
            ).value;

        const location =
            document.getElementById(
                "location"
            ).value;

        const owner =
            document.getElementById(
                "ownerAddress"
            ).value;

        // Basic validation
        if (!id || !location || !owner) {

            alert(
                "Please fill all property details."
            );

            return;
        }

        const tx =
            await contract.registerProperty(
                id,
                location,
                owner
            );

        document.getElementById(
            "registerStatus"
        ).innerText =
            "Transaction sent. Waiting for confirmation...";

        console.log(
            "Transaction hash:",
            tx.hash
        );

        await tx.wait();

        document.getElementById(
            "registerStatus"
        ).innerText =
            "Property registered successfully!";

        console.log(
            "Property registered successfully."
        );

    } catch (error) {

        console.error(error);

        document.getElementById(
            "registerStatus"
        ).innerText =
            "Error: " + error.message;
    }
}


// ==========================================
// VIEW PROPERTY
// ==========================================

document.getElementById("viewProperty").onclick =
    viewProperty;


async function viewProperty() {

    try {

        if (!contract) {

            alert("Connect wallet first.");

            return;
        }

        const id =
            document.getElementById(
                "viewPropertyId"
            ).value;

        const property =
            await contract.properties(id);

        // Check whether property exists
        if (!property[3]) {

            document.getElementById(
                "propertyResult"
            ).innerText =
                "Property not found.";

            return;
        }

        document.getElementById(
            "propertyResult"
        ).innerHTML = `

            <strong>Property ID:</strong>
            ${property[0]}
            <br>

            <strong>Location:</strong>
            ${property[1]}
            <br>

            <strong>Owner:</strong>
            ${property[2]}
            <br>

            <strong>Exists:</strong>
            ${property[3]}

        `;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "propertyResult"
        ).innerText =
            "Property not found.";
    }
}


// ==========================================
// REQUEST TRANSFER
// ==========================================

document.getElementById("requestTransfer").onclick =
    requestTransfer;


async function requestTransfer() {

    try {

        if (!contract) {

            alert("Connect wallet first.");

            return;
        }

        const network =
            await provider.getNetwork();

        if (network.chainId !== 11155111n) {

            alert(
                "Please switch MetaMask to Sepolia."
            );

            return;
        }

        const id =
            document.getElementById(
                "transferPropertyId"
            ).value;

        const newOwner =
            document.getElementById(
                "newOwner"
            ).value;

        const tx =
            await contract.requestTransfer(
                id,
                newOwner
            );

        document.getElementById(
            "transferStatus"
        ).innerText =
            "Transfer request sent...";

        await tx.wait();

        document.getElementById(
            "transferStatus"
        ).innerText =
            "Transfer request submitted successfully!";

    } catch (error) {

        console.error(error);

        document.getElementById(
            "transferStatus"
        ).innerText =
            "Error: " + error.message;
    }
}


// ==========================================
// APPROVE TRANSFER
// ==========================================

document.getElementById("approveTransfer").onclick =
    approveTransfer;


async function approveTransfer() {

    try {

        if (!contract) {

            alert("Connect wallet first.");

            return;
        }

        const network =
            await provider.getNetwork();

        if (network.chainId !== 11155111n) {

            alert(
                "Please switch MetaMask to Sepolia."
            );

            return;
        }

        const id =
            document.getElementById(
                "approvePropertyId"
            ).value;

        const tx =
            await contract.approveTransfer(id);

        document.getElementById(
            "approveStatus"
        ).innerText =
            "Approval transaction sent...";

        await tx.wait();

        document.getElementById(
            "approveStatus"
        ).innerText =
            "Transfer approved successfully!";

    } catch (error) {

        console.error(error);

        document.getElementById(
            "approveStatus"
        ).innerText =
            "Error: " + error.message;
    }
}


// ==========================================
// REJECT TRANSFER
// ==========================================

document.getElementById("rejectTransfer").onclick =
    rejectTransfer;


async function rejectTransfer() {

    try {

        if (!contract) {

            alert("Connect wallet first.");

            return;
        }

        const network =
            await provider.getNetwork();

        if (network.chainId !== 11155111n) {

            alert(
                "Please switch MetaMask to Sepolia."
            );

            return;
        }

        const id =
            document.getElementById(
                "rejectPropertyId"
            ).value;

        const tx =
            await contract.rejectTransfer(id);

        document.getElementById(
            "rejectStatus"
        ).innerText =
            "Rejection transaction sent...";

        await tx.wait();

        document.getElementById(
            "rejectStatus"
        ).innerText =
            "Transfer rejected successfully!";

    } catch (error) {

        console.error(error);

        document.getElementById(
            "rejectStatus"
        ).innerText =
            "Error: " + error.message;
    }
}


// ==========================================
// OWNERSHIP HISTORY
// ==========================================

document.getElementById("viewHistory").onclick =
    viewHistory;


async function viewHistory() {

    try {

        if (!contract) {

            alert("Connect wallet first.");

            return;
        }

        const propertyId =
            document.getElementById(
                "historyPropertyId"
            ).value;

        const index =
            document.getElementById(
                "historyIndex"
            ).value;

        const history =
            await contract.ownershipHistory(
                propertyId,
                index
            );

        const date =
            new Date(
                Number(history[1]) * 1000
            );

        document.getElementById(
            "historyResult"
        ).innerHTML = `

            <strong>Owner:</strong>
            ${history[0]}
            <br>

            <strong>Timestamp:</strong>
            ${history[1]}
            <br>

            <strong>Date:</strong>
            ${date.toLocaleString()}

        `;

    } catch (error) {

        console.error(error);

        document.getElementById(
            "historyResult"
        ).innerText =
            "No ownership history found.";
    }
}
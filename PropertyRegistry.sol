// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyRegistry {

    // ---------------- PROPERTY ----------------

    struct Property {
        uint256 id;
        string location;
        address owner;
        bool exists;
    }

    mapping(uint256 => Property) public properties;


    // ---------------- OWNERSHIP HISTORY ----------------

    struct OwnershipRecord {
        address owner;
        uint256 timestamp;
    }

    mapping(uint256 => OwnershipRecord[]) public ownershipHistory;


    // ---------------- TRANSFER REQUEST ----------------

    struct TransferRequest {
        uint256 propertyId;
        address currentOwner;
        address newOwner;
        bool exists;
        bool approved;
        bool rejected;
    }

    mapping(uint256 => TransferRequest) public transferRequests;


    // ---------------- REGISTRAR ----------------

    address public registrar;


    // ---------------- EVENTS ----------------

    event PropertyRegistered(
        uint256 propertyId,
        address owner,
        string location
    );

    event TransferRequested(
        uint256 propertyId,
        address currentOwner,
        address newOwner
    );

    event TransferApproved(
        uint256 propertyId,
        address oldOwner,
        address newOwner
    );

    event TransferRejected(
        uint256 propertyId,
        address currentOwner,
        address newOwner
    );


    // ---------------- CONSTRUCTOR ----------------

    constructor() {
        registrar = msg.sender;
    }


    // ---------------- REGISTER PROPERTY ----------------

    function registerProperty(
        uint256 _id,
        string memory _location,
        address _owner
    ) public {

        require(
            msg.sender == registrar,
            "Only registrar can register"
        );

        require(
            !properties[_id].exists,
            "Property already exists"
        );

        properties[_id] = Property(
            _id,
            _location,
            _owner,
            true
        );

        ownershipHistory[_id].push(
            OwnershipRecord(
                _owner,
                block.timestamp
            )
        );

        emit PropertyRegistered(
            _id,
            _owner,
            _location
        );
    }


    // ---------------- REQUEST TRANSFER ----------------

    function requestTransfer(
        uint256 _propertyId,
        address _newOwner
    ) public {

        require(
            properties[_propertyId].exists,
            "Property does not exist"
        );

        require(
            msg.sender == properties[_propertyId].owner,
            "Only current owner can request transfer"
        );

        require(
            _newOwner != address(0),
            "Invalid new owner"
        );

        transferRequests[_propertyId] = TransferRequest(
            _propertyId,
            msg.sender,
            _newOwner,
            true,
            false,
            false
        );

        emit TransferRequested(
            _propertyId,
            msg.sender,
            _newOwner
        );
    }


    // ---------------- APPROVE TRANSFER ----------------

    function approveTransfer(
        uint256 _propertyId
    ) public {

        require(
            msg.sender == registrar,
            "Only registrar can approve"
        );

        require(
            transferRequests[_propertyId].exists,
            "No transfer request"
        );

        require(
            !transferRequests[_propertyId].approved,
            "Transfer already approved"
        );

        require(
            !transferRequests[_propertyId].rejected,
            "Transfer already rejected"
        );

        address oldOwner = properties[_propertyId].owner;
        address newOwner = transferRequests[_propertyId].newOwner;

        // Change current owner
        properties[_propertyId].owner = newOwner;

        // Add new owner to ownership history
        ownershipHistory[_propertyId].push(
            OwnershipRecord(
                newOwner,
                block.timestamp
            )
        );

        transferRequests[_propertyId].approved = true;

        emit TransferApproved(
            _propertyId,
            oldOwner,
            newOwner
        );
    }


    // ---------------- REJECT TRANSFER ----------------

    function rejectTransfer(
        uint256 _propertyId
    ) public {

        require(
            msg.sender == registrar,
            "Only registrar can reject"
        );

        require(
            transferRequests[_propertyId].exists,
            "No transfer request"
        );

        require(
            !transferRequests[_propertyId].approved,
            "Transfer already approved"
        );

        require(
            !transferRequests[_propertyId].rejected,
            "Transfer already rejected"
        );

        transferRequests[_propertyId].rejected = true;

        emit TransferRejected(
            _propertyId,
            transferRequests[_propertyId].currentOwner,
            transferRequests[_propertyId].newOwner
        );
    }
}
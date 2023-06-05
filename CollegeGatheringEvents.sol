// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract CollegeGatheringEvents {
    struct Gathering {
        address organizer;
        string name;
        uint date;
        uint price;
        uint ticketCount;
        uint ticketRemain;
    }

    mapping(uint => Gathering) public gathering;
    mapping(address => mapping(uint => uint)) public tickets; // holding tickets
    uint public studentId;

    function createEvent(
        string memory name,
        uint date,
        uint price,
        uint ticketCount
    ) external {
        require(date > block.timestamp, "gathering already happened");
        require(ticketCount > 0, "ticket not available right now");

        gathering[studentId] = Gathering(
            msg.sender,
            name,
            date,
            price,
            ticketCount,
            ticketCount
        );
        studentId++;
    }

    function BuyTicket(uint id, uint quantity) public payable {
        require(gathering[id].date != 0, "gathering does not exist");
        require(gathering[id].date > block.timestamp, "gathering is over");
        Gathering storage _gathering = gathering[id];
        require(
            msg.value == (_gathering.price * quantity),
            "ether not enough to buy tickets"
        );
        require(_gathering.ticketRemain >= quantity, "tickets not available");
        _gathering.ticketRemain -= quantity;
        tickets[msg.sender][id] += quantity;
    }

    function transferTicket(
        uint256 eventId,
        uint256 quantity,
        address recipient
    ) public {
        require(
            tickets[msg.sender][eventId] >= quantity,
            "Sender does not have enough tickets"
        );

        tickets[msg.sender][eventId] -= quantity;
        tickets[recipient][eventId] += quantity;
    }
}

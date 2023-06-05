const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CollegeGatheringEvents", function () {
  let contract;
  let owner;
  let user;

  beforeEach(async function () {
    const CollegeGatheringEvents = await ethers.getContractFactory(
      "CollegeGatheringEvents"
    );
    contract = await CollegeGatheringEvents.deploy();
    await contract.deployed();

    [owner, user] = await ethers.getSigners();
  });

  it("should create an event", async function () {
    const eventName = "Event 1";
    const eventDate = Math.floor(Date.now() / 1000) + 3600;
    const eventPrice = 100;
    const eventTicketCount = 10;

    await contract.createEvent(
      eventName,
      eventDate,
      eventPrice,
      eventTicketCount
    );

    const event = await contract.gathering(0);
    expect(event.organizer).to.equal(owner.address);
    expect(event.name).to.equal(eventName);
    expect(event.date).to.equal(eventDate);
    expect(event.price).to.equal(eventPrice);
    expect(event.ticketCount).to.equal(eventTicketCount);
    expect(event.ticketRemain).to.equal(eventTicketCount);
  });

  it("should allow user to buy tickets", async () => {
    const eventName = "Event 1";
    const eventDate = Math.floor(Date.now() / 1000) + 3600;
    const eventPrice = 100;
    const eventTicketCount = 10;

    await contract.createEvent(
      eventName,
      eventDate,
      eventPrice,
      eventTicketCount
    );

    const ticketQuantity = 2;
    const paymentAmount = eventPrice * ticketQuantity;

    await contract.connect(user).BuyTicket(0, ticketQuantity, {
      value: paymentAmount,
    });

    const tickets = await contract.tickets(user.address, 0);
    const gathering = await contract.gathering(0);

    expect(tickets).to.equal(ticketQuantity);
    expect(gathering.ticketRemain).to.equal(eventTicketCount - ticketQuantity);
  });

  it("should allow transfer of tickets between users", async function () {
    const eventName = "Event 1";
    const eventDate = Math.floor(Date.now() / 1000) + 3600;
    const eventPrice = 100;
    const eventTicketCount = 10;

    await contract.createEvent(
      eventName,
      eventDate,
      eventPrice,
      eventTicketCount
    );

    const ticketQuantity = 1;
    const paymentAmount = eventPrice * ticketQuantity;

    await contract.connect(user).BuyTicket(0, ticketQuantity, {
      value: paymentAmount,
    });

    const userTicketsBeforeTransfer = await contract.tickets(user.address, 0);
    const ownerTicketsBeforeTransfer = await contract.tickets(owner.address, 0);

    expect(userTicketsBeforeTransfer).to.equal(ticketQuantity);
    expect(ownerTicketsBeforeTransfer).to.equal(0);

    await contract
      .connect(user)
      .transferTicket(0, ticketQuantity, owner.address);

    const userTicketsAfterTransfer = await contract.tickets(user.address, 0);
    const ownerTicketsAfterTransfer = await contract.tickets(owner.address, 0);

    expect(userTicketsAfterTransfer).to.equal(0);
    expect(ownerTicketsAfterTransfer).to.equal(ticketQuantity);
  });
});

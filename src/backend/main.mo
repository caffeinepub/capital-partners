import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Int "mo:core/Int";

actor {
  type MessageId = Nat;

  type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  var nextId : MessageId = 0;
  let messages = Map.empty<MessageId, ContactMessage>();

  module ContactMessage {
    public func compare(message1 : ContactMessage, message2 : ContactMessage) : Order.Order {
      Int.compare(message1.timestamp, message2.timestamp);
    };
  };

  public shared ({ caller }) func submitContactMessage(name : Text, email : Text, message : Text) : async () {
    let contactMessage : ContactMessage = {
      name;
      email;
      message;
      timestamp = Time.now();
    };

    messages.add(nextId, contactMessage);
    nextId += 1;
  };

  public query ({ caller }) func getAllMessages() : async [ContactMessage] {
    let messageArray = messages.values().toArray();
    if (messageArray.isEmpty()) { Runtime.trap("No messages found.") };

    messageArray.sort();
  };
};

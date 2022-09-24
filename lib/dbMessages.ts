import { faL } from '@fortawesome/free-solid-svg-icons';
import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import { IDbUser } from './user';

export interface IMessage {
  _id?: string;
  channelID: string;
  userID: string;
  message: string;
  date: number;
}
// add new message
const addMessage: (
  channelID: string,
  userID: string,
  message: string
) => Promise<boolean> = async (channelID, userID, message) => {
  try {
    const newMessage: IMessage = {
      channelID,
      userID,
      message,
      date: Date.now(),
    };
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('messages');
    await collection.insertOne(newMessage);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

// get all messages by channelID
const getChannelMessages: (
  channelID: string
) => Promise<{ messages: IMessage[]; users: IDbUser[] }> = async (
  channelID
) => {
  try {
    const _channelID = new ObjectId(channelID);
    const client = await clientPromise;
    const db = client.db('messenger');
    const mesColl = db.collection('messages');
    const resArr = await mesColl
      .find({ channelID: channelID })
      .sort({ date: 1 })
      .toArray();
    const userIDS = new Set();
    resArr.forEach((message: IMessage) => userIDS.add(message.userID));
    const userColl = db.collection('users');
    const foundusers = await userColl
      .find({
        _id: { $in: Array.from(userIDS) },
      })
      .project({ email: 0, familyName: 0 })
      .toArray();
    return { messages: resArr, users: foundusers };
  } catch (error) {
    return { messages: [], users: [] };
  }
};

// get all messages by channelID and date
const getChannelMessagesByDate: (
  channelID: string,
  date: number
) => Promise<{ messages: IMessage[]; users: IDbUser[] }> = async (
  channelID,
  date
) => {
  try {
    const _channelID = new ObjectId(channelID);
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('messages');
    const resArr = await collection
      .find({ channelID: channelID, date: { $gte: date } })
      .sort({ date: 1 })
      .toArray();
    const userIDS = new Set();
    resArr.forEach((message: IMessage) => userIDS.add(message.userID));
    const userColl = db.collection('users');
    const foundusers = await userColl
      .find({
        _id: { $in: Array.from(userIDS) },
      })
      .project({ email: 0, familyName: 0 })
      .toArray();
    return { messages: resArr, users: foundusers };
  } catch (error) {
    console.log(error);
  }
  return { messages: [], users: [] };
};

// delete all channel messages by channelID and adminID
const deleteChannelMessages: (
  channelID: string,
  adminID: string
) => Promise<boolean> = async (channelID, adminID) => {
  try {
    const client = await clientPromise;
    const db = client.db('messenger');
    const messageCollection = db.collection('messages');
    // get channel data
    const channelCollection = db.collection('channels');
    const foundChannel = await channelCollection.findOne({
      _id: new ObjectId(channelID),
      adminID: new ObjectId(adminID),
    });
    if (foundChannel && foundChannel._id) {
      const result = await messageCollection.delete({ channelID });
      return result.deletedCount > 0 ? true : false;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// delete all channel messages by channelID and adminID
const deleteMessage: (
  channelID: string,
  messageID: string,
  userID: string
) => Promise<boolean> = async (channelID, messageID, userID) => {
  try {
    const client = await clientPromise;
    const db = client.db('messenger');
    const messageCollection = db.collection('messages');
    // get channel data
    const channelCollection = db.collection('channels');
    const foundChannel = await channelCollection.findOne({
      _id: new ObjectId(channelID),
      adminID: new ObjectId(userID),
    });
    if (foundChannel && foundChannel._id) {
      const result = await messageCollection.deleteOne({
        _id: new ObjectId(messageID),
      });
      return result.deletedCount > 0 ? true : false;
    } else {
      const result = await messageCollection.deleteOne({
        _id: new ObjectId(messageID),
        userID: new ObjectId(userID),
      });
      return result.deletedCount > 0 ? true : false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  addMessage,
  getChannelMessages,
  getChannelMessagesByDate,
  deleteChannelMessages,
  deleteMessage,
};

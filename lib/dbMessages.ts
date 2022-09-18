import { faSort } from '@fortawesome/free-solid-svg-icons';
import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

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
const getChannelMessages: (channelID: string) => Promise<IMessage[]> = async (
  channelID
) => {
  try {
    const _channelID = new ObjectId(channelID);
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('messages');
    const resArr = await collection
      .find({ channelID: _channelID })
      .sort({ date: 1 })
      .toArray();
    return resArr;
  } catch (error) {
    console.log(error);
  }
  return [];
};

// get all messages by channelID and date
const getChannelMessagesByDate: (
  channelID: string,
  date: number
) => Promise<IMessage[]> = async (channelID, date) => {
  try {
    const _channelID = new ObjectId(channelID);
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('messages');
    const resArr = await collection
      .find({ channelID: _channelID, date: { $gte: date } })
      .sort({ date: 1 })
      .toArray();
    return resArr;
  } catch (error) {
    console.log(error);
  }
  return [];
};

export { addMessage, getChannelMessages, getChannelMessagesByDate };

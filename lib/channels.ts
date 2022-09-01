import clientPromise from './mongodb';
import { ObjectID } from 'bson';

export interface IChannel {
  name: string;
  description?: string;
  public: boolean;
  adminID: string;
  users?: string[];
}
// create new channel for the user
const createChannel: (channel: IChannel) => Promise<boolean> = async (
  channel
) => {
  try {
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    await collection.insertOne(channel);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

// get own channels, where user is admin
const getOwnChannels: (adminID: string) => Promise<IChannel[]> = async (
  adminID
) => {
  try {
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    const resArr = await collection.find({ adminID }).toArray();
    return resArr;
  } catch (error) {
    console.log(error);
  }
  return [];
};

// get channels, where user is usual user
const getSubscribedChannels: (userID: string) => Promise<IChannel[]> = async (
  userID
) => {
  try {
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    const resArr = await collection.find({ users: userID }).toArray();
    return resArr;
  } catch (error) {
    console.log(error);
  }
  return [];
};

// delete channel by channelID and adminID
const deleteChannel: (
  channelID: string,
  adminID: string
) => Promise<boolean> = async (channelID, adminID) => {
  try {
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    await collection.deleteOne({ _id: channelID, adminID });
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

export { createChannel, getOwnChannels, getSubscribedChannels, deleteChannel };

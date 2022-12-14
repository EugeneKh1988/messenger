import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export interface IChannel {
  name: string;
  description?: string;
  ispublic: boolean;
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

// get channels, where user is a usual user
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
    const result = await collection.deleteOne({ _id: channelID, adminID });
    return result.deletedCount > 0 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// add user to a channel
const addUserToChannel: (
  channelID: string,
  userID: string
) => Promise<boolean> = async (channelID, userID) => {
  try {
    const _userID = new ObjectId(userID);
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    const foundChannel = await collection.findOne({
      _id: new ObjectId(channelID),
      users: { $nin: [userID] },
    });
    //console.log(new ObjectId(foundChannel?.adminID).equals(_userID));
    if (
      !foundChannel ||
      foundChannel?.ispublic === false ||
      new ObjectId(foundChannel?.adminID).equals(_userID)
    ) {
      return false;
    }
    await collection.updateOne(
      { _id: foundChannel._id },
      { $push: { users: _userID } }
    );
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

// get users from the channel
const getChannelUsers: (
  channelID: string,
  userID: string,
  page: number
) => Promise<string[]> = async (channelID, userID, page) => {
  try {
    const _userID = new ObjectId(userID);
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    const foundChannel = await collection
      .find({
        _id: new ObjectId(channelID),
        $or: [{ users: _userID }, { adminID: _userID }],
      })
      .project({ users: { $slice: [(page - 1) * 100, 100] } });
    let res: any = null;
    await foundChannel.forEach((elem: any) => (res = elem));

    if (!res || !res?.users) {
      return [];
    }
    return res.users;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// delete a user from the channel by itself
const deleteChannelUser: (
  channelID: string,
  userID: string
) => Promise<boolean> = async (channelID, userID) => {
  try {
    const _userID = new ObjectId(userID);
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    await collection.updateOne(
      { _id: new ObjectId(channelID) },
      { $pull: { users: _userID } }
    );
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

// delete a user from the channel by admin
const deleteChannelUserByAdmin: (
  channelID: string,
  userID: string,
  adminID: string
) => Promise<boolean> = async (channelID, userID, adminID) => {
  try {
    const _userID = new ObjectId(userID);
    const _adminID = new ObjectId(adminID);
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    await collection.updateOne(
      { _id: new ObjectId(channelID), adminID: _adminID },
      { $pull: { users: _userID } }
    );
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

// get channels by name
const getChannelsByName: (
  name: string,
  page: number
) => Promise<IChannel[]> = async (name, page) => {
  try {
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('channels');
    const foundChannels = await collection
      .find({
        name: { $regex: name, $options: 'i' },
      })
      .project({ users: 0, adminID: 0 })
      .skip((page - 1) * 100)
      .limit(100)
      .toArray();
    if (!foundChannels || foundChannels?.length === 0) {
      return [];
    }
    return foundChannels;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export {
  createChannel,
  getOwnChannels,
  getSubscribedChannels,
  deleteChannel,
  addUserToChannel,
  getChannelUsers,
  deleteChannelUser,
  deleteChannelUserByAdmin,
  getChannelsByName,
};

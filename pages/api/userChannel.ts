import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addUserToChannel,
  getChannelUsers,
  deleteChannelUser,
  deleteChannelUserByAdmin,
} from '../../lib/dbChannels';
import { getUsersByID } from '../../lib/user';
import { getUserID } from '../../lib/user';

const userChannel: (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session && session.user) {
    // add user to the channel
    if (req.method === 'POST') {
      const { channelID } = req.body;
      const userID = await getUserID(session.user.email || '');
      if (userID) {
        const addToChannel = await addUserToChannel(channelID, userID);
        return res.json({ status: addToChannel });
      }
      return res.json({ status: false });
    }
    // get users from the channel
    if (req.method === 'GET') {
      const userID = await getUserID(session.user.email || '');
      const { page, channelID } = req.query;
      if (
        userID &&
        page &&
        channelID &&
        !Array.isArray(channelID) &&
        !Array.isArray(page)
      ) {
        const users =
          parseInt(page) > 0
            ? await getChannelUsers(channelID, userID, parseInt(page))
            : [];
        const usersData = await getUsersByID(users);
        return res.json({ users: usersData });
      }
      return res.json({ users: [] });
    }
    // delete user from the channel
    if (req.method === 'DELETE') {
      const { channelID, outerUserID } = req.body;
      const userID = await getUserID(session.user.email || '');
      // if user want to delete itself
      if (channelID && userID && !Array.isArray(channelID) && !outerUserID) {
        const status = await deleteChannelUser(channelID, userID);
        return res.json({ status });
      }
      // if admin want to delete other user
      if (
        channelID &&
        userID &&
        !Array.isArray(channelID) &&
        outerUserID &&
        !Array.isArray(outerUserID)
      ) {
        const status = await deleteChannelUserByAdmin(
          channelID,
          outerUserID,
          userID
        );
        return res.json({ status });
      }
      return res.json({ status: false });
    }
  }
  return res.json({ status: false });
};

export default userChannel;

import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addMessage,
  deleteChannelMessages,
  deleteMessage,
  getChannelMessages,
  getChannelMessagesByDate,
  IMessage,
} from '../../lib/dbMessages';
import { getUserID, IDbUser } from '../../lib/user';

const messages: (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session && session.user) {
    // add message
    if (req.method === 'POST') {
      const { channelID, message } = req.body;
      const userID = await getUserID(session.user.email || '');
      if (userID) {
        const created = await addMessage(channelID, userID, message);
        return res.json({ status: created });
      }
      return res.json({ status: false });
    }
    // get messages
    if (req.method === 'GET') {
      const userID = await getUserID(session.user.email || '');
      // get channelID and date
      const { channelID, date } = req.query;
      if (
        userID &&
        channelID &&
        !date &&
        !Array.isArray(channelID) &&
        !Array.isArray(date)
      ) {
        // get all messages by channelID
        const channelMessages: { messages: IMessage[]; users: IDbUser[] } =
          await getChannelMessages(channelID);
        return res.json({
          messages: channelMessages.messages,
          users: channelMessages.users,
        });
      } else if (
        userID &&
        channelID &&
        date &&
        !Array.isArray(channelID) &&
        !Array.isArray(date)
      ) {
        // get all messages of channel those created after some date
        const channelMessages = await getChannelMessagesByDate(
          channelID,
          parseInt(date) || 1
        );
        return res.json({ messages: channelMessages });
      }
      return res.json({ messages: [] });
    }
    // delete message
    if (req.method === 'DELETE') {
      const { channelID, messageID } = req.body;
      const userID = await getUserID(session.user.email || '');
      if (channelID && userID && !messageID) {
        // delete all messages by channelID
        const status = await deleteChannelMessages(channelID, userID);
        return res.json({ status });
      } else if (channelID && userID && messageID) {
        // delete message by messageID
        const status = await deleteMessage(channelID, messageID, userID);
        return res.json({ status });
      }
      return res.json({ status: false });
    }
  }
  return res.json({ status: false });
};

export default messages;

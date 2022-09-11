import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  createChannel,
  IChannel,
  getOwnChannels,
  getSubscribedChannels,
  deleteChannel,
  getChannelsByName,
} from '../../lib/dbChannels';
import { getUserID } from '../../lib/user';

interface IUser {
  email: string;
  image: string;
  name: string;
}

const channel: (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session && session.user) {
    // create channel
    if (req.method === 'POST') {
      const { name, description, ispublic } = req.body;
      const userID = await getUserID(session.user.email || '');
      if (userID) {
        const channelData: IChannel = {
          name,
          description,
          ispublic,
          adminID: userID,
        };
        const created = await createChannel(channelData);
        return res.json({ status: created });
      }
      return res.json({ status: false });
    }
    // get channels
    if (req.method === 'GET') {
      const userID = await getUserID(session.user.email || '');
      // get name of channel and page
      const { name, page } = req.query;
      if (
        userID &&
        name &&
        page &&
        !Array.isArray(name) &&
        !Array.isArray(page)
      ) {
        // get channels by name and page
        const channels =
          parseInt(page) > 0
            ? await getChannelsByName(name, parseInt(page))
            : [];
        return res.json({ channels });
      } else if (userID) {
        // get channels by user
        const own = await getOwnChannels(userID);
        const sub = await getSubscribedChannels(userID);
        return res.json({ own, sub });
      }
      return res.json({ own: [], sub: [] });
    }
    // delete channel
    if (req.method === 'DELETE') {
      const { channelID } = req.body;
      const userID = await getUserID(session.user.email || '');
      if (channelID && userID) {
        const status = await deleteChannel(channelID, userID);
        return res.json({ status });
      }
      return res.json({ status: false });
    }
  }
  return res.json({ status: false });
};

export default channel;

import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';

interface IUser {
  email: string;
  image: string;
  name: string;
}

export type userType = { user: IUser } | { user: boolean };
const getUser: (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session && session.user) {
    return res.json({ user: session.user });
  }
  return res.json({ user: false });
};

export default getUser;

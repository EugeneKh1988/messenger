import clientPromise from './mongodb';

export interface IDbUser {
  name: string;
  familyName: string;
  email: string;
  photo: string;
}
const createUser: (user: IDbUser) => Promise<boolean> = async (user) => {
  try {
    const client = await clientPromise;
    const db = client.db('messenger');
    const collection = db.collection('users');
    const foundUser = await collection.findOne({ email: user.email });
    if (!foundUser) {
      await collection.insertOne(user);
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

export { createUser };

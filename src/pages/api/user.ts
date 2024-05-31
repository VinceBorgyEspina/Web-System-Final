import { NextApiRequest, NextApiResponse } from 'next';

let userData = {
  id: 1,
  name: 'Vince Borgy E. Espina',
  email: 'vinceborgy@gmail.com',
  bio: '3rd Year Computer Science Student, web developer',
  desc: [
    {
      title: "My Description",
      content: "This is my post"
    },
    {
      title: "My 2nd Description",
      content: "This is my second post"
    }
  ]
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(userData);
  } else if (req.method === 'PUT') {
    const { id, name, email, bio, desc } = req.body;
    if (!id || !name || !email || !bio || !desc) {
      res.status(400).json({ error: "Missing required fields" });
    } else {
      userData = { id, name, email, bio, desc };
      res.status(200).json(userData);
    }
  } else if (req.method === 'DESC ') {
    const { name, email, bio, desc } = req.body;
    if (!name || !email || !bio || !desc) {
      res.status(400).json({ error: "Missing required fields" });
    } else {
      const id = userData.id + 1;
      userData = { id, name, email, bio, desc };
      res.status(201).json(userData);
    }
  } else if (req.method === 'DELETE') {
    userData = {
      id: 1,
      name: '',
      email: '',
      bio: '',
      desc: []
    };
    res.status(200).end('User data deleted successfully');
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

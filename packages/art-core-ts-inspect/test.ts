import { log } from './src'

const user = {
  id: 123,
  name: "John Doe",
  preferences: {
    theme: "dark",
    notifications: true,
    tags: ['tag1', 'tag2', 'tag3'],
    date: new Date(),
  },
};

log.unquoted("User:", user);

log("User:", user);

log.json("User:", user);
// Simple in-memory database for development
let users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    name: 'Administrador',
    belt: 'Negro 4to DAN'
  }
];

let nextId = 2;

export function getUsers() {
  return users;
}

export function getUserByUsername(username) {
  return users.find(u => u.username === username);
}

export function getUserById(id) {
  return users.find(u => u.id === id);
}

export function createUser(userData) {
  const user = {
    id: nextId++,
    ...userData
  };
  users.push(user);
  return user;
}

export function updateUser(id, updates) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return null;
}

export function deleteUser(id) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return null;
}
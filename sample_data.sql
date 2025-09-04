-- Sample data untuk testing aplikasi realtime chat

-- Insert sample users
INSERT INTO users (id, username, email, createdAt, updatedAt) VALUES
('user1', 'john_doe', 'john@example.com', NOW(), NOW()),
('user2', 'jane_smith', 'jane@example.com', NOW(), NOW()),
('user3', 'bob_wilson', 'bob@example.com', NOW(), NOW());

-- Insert sample rooms
INSERT INTO rooms (id, name, createdAt, updatedAt) VALUES
('room1', 'General Chat', NOW(), NOW()),
('room2', 'Tech Discussion', NOW(), NOW()),
('room3', 'Random', NOW(), NOW());

-- Insert room members
INSERT INTO room_members (id, userId, roomId, joinedAt) VALUES
('member1', 'user1', 'room1', NOW()),
('member2', 'user2', 'room1', NOW()),
('member3', 'user3', 'room1', NOW()),
('member4', 'user1', 'room2', NOW()),
('member5', 'user2', 'room2', NOW());

-- Insert sample messages
INSERT INTO messages (id, content, userId, roomId, createdAt) VALUES
('msg1', 'Hello everyone! Welcome to the chat.', 'user1', 'room1', NOW()),
('msg2', 'Hi John! Thanks for setting this up.', 'user2', 'room1', NOW()),
('msg3', 'Great to be here!', 'user3', 'room1', NOW()),
('msg4', 'Anyone working on interesting projects?', 'user1', 'room2', NOW()),
('msg5', 'I am building a realtime chat app with Next.js!', 'user2', 'room2', NOW());

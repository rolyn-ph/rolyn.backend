// __tests__/User.test.js

// User.test.js

// __tests__/User.test.js
const { createUser } = require('../models/User');
const { createClient } = require('@supabase/supabase-js');

// Mock the Supabase client directly
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      from: jest.fn(() => ({
        insert: jest.fn().mockResolvedValue({
          data: [{ id: '1', username: 'testuser', email: 'test@example.com' }],
          error: null,
        }),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      })),
    })),
  };
});

describe('createUser', () => {
  it('should create a new user and return user data', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      role: 'job_seeker',
    };

    const user = await createUser(userData);

    expect(user).toHaveLength(1);
    expect(user[0].username).toBe('testuser');
  });
});



/*
const { createUser } = require('../models/User');
const supabase = require('@supabase/supabase-js');

jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            from: jest.fn(() => ({
                select: jest.fn(() => ({
                    eq: jest.fn().mockReturnThis(),
                    single: jest.fn().mockResolvedValue({
                        data: null,
                        error: null
                    })
                })),
                insert: jest.fn().mockResolvedValue({
                    data: [{ id: '1', username: 'testuser', email: 'test@example.com' }],
                    error: null
                })
            }))
        }))
    };
});




describe('createUser', () => {
    it('should create a new user and return user data', async () => {
        const userData = { username: 'testuser', email: 'test@example.com', password: 'testpassword', role: 'job_seeker' };
        const result = await createUser(userData);

        expect(result).toEqual([{ id: '1', username: 'testuser', email: 'test@example.com' }]);
    });

    it('should throw an error if the user already exists', async () => {
        const userData = { username: 'existinguser', email: 'existing@example.com', password: 'testpassword', role: 'job_seeker' };
        await expect(createUser(userData)).rejects.toThrow('User already exists');
    });
});
*/
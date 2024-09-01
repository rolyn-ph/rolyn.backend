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

  it('should throw an error if the user already exists', async () => {
    const { createClient } = require('@supabase/supabase-js');

    // Mock the entire method chain
    const mockSingle = jest.fn().mockResolvedValueOnce({
        data: { id: '1', email: 'test@example.com' },
        error: null,
    });

    const mockEq = jest.fn(() => ({
        single: mockSingle,
    }));

    const mockSelect = jest.fn(() => ({
        eq: mockEq,
    }));

    const mockFrom = jest.fn(() => ({
        select: mockSelect,
    }));

    createClient.mockReturnValue({
        from: mockFrom,
    });

    const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        role: 'job_seeker',
    };

    try {
        await createUser(userData);
    } catch (error) {
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Introduce a 100ms delay
        expect(error.message).toBe('User already exists');
        console.log('Caught Error:', error.message); // Ensure we catch the correct error
    }
});


});

// __tests__/User.test.js

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


/*
jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            from: jest.fn(() => ({
                insert: jest.fn().mockResolvedValue({
                    data: [{ id: '1', username: 'testuser', email: 'test@example.com' }],
                    error: null
                }),
                select: jest.fn().mockResolvedValue({
                    data: [{ id: '1', email: 'existing@example.com' }],
                    error: null
                })
            }))
        }))
    };
});
*/

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
    /*
    it('should throw an error if the user already exists', async () => {
        supabase.createClient().from().insert.mockResolvedValue({
            data: null,
            error: { message: 'User already exists' }
        });

        const userData = { username: 'existinguser', email: 'existing@example.com', password: 'testpassword', role: 'job_seeker' };

        await expect(createUser(userData)).rejects.toThrow('User already exists');
    });
    */
});



/*
const { createUser } = require('../models/User');
const supabase = require('@supabase/supabase-js');
jest.mock('@supabase/supabase-js');

describe('createUser', () => {
    it('should create a new user and return user data', async () => { // Tests basic functionality of createUser function
        // Mocking supabase.from().insert().select() chain
        supabase.createClient.mockReturnValue({
            from: jest.fn().mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockResolvedValue({
                        data: [{ id: '1', username: 'testuser', email: 'test@example.com' }],
                        error: null
                    })
                })
            })
        });

        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'job_seeker'
        };

        const result = await createUser(userData);
        expect(result).toEqual([{ id: '1', username: 'testuser', email: 'test@example.com' }]);
    });

    it('should throw an error if the user already exists', async () => { // Tests if already exists error is thrown
        // Mocking supabase.from().select().eq().single() chain for the "already exists" scenario
        supabase.createClient.mockReturnValue({
            from: jest.fn().mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockResolvedValue({
                        data: null,
                        error: { message: 'User already exists' }
                    })
                })
            })
        });

        const userData = {
            username: 'existinguser',
            email: 'existing@example.com',
            password: 'password123',
            role: 'job_seeker'
        };

        await expect(createUser(userData)).rejects.toThrow('User already exists');
    });
});
*/
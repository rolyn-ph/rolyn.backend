// __tests__/User.test.js

// User.test.js

jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: () => ({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(),
        }),
    };
});

const { createUser, getUserByEmail } = require('../models/User');

describe('User module', () => {
    let supabase;

    beforeEach(() => {
        supabase = require('@supabase/supabase-js').createClient();

        // Reset mock implementations before each test
        supabase.from().select().eq().single.mockReset();
        supabase.from().insert.mockReset();
    });

    describe('createUser', () => {
        it('should throw an error if the user already exists', async () => {
            // Mock Supabase to return an existing user
            supabase.from().select().eq().single.mockResolvedValueOnce({
                data: { id: 1 },
                error: null,
            });

            console.log('Running test: should throw an error if the user already exists');
            console.log('Mocking single() to return existing user with id 1');

            await expect(createUser({ email: 'test@example.com' })).rejects.toThrow('User already exists');

            console.log('Test complete: should throw an error if the user already exists');
        });

        it('should create a new user if no existing user is found', async () => {
            // Mock Supabase to indicate no user exists
            supabase.from().select().eq().single.mockResolvedValueOnce({
                data: null,
                error: { code: 'PGRST116' },  // Assuming this is the code for "no rows found"
            });

            console.log('Running test: should create a new user if no existing user is found');
            console.log('Mocking single() to return no existing user (data: null, error: PGRST116)');

            // Mock the insert function to return a new user object
            const mockInsertResponse = { id: 1, username: 'testuser' };
            supabase.from().insert.mockResolvedValueOnce({
                data: [mockInsertResponse],
                error: null,
            });

            const result = await createUser({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password',
                role: 'worker',
            });

            console.log('Result of createUser:', result);  // Log the result to see what’s returned
            expect(result).toEqual([mockInsertResponse]);

            console.log('Test complete: should create a new user if no existing user is found');
        });

        it('should throw an error if there is an issue during user check', async () => {
            // Mock Supabase to return an error during user check
            supabase.from().select().eq().single.mockResolvedValueOnce({
                data: null,
                error: { code: 'PGRST100' },  // Mock error code for an actual error
            });

            console.log('Running test: should throw an error if there is an issue during user check');
            console.log('Mocking single() to return an error (data: null, error: PGRST100)');

            await expect(createUser({ email: 'test@example.com' })).rejects.toThrow('Error checking for existing user');

            console.log('Test complete: should throw an error if there is an issue during user check');
        });
    });

    describe('getUserByEmail', () => {
        it('should return a user by email', async () => {
            // Mock Supabase to return a user
            const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' };
            supabase.from().select().eq().single.mockResolvedValueOnce({
                data: mockUser,
                error: null,
            });

            console.log('Running test: should return a user by email');
            console.log('Mocking single() to return user:', mockUser);

            const result = await getUserByEmail('test@example.com');
            console.log('Result of getUserByEmail:', result);  // Log the result to see what’s returned
            expect(result).toEqual(mockUser);

            console.log('Test complete: should return a user by email');
        });

        it('should throw an error if user is not found', async () => {
            // Mock Supabase to simulate a user not being found
            supabase.from().select().eq().single.mockResolvedValueOnce({
                data: null,
                error: { message: 'User not found' },
            });

            console.log('Running test: should throw an error if user is not found');
            console.log('Mocking single() to return null with error: User not found');

            await expect(getUserByEmail('nonexistent@example.com')).rejects.toThrow('User not found');

            console.log('Test complete: should throw an error if user is not found');
        });
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
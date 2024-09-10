// Mock the supabase object directly
const supabase = {
    from: () => ({
        select: () => ({
            eq: () => ({
                single: async () => ({
                    data: { id: '1', email: 'test@example.com' }, // Mocking the existing user
                    error: null,
                }),
            }),
        }),
    }),
};

// Mock the createUser function with the mock supabase
async function createUser(userData) {
    const { email } = userData;

    const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (selectError && selectError.code !== 'PGRST116') {
        throw new Error('Error checking for existing user');
    }

    if (existingUser) {
        throw new Error('User already exists');
    }

    const { data, error } = await supabase
        .from('users')
        .insert([{ ...userData }]);

    if (error) {
        throw new Error('Error creating user');
    }

    return data;
}

// Run the test
async function runTest() {
    const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        role: 'job_seeker',
    };

    try {
        await createUser(userData);
    } catch (error) {
        console.log('Caught Error:', error.message); // Ensure we catch the correct error
    }
}

runTest();

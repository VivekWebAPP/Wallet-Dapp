const login = async (body) => {
  const url = '/auth/login';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.token));
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const signup = async (body) => {
  const url = '/auth/sigin';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Signup failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));

const AuthService = {
  login,
  signup,
  logout,
  getCurrentUser,
};

export default AuthService;

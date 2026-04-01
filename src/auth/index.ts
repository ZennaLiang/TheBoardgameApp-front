const API_URL = import.meta.env.VITE_API_URL;

interface SignupUser {
  name: string;
  email: string;
  password: string;
}

interface SigninUser {
  email: string;
  password: string;
}

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  boardgames?: any[];
  bggUsername?: string;
}

export interface AuthData {
  token: string;
  user: AuthUser;
  error?: string;
}

export const signup = (user: SignupUser): Promise<any> => {
  return fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const signin = (user: SigninUser): Promise<AuthData> => {
  return fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const googleLogin = (user: { tokenId: string }): Promise<AuthData> => {
  return fetch(`${API_URL}/google-login/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const facebookLogin = (user: { email: string; name: string }): Promise<AuthData> => {
  return fetch(`${API_URL}/facebook-login/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const authenticate = (jwt: AuthData, next: () => void): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    next();
  }
};

export const signout = (next: () => void): Promise<any> => {
  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  next();
  return fetch(`${API_URL}/signout`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const isAuthenticated = (): AuthData => {
  if (typeof window === "undefined") {
    return false as unknown as AuthData;
  }
  const item = localStorage.getItem("jwt");
  if (item) {
    return JSON.parse(item) as AuthData;
  }
  return false as unknown as AuthData;
};

export const forgotPasswordReq = (email: string): Promise<any> => {
  return fetch(`${API_URL}/forgot-password/`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const resetPasswordReq = (resetInfo: {
  resetPasswordLink: string;
  newPassword: string;
}): Promise<any> => {
  return fetch(`${API_URL}/reset-password/`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetInfo),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

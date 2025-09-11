import {
  signup,
  signin,
  googleLogin,
  facebookLogin,
  authenticate,
  signout,
  isAuthenticated,
  forgotPasswordReq,
  resetPasswordReq
} from "./index";

describe("Auth API calls", () => {
  it("sign up should create a user", () => {
    let testUser = {
      name: "IAmATestUser",
      email: "testuser@theboardgameguru.com",
      password: "Abcd1234",
      matchPassword: "Abcd1234"
    };
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: testUser })
      } as Response)
    );
    
    signup(testUser).then(data => {
      console.log(data);
      expect(data).toBeTruthy();
    });
  });

  it("sign up should fail", () => {
    let testUser = {
      name: "IAmATestUser123",
      email: "testuser@theboardgameguru.com",
      password: "abc123",
      matchPassword: "Abcd1234"
    };
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Validation failed" })
      } as Response)
    );
    
    signup(testUser).then(data => {
      console.log(data);
      expect(data).toBeFalsy();
    });
  });
});

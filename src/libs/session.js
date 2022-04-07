export const ironSessionOptions = {
    cookieName: "user_plt",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production"
    }
}

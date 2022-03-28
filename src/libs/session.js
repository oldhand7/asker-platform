export const ironSessionOptions = {
    cookieName: "proj",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    }
}

export const shortTtl = 3600;
export const longTtl = 3600 * 24 * 30;

export const sessionOptions = {
    cookieName: "user",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    ttl: shortTtl
}

export const withUserGuard = (handler, superadmin = false) => (req, res) => {
  const { user } = req.session;

  if (!user || (superadmin && !user.superadmin)) {
    res.status(403).json({
      message: "You don\'t have permission to access this resource."
    })

    return;
  }

  handler(req, res);
};

require("dotenv").config();
const { User } = require("../models");

const auth = async (req, res, next) => {
      let session = req.session;

      if (!session) return res.redirect("/auth/login");

      if (!session.authenticated) return res.redirect("/auth/login");

      let user = await User.findById(session.user._id, "-password");

      if (!user) {
            res.clearCookie(process.env.SESSION_COOKIE_NAME);
            session.destroy();
            return res.redirect("/auth/login");
      }

      session.user = user.public;

      return next();
};

module.exports = auth;

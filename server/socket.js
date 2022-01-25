// const count = io.engine.clientsCount;

const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);

let join_Room = (socket) => {
      let session = socket.request.session;

      if (!session.authenticated) return;

      let room = session.user._id.toString();
      socket.join(room);
      console.log("joined room ===> ; ", room);
};

let authSocket = (socket, next) => {
      // @ts-ignore
      let session = socket.request.session;

      if (session.authenticated) {
            return next();
      }

      return next(new Error("Not authenticated"));
};

module.exports = {
      wrap,
      join_Room,
      authSocket,
};

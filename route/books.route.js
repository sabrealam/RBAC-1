const bookRouter = require("express").Router();
const Book = require("../model/bookModel");
const auth = require("../middleweres/auth");
const access = require("../middleweres/access");

bookRouter.get("/", auth, access([`VIEWER`, `VIEW_ALL`]), async (req, res) => {
  let { _id, role, name, email } = req.user.data.user;
  try {
    if (!role === `VIEWER` && !role === `VIEW_ALL`)
      return res.status(401).send({ message: `Unauthorized` });

    if (req.query.new && req.query.new == `1`) {
      let tenMinuteAgo = new Date(Date.now() - 10 * 60 * 1000);
      let book = await Book.find({ createdAt: { $gt: tenMinuteAgo } });
      res.json({ book: book });
      return;
    }
    if (req.query.new && req.query.old == 1) {
      let tenMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
      let book = await Book.find({ createdAt: { $lt: tenMinuteAgo } });

      res.json({ book: book });
      return;
    }
    if (role == `VIEWER`) {
      let book = await Book.find({ admin: { UserID: _id } });
      res.send({ books: book });
      return;
    }
    let book = await Book.find();
    res.send({ books: book });
  } catch (error) {
    res
      .status(401)
      .send({ error: error.message, def: `Catch --> Error from /books/` });
  }
});

// bookRouter.get(
//   "/old",
//   auth,
//   access([`VIEWER`, `VIEW_ALL`]),
//   async (req, res) => {
//     let { _id, role, name, email } = req.user.data.user;
//     let { id } = req.params;
//     try {
//       let tenMinuteAgo = new Date(Date.now() - 10 * 60 * 1000);

//       let book = await Book.find({ createdAt: { $lt: tenMinuteAgo } });

//       res.json({ book: book });
//     } catch (error) {
//       res
//         .status(401)
//         .send({ error: error.message, def: `Catch --> Error from /books/old` });
//     }
//   }
// );
// bookRouter.get(
//   "/new",
//   auth,
//   access([`VIEWER`, `VIEW_ALL`]),
//   async (req, res) => {
//     let { _id, role, name, email } = req.user.data.user;

//     console.log(req.query);
//     try {
//       let tenMinuteAgo = new Date(Date.now() - 10 * 60 * 1000);

//       let book = await Book.find({ createdAt: { $gt: tenMinuteAgo } });

//       res.json({ book: book });
//     } catch (error) {
//       res
//         .status(401)
//         .send({ error: error.message, def: `Catch --> Error from /books/old` });
//     }
//   }
// );

bookRouter.post("/create", auth, access([`CREATOR`]), async (req, res) => {
  let { title, author, price } = req.body;
  let { _id, role, name, email } = req.user.data.user;
  console.log(role);
  try {
    let book = await Book.create({
      title,
      author,
      price,
      admin: { UserID: _id, name, email },
    });

    await book.save();
    res.send({ book: book });
  } catch (error) {
    res
      .status(401)
      .send({
        error: error.message,
        def: `Catch --> Error from /books/create`,
      });
  }
});

bookRouter.patch("/update/:id", auth, access([`CREATOR`]), async (req, res) => {
  let { title, author, price } = req.body;
  let { id } = req.params;
  try {
    let book = await Book.findByIdAndUpdate(id, { title, author, price });
    await book.save();
    res.send({ book: book });
  } catch (error) {
    res
      .status(401)
      .send({
        error: error.message,
        def: `Catch --> Error from /books/update`,
      });
  }
});

bookRouter.delete(
  `/delete/:id`,
  auth,
  access([`CREATOR`]),
  async (req, res) => {
    let { id } = req.params;
    try {
      let book = await Book.findByIdAndDelete(id);
      res.send({ book: book });
    } catch (error) {
      res
        .status(401)
        .send({
          error: error.message,
          def: `Catch --> Error from /books/delete`,
        });
    }
  }
);

module.exports = bookRouter;

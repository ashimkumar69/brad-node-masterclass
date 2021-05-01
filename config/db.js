const mongoose = require("mongoose");

const connectDB = async () => {
  const connected = await mongoose.connect(process.env.MONG_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log(`Server running on: ${connected.connection.host}`.success);
};

module.exports = connectDB;

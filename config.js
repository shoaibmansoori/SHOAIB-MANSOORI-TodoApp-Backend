const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://shoaibmansuri526:lK3xEAM2AXHakKKO@firstcluster.e1ejfv9.mongodb.net/Todo?retryWrites=true&w=majority&appName=FirstCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

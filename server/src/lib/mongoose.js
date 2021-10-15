import { connect } from "mongoose";

export default async (config) => {
  const connection = await connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  
  console.log(connection);
  return connection.connection.db;
};

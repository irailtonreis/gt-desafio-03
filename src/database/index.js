import Sequelize from 'sequelize';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';
import File from '../app/models/File';
import Deliverman from '../app/models/Deliveryman';
import databaseConfig from '../config/database';

const models = [User, Recipient, Deliverman, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();

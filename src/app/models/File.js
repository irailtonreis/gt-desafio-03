import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:8080/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasOne(models.Deliveryman, {
      foreignKey: 'avatar_id',
      as: 'avatar',
    });

    this.hasOne(models.Order, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default File;

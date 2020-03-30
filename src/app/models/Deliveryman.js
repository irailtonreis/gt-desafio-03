import Sequelize, { Model } from 'sequelize';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'deliveryman_id',
      as: 'sgnature',
    });

    this.hasMany(models.Order, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
  }
}

export default Deliveryman;

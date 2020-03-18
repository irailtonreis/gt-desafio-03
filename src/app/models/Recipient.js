import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        rua: Sequelize.STRING,
        numero: Sequelize.STRING,
        complemento: Sequelize.STRING,
        estado: Sequelize.STRING,
        cidade: Sequelize.STRING,
        cep: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Order, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
  }
}

export default Recipient;

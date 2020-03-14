import Deliverman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliverman.findAll();
    return res.json(deliverymen);
  }

  async store(req, res) {
    const deliveryman = await Deliverman.create(req.body);
    return res.json(deliveryman);
  }

  async update(req, res) {
    const deliveryman = await Deliverman.findByPk(req.params.id);

    const { id, name, email, avatar_id } = await deliveryman.update(req.body);
    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const deliverymen = await Deliverman.findByPk(req.params.id);

    deliverymen.destroy();
    return res.send();
  }
}
export default new DeliverymanController();

import Deliverman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    return res.json(req.body);
  }

  async store(req, res) {
    // const { avatar_id, name, email } = req.body;

    const deliveryman = await Deliverman.create(req.body);
    return res.json(deliveryman);
  }

  async update(req, res) {
    return res.send();
  }

  async delete(req, res) {
    return res.send();
  }
}
export default new DeliverymanController();

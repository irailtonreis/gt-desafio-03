import * as Yup from 'yup';
import Order from '../models/Order';

class OrderController {
  async index(req, res) {
    return res.send();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
      recipient_id: Yup.number().required(),
      signature_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.create(req.body);

    return res.json(order);
  }
}

export default new OrderController();

import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
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
    const { start_date, end_date, deliveryman_id } = req.body;

    const hourStart = startOfHour(parseISO(start_date));
    console.log(hourStart);
    // const hourEnd = endOfHour(parseISO(end_date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const checkOrders = await Order.findOne({
      where: {
        deliveryman_id,
        canceled_at: false,
        hourStart,
      },
    });

    if (checkOrders) {
      return res
        .status(400)
        .json({ error: 'There is already a delivery in progress' });
    }

    const order = await Order.create(req.body);

    return res.json(order);
  }
}

export default new OrderController();

import * as Yup from 'yup';
import { parseISO, startOfHour, isBefore, format, isAfter } from 'date-fns';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Mail from '../../lib/Mail';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        canceled_at: null,
      },
      order: ['start_date'],
      attributes: ['id', 'product', 'start_date'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'nome',
            'rua',
            'numero',
            'complemento',
            'cep',
            'cidade',
          ],
        },
      ],
    });
    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      signature_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, start_date } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (start_date) {
      const date = parseISO(start_date);

      const date1 = parseISO(start_date).setHours(5, 0, 0);

      const date2 = parseISO(start_date).setHours(15, 0, 0);

      const startDay = parseISO(format(date1, "yyy-MM-dd'T'HH:mm:ssxxx"));
      const endDay = parseISO(format(date2, "yyy-MM-dd'T'HH:mm:ssxxx"));

      if (isBefore(date, startDay)) {
        return res.status(400).json({ error: 'Time not allowed' });
      }

      if (isAfter(date, endDay)) {
        return res.status(400).json({ error: 'Time not allowed' });
      }

      const hourStart = startOfHour(parseISO(start_date));

      const checkOrders = await Order.findOne({
        where: {
          deliveryman_id,
          canceled_at: null,
          start_date: hourStart,
        },
      });

      if (checkOrders) {
        return res
          .status(400)
          .json({ error: 'There is already a delivery in progress' });
      }
    }

    const order = await Order.create(req.body);

    await Mail.sendMail({
      to: `${deliveryman.name} ${deliveryman.email}`,
      subject: 'Nova encomenda',
      text: 'Você tem uma nova encomenda para entregar',
    });

    return res.send(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      start_date: Yup.date().required(),
      recipient_id: Yup.number().required(),
      signature_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = await Order.findByPk(req.params.id);

    return res.json(id);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    return res.json(order);
  }
}

export default new OrderController();

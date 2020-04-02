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
      order: ['id'],
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
              attributes: ['name', 'path', 'url'],
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
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, start_date, recipient_id, product } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (start_date) {
      const date = parseISO(start_date);

      const setDate = parseISO(start_date);

      const date1 = setDate.setHours(5, 0, 0);

      const date2 = setDate.setHours(15, 0, 0);

      const startDay = parseISO(format(date1, "yyy-MM-dd'T'HH:mm:ssxxx"));
      const endDay = parseISO(format(date2, "yyy-MM-dd'T'HH:mm:ssxxx"));

      if (isBefore(date, startDay)) {
        return res.status(400).json({ error: 'Hour is not allowed' });
      }

      if (isAfter(date, endDay)) {
        return res.status(400).json({ error: 'Hour is not allowed' });
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

    const recipient = await Recipient.findByPk(recipient_id);

    const order = await Order.create(req.body);

    await Mail.sendMail({
      to: `${deliveryman.name} ${deliveryman.email}`,
      subject: 'Nova encomenda',
      template: 'cancellation',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.nome,
        rua: recipient.rua,
        numero: recipient.numero,
        cep: recipient.cep,
        complemento: recipient.complemento,
        cidade: recipient.cidade,
        estado: recipient.estado,
        product,
      },
    });

    return res.send(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });
    const { start_date, end_date } = req.body;

    const hourEnd = startOfHour(parseISO(end_date));
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);

    await order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const order = await Order.findByPk(req.params.id);

    await order.destroy();

    return res.send();
  }
}

export default new OrderController();

import * as Yup from 'yup';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';
import VerifyStart from '../utils/VerifyStart';
import VerifyEnd from '../utils/VerifyEnd';

class ViewController {
  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const { id } = req.params;

    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        end_date: {
          [Op.ne]: null,
        },
      },
      order: ['id'],
      attributes: ['id', 'product', 'end_date'],
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
      ],
    });
    return res.json(orders);
  }

  async index(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const { id } = req.params;

    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
      },
      order: ['id'],
      attributes: ['id', 'product'],
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
      ],
    });
    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { start_date, end_date } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (start_date) {
      if (VerifyStart(start_date)) {
        return res.status(400).json({ error: 'Hour start is not allowed' });
      }
    }

    if (end_date) {
      if (VerifyEnd(end_date)) {
        return res.status(400).json({ error: 'Hour end is not allowed' });
      }
    }

    await order.update(req.body);

    return res.json(order);
  }
}

export default new ViewController();

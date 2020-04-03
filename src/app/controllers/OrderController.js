import * as Yup from 'yup';
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

    const { deliveryman_id, recipient_id, product } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

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

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);

    await order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const order = await Order.findByPk(req.params.id);

    if (order.start_date) {
      return res.status(401).json({ error: 'Cancellation is not allowed' });
    }

    order.canceled_at = new Date();
    await order.save();

    return res.json(order);
  }
}

export default new OrderController();

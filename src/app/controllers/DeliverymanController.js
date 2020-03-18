import * as Yup from 'yup';
import Deliverman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliverman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });
    return res.json(deliverymen);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // const { email } = req.body;
    // const deliverymanExists = await Deliverman.findOne({
    //   where: { email },
    // });

    // const file = await File.findByPk(req.body.avatar_id);

    // if (!file) {
    //   return res.status(401).json({ error: 'Avatar does not exists.' });
    // }

    // if (deliverymanExists) {
    //   return res.status(400).json({ error: 'E-mail already exists.' });
    // }

    const deliveryman = await Deliverman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().required(),
    });

    const deliveryman = await Deliverman.findByPk(req.params.id);

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    if (req.body.email !== deliveryman.email) {
      const deliverymanExists = await Deliverman.findOne({
        where: { email },
      });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'E-mail already exists.' });
      }
    }

    const { id, name, avatar_id } = await deliveryman.update(req.body);
    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const deliverymen = await Deliverman.findByPk(req.params.id);

    if (!deliverymen) {
      return res.status(401).json({ error: 'Deliveryman does not exists.' });
    }
    await deliverymen.destroy();

    return res.send();
  }
}
export default new DeliverymanController();

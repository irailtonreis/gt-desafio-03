import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.string().required(),
      cep: Yup.string()
        .min(8)
        .required(),
      complemento: Yup.string(),
      cidade: Yup.string().required(),
      estado: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fails' });
    }

    // const recipientExists = await Recipient.findOne({
    //   where: { cep: req.body.cep, nome: req.body.nome },
    // });

    // if (recipientExists) {
    //   return res.status(400).json({ error: 'User already exists.' });
    // }

    const {
      id,
      nome,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      nome,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.string().required(),
      cep: Yup.string()
        .min(8)
        .required(),
      complemento: Yup.string(),
      cidade: Yup.string().required(),
      estado: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const {
      nome,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep,
    } = await recipient.update(req.body);

    return res.json({
      nome,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep,
    });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    recipient.destroy();

    return res.send();
  }
}

export default new RecipientController();

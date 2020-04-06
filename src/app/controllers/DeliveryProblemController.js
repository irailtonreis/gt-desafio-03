import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
    });
    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      delivery_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const problem = await DeliveryProblem.create(req.body);

    return res.json(problem);
  }
}

export default new DeliveryProblemController();

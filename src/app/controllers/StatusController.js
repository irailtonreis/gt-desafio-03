import * as Yup from 'yup';
import VerifyStart from '../utils/VerifyStart';
import VerifyEnd from '../utils/VerifyEnd';
import Order from '../models/Order';

class StatusController {
  async update(req, res) {
    if (req.body.start_date) {
      const schema = Yup.object().shape({
        start_date: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }
    }

    if (req.body.end_date) {
      const schema = Yup.object().shape({
        end_date: Yup.date().required(),
        signature_id: Yup.number().when('end_date', (end_date, field) =>
          end_date ? field.required() : !field
        ),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }
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

export default new StatusController();

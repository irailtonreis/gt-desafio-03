import * as Yup from 'yup';
import {
  parseISO,
  startOfHour,
  isBefore,
  setSeconds,
  setMinutes,
  setHours,
  format,
  isAfter,
  isBefore,
} from 'date-fns';
import Order from '../models/Order';

class OrderController {
  async index(req, res) {
    return res.send();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      start_date: Yup.date().required(),
      recipient_id: Yup.number().required(),
      signature_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    const { deliveryman_id, start_date } = req.body;

    const startDate = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    const avaliable = startDate.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(parseISO(start_date), hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyy-MM-dd'T'HH:mm:ssxxx"),
        avaliable: isAfter(value, new Date().getTime()),
      };
    });


    return res.json(avaliable);
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }

    // const hourStart = startOfHour(parseISO(start_date));

    // if (isBefore(hourStart, new Date())) {
    //   return res.status(400).json({ error: 'Past dates are not permitted' });
    // }

    // const checkOrders = await Order.findOne({
    //   where: {
    //     deliveryman_id,
    //     canceled_at: null,
    //     start_date: hourStart,
    //   },
    // });

    // if (checkOrders) {
    //   return res
    //     .status(400)
    //     .json({ error: 'There is already a delivery in progress' });
    // }

    // const order = await Order.create(req.body);

    // return res.json(order);
  }
}

export default new OrderController();

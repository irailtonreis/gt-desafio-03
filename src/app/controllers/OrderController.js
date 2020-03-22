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
  startOfDay,
  endOfDay,
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
      '18:00',
    ];
    const [date, minute] = start_date.split('T');
    console.log(date);

    var startday = startOfDay(new Date(date, 8, 00, 0))
    var endDay = startOfDay(new Date(date, 18, 00, 0))

    console.log(startday);
    // console.log(result);
    // const avaliable = startDate.map((time, index) => {
      

      const [hour] = time.split(':');

    //   console.log(hour);
    //   const hourEnd = setSeconds(
    //     setMinutes(setHours(parseISO(start_date), hour), minute),
    //     0
    //   );


    //   const date = parseISO(start_date);

    //   return {
    //     value: format(value, "yyy-MM-dd'T'HH:mm:ssxxx"),
    //     date: format(date, "yyy-MM-dd'T'HH:mm:ssxxx"),
    //     avaliable: isBefore(date, hourEnd),
    //   };
    // });


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

    return res.json(startday);
  }
}

export default new OrderController();

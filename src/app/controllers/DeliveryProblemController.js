class DeliveryProblemController {
  async store(req, res) {
    return res.json(req.body);
  }
}

export default new DeliveryProblemController();

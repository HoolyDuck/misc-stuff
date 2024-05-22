const Order = require("./model");
const Employee = require("../employees/model");

const getOrders = async (req, res) => {
  const orders = await Order.find().populate("employee");
  res.send(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("employee");
  res.send(order);
};

const createOrder = async (req, res) => {
  const order = new Order(req.body);
  const employee = await Employee.findById(order.employee);
  employee.orders.push(order._id);
  await employee.save();
  await order.save();
  res.send(order);
};

const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  const employee = await Employee.findById(order.employee);
  employee.orders.push(order._id);
  await employee.save();
  res.send(order);
};

const deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.send("Order deleted");
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };

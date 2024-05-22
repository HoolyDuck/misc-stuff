const Employee = require("./model");

const getEmployees = async (req, res) => {
  const employees = await Employee.find().populate("orders"); 
  res.send(employees);
};

const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("orders");
  res.send(employee);
};

const createEmployee = async (req, res) => {
  const employee = new Employee(req.body);
  await employee.save();
  res.send(employee);
};

const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(employee);
};

const deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.send("Employee deleted");
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

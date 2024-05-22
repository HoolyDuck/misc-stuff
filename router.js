const express = require("express");

const router = express.Router();

const orderService = require("./orders/service");
const employeeService = require("./employees/service");

router.get("/orders", orderService.getOrders);
router.get("/orders/:id", orderService.getOrderById);
router.post("/orders", orderService.createOrder);
router.put("/orders/:id", orderService.updateOrder);
router.delete("/orders/:id", orderService.deleteOrder);

router.get("/employees", employeeService.getEmployees);
router.get("/employees/:id", employeeService.getEmployeeById);
router.post("/employees", employeeService.createEmployee);
router.put("/employees/:id", employeeService.updateEmployee);
router.delete("/employees/:id", employeeService.deleteEmployee);

module.exports = router;

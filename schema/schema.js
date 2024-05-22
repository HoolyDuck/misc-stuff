const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
    GraphQLInt,
    buildSchema,
} = require('graphql');

const Employee = require('../employees/model');
const Order = require('../orders/model');
const { createHandler } = require("graphql-http/lib/use/express")


const schema = buildSchema(`
    type Employee {
        id: ID
        name: String
        surname: String
        age: Int
        position: String
        orders: [Order]
    }

    type Order {
        id: ID
        name: String
        orderDate: String
        company: String
        price: Int
        employee: Employee
    }

    type Query {
        employee(id: ID): Employee
        employees: [Employee]
        order(id: ID): Order
        orders: [Order]
    }

    type Mutation {
        addEmployee(name: String!, surname: String!, age: Int!, position: String!): Employee
        addOrder(name: String!, orderDate: String!, company: String!, price: Int!, employeeId: ID!): Order
        updateEmployee(id: ID!, name: String, surname: String, age: Int, position: String): Employee
        updateOrder(id: ID!, name: String, orderDate: String, company: String, price: Int, employeeId: ID): Order
        deleteEmployee(id: ID!): String
        deleteOrder(id: ID!): String
    }
`);

const resolvers = {
    employee: async ({ id }) => {
        return await Employee.findById(id).populate("orders");
    },
    employees: async () => {
        return await Employee.find().populate("orders");
    },
    order: async ({ id }) => {
        return await Order.findById(id).populate("employee")
    },
    orders: async () => {
        return await Order.find().populate("employee");
    },
    addEmployee: async ({ name, surname, age, position }) => {
        let employee = new Employee({
            name,
            surname,
            age,
            position,
        });
        return await employee.save();
    },
    addOrder: async ({ name, orderDate, company, price, employeeId }) => {
        let order = new Order({
            name,
            orderDate,
            company,
            price,
            employee: { _id: employeeId }
        });
        const employee = await Employee.findById(employeeId);
        employee.orders.push(order._id);
        await employee.save();
        return await order.save();
    },
    updateEmployee: async ({ id, name, surname, age, position }) => {
        const update = {}
        const check = { name, surname, age, position }
        for (const key in check) {
            if (check[key]) {
                update[key] = check[key]
            }
        }
        return await Employee.findByIdAndUpdate(id, update, { new: true });
    },
    updateOrder: async ({ id, name, orderDate, company, price, employeeId }) => {
        const update = {}
        const check = { name, orderDate, company, price, employeeId }
        for (const key in check) {
            if (check[key]) {
                update[key] = check[key]
            }
        }
        const order = await Order.findByIdAndUpdate(id, update, { new: true });
        if (employeeId) {
            const employee = await Employee.findById(employeeId);
            employee.orders.push(order._id);
            await employee.save();
        }
        return order;
    },
    deleteEmployee: async ({ id }) => {
        await Employee.findByIdAndDelete(id);
        return "Employee deleted";
    },
    deleteOrder: async ({ id }) => {
        await Order.findByIdAndDelete(id);
        return "Order deleted";
    },
};

module.exports = createHandler({ schema: schema, rootValue: resolvers });

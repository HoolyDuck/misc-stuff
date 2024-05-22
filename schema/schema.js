const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
    GraphQLInt,
} = require('graphql');

const Employee = require('../employees/model');
const Order = require('../orders/model');


const EmployeeType = new GraphQLObjectType({
    name: "Employee",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        surname: { type: GraphQLString },
        age: { type: GraphQLInt },
        position: { type: GraphQLString },
        orders: {
            type: new GraphQLList(OrderType),
            async resolve(parent, args) {
                return Order.find({ employee: { _id: parent.id } });
            },
        },
    }),
});

const OrderType = new GraphQLObjectType({
    name: "Order",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        orderDate: { type: GraphQLString },
        company: { type: GraphQLString },
        price: { type: GraphQLInt },
        employee: {
            type: EmployeeType,
            async resolve(parent, args) {
                return Employee.findById(parent.employee._id);
            }
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        employee: {
            type: EmployeeType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return Employee.findById(args.id);
            },
        },
        employees: {
            type: new GraphQLList(EmployeeType),
            async resolve(parent, args) {
                return Employee.find();
            },
        },
        order: {
            type: OrderType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return Order.findById(args.id);
            },
        },
        orders: {
            type: new GraphQLList(OrderType),
            async resolve(parent, args) {
                const orders = await Order.find();
                return orders;
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addEmployee: {
            type: EmployeeType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                surname: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                position: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                let employee = new Employee({
                    name: args.name,
                    surname: args.surname,
                    age: args.age,
                    position: args.position,
                });
                return employee.save();
            },
        },
        addOrder: {
            type: OrderType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                orderDate: { type: new GraphQLNonNull(GraphQLString) },
                company: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLInt) },
                employeeId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                let order = new Order({
                    name: args.name,
                    orderDate: args.orderDate,
                    company: args.company,
                    price: args.price,
                    employee: { _id: args.employeeId }
                });
                const employee = await Employee.findById(args.employeeId);
                console.log(employee);
                employee.orders.push(order._id);
                await employee.save();
                return order.save();
            },
        },
        updateEmployee: {
            type: EmployeeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                surname: { type: GraphQLString },
                age: { type: GraphQLInt },
                position: { type: GraphQLString },
            },
            async resolve(parent, args) {
                return Employee.findByIdAndUpdate(args.id, args, { new: true });
            },
        },
        updateOrder: {
            type: OrderType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                orderDate: { type: GraphQLString },
                company: { type: GraphQLString },
                price: { type: GraphQLInt },
                employeeId: { type: GraphQLID },
            },
            async resolve(parent, args) {
                return Order.findByIdAndUpdate(args.id, args, { new: true });
            },
        },
        deleteEmployee: {
            type: GraphQLString,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(parent, args) {
                await Employee.findByIdAndDelete(args.id);
                return "Employee deleted";
            },
        },
        deleteOrder: {
            type: GraphQLString,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(parent, args) {
                await Order.findByIdAndDelete(args.id);
                return "Order deleted";
            }
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

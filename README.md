# client

> sweet and savoury delights friday frontend

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

```
Customer
    Landing Screen
        Select Pickup or Delivery Page / Overlay
        Select Branch
    Home
        Menu
            Products
        Contact
    Cart
        List of Selections
        Total
        Confirm Order
    Product Ordering Wizard
        Registration Page
            Address
            Name
            Email
            Phone Number
            Save?
        Order Review
            Submit
Admin SPA
    Products
        Image
        Category
        Cost
        Nutrional Facts
        Status
            Available
            Unavailable
    Menu
        Menu Item
            Products
            Price
    Orders
        Status
            Accepted
            Being Prepared
            Ready for Pickup / Ready for Delivery
            Cancelled
        List of items
        Time since Order
        Total
    Settings
        Change Password
        Change Email
Super Admin SPA
    Customers
        Company
            Representative
                Email
                Name
                Phone
                Employees
                    Email
                    Name
                    Phone
            Sales Report
            Configuration
                Select Reimbursement
    Settings
        Percentage per Transaction
        SUbscription Cost

Flow
    User selects branch -> User specifies Pickup -> User selects products -> Add to cart -> User Registers (Name, Phone Number) -> Submits Order -> Recieved an Order Number
    User selects branch -> User specifies Delivery -> User selects products -> Add to cart -> User Registers (Name, Address, Phone Number, Email) -> Submits Order -> Recieved an Order Number
    Employee views list of orders -> Employee calls to confirm each order -> Confirmed Orders are Prepared

Address Phone Number Email
```

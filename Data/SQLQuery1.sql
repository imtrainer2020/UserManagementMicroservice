/*===========================================================
  0) CLEANUP (Drop in dependency order)
===========================================================*/
IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Orders', 'U')     IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Products', 'U')   IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.Customers', 'U')  IS NOT NULL DROP TABLE dbo.Customers;
IF OBJECT_ID('dbo.Employees', 'U')  IS NOT NULL DROP TABLE dbo.Employees;
GO

/*===========================================================
  1) CREATE TABLES (IDENTITY + RELATIONS + CASCADES)
===========================================================*/

-- Customers
CREATE TABLE dbo.Customers
(
    CustomerId   INT IDENTITY(1,1) NOT NULL,
    CustomerName NVARCHAR(100)     NOT NULL,
    City         NVARCHAR(50)      NOT NULL,
    Segment      NVARCHAR(30)      NOT NULL,
    CONSTRAINT PK_Customers PRIMARY KEY CLUSTERED (CustomerId)
);
GO

-- Products (start at 101)
CREATE TABLE dbo.Products
(
    ProductId   INT IDENTITY(101,1) NOT NULL,
    ProductName NVARCHAR(120)       NOT NULL,
    Category    NVARCHAR(60)        NOT NULL,
    ListPrice   DECIMAL(12,2)       NOT NULL,
    CONSTRAINT PK_Products PRIMARY KEY CLUSTERED (ProductId),
    CONSTRAINT CK_Products_ListPrice CHECK (ListPrice >= 0)
);
GO

-- Employees (SELF FK)  ✅ FIXED: removed ON UPDATE CASCADE
CREATE TABLE dbo.Employees
(
    EmployeeId  INT IDENTITY(1,1) NOT NULL,
    EmpName     NVARCHAR(100)     NOT NULL,
    ManagerId   INT               NULL,
    Department  NVARCHAR(50)      NOT NULL,
    Salary      DECIMAL(12,2)     NOT NULL,
    CONSTRAINT PK_Employees PRIMARY KEY CLUSTERED (EmployeeId),
    CONSTRAINT CK_Employees_Salary CHECK (Salary > 0),
    CONSTRAINT FK_Employees_Manager
        FOREIGN KEY (ManagerId) REFERENCES dbo.Employees(EmployeeId)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
GO

-- Orders (start at 1001)
CREATE TABLE dbo.Orders
(
    OrderId     INT IDENTITY(1001,1) NOT NULL,
    CustomerId  INT                  NOT NULL,
    OrderDate   DATETIME2(0)         NOT NULL,
    Status      NVARCHAR(20)         NOT NULL,
    TotalAmount DECIMAL(12,2)        NOT NULL CONSTRAINT DF_Orders_TotalAmount DEFAULT (0),
    CONSTRAINT PK_Orders PRIMARY KEY CLUSTERED (OrderId),
    CONSTRAINT CK_Orders_TotalAmount CHECK (TotalAmount >= 0),
    CONSTRAINT CK_Orders_Status CHECK (Status IN ('Pending','Processing','Shipped','Delivered','Cancelled')),
    CONSTRAINT FK_Orders_Customers
        FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(CustomerId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
GO

-- OrderItems
CREATE TABLE dbo.OrderItems
(
    OrderItemId INT IDENTITY(1,1) NOT NULL,
    OrderId     INT               NOT NULL,
    ProductId   INT               NOT NULL,
    Quantity    INT               NOT NULL,
    UnitPrice   DECIMAL(12,2)     NOT NULL,
    CONSTRAINT PK_OrderItems PRIMARY KEY CLUSTERED (OrderItemId),
    CONSTRAINT CK_OrderItems_Quantity CHECK (Quantity > 0),
    CONSTRAINT CK_OrderItems_UnitPrice CHECK (UnitPrice > 0),

    CONSTRAINT FK_OrderItems_Orders
        FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT FK_OrderItems_Products
        FOREIGN KEY (ProductId) REFERENCES dbo.Products(ProductId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
GO

/*===========================================================
  2) INDEXES
===========================================================*/
CREATE NONCLUSTERED INDEX IX_Customers_City_Segment
ON dbo.Customers (City, Segment)
INCLUDE (CustomerName);
GO

CREATE NONCLUSTERED INDEX IX_Orders_CustomerId_OrderDate
ON dbo.Orders (CustomerId, OrderDate DESC)
INCLUDE (Status, TotalAmount);
GO

CREATE NONCLUSTERED INDEX IX_Orders_OrderDate_Status
ON dbo.Orders (OrderDate DESC, Status)
INCLUDE (CustomerId, TotalAmount);
GO

CREATE NONCLUSTERED INDEX IX_OrderItems_OrderId
ON dbo.OrderItems (OrderId)
INCLUDE (ProductId, Quantity, UnitPrice);
GO

CREATE NONCLUSTERED INDEX IX_OrderItems_ProductId
ON dbo.OrderItems (ProductId)
INCLUDE (OrderId, Quantity, UnitPrice);
GO

CREATE NONCLUSTERED INDEX IX_Products_Category
ON dbo.Products (Category)
INCLUDE (ProductName, ListPrice);
GO

CREATE NONCLUSTERED INDEX IX_Employees_Department
ON dbo.Employees (Department)
INCLUDE (EmpName, Salary, ManagerId);
GO

CREATE NONCLUSTERED INDEX IX_Employees_ManagerId
ON dbo.Employees (ManagerId)
INCLUDE (EmpName, Department, Salary);
GO

/*===========================================================
  3) INSERT SAMPLE DATA (>=15 each)
===========================================================*/

-- Customers (15)
INSERT INTO dbo.Customers (CustomerName, City, Segment) VALUES
('Arun Kumar',     'Chennai',     'Retail'),
('Meera Iyer',     'Chennai',     'Corporate'),
('Vikram Rao',     'Bengaluru',   'SMB'),
('Neha Sharma',    'Hyderabad',   'Retail'),
('Rahul Verma',    'Mumbai',      'Enterprise'),
('Sneha Nair',     'Kochi',       'Retail'),
('Karthik S',      'Coimbatore',  'SMB'),
('Ayesha Khan',    'Delhi',       'Corporate'),
('Sanjay Gupta',   'Pune',        'Retail'),
('Divya Patel',    'Ahmedabad',   'SMB'),
('Rohit Singh',    'Kolkata',     'Corporate'),
('Priya Das',      'Chandigarh',  'Retail'),
('Naveen Reddy',   'Hyderabad',   'SMB'),
('Ananya Bose',    'Bengaluru',   'Enterprise'),
('Fatima Shaikh',  'Mumbai',      'Corporate');
GO

-- Products (15)
INSERT INTO dbo.Products (ProductName, Category, ListPrice) VALUES
('Laptop 14-inch i5',           'Electronics', 65000.00),
('Laptop 15-inch i7',           'Electronics', 92000.00),
('Wireless Mouse',              'Accessories',   799.00),
('Mechanical Keyboard',         'Accessories',  3499.00),
('27-inch Monitor',             'Electronics', 18999.00),
('USB-C Hub 7-in-1',            'Accessories',  2499.00),
('Noise Cancelling Headphones', 'Audio',      14999.00),
('Bluetooth Speaker',           'Audio',       3999.00),
('Office Chair Ergonomic',      'Furniture',  12999.00),
('Standing Desk',               'Furniture',  25999.00),
('External SSD 1TB',            'Storage',     7999.00),
('External HDD 2TB',            'Storage',     6499.00),
('Smartphone 128GB',            'Mobiles',    29999.00),
('Smartphone 256GB',            'Mobiles',    37999.00),
('Printer All-in-One',          'Office',     11999.00);
GO

-- Employees (15) - managers first
INSERT INTO dbo.Employees (EmpName, ManagerId, Department, Salary) VALUES
('Kiran (CEO)',           NULL, 'Executive', 250000.00), -- 1
('Prasanna (CTO)',        1,    'Executive', 200000.00), -- 2
('Anita (CFO)',           1,    'Executive', 190000.00), -- 3
('Ramesh (Eng Manager)',  2,    'Engineering', 150000.00), -- 4
('Sowmya (Eng Manager)',  2,    'Engineering', 145000.00), -- 5
('Deepak (Sales Head)',   1,    'Sales',      160000.00),  -- 6
('Nisha (HR Head)',       1,    'HR',         140000.00),  -- 7
('Vivek (Engineer)',      4,    'Engineering', 90000.00),  -- 8
('Lavanya (Engineer)',    4,    'Engineering', 88000.00),  -- 9
('Arif (Engineer)',       5,    'Engineering', 87000.00),  -- 10
('Keerthi (QA)',          5,    'Engineering', 82000.00),  -- 11
('Manoj (Sales Exec)',    6,    'Sales',       75000.00),  -- 12
('Ishita (Sales Exec)',   6,    'Sales',       76000.00),  -- 13
('Rekha (HR Exec)',       7,    'HR',          65000.00),  -- 14
('Suresh (Accountant)',   3,    'Finance',     80000.00);  -- 15
GO

/*===========================================================
  4) ORDERS + ITEMS + CORRECT TOTALS
===========================================================*/

-- Orders (15)
INSERT INTO dbo.Orders (CustomerId, OrderDate, Status) VALUES
(1,  '2026-02-01 10:05:00', 'Delivered'),
(2,  '2026-02-03 11:20:00', 'Delivered'),
(3,  '2026-02-05 09:40:00', 'Shipped'),
(4,  '2026-02-06 15:10:00', 'Processing'),
(5,  '2026-02-07 12:00:00', 'Delivered'),
(6,  '2026-02-09 18:25:00', 'Cancelled'),
(7,  '2026-02-10 14:55:00', 'Delivered'),
(8,  '2026-02-11 10:30:00', 'Pending'),
(9,  '2026-02-12 17:15:00', 'Delivered'),
(10, '2026-02-13 13:45:00', 'Shipped'),
(11, '2026-02-14 09:05:00', 'Delivered'),
(12, '2026-02-15 16:40:00', 'Processing'),
(13, '2026-02-16 11:10:00', 'Delivered'),
(14, '2026-02-18 19:20:00', 'Delivered'),
(15, '2026-02-20 08:50:00', 'Shipped');
GO

-- OrderItems (45 rows: 3 items per order = realistic)
INSERT INTO dbo.OrderItems (OrderId, ProductId, Quantity, UnitPrice) VALUES
(1001, 101, 1, 65000.00),(1001, 103, 2,  799.00),(1001, 106, 1, 2499.00),
(1002, 104, 1,  3499.00),(1002, 103, 1,  799.00),(1002, 108, 1, 3999.00),
(1003, 105, 1, 18999.00),(1003, 103, 1,  799.00),(1003, 106, 1, 2499.00),
(1004, 107, 1, 14999.00),(1004, 106, 1, 2499.00),(1004, 103, 1,  799.00),
(1005, 113, 1, 29999.00),(1005, 111, 1, 7999.00),(1005, 103, 1,  799.00),
(1006, 112, 1,  6499.00),(1006, 103, 1,  799.00),(1006, 106, 1, 2499.00),
(1007, 110, 1, 25999.00),(1007, 109, 1,12999.00),(1007, 106, 1, 2499.00),
(1008, 111, 1,  7999.00),(1008, 104, 1, 3499.00),(1008, 103, 2,  799.00),
(1009, 115, 1, 11999.00),(1009, 108, 1, 3999.00),(1009, 106, 1, 2499.00),
(1010, 114, 1, 37999.00),(1010, 107, 1,14999.00),(1010, 103, 1,  799.00),
(1011, 103, 1,   799.00),(1011, 106, 1, 2499.00),(1011, 108, 1, 3999.00),
(1012, 109, 1, 12999.00),(1012, 104, 1, 3499.00),(1012, 106, 1, 2499.00),
(1013, 108, 1,  3999.00),(1013, 103, 1,  799.00),(1013, 115, 1,11999.00),
(1014, 102, 1, 92000.00),(1014, 105, 1,18999.00),(1014, 103, 1,  799.00),
(1015, 106, 1,  2499.00),(1015, 111, 1, 7999.00),(1015, 103, 1,  799.00);
GO

-- Update stored totals from items
UPDATE o
SET o.TotalAmount = x.TotalAmount
FROM dbo.Orders o
JOIN (
    SELECT OrderId, SUM(Quantity * UnitPrice) AS TotalAmount
    FROM dbo.OrderItems
    GROUP BY OrderId
) x ON x.OrderId = o.OrderId;
GO

/*===========================================================
  5) VALIDATION
===========================================================*/
SELECT 'Customers'  AS TableName, COUNT(*) AS RowsCount FROM dbo.Customers
UNION ALL SELECT 'Products',   COUNT(*) FROM dbo.Products
UNION ALL SELECT 'Employees',  COUNT(*) FROM dbo.Employees
UNION ALL SELECT 'Orders',     COUNT(*) FROM dbo.Orders
UNION ALL SELECT 'OrderItems', COUNT(*) FROM dbo.OrderItems;
GO

SELECT o.OrderId, o.TotalAmount,
       SUM(oi.Quantity * oi.UnitPrice) AS CalculatedTotal
FROM dbo.Orders o
JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
GROUP BY o.OrderId, o.TotalAmount
ORDER BY o.OrderId;
GO
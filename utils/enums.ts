export enum Role {
  CEO = "CEO",
  Manager = "Manager",
  Cashier = "Cashier",
  StockClerk = "Stock Clerk",
  SalesAssociate = "Sales Associate",
  CustomerServiceRepresentative = "Customer Service Representative",
  Janitor = "Janitor",
  SecurityGuard = "Security Guard",
  MarketingSpecialist = "Marketing Specialist",
  Accountant = "Accountant",
  HumanResources = "Human Resources",
  ITSupport = "IT Support",
  LogisticsCoordinator = "Logistics Coordinator",
  ProcurementSpecialist = "Procurement Specialist",
}

// Create an array from the enum values
export const RoleArray = Object.values(Role);

const expenseService = require("../services/expense.service");

exports.getExpenses = async (req, res) => {
  const { expenses, total, page, limit } = await expenseService.getExpenses(
    req.user,
    req.query,
  );

  res.status(200).json({
    success: true,
    data: expenses,
    meta: { total, page, limit },
  });
};

exports.addExpense = async (req, res) => {
  const expense = await expenseService.addExpense(req.body, req.user);

  res.status(201).json({
    success: true,
    message: "Expense added successfully",
    data: expense,
  });
};

exports.getTripExpenses = async (req, res) => {
  const expenses = await expenseService.getTripExpenses(
    req.params.tripId,
    req.user,
  );

  res.status(200).json({
    success: true,
    data: expenses,
  });
};

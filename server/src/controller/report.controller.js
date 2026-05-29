const exceljs = require("exceljs");
const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

const exportToExcel = async (req, res) => {
  try {
    const workbook = new exceljs.Workbook();
    
    // Add Trips Sheet
    const tripSheet = workbook.addWorksheet("Trips");
    tripSheet.columns = [
      { header: "Trip ID", key: "_id", width: 30 },
      { header: "Source", key: "source", width: 20 },
      { header: "Destination", key: "destination", width: 20 },
      { header: "Income", key: "income", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];
    
    const trips = await Trip.find().lean();
    trips.forEach(trip => {
      tripSheet.addRow({
          ...trip,
          _id: trip._id.toString()
      });
    });
    
    // Add Expenses Sheet
    const expenseSheet = workbook.addWorksheet("Expenses");
    expenseSheet.columns = [
      { header: "Expense ID", key: "_id", width: 30 },
      { header: "Type", key: "type", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Description", key: "description", width: 30 },
      { header: "Date", key: "date", width: 15 },
      { header: "Paid By", key: "paidBy", width: 15 },
    ];
    
    const expenses = await Expense.find().lean();
    expenses.forEach(expense => {
      expenseSheet.addRow({
          ...expense,
          _id: expense._id.toString()
      });
    });
    
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "report.xlsx"
    );
    
    await workbook.xlsx.write(res);
    res.status(200).end();
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { exportToExcel };

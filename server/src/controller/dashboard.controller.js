const dashboardService = require("../services/dashboard.service");

exports.getDashboardSummary = async (req, res) => {
  const summary = await dashboardService.getDashboardSummary();

  res.status(200).json({
    success: true,
    data: summary,
  });
};

exports.getExpenseBreakdown = async (req, res) => {
  const breakdown = await dashboardService.getExpenseBreakdown();

  res.status(200).json({
    success: true,
    data: breakdown,
  });
};

exports.getTripProfit = async (req, res) => {
  const profit = await dashboardService.getTripProfit(req.params.tripId);

  res.status(200).json({
    success: true,
    data: profit,
  });
};

exports.getRecentTrips = async (req, res) => {
  const recentTrips = await dashboardService.getRecentTrips();

  res.status(200).json({
    success: true,
    data: recentTrips,
  });
};

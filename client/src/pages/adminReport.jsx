import { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/adminReport.css";
export default function ReportAnalyticsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const res = await api.dashboard.get(); // or a dedicated /reports endpoint
    setReport(res.data.data);
  };

  if (!report) return <p>Loading report...</p>;

  return (
    <div className="report-page">
      <header className="report-header">
        <div>
          <h2>Report & Analytics</h2>
          <p>Detailed business insight & report</p>
        </div>
        <button className="export-btn">Export to Excel</button>
      </header>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">
          Total Revenue: ${report.totalRevenue}
        </div>
        <div className="summary-card">
          Total Expense: ${report.totalExpense}
        </div>
        <div className="summary-card">Net Profit: ${report.netProfit}</div>
        <div className="summary-card">
          Avg Fuel/Trip: ${report.avgFuelPerTrip}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="expense-breakdown">
        <h3>Expense Breakdown</h3>
        <ul>
          {Object.entries(report.expensesBreakdown).map(([type, value]) => (
            <li key={type}>
              <span>{type}</span>
              <span>
                ${value.amount} ({value.percent}%)
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Profit by Truck */}
      <div className="table-section">
        <h3>Profit by Truck</h3>
        <table>
          <thead>
            <tr>
              <th>Truck</th>
              <th>Trips</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {report.truckProfits.map((t) => (
              <tr key={t.truck}>
                <td>{t.truck}</td>
                <td>{t.trips}</td>
                <td>${t.revenue}</td>
                <td>${t.expenses}</td>
                <td>${t.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profit by Driver */}
      <div className="table-section">
        <h3>Profit by Driver</h3>
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Trips</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {report.driverProfits.map((d) => (
              <tr key={d.driver}>
                <td>{d.driver}</td>
                <td>{d.trips}</td>
                <td>${d.revenue}</td>
                <td>${d.expenses}</td>
                <td>${d.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Most Profitable Route */}
      <div className="table-section">
        <h3>Most Profitable Route</h3>
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Trips</th>
              <th>Revenue</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {report.routeProfits.map((r) => (
              <tr key={r.route}>
                <td>{r.route}</td>
                <td>{r.trips}</td>
                <td>${r.revenue}</td>
                <td>${r.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

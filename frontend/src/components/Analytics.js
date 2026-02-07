import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = ({ expenses, stats, categories }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Pie Chart Data - Category Distribution
  const pieData = {
    labels: stats.categoryStats ? stats.categoryStats.map(cat => cat._id) : [],
    datasets: [{
      label: 'Spending by Category',
      data: stats.categoryStats ? stats.categoryStats.map(cat => cat.total) : [],
      backgroundColor: [
        '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
        '#F38181', '#AA96DA', '#FCBAD3', '#A8E6CF'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Bar Chart Data - Category Spending
  const barData = {
    labels: stats.categoryStats ? stats.categoryStats.map(cat => cat._id) : [],
    datasets: [{
      label: 'Amount Spent (₹)',
      data: stats.categoryStats ? stats.categoryStats.map(cat => cat.total) : [],
      backgroundColor: 'rgba(102, 126, 234, 0.7)',
      borderColor: 'rgba(102, 126, 234, 1)',
      borderWidth: 1
    }]
  };

  // Line Chart Data - Daily Trend
  const lineData = {
    labels: stats.dailyTrend ? stats.dailyTrend.map(day => day._id) : [],
    datasets: [{
      label: 'Daily Spending (₹)',
      data: stats.dailyTrend ? stats.dailyTrend.map(day => day.total) : [],
      borderColor: 'rgb(102, 126, 234)',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="analytics">
      <h2>Analytics & Insights</h2>

      <div className="analytics-summary">
        <div className="analytics-stat">
          <span className="stat-label">Highest Expense</span>
          <span className="stat-value">{formatCurrency(stats.maxExpense || 0)}</span>
        </div>
        <div className="analytics-stat">
          <span className="stat-label">Lowest Expense</span>
          <span className="stat-value">{formatCurrency(stats.minExpense || 0)}</span>
        </div>
        <div className="analytics-stat">
          <span className="stat-label">Average Expense</span>
          <span className="stat-value">{formatCurrency(stats.avgExpense || 0)}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Spending by Category</h3>
          <div className="chart-wrapper">
            {stats.categoryStats && stats.categoryStats.length > 0 ? (
              <Pie data={pieData} options={chartOptions} />
            ) : (
              <p className="no-data">No data available</p>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>Category Comparison</h3>
          <div className="chart-wrapper">
            {stats.categoryStats && stats.categoryStats.length > 0 ? (
              <Bar data={barData} options={{...chartOptions, scales: { y: { beginAtZero: true } }}} />
            ) : (
              <p className="no-data">No data available</p>
            )}
          </div>
        </div>

        <div className="chart-container chart-wide">
          <h3>30-Day Spending Trend</h3>
          <div className="chart-wrapper">
            {stats.dailyTrend && stats.dailyTrend.length > 0 ? (
              <Line data={lineData} options={{...chartOptions, scales: { y: { beginAtZero: true } }}} />
            ) : (
              <p className="no-data">No data available</p>
            )}
          </div>
        </div>
      </div>

      {stats.paymentMethodStats && stats.paymentMethodStats.length > 0 && (
        <div className="payment-method-stats">
          <h3>Payment Method Distribution</h3>
          <div className="payment-methods">
            {stats.paymentMethodStats.map((method, index) => (
              <div key={index} className="payment-method-item">
                <span className="payment-method-name">{method._id}</span>
                <div className="payment-method-bar">
                  <div 
                    className="payment-method-fill"
                    style={{
                      width: `${(method.total / stats.totalAmount) * 100}%`,
                      backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                    }}
                  ></div>
                </div>
                <span className="payment-method-amount">
                  {formatCurrency(method.total)} ({method.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

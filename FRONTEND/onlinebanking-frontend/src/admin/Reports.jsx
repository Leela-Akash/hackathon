import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatRate } from '../utils/format';
import './admincss/Reports.css';

const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/reports`);
      setReports(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="spinner"></div>
        <p>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!reports) {
    return <div>No reports available</div>;
  }

  const userStats = reports.userStats || {};
  const transactionStats = reports.transactionStats || {};
  const loanStats = reports.loanStats || {};
  const revenueStats = reports.revenueStats || {};
  const systemHealth = reports.systemHealth || {};
  const loanTypeCount = reports.loanTypeCount || {};
  const loanTypeAmount = reports.loanTypeAmount || {};
  const transactionBreakdown = reports.transactionBreakdown || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>📊 System Reports & Analytics</h1>
        <button onClick={fetchReports} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Customer Account Reports */}
      <div className="report-section">
        <h2>👥 Customer Account Reports</h2>
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <h3>{formatNumber(userStats.totalCustomers)}</h3>
              <p>Total Customers</p>
              <small>{userStats.activeAccounts || 0} Active Accounts</small>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">🧑‍💼</div>
            <div className="stat-content">
              <h3>{formatNumber(userStats.totalStaff)}</h3>
              <p>Total Staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Reports */}
      <div className="report-section">
        <h2>💳 Transaction Reports</h2>
        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatCurrency(transactionStats.totalDeposits)}</h3>
              <p>Total Deposits</p>
              <small>{formatNumber(transactionStats.depositCount)} transactions</small>
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon">💸</div>
            <div className="stat-content">
              <h3>{formatCurrency(transactionStats.totalWithdrawals)}</h3>
              <p>Total Withdrawals</p>
              <small>{formatNumber(transactionStats.withdrawalCount)} transactions</small>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{formatCurrency(transactionStats.netBalance)}</h3>
              <p>Net Balance</p>
              <small>{formatNumber(transactionStats.totalTransactions)} total transactions</small>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Reports */}
      <div className="report-section">
        <h2>🏦 Loan Reports</h2>
        <div className="stats-grid">
          <div className="stat-card orange">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{formatNumber(loanStats.pendingLoans)}</h3>
              <p>Pending Loans</p>
              <small>{formatCurrency(loanStats.pendingLoanAmount)}</small>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{formatNumber(loanStats.approvedLoans)}</h3>
              <p>Approved Loans</p>
              <small>{formatCurrency(loanStats.approvedLoanAmount)}</small>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{formatNumber(loanStats.activeLoans)}</h3>
              <p>Active Loans</p>
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{formatNumber(loanStats.overdueLoans)}</h3>
              <p>Overdue Loans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Reports */}
      <div className="report-section">
        <h2>💵 Revenue Reports</h2>
        <div className="stats-grid">
          <div className="stat-card green">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>{formatCurrency(revenueStats.estimatedInterestEarnings)}</h3>
              <p>Interest Earned</p>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">💼</div>
            <div className="stat-content">
              <h3>{formatCurrency(revenueStats.serviceCharges)}</h3>
              <p>Service Charges</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatCurrency(revenueStats.totalRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Health & Compliance */}
      <div className="report-section">
        <h2>⚡ System Health & Compliance</h2>
        <div className="stats-grid">
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{formatRate(systemHealth.transactionSuccessRate, 1)}%</h3>
              <p>Transaction Success Rate</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">🖥️</div>
            <div className="stat-content">
              <h3>{systemHealth.apiUptime}%</h3>
              <p>API Uptime</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>{formatNumber(systemHealth.failedTransactions)}</h3>
              <p>Failed Transactions</p>
            </div>
          </div>
          <div className="stat-card alert">
            <div className="stat-icon">🔔</div>
            <div className="stat-content">
              <h3>{formatNumber(systemHealth.highValueTransactions)}</h3>
              <p>High-Value Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics with Charts */}
      <div className="report-section">
        <h2>📊 Transaction Volume Charts</h2>
        <div className="charts-grid">
          {/* Transaction Distribution Chart */}
          <div className="chart-card">
            <h3>Transaction Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Deposits', value: transactionBreakdown.Deposits || 0 },
                    { name: 'Withdrawals', value: transactionBreakdown.Withdrawals || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[transactionBreakdown.Deposits || 0, transactionBreakdown.Withdrawals || 0].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4caf50' : '#f44336'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Overview Chart */}
          <div className="chart-card">
            <h3>Financial Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Deposits', amount: transactionStats.totalDeposits },
                { name: 'Withdrawals', amount: transactionStats.totalWithdrawals },
                { name: 'Net Balance', amount: transactionStats.netBalance }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Loan Type Breakdown */}
      {Object.keys(loanTypeCount).length > 0 && (
        <div className="report-section">
          <h2>📈 Loan Type Breakdown</h2>
          <div className="breakdown-grid">
            <div className="breakdown-card">
              <h3>Loan Types by Count</h3>
              <div className="breakdown-list">
                {Object.entries(loanTypeCount).map(([type, count]) => (
                  <div key={type} className="breakdown-item">
                    <span className="type-name">{type}</span>
                    <span className="type-value">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="breakdown-card">
              <h3>Loan Types by Amount</h3>
              <div className="breakdown-list">
                {Object.entries(loanTypeAmount).map(([type, amount]) => (
                  <div key={type} className="breakdown-item">
                    <span className="type-name">{type}</span>
                    <span className="type-value">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

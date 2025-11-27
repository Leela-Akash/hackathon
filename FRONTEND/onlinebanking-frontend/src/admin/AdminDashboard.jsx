import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatRate, normalizeTransactionSuccessRate } from "../utils/format";
import "./admincss/AdminDashboard.css";

const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customerCount: 0,
    staffCount: 0,
    activeAccounts: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTransfers: 0,
    activeLoans: 0,
    overdueLoans: 0,
    revenue: 0,
    transactionSuccessRate: 0,
    apiUptime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [customerRes, staffRes, reportsRes] = await Promise.all([
          axios.get(`${API_URL}/customercount`),
          axios.get(`${API_URL}/staffcount`),
          axios.get(`${API_URL}/reports`)
        ]);

        const reports = reportsRes.data;
        // Normalize transactionSuccessRate to handle various API response formats
        const normalizedRate = normalizeTransactionSuccessRate(
          reports.systemHealth?.transactionSuccessRate
        );
        setStats({
          customerCount: reports.userStats?.totalCustomers || 0,
          activeAccounts: reports.userStats?.activeAccounts || 0,
          staffCount: staffRes.data,
          totalDeposits: reports.transactionStats?.totalDeposits || 0,
          totalWithdrawals: reports.transactionStats?.totalWithdrawals || 0,
          totalTransfers: reports.transactionBreakdown?.Transfers || 0,
          activeLoans: reports.loanStats?.activeLoans || 0,
          overdueLoans: reports.loanStats?.overdueLoans || 0,
          revenue: reports.revenueStats?.totalRevenue || 0,
          transactionSuccessRate: normalizedRate ?? 0,
          apiUptime: reports.systemHealth?.apiUptime || 0
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Banking System Overview</p>
        </div>
        <div className="admin-avatar">
          <span>A</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.customerCount}</h3>
            <p>Total Customers</p>
            <small>{stats.activeAccounts} Active Accounts</small>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.totalDeposits?.toLocaleString('en-IN')}</h3>
            <p>Total Deposits</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>₹{stats.totalWithdrawals?.toLocaleString('en-IN')}</h3>
            <p>Total Withdrawals</p>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{stats.totalTransfers}</h3>
            <p>Fund Transfers</p>
          </div>
        </div>
      </div>

      {/* Loan & Revenue */}
      <div className="stats-grid">
        <div className="stat-card loan-card">
          <div className="stat-icon">🏦</div>
          <div className="stat-content">
            <h3>{stats.activeLoans}</h3>
            <p>Active Loans</p>
            {stats.overdueLoans > 0 && (
              <small className="alert" style={{ color: '#f44336', fontWeight: 'bold' }}>
                ⚠️ {stats.overdueLoans} Overdue
              </small>
            )}
          </div>
        </div>
        <div className="stat-card revenue-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>₹{stats.revenue?.toLocaleString('en-IN')}</h3>
            <p>Revenue / Interest</p>
          </div>
        </div>
        <div className="stat-card health-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{formatRate(stats.transactionSuccessRate, 1)}%</h3>
            <p>Transaction Success Rate</p>
            <small>API Uptime: {stats.apiUptime}%</small>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button 
          className="reports-btn" 
          onClick={() => navigate('/staff/reports')}
        >
          📊 View Detailed Reports & Analytics
        </button>
      </div>
    </div>
  );
}

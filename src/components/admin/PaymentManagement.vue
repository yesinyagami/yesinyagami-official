<!--
  Payment Management Component
  Financial oversight and transaction management
-->

<template>
  <div class="payment-management">
    <div class="section-header">
      <h2>💳 Payment Management</h2>
      <div class="header-actions">
        <select v-model="filterPeriod" class="filter-select">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
        <button @click="exportPayments" class="export-btn">📊 Export</button>
      </div>
    </div>
    
    <!-- Revenue Overview -->
    <div class="revenue-overview">
      <div class="revenue-card total">
        <div class="revenue-icon">💰</div>
        <div class="revenue-content">
          <h3>Total Revenue</h3>
          <p class="revenue-amount">${{ totalRevenue.toLocaleString() }}</p>
          <span class="revenue-change positive">+{{ revenueGrowth }}%</span>
        </div>
      </div>
      
      <div class="revenue-card today">
        <div class="revenue-icon">📈</div>
        <div class="revenue-content">
          <h3>Today's Revenue</h3>
          <p class="revenue-amount">${{ todayRevenue.toLocaleString() }}</p>
          <span class="revenue-subtitle">{{ todayTransactions }} transactions</span>
        </div>
      </div>
      
      <div class="revenue-card monthly">
        <div class="revenue-icon">📊</div>
        <div class="revenue-content">
          <h3>Monthly Revenue</h3>
          <p class="revenue-amount">${{ monthlyRevenue.toLocaleString() }}</p>
          <span class="revenue-subtitle">Avg: ${{ avgTransaction }}</span>
        </div>
      </div>
      
      <div class="revenue-card pending">
        <div class="revenue-icon">⏳</div>
        <div class="revenue-content">
          <h3>Pending</h3>
          <p class="revenue-amount">${{ pendingAmount.toLocaleString() }}</p>
          <span class="revenue-subtitle">{{ pendingCount }} pending</span>
        </div>
      </div>
    </div>
    
    <!-- Payment Methods Distribution -->
    <div class="payment-distribution">
      <h3>Payment Methods</h3>
      <div class="distribution-grid">
        <div class="method-card coffee">
          <div class="method-info">
            <span class="method-icon">☕</span>
            <span class="method-name">Buy Me Coffee</span>
          </div>
          <div class="method-stats">
            <span class="method-amount">${{ coffeeRevenue }}</span>
            <span class="method-percentage">{{ coffeePercentage }}%</span>
          </div>
        </div>
        
        <div class="method-card ipass">
          <div class="method-info">
            <span class="method-icon">💎</span>
            <span class="method-name">iPass Money</span>
          </div>
          <div class="method-stats">
            <span class="method-amount">${{ ipassRevenue }}</span>
            <span class="method-percentage">{{ ipassPercentage }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Transactions Table -->
    <div class="transactions-section">
      <h3>Recent Transactions</h3>
      <div class="transactions-table-container">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td>
                <span class="transaction-id">{{ transaction.id }}</span>
              </td>
              <td>
                <div class="user-info">
                  <span class="user-name">{{ transaction.userName }}</span>
                  <span class="user-email">{{ transaction.userEmail }}</span>
                </div>
              </td>
              <td>
                <span class="amount">${{ transaction.amount }}</span>
              </td>
              <td>
                <span :class="['method-badge', transaction.method]">
                  {{ transaction.method === 'coffee' ? 'Buy Me Coffee' : 'iPass Money' }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', transaction.status]">
                  {{ transaction.status.toUpperCase() }}
                </span>
              </td>
              <td>
                <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="viewTransaction(transaction)" class="action-btn view" title="View Details">👁️</button>
                  <button 
                    v-if="transaction.status === 'pending'" 
                    @click="approveTransaction(transaction)" 
                    class="action-btn approve" 
                    title="Approve"
                  >✅</button>
                  <button 
                    v-if="transaction.status === 'pending'" 
                    @click="rejectTransaction(transaction)" 
                    class="action-btn reject" 
                    title="Reject"
                  >❌</button>
                  <button 
                    v-if="adminStore.isSuperAdmin && transaction.status === 'completed'" 
                    @click="refundTransaction(transaction)" 
                    class="action-btn refund" 
                    title="Refund"
                  >💸</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()

// State
const filterPeriod = ref('today')

// Mock transaction data
const transactions = ref([
  {
    id: 'TXN001',
    userName: 'Alice Chen',
    userEmail: 'alice@example.com',
    amount: 12,
    method: 'ipass',
    status: 'completed',
    date: new Date('2025-01-16T10:30:00'),
    membership: 'night_god'
  },
  {
    id: 'TXN002',
    userName: 'Bob Wilson',
    userEmail: 'bob@example.com',
    amount: 5,
    method: 'coffee',
    status: 'completed',
    date: new Date('2025-01-16T09:15:00'),
    membership: 'moon_shadow'
  },
  {
    id: 'TXN003',
    userName: 'Carol Davis',
    userEmail: 'carol@example.com',
    amount: 5,
    method: 'coffee',
    status: 'pending',
    date: new Date('2025-01-16T08:45:00'),
    membership: 'moon_shadow'
  },
  {
    id: 'TXN004',
    userName: 'David Kim',
    userEmail: 'david@example.com',
    amount: 12,
    method: 'ipass',
    status: 'completed',
    date: new Date('2025-01-15T16:20:00'),
    membership: 'night_god'
  },
  {
    id: 'TXN005',
    userName: 'Eva Rodriguez',
    userEmail: 'eva@example.com',
    amount: 3,
    method: 'coffee',
    status: 'failed',
    date: new Date('2025-01-15T14:10:00'),
    membership: 'free_spirit'
  }
])

// Computed values
const filteredTransactions = computed(() => {
  const now = new Date()
  let cutoffDate = new Date()
  
  switch (filterPeriod.value) {
    case 'today':
      cutoffDate.setHours(0, 0, 0, 0)
      break
    case 'week':
      cutoffDate.setDate(now.getDate() - 7)
      break
    case 'month':
      cutoffDate.setMonth(now.getMonth() - 1)
      break
    case 'all':
      cutoffDate = new Date(0)
      break
  }
  
  return transactions.value.filter(t => t.date >= cutoffDate)
})

const totalRevenue = computed(() => 
  transactions.value
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
)

const todayRevenue = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return transactions.value
    .filter(t => t.status === 'completed' && t.date >= today)
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthlyRevenue = computed(() => {
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  return transactions.value
    .filter(t => t.status === 'completed' && t.date >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0)
})

const todayTransactions = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return transactions.value.filter(t => t.date >= today).length
})

const avgTransaction = computed(() => {
  const completedTransactions = transactions.value.filter(t => t.status === 'completed')
  return completedTransactions.length > 0 
    ? (totalRevenue.value / completedTransactions.length).toFixed(0)
    : 0
})

const pendingAmount = computed(() =>
  transactions.value
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)
)

const pendingCount = computed(() =>
  transactions.value.filter(t => t.status === 'pending').length
)

const coffeeRevenue = computed(() =>
  transactions.value
    .filter(t => t.status === 'completed' && t.method === 'coffee')
    .reduce((sum, t) => sum + t.amount, 0)
)

const ipassRevenue = computed(() =>
  transactions.value
    .filter(t => t.status === 'completed' && t.method === 'ipass')
    .reduce((sum, t) => sum + t.amount, 0)
)

const coffeePercentage = computed(() =>
  totalRevenue.value > 0 ? Math.round((coffeeRevenue.value / totalRevenue.value) * 100) : 0
)

const ipassPercentage = computed(() =>
  totalRevenue.value > 0 ? Math.round((ipassRevenue.value / totalRevenue.value) * 100) : 0
)

const revenueGrowth = ref(23.5) // Mock growth percentage

// Methods
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function viewTransaction(transaction: any) {
  console.log('Viewing transaction:', transaction)
  // Open transaction detail modal
}

function approveTransaction(transaction: any) {
  if (confirm(`Approve transaction ${transaction.id}?`)) {
    transaction.status = 'completed'
    console.log(`Approved transaction: ${transaction.id}`)
  }
}

function rejectTransaction(transaction: any) {
  if (confirm(`Reject transaction ${transaction.id}?`)) {
    transaction.status = 'failed'
    console.log(`Rejected transaction: ${transaction.id}`)
  }
}

function refundTransaction(transaction: any) {
  if (confirm(`Issue refund for transaction ${transaction.id}? Amount: $${transaction.amount}`)) {
    console.log(`Refunded transaction: ${transaction.id}`)
    // Process refund
  }
}

function exportPayments() {
  const data = {
    transactions: filteredTransactions.value,
    summary: {
      totalRevenue: totalRevenue.value,
      todayRevenue: todayRevenue.value,
      monthlyRevenue: monthlyRevenue.value,
      avgTransaction: avgTransaction.value
    },
    exportDate: new Date().toISOString(),
    period: filterPeriod.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `night-god-tarot-payments-${filterPeriod.value}-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  console.log('Payment Management loaded')
})
</script>

<style scoped>
.payment-management {
  padding: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header h2 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.5rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
}

.export-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Revenue Overview */
.revenue-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.revenue-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(107, 70, 193, 0.2);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.revenue-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(107, 70, 193, 0.4);
}

.revenue-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.revenue-content h3 {
  margin: 0 0 0.5rem 0;
  color: #c0c0c0;
  font-size: 1rem;
  font-weight: 500;
}

.revenue-amount {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.revenue-change {
  font-size: 0.9rem;
  font-weight: 600;
}

.revenue-change.positive {
  color: #4ade80;
}

.revenue-subtitle {
  color: #a0a0a0;
  font-size: 0.9rem;
}

/* Payment Distribution */
.payment-distribution {
  margin-bottom: 2rem;
}

.payment-distribution h3 {
  margin: 0 0 1rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 500;
}

.distribution-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.method-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.method-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.method-icon {
  font-size: 1.5rem;
}

.method-name {
  color: #e0e0e0;
  font-weight: 500;
}

.method-stats {
  text-align: right;
}

.method-amount {
  display: block;
  color: #667eea;
  font-size: 1.25rem;
  font-weight: 600;
}

.method-percentage {
  color: #a0a0a0;
  font-size: 0.9rem;
}

/* Transactions Section */
.transactions-section h3 {
  margin: 0 0 1rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 500;
}

.transactions-table-container {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  text-align: left;
  color: #c0c0c0;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.transactions-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.transactions-table tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.transaction-id {
  font-family: monospace;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #e0e0e0;
  font-weight: 500;
}

.user-email {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.amount {
  color: #4ade80;
  font-weight: 600;
  font-size: 1.1rem;
}

.method-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.method-badge.coffee {
  background: rgba(139, 69, 19, 0.2);
  color: #cd853f;
}

.method-badge.ipass {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.completed {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.status-badge.failed {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.transaction-date {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn.approve:hover {
  background: rgba(34, 197, 94, 0.2);
}

.action-btn.reject:hover {
  background: rgba(239, 68, 68, 0.2);
}

.action-btn.refund:hover {
  background: rgba(245, 158, 11, 0.2);
}

/* Responsive */
@media (max-width: 1200px) {
  .transactions-table-container {
    overflow-x: auto;
  }
  
  .transactions-table {
    min-width: 800px;
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .revenue-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .distribution-grid {
    grid-template-columns: 1fr;
  }
}
</style>
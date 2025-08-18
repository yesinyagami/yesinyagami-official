<!--
  User Management Component
  Comprehensive user administration interface
-->

<template>
  <div class="user-management">
    <div class="section-header">
      <h2>👥 User Management</h2>
      <div class="header-actions">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search users..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Users</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="premium">Premium</option>
          <option value="banned">Banned</option>
        </select>
      </div>
    </div>
    
    <!-- User Stats Overview -->
    <div class="user-stats">
      <div class="stat-card">
        <span class="stat-number">{{ totalUsers }}</span>
        <span class="stat-label">Total Users</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ activeUsers }}</span>
        <span class="stat-label">Active Today</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ premiumUsers }}</span>
        <span class="stat-label">Premium Members</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ newUsers }}</span>
        <span class="stat-label">New This Week</span>
      </div>
    </div>
    
    <!-- Users Table -->
    <div class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Membership</th>
            <th>Readings</th>
            <th>Revenue</th>
            <th>Last Active</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" :class="{ 'banned': user.status === 'banned' }">
            <td>
              <div class="user-info">
                <div class="user-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-id">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="user-email">{{ user.email }}</span>
            </td>
            <td>
              <span :class="['membership-badge', user.membership]">
                {{ user.membership.toUpperCase() }}
              </span>
            </td>
            <td>
              <span class="readings-count">{{ user.readingsCount }}</span>
            </td>
            <td>
              <span class="revenue-amount">${{ user.totalRevenue }}</span>
            </td>
            <td>
              <span class="last-active">{{ formatDate(user.lastActive) }}</span>
            </td>
            <td>
              <span :class="['status-badge', user.status]">
                {{ user.status.toUpperCase() }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewUser(user)" class="action-btn view" title="View Details">👁️</button>
                <button @click="editUser(user)" class="action-btn edit" title="Edit User">✏️</button>
                <button 
                  v-if="user.status !== 'banned'" 
                  @click="banUser(user)" 
                  class="action-btn ban" 
                  title="Ban User"
                >🚫</button>
                <button 
                  v-else 
                  @click="unbanUser(user)" 
                  class="action-btn unban" 
                  title="Unban User"
                >✅</button>
                <button 
                  v-if="adminStore.isSuperAdmin" 
                  @click="deleteUser(user)" 
                  class="action-btn delete" 
                  title="Delete User"
                >🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
    </div>
    
    <!-- User Detail Modal -->
    <UserDetailModal 
      v-if="selectedUser" 
      :user="selectedUser" 
      @close="selectedUser = null" 
      @update="updateUser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import UserDetailModal from './UserDetailModal.vue'

const adminStore = useAdminStore()

// State
const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const usersPerPage = 20
const selectedUser = ref(null)

// Mock user data (replace with API call)
const users = ref([
  {
    id: 'USR001',
    name: 'Alice Chen',
    email: 'alice@example.com',
    membership: 'night_god',
    readingsCount: 45,
    totalRevenue: 540,
    lastActive: new Date('2025-01-15'),
    status: 'active',
    joinDate: new Date('2024-12-01')
  },
  {
    id: 'USR002',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    membership: 'moon_shadow',
    readingsCount: 23,
    totalRevenue: 115,
    lastActive: new Date('2025-01-14'),
    status: 'active',
    joinDate: new Date('2024-11-15')
  },
  {
    id: 'USR003',
    name: 'Carol Davis',
    email: 'carol@example.com',
    membership: 'free_spirit',
    readingsCount: 8,
    totalRevenue: 0,
    lastActive: new Date('2025-01-10'),
    status: 'inactive',
    joinDate: new Date('2024-10-20')
  },
  {
    id: 'USR004',
    name: 'David Kim',
    email: 'david@example.com',
    membership: 'night_god',
    readingsCount: 67,
    totalRevenue: 804,
    lastActive: new Date('2025-01-16'),
    status: 'active',
    joinDate: new Date('2024-09-05')
  },
  {
    id: 'USR005',
    name: 'Eva Rodriguez',
    email: 'eva@example.com',
    membership: 'moon_shadow',
    readingsCount: 12,
    totalRevenue: 60,
    lastActive: new Date('2025-01-12'),
    status: 'banned',
    joinDate: new Date('2024-12-10')
  }
])

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
    )
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(user => user.status === filterStatus.value)
  }
  
  const startIndex = (currentPage.value - 1) * usersPerPage
  return filtered.slice(startIndex, startIndex + usersPerPage)
})

const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return users.value.filter(user => user.lastActive >= today).length
})
const premiumUsers = computed(() => 
  users.value.filter(user => user.membership !== 'free_spirit').length
)
const newUsers = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return users.value.filter(user => user.joinDate >= weekAgo).length
})

const totalPages = computed(() => Math.ceil(users.value.length / usersPerPage))

// Methods
function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString()
}

function viewUser(user: any) {
  selectedUser.value = user
}

function editUser(user: any) {
  selectedUser.value = user
}

function banUser(user: any) {
  if (confirm(`Ban user ${user.name}?`)) {
    user.status = 'banned'
    console.log(`Banned user: ${user.email}`)
  }
}

function unbanUser(user: any) {
  if (confirm(`Unban user ${user.name}?`)) {
    user.status = 'active'
    console.log(`Unbanned user: ${user.email}`)
  }
}

function deleteUser(user: any) {
  if (confirm(`PERMANENTLY DELETE user ${user.name}? This action cannot be undone.`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
      console.log(`Deleted user: ${user.email}`)
    }
  }
}

function updateUser(updatedUser: any) {
  const index = users.value.findIndex(u => u.id === updatedUser.id)
  if (index > -1) {
    users.value[index] = { ...users.value[index], ...updatedUser }
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
  // Load users data
  console.log('User Management loaded')
})
</script>

<style scoped>
.user-management {
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

.search-box {
  position: relative;
}

.search-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  color: #fff;
  width: 250px;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.filter-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
}

/* User Stats */
.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(107, 70, 193, 0.2);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #a0a0a0;
  font-size: 0.9rem;
}

/* Users Table */
.users-table-container {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  text-align: left;
  color: #c0c0c0;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.users-table tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.users-table tr.banned {
  opacity: 0.6;
  background: rgba(239, 68, 68, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
}

.user-name {
  color: #e0e0e0;
  font-weight: 500;
}

.user-id {
  color: #a0a0a0;
  font-size: 0.8rem;
}

.user-email {
  color: #c0c0c0;
}

.membership-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.membership-badge.free_spirit {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
}

.membership-badge.moon_shadow {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.membership-badge.night_god {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.status-badge.inactive {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
}

.status-badge.banned {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
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

.action-btn.ban:hover {
  background: rgba(239, 68, 68, 0.2);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.3);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.2);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #a0a0a0;
}

/* Responsive */
@media (max-width: 1200px) {
  .users-table-container {
    overflow-x: auto;
  }
  
  .users-table {
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
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
  
  .user-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
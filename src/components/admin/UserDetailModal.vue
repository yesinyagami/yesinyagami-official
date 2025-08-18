<!--
  User Detail Modal Component
  Detailed view and editing for individual users
-->

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="user-detail-modal">
        <div class="modal-header">
          <h3>User Details</h3>
          <button @click="$emit('close')" class="close-btn">×</button>
        </div>
        
        <div class="modal-content">
          <div class="user-profile">
            <div class="profile-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
            <div class="profile-info">
              <h4>{{ user.name }}</h4>
              <p>{{ user.email }}</p>
              <span :class="['status-badge', user.status]">{{ user.status.toUpperCase() }}</span>
            </div>
          </div>
          
          <div class="user-details-grid">
            <div class="detail-section">
              <h5>Account Information</h5>
              <div class="detail-row">
                <span>User ID:</span>
                <span>{{ user.id }}</span>
              </div>
              <div class="detail-row">
                <span>Membership:</span>
                <span :class="['membership-badge', user.membership]">
                  {{ user.membership.replace('_', ' ').toUpperCase() }}
                </span>
              </div>
              <div class="detail-row">
                <span>Join Date:</span>
                <span>{{ formatDate(user.joinDate) }}</span>
              </div>
              <div class="detail-row">
                <span>Last Active:</span>
                <span>{{ formatDate(user.lastActive) }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h5>Usage Statistics</h5>
              <div class="detail-row">
                <span>Total Readings:</span>
                <span>{{ user.readingsCount }}</span>
              </div>
              <div class="detail-row">
                <span>Total Revenue:</span>
                <span>${{ user.totalRevenue }}</span>
              </div>
              <div class="detail-row">
                <span>Avg per Reading:</span>
                <span>${{ (user.totalRevenue / user.readingsCount || 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="adminStore.isSuperAdmin" class="admin-actions">
            <h5>Admin Actions</h5>
            <div class="action-grid">
              <button @click="upgradeMembership" class="action-button upgrade">
                🔄 Upgrade Membership
              </button>
              <button @click="addCredits" class="action-button credits">
                💰 Add Credits
              </button>
              <button @click="resetPassword" class="action-button reset">
                🔑 Reset Password
              </button>
              <button @click="viewHistory" class="action-button history">
                📋 View History
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="$emit('close')" class="btn secondary">Close</button>
          <button @click="saveChanges" class="btn primary">Save Changes</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAdminStore } from '@/stores/adminStore'

const props = defineProps<{
  user: any
}>()

const emit = defineEmits<{
  close: []
  update: [user: any]
}>()

const adminStore = useAdminStore()

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function upgradeMembership() {
  const newMembership = prompt('Enter new membership level (free_spirit, moon_shadow, night_god):')
  if (newMembership && ['free_spirit', 'moon_shadow', 'night_god'].includes(newMembership)) {
    props.user.membership = newMembership
    console.log(`Upgraded ${props.user.name} to ${newMembership}`)
  }
}

function addCredits() {
  const credits = prompt('Enter credit amount to add:')
  if (credits && !isNaN(Number(credits))) {
    console.log(`Added ${credits} credits to ${props.user.name}`)
  }
}

function resetPassword() {
  if (confirm(`Send password reset email to ${props.user.email}?`)) {
    console.log(`Password reset sent to ${props.user.email}`)
  }
}

function viewHistory() {
  console.log(`Viewing history for ${props.user.name}`)
}

function saveChanges() {
  emit('update', props.user)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.user-detail-modal {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(107, 70, 193, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  color: #e0e0e0;
  font-size: 1.5rem;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 24px;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.modal-content {
  padding: 2rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
}

.profile-info h4 {
  margin: 0 0 0.5rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
}

.profile-info p {
  margin: 0 0 0.75rem 0;
  color: #a0a0a0;
}

.user-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section h5 {
  margin: 0 0 1rem 0;
  color: #c0c0c0;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row span:first-child {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.detail-row span:last-child {
  color: #e0e0e0;
  font-weight: 500;
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

.admin-actions h5 {
  margin: 0 0 1rem 0;
  color: #c0c0c0;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.action-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-button:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.4);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 2rem 2rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .user-details-grid {
    grid-template-columns: 1fr;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
  
  .user-profile {
    flex-direction: column;
    text-align: center;
  }
}
</style>
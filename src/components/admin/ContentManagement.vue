<!--
  Content Management Component
  Manage tarot cards, readings, and site content
-->

<template>
  <div class="content-management">
    <div class="section-header">
      <h2>📋 Content Management</h2>
      <div class="header-actions">
        <button @click="addNewCard" class="add-btn">➕ Add Card</button>
      </div>
    </div>
    
    <!-- Content Categories -->>
    <div class="content-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }"
        class="tab-btn"
      >
        {{ tab.name }}
      </button>
    </div>
    
    <!-- Tarot Cards Management -->
    <div v-if="activeTab === 'cards'" class="cards-section">
      <div class="cards-stats">
        <div class="stat-item">
          <span class="stat-number">78</span>
          <span class="stat-label">Traditional Cards</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">16</span>
          <span class="stat-label">Hidden Oracle</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">94</span>
          <span class="stat-label">Total Cards</span>
        </div>
      </div>
      
      <div class="cards-grid">
        <div v-for="card in sampleCards" :key="card.id" class="card-item">
          <div class="card-preview">
            <img :src="card.image" :alt="card.name" class="card-image" />
          </div>
          <div class="card-info">
            <h4>{{ card.name }}</h4>
            <p class="card-description">{{ card.description }}</p>
            <div class="card-tags">
              <span class="tag">{{ card.suit }}</span>
              <span class="tag">{{ card.type }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button @click="editCard(card)" class="action-btn edit">✏️</button>
            <button @click="previewCard(card)" class="action-btn preview">👁️</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Site Content Management -->
    <div v-if="activeTab === 'site'" class="site-content-section">
      <div class="content-editor">
        <h3>Site Content Editor</h3>
        <div class="editor-tabs">
          <button 
            v-for="page in sitePages" 
            :key="page.id"
            @click="activePage = page.id"
            :class="{ active: activePage === page.id }"
            class="editor-tab"
          >
            {{ page.name }}
          </button>
        </div>
        
        <div class="editor-content">
          <div class="form-group">
            <label>Page Title</label>
            <input v-model="currentPageContent.title" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>Page Description</label>
            <textarea v-model="currentPageContent.description" class="form-textarea" rows="4"></textarea>
          </div>
          
          <div class="form-group">
            <label>Meta Keywords</label>
            <input v-model="currentPageContent.keywords" type="text" class="form-input" />
          </div>
          
          <div class="editor-actions">
            <button @click="savePageContent" class="btn primary">Save Changes</button>
            <button @click="previewPage" class="btn secondary">Preview</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Novel Content Management -->
    <div v-if="activeTab === 'novel'" class="novel-section">
      <div class="novel-stats">
        <div class="stat-card">
          <h4>Word Count</h4>
          <p class="stat-number">310,000</p>
        </div>
        <div class="stat-card">
          <h4>Chapters</h4>
          <p class="stat-number">24</p>
        </div>
        <div class="stat-card">
          <h4>Integration Rate</h4>
          <p class="stat-number">87%</p>
        </div>
      </div>
      
      <div class="novel-management">
        <h3>Novel Integration</h3>
        <p>Manage the 310,000-word mystical novel integrated into reading interpretations.</p>
        
        <div class="novel-actions">
          <button @click="uploadNovelChapter" class="btn primary">Upload Chapter</button>
          <button @click="analyzeNovel" class="btn secondary">Analyze Content</button>
          <button @click="reindexNovel" class="btn secondary">Reindex Database</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('cards')
const activePage = ref('home')

const tabs = [
  { id: 'cards', name: 'Tarot Cards' },
  { id: 'site', name: 'Site Content' },
  { id: 'novel', name: 'Novel Content' }
]

const sitePages = [
  { id: 'home', name: 'Home Page' },
  { id: 'about', name: 'About Page' },
  { id: 'demo', name: 'Reading Page' }
]

const currentPageContent = ref({
  title: 'Night God Tarot - Divine AI Wisdom',
  description: 'Experience profound tarot readings through unlimited Monica AI intelligence.',
  keywords: 'tarot, AI, readings, Monica AI, divination'
})

const sampleCards = ref([
  {
    id: 1,
    name: 'The Fool',
    description: 'New beginnings, innocence, spontaneity',
    image: '/assets/01_The_Fool.png',
    suit: 'Major Arcana',
    type: 'Traditional'
  },
  {
    id: 2,
    name: 'The Magician',
    description: 'Manifestation, resourcefulness, power',
    image: '/assets/02_The_Magician.png',
    suit: 'Major Arcana',
    type: 'Traditional'
  },
  {
    id: 79,
    name: 'The Hidden Oracle',
    description: 'Secret knowledge, hidden wisdom',
    image: '/assets/79_The_Hidden_Oracle.png',
    suit: 'Hidden Oracle',
    type: 'Special'
  }
])

function addNewCard() {
  console.log('Adding new tarot card...')
}

function editCard(card: any) {
  console.log('Editing card:', card.name)
}

function previewCard(card: any) {
  console.log('Previewing card:', card.name)
}

function savePageContent() {
  console.log('Saving page content:', currentPageContent.value)
}

function previewPage() {
  console.log('Previewing page content')
}

function uploadNovelChapter() {
  console.log('Uploading novel chapter...')
}

function analyzeNovel() {
  console.log('Analyzing novel content...')
}

function reindexNovel() {
  console.log('Reindexing novel database...')
}
</script>

<style scoped>
.content-management {
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

.add-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.content-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.cards-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.card-preview {
  text-align: center;
  margin-bottom: 1rem;
}

.card-image {
  width: 80px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-info h4 {
  margin: 0 0 0.5rem 0;
  color: #e0e0e0;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-description {
  margin: 0 0 1rem 0;
  color: #a0a0a0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.card-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.4);
}

.content-editor {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 2rem;
}

.content-editor h3 {
  margin: 0 0 1.5rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 500;
}

.editor-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-tab {
  background: none;
  border: none;
  color: #a0a0a0;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.editor-tab:hover {
  color: #fff;
}

.editor-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #c0c0c0;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.editor-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.novel-stats {
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
}

.stat-card h4 {
  margin: 0 0 0.5rem 0;
  color: #c0c0c0;
  font-size: 1rem;
  font-weight: 500;
}

.stat-card .stat-number {
  color: #667eea;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.novel-management {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 2rem;
}

.novel-management h3 {
  margin: 0 0 1rem 0;
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 500;
}

.novel-management p {
  margin: 0 0 2rem 0;
  color: #a0a0a0;
  line-height: 1.6;
}

.novel-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .cards-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .novel-actions {
    flex-direction: column;
  }
  
  .editor-actions {
    flex-direction: column;
  }
}
</style>
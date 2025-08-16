#!/usr/bin/env node

/**
 * Night God Tarot Resource Scanner
 * Scans and organizes all project resources
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const sourceProjects = [
  path.join(__dirname, '../../night-god-tarot-unified'),
  path.join(__dirname, '../../night-god-tarot')
]

class ResourceScanner {
  constructor() {
    this.resources = {
      tarotCards: [],
      hiddenCards: [],
      brandingAssets: [],
      audioFiles: [],
      novelFiles: [],
      designAssets: [],
      iconFiles: [],
      backgroundImages: [],
      fonts: [],
      other: []
    }
    
    this.manifest = {
      version: '2.0.0',
      generatedAt: new Date().toISOString(),
      totalFiles: 0,
      categories: {},
      dependencies: {},
      structure: {}
    }
  }

  /**
   * Scan all source projects for resources
   */
  async scanAllResources() {
    console.log('🔍 Scanning Night God Tarot resources...')
    
    for (const sourceProject of sourceProjects) {
      if (fs.existsSync(sourceProject)) {
        console.log(`📁 Scanning: ${sourceProject}`)
        await this.scanDirectory(sourceProject)
      }
    }
    
    await this.organizeResources()
    await this.generateManifest()
    
    console.log('✅ Resource scanning complete!')
    return this.manifest
  }

  /**
   * Scan directory recursively
   */
  async scanDirectory(dirPath, category = 'other') {
    try {
      const items = fs.readdirSync(dirPath)
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item)
        const stats = fs.statSync(fullPath)
        
        if (stats.isDirectory()) {
          // Determine category based on directory name
          let newCategory = this.categorizeDirectory(item)
          await this.scanDirectory(fullPath, newCategory)
        } else if (stats.isFile()) {
          await this.processFile(fullPath, category)
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan ${dirPath}:`, error.message)
    }
  }

  /**
   * Categorize directory based on name
   */
  categorizeDirectory(dirname) {
    const categories = {
      'tarot-cards': 'tarotCards',
      'cards': 'tarotCards',
      'hidden-cards': 'hiddenCards',
      'hidden': 'hiddenCards',
      'branding': 'brandingAssets',
      'logo': 'brandingAssets',
      'audio': 'audioFiles',
      'sound': 'audioFiles',
      'novel': 'novelFiles',
      'story': 'novelFiles',
      'text': 'novelFiles',
      'design': 'designAssets',
      'css': 'designAssets',
      'styles': 'designAssets',
      'icons': 'iconFiles',
      'backgrounds': 'backgroundImages',
      'bg': 'backgroundImages',
      'fonts': 'fonts',
      'font': 'fonts'
    }
    
    return categories[dirname.toLowerCase()] || 'other'
  }

  /**
   * Process individual file
   */
  async processFile(filePath, category) {
    const ext = path.extname(filePath).toLowerCase()
    const basename = path.basename(filePath)
    const size = fs.statSync(filePath).size
    
    // Skip node_modules and system files
    if (filePath.includes('node_modules') || 
        filePath.includes('.git') || 
        basename.startsWith('.') ||
        basename.includes('test') ||
        basename.includes('spec')) {
      return
    }
    
    const fileInfo = {
      name: basename,
      path: filePath,
      relativePath: path.relative(projectRoot, filePath),
      extension: ext,
      size: size,
      category: this.categorizeFile(basename, ext, category),
      lastModified: fs.statSync(filePath).mtime,
      type: this.getFileType(ext)
    }
    
    // Add to appropriate category
    const cat = fileInfo.category
    if (!this.resources[cat]) {
      this.resources[cat] = []
    }
    this.resources[cat].push(fileInfo)
    
    this.manifest.totalFiles++
  }

  /**
   * Categorize file based on name and extension
   */
  categorizeFile(filename, ext, dirCategory) {
    // Image files
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
      if (filename.match(/^\d{2}_/) || filename.includes('tarot')) {
        return 'tarotCards'
      }
      if (filename.includes('hidden') || filename.match(/^\d{2,3}_The_/)) {
        return 'hiddenCards'
      }
      if (filename.includes('logo') || filename.includes('brand')) {
        return 'brandingAssets'
      }
      if (filename.includes('icon')) {
        return 'iconFiles'
      }
      if (filename.includes('bg') || filename.includes('background')) {
        return 'backgroundImages'
      }
    }
    
    // Audio files
    if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
      return 'audioFiles'
    }
    
    // Text/Novel files
    if (['.txt', '.md', '.json'].includes(ext) && 
        (filename.includes('novel') || filename.includes('story') || filename.includes('chapter'))) {
      return 'novelFiles'
    }
    
    // Design files
    if (['.css', '.scss', '.less'].includes(ext)) {
      return 'designAssets'
    }
    
    // Font files
    if (['.woff', '.woff2', '.ttf', '.otf'].includes(ext)) {
      return 'fonts'
    }
    
    return dirCategory || 'other'
  }

  /**
   * Get file type description
   */
  getFileType(ext) {
    const types = {
      '.png': 'PNG Image',
      '.jpg': 'JPEG Image',
      '.jpeg': 'JPEG Image',
      '.gif': 'GIF Image',
      '.svg': 'SVG Vector',
      '.webp': 'WebP Image',
      '.mp3': 'MP3 Audio',
      '.wav': 'WAV Audio',
      '.ogg': 'OGG Audio',
      '.m4a': 'M4A Audio',
      '.txt': 'Text File',
      '.md': 'Markdown',
      '.json': 'JSON Data',
      '.css': 'CSS Stylesheet',
      '.scss': 'SCSS Stylesheet',
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.vue': 'Vue Component',
      '.woff': 'WOFF Font',
      '.woff2': 'WOFF2 Font',
      '.ttf': 'TrueType Font',
      '.otf': 'OpenType Font'
    }
    
    return types[ext] || 'Unknown'
  }

  /**
   * Organize resources into target structure
   */
  async organizeResources() {
    console.log('📋 Organizing resources...')
    
    const targetStructure = {
      'public/assets/tarot-cards/': this.resources.tarotCards,
      'public/assets/hidden-cards/': this.resources.hiddenCards,
      'public/assets/branding/': this.resources.brandingAssets,
      'public/assets/icons/': this.resources.iconFiles,
      'public/assets/backgrounds/': this.resources.backgroundImages,
      'public/assets/fonts/': this.resources.fonts,
      'public/assets/audio/': this.resources.audioFiles,
      'src/assets/novel/': this.resources.novelFiles,
      'src/assets/design/': this.resources.designAssets
    }
    
    for (const [targetDir, files] of Object.entries(targetStructure)) {
      if (files && files.length > 0) {
        const fullTargetDir = path.join(projectRoot, targetDir)
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(fullTargetDir)) {
          fs.mkdirSync(fullTargetDir, { recursive: true })
        }
        
        // Copy files (in a real implementation)
        console.log(`📁 ${targetDir}: ${files.length} files`)
        
        for (const file of files) {
          console.log(`  📄 ${file.name} (${this.formatSize(file.size)})`)
        }
      }
    }
  }

  /**
   * Generate comprehensive manifest
   */
  async generateManifest() {
    console.log('📝 Generating manifest...')
    
    // Calculate statistics
    this.manifest.categories = {}
    for (const [category, files] of Object.entries(this.resources)) {
      if (files && files.length > 0) {
        this.manifest.categories[category] = {
          count: files.length,
          totalSize: files.reduce((sum, f) => sum + f.size, 0),
          types: [...new Set(files.map(f => f.type))],
          lastUpdated: new Date(Math.max(...files.map(f => new Date(f.lastModified)))).toISOString()
        }
      }
    }
    
    // Tarot cards analysis
    if (this.resources.tarotCards.length > 0) {
      this.manifest.tarotCards = {
        total: this.resources.tarotCards.length,
        expected: 78,
        missing: 78 - this.resources.tarotCards.length,
        complete: this.resources.tarotCards.length >= 78,
        formats: [...new Set(this.resources.tarotCards.map(f => f.extension))],
        naming: this.analyzeTarotCardNaming()
      }
    }
    
    // Hidden cards analysis
    if (this.resources.hiddenCards.length > 0) {
      this.manifest.hiddenCards = {
        total: this.resources.hiddenCards.length,
        expected: 15,
        complete: this.resources.hiddenCards.length >= 15,
        formats: [...new Set(this.resources.hiddenCards.map(f => f.extension))]
      }
    }
    
    // Novel analysis
    if (this.resources.novelFiles.length > 0) {
      this.manifest.novel = {
        files: this.resources.novelFiles.length,
        totalSize: this.resources.novelFiles.reduce((sum, f) => sum + f.size, 0),
        estimatedWords: Math.floor(this.resources.novelFiles.reduce((sum, f) => sum + f.size, 0) / 5), // Rough estimate
        formats: [...new Set(this.resources.novelFiles.map(f => f.extension))]
      }
    }
    
    // Dependencies
    this.manifest.dependencies = {
      vue: '^3.5.18',
      typescript: '~5.8.0',
      vite: '^7.0.6',
      tailwindcss: 'latest',
      three: 'latest',
      gsap: 'latest',
      'socket.io-client': 'latest',
      monica_ai: 'integrated'
    }
    
    // Project structure
    this.manifest.structure = {
      'src/components/cards/': 'Tarot card components',
      'src/components/spreads/': 'Tarot spread layouts',
      'src/components/ai/': 'Monica AI integration',
      'src/components/payment/': 'Payment system',
      'src/components/3d/': '3D effects and visuals',
      'src/services/monica/': 'Monica AI services',
      'src/services/ai/': 'AI orchestration',
      'src/data/': 'Static data files',
      'src/types/': 'TypeScript definitions',
      'public/assets/': 'Static assets',
      'server/': 'Backend services'
    }
    
    // Save manifest
    const manifestPath = path.join(projectRoot, 'public/data/resources-manifest.json')
    const manifestDir = path.dirname(manifestPath)
    
    if (!fs.existsSync(manifestDir)) {
      fs.mkdirSync(manifestDir, { recursive: true })
    }
    
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2))
    console.log(`📋 Manifest saved: ${manifestPath}`)
  }

  /**
   * Analyze tarot card naming patterns
   */
  analyzeTarotCardNaming() {
    const patterns = {
      numbered: 0, // 01_The_Fool.png
      underscored: 0, // the_fool.png
      dashed: 0, // the-fool.png
      camelCase: 0 // theFool.png
    }
    
    for (const card of this.resources.tarotCards) {
      if (card.name.match(/^\d{2}_/)) patterns.numbered++
      else if (card.name.includes('_')) patterns.underscored++
      else if (card.name.includes('-')) patterns.dashed++
      else patterns.camelCase++
    }
    
    return patterns
  }

  /**
   * Format file size
   */
  formatSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// Create scanner and run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const scanner = new ResourceScanner()
  scanner.scanAllResources().then(manifest => {
    console.log('\n🎉 Resource scanning complete!')
    console.log(`📊 Total files: ${manifest.totalFiles}`)
    console.log(`📁 Categories: ${Object.keys(manifest.categories).length}`)
    console.log(`🃏 Tarot cards: ${manifest.tarotCards?.total || 0}/78`)
    console.log(`✨ Hidden cards: ${manifest.hiddenCards?.total || 0}/15`)
    
    if (manifest.novel) {
      console.log(`📚 Novel: ~${manifest.novel.estimatedWords.toLocaleString()} words`)
    }
  }).catch(error => {
    console.error('❌ Scanning failed:', error)
    process.exit(1)
  })
}

export { ResourceScanner }
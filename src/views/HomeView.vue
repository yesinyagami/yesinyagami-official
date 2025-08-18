<template>
  <div class="min-h-screen overflow-hidden relative">
    <!-- Premium Cosmic Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-black">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,215,0,0.05),transparent_50%)]">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.08),transparent_50%)]">
            <!-- Animated Stars -->
            <div class="stars-field"></div>
            <div class="stars-field stars-2"></div>
            <div class="stars-field stars-3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-40 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Premium Logo -->
        <div class="text-center mb-16">
          <div class="inline-block relative group">
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700"></div>
            <img src="@/assets/night-god-logo.jpg" alt="Night God Tarot" 
                 class="relative w-32 h-32 mx-auto rounded-full shadow-2xl border border-yellow-400/30 group-hover:border-yellow-400/60 transition-all duration-500 backdrop-blur-sm" />
          </div>
        </div>

        <div class="text-center mb-20">
          <!-- Elite Headlines -->
          <div class="mb-8 space-y-4">
            <h1 class="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent leading-tight tracking-tight">
              NIGHT GOD
            </h1>
            <div class="text-3xl md:text-5xl font-light text-white/90 tracking-[0.2em] uppercase">
              Divine • AI • Oracle
            </div>
          </div>
          
          <p class="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the world's most advanced AI-powered tarot readings.<br/>
            <span class="text-yellow-400/80">Trusted by discerning seekers worldwide.</span>
          </p>
          
          <!-- Elite Credentials -->
          <div class="flex flex-wrap justify-center gap-6 mb-16">
            <div class="premium-badge">
              <div class="premium-badge-icon">⚡</div>
              <div class="premium-badge-text">
                <div class="font-semibold text-white">Instant Access</div>
                <div class="text-yellow-400/70 text-sm">24/7 Global</div>
              </div>
            </div>
            <div class="premium-badge">
              <div class="premium-badge-icon">🧠</div>
              <div class="premium-badge-text">
                <div class="font-semibold text-white">AI Precision</div>
                <div class="text-yellow-400/70 text-sm">98% Accuracy</div>
              </div>
            </div>
            <div class="premium-badge">
              <div class="premium-badge-icon">👑</div>
              <div class="premium-badge-text">
                <div class="font-semibold text-white">Elite Tier</div>
                <div class="text-yellow-400/70 text-sm">Premium Only</div>
              </div>
            </div>
          </div>
          
          <!-- Premium CTA Section -->
          <div class="space-y-12">
            <!-- Main CTA -->
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
              <router-link to="/demo" class="relative block max-w-md mx-auto">
                <div class="luxury-cta-button">
                  <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-2xl"></div>
                  <div class="relative px-12 py-6 bg-gradient-to-r from-black/80 via-black/60 to-black/80 m-0.5 rounded-2xl border border-yellow-400/30">
                    <div class="text-center">
                      <div class="text-3xl font-bold text-yellow-400 mb-2 tracking-wide">
                        BEGIN YOUR JOURNEY
                      </div>
                      <div class="text-white/90 text-lg font-light">
                        Experience Divine Wisdom
                      </div>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
            
            <!-- Elite Trust Elements -->
            <div class="text-center space-y-4">
              <div class="text-slate-400 font-light tracking-wider uppercase text-sm">
                Trusted by Discerning Clients Worldwide
              </div>
              <div class="flex justify-center items-center gap-1 text-yellow-400">
                <span class="text-2xl">★★★★★</span>
              </div>
              <div class="text-slate-300 text-sm font-light">
                Exclusively serving premium clientele since 2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Premium Features Section -->
    <section class="relative py-32 px-6">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent"></div>
      <div class="max-w-7xl mx-auto relative">
        <div class="text-center mb-20">
          <h2 class="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            <span class="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Unparalleled</span><br/>
            <span class="font-light text-white/90">Excellence</span>
          </h2>
          <p class="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Experience features that surpass the world's leading platforms
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="luxury-feature-card group">
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-2xl group-hover:from-yellow-400/20 transition-all duration-700"></div>
            <div class="relative p-8 text-center">
              <div class="luxury-icon mb-6">
                <div class="text-5xl">⚡</div>
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">Instant Oracle</h3>
              <p class="text-slate-300 leading-relaxed font-light">
                Lightning-fast AI processing delivers profound insights in seconds, not minutes.
              </p>
            </div>
          </div>
          
          <div class="luxury-feature-card group">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent rounded-2xl group-hover:from-purple-400/20 transition-all duration-700"></div>
            <div class="relative p-8 text-center">
              <div class="luxury-icon mb-6">
                <div class="text-5xl">🧠</div>
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">AI Mastery</h3>
              <p class="text-slate-300 leading-relaxed font-light">
                Advanced neural networks trained on millennia of mystical wisdom and modern psychology.
              </p>
            </div>
          </div>
          
          <div class="luxury-feature-card group">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent rounded-2xl group-hover:from-blue-400/20 transition-all duration-700"></div>
            <div class="relative p-8 text-center">
              <div class="luxury-icon mb-6">
                <div class="text-5xl">👑</div>
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">Elite Tier</h3>
              <p class="text-slate-300 leading-relaxed font-light">
                Exclusively crafted for discerning individuals who demand the highest quality guidance.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Industry Recognition -->
        <div class="mt-16 text-center">
          <h3 class="text-2xl font-bold text-white mb-8">Recognized by Leading Media</h3>
          <div class="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <div class="text-white font-semibold">CBS • Featured</div>
            <div class="text-white font-semibold">USA Today • Reviewed</div>
            <div class="text-white font-semibold">Good Morning America • Highlighted</div>
            <div class="text-white font-semibold">TechCrunch • AI Innovation</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reading Categories -->
    <section class="py-16 px-4">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          What's on Your Mind?
        </h2>
        
        <div class="grid md:grid-cols-3 gap-6">
          <router-link to="/demo" class="category-card group">
            <div class="text-4xl mb-4">💕</div>
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Love & Relationships</h3>
            <p class="text-gray-300 text-sm">Find clarity about your romantic life, soulmate connections, and relationship challenges.</p>
          </router-link>
          
          <router-link to="/demo" class="category-card group">
            <div class="text-4xl mb-4">💼</div>
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Career & Money</h3>
            <p class="text-gray-300 text-sm">Get guidance on career decisions, financial opportunities, and professional growth.</p>
          </router-link>
          
          <router-link to="/demo" class="category-card group">
            <div class="text-4xl mb-4">🌟</div>
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Spiritual Growth</h3>
            <p class="text-gray-300 text-sm">Discover your life purpose, spiritual path, and personal transformation journey.</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Pricing Plans -->
    <section class="py-16 px-4 bg-black/30">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Reading Experience
          </h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            From quick insights to comprehensive spiritual guidance. All readings include AI-powered interpretations and personalized insights.
          </p>
        </div>
        
        <div class="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-6">
          <!-- Mysticsense Style - Entry Level -->
          <div class="pricing-card-global basic">
            <div class="platform-badge">Mysticsense Style</div>
            <div class="text-center">
              <h3 class="text-lg font-bold text-blue-400 mb-2">Quick Oracle</h3>
              <div class="text-3xl font-bold text-white mb-1">$10</div>
              <div class="text-gray-400 text-sm mb-6">3 cards • 5 min free trial</div>
              <ul class="text-left text-sm text-gray-300 space-y-2 mb-6">
                <li>✓ 3 Tarot Cards</li>
                <li>✓ 1 AI Oracle</li>
                <li>✓ Basic Interpretation</li>
                <li>✓ Instant Delivery</li>
                <li>✓ Mobile App Access</li>
              </ul>
              <router-link to="/demo" class="cta-button-mysticsense">
                Start 5 Min Free
              </router-link>
            </div>
          </div>
          
          <!-- AskNow Style - Professional -->
          <div class="pricing-card-global professional">
            <div class="platform-badge">AskNow Quality</div>
            <div class="text-center">
              <h3 class="text-lg font-bold text-green-400 mb-2">Professional</h3>
              <div class="text-3xl font-bold text-white mb-1">$50</div>
              <div class="text-gray-400 text-sm mb-6">5 cards • 20+ years expertise</div>
              <ul class="text-left text-sm text-gray-300 space-y-2 mb-6">
                <li>✓ 5 Tarot Cards</li>
                <li>✓ 2 AI Oracles</li>
                <li>✓ Video Reading Option</li>
                <li>✓ Callback Scheduling</li>
                <li>✓ 24/7 Support</li>
              </ul>
              <router-link to="/demo" class="cta-button-asknow">
                $1/min + Free
              </router-link>
            </div>
          </div>
          
          <!-- Keen Style - Most Popular -->
          <div class="pricing-card-global featured keen-style">
            <div class="popular-badge-global">KEEN'S MOST POPULAR</div>
            <div class="satisfaction-badge">💯 100% Satisfaction</div>
            <div class="text-center">
              <h3 class="text-lg font-bold text-yellow-400 mb-2">Premium Oracle</h3>
              <div class="text-3xl font-bold text-white mb-1">$100</div>
              <div class="text-gray-400 text-sm mb-6">7 cards • Keen guarantee</div>
              <ul class="text-left text-sm text-gray-300 space-y-2 mb-6">
                <li>✓ 7 Tarot Cards</li>
                <li>✓ 3 AI Oracles</li>
                <li>✓ Keen-Style Matching</li>
                <li>✓ Satisfaction Guarantee</li>
                <li>✓ Priority Support</li>
              </ul>
              <router-link to="/demo" class="cta-button-keen">
                ✨ Get Guaranteed Results
              </router-link>
            </div>
          </div>
          
          <!-- California Psychics Style - VIP -->
          <div class="pricing-card-global vip california-style">
            <div class="platform-badge california">California Premium</div>
            <div class="text-center">
              <h3 class="text-lg font-bold text-purple-400 mb-2">VIP Oracle</h3>
              <div class="text-3xl font-bold text-white mb-1">$300</div>
              <div class="text-gray-400 text-sm mb-6">10 cards • Life-changing guarantee</div>
              <ul class="text-left text-sm text-gray-300 space-y-2 mb-6">
                <li>✓ 10 Premium Cards</li>
                <li>✓ 4 Elite AI Oracles</li>
                <li>✓ Life-Changing Guarantee</li>
                <li>✓ 25+ Years Expertise</li>
                <li>✓ Premium Matching</li>
              </ul>
              <router-link to="/demo" class="cta-button-california">
                Life-Changing Promise
              </router-link>
            </div>
          </div>
          
          <!-- Ultra Divine - Global Premium -->
          <div class="pricing-card-global ultra premium-global">
            <div class="platform-badge ultra-badge">All Platforms Combined</div>
            <div class="text-center">
              <h3 class="text-lg font-bold text-gold mb-2">Ultra Divine</h3>
              <div class="text-3xl font-bold text-white mb-1">$5,000</div>
              <div class="text-gray-400 text-sm mb-6">15 cards • Complete mastery</div>
              <ul class="text-left text-sm text-gray-300 space-y-2 mb-6">
                <li>✓ 15 Master Cards</li>
                <li>✓ All 4 Premium Oracles</li>
                <li>✓ Oranum Video Technology</li>
                <li>✓ Global Elite Standards</li>
                <li>✓ Divine Transformation</li>
              </ul>
              <router-link to="/demo" class="cta-button-ultra">
                👑 Divine Mastery
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Global Standards Policy -->
        <div class="mt-16 grid md:grid-cols-3 gap-6">
          <div class="policy-card satisfaction">
            <h4 class="text-green-400 font-bold text-lg mb-2">🔄 Satisfaction Guarantee</h4>
            <p class="text-gray-300 text-sm">
              Following California Psychics & Keen standards: If not life-changing, choose another tier or get support.
            </p>
          </div>
          
          <div class="policy-card quality">
            <h4 class="text-blue-400 font-bold text-lg mb-2">👑 Elite Quality Promise</h4>
            <p class="text-gray-300 text-sm">
              Only 2% acceptance rate like premium platforms. 98% accuracy guaranteed with advanced AI oracles.
            </p>
          </div>
          
          <div class="policy-card spiritual">
            <h4 class="text-purple-400 font-bold text-lg mb-2">⚡ Instant Divine Access</h4>
            <p class="text-gray-300 text-sm">
              Psychic Source speed + Oranum technology. Spiritual guidance delivered instantly, available 24/7 globally.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust & Stats Section -->
    <section class="py-16 px-4 bg-black/30">
      <div class="container mx-auto max-w-6xl">
        <!-- Stats Row -->
        <div class="grid md:grid-cols-4 gap-8 mb-16 text-center">
          <div class="stat-item">
            <div class="text-4xl font-bold text-green-400 mb-2">50,000+</div>
            <p class="text-gray-300">Readings Delivered</p>
          </div>
          <div class="stat-item">
            <div class="text-4xl font-bold text-blue-400 mb-2">24/7</div>
            <p class="text-gray-300">Available Instantly</p>
          </div>
          <div class="stat-item">
            <div class="text-4xl font-bold text-purple-400 mb-2">98%</div>
            <p class="text-gray-300">Satisfaction Rate</p>
          </div>
          <div class="stat-item">
            <div class="text-4xl font-bold text-yellow-400 mb-2">5⭐</div>
            <p class="text-gray-300">Average Rating</p>
          </div>
        </div>
        
        <!-- Live Reviews Section -->
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-8">💬 What Our Users Say</h2>
          <div class="bg-green-900/20 border border-green-400/30 rounded-lg p-4 mb-8 inline-block">
            <span class="text-green-400 font-semibold text-sm">🟢 LIVE REVIEWS</span>
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="testimonial-card-enhanced">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold mr-3">S</div>
              <div>
                <p class="text-white font-semibold">Sarah Mitchell</p>
                <div class="text-yellow-400 text-sm">⭐⭐⭐⭐⭐ Verified Purchase</div>
              </div>
            </div>
            <p class="text-gray-300 mb-4 italic">"Just got my Premium reading and I'm blown away! The accuracy about my love life was spot-on. Monica AI picked up on things no human psychic ever has. Worth every penny! 💕"</p>
            <p class="text-gray-400 text-xs">VIP Reading • 2 hours ago</p>
          </div>
          
          <div class="testimonial-card-enhanced">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-3">M</div>
              <div>
                <p class="text-white font-semibold">Marcus Rodriguez</p>
                <div class="text-yellow-400 text-sm">⭐⭐⭐⭐⭐ Verified Purchase</div>
              </div>
            </div>
            <p class="text-gray-300 mb-4 italic">"Career guidance was incredible! The AI predicted a job opportunity that literally came true 3 days later. I'm a believer now. Getting the Ultra Divine next! 🚀"</p>
            <p class="text-gray-400 text-xs">Professional Reading • 6 hours ago</p>
          </div>
          
          <div class="testimonial-card-enhanced">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold mr-3">E</div>
              <div>
                <p class="text-white font-semibold">Emma Thompson</p>
                <div class="text-yellow-400 text-sm">⭐⭐⭐⭐⭐ Verified Purchase</div>
              </div>
            </div>
            <p class="text-gray-300 mb-4 italic">"I've tried Keen, Kasamba, all of them. Night God Tarot's AI is revolutionary. The depth of insight is unmatched. This is the future of spiritual guidance! ✨"</p>
            <p class="text-gray-400 text-xs">Ultra Divine Reading • 12 hours ago</p>
          </div>
        </div>
        
        <!-- Trust Badges -->
        <div class="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-gray-700">
          <div class="trust-badge">
            <span class="text-green-400">🔒</span>
            <span class="text-white text-sm">SSL Secured</span>
          </div>
          <div class="trust-badge">
            <span class="text-blue-400">💳</span>
            <span class="text-white text-sm">Secure Payments</span>
          </div>
          <div class="trust-badge">
            <span class="text-purple-400">🛡️</span>
            <span class="text-white text-sm">Privacy Protected</span>
          </div>
          <div class="trust-badge">
            <span class="text-yellow-400">⚡</span>
            <span class="text-white text-sm">Instant Delivery</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-20 px-4 text-center">
      <div class="container mx-auto max-w-4xl">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Discover Your Path?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Get instant clarity about your love life, career, and spiritual journey
        </p>
        <router-link to="/demo" class="inline-block px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl rounded-lg hover:from-green-400 hover:to-green-500 transform hover:scale-105 transition-all duration-300 shadow-xl">
          🔮 Start Your FREE Reading
        </router-link>
        <p class="text-gray-400 text-sm mt-4">Join thousands who've found clarity through Night God Tarot</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Professional homepage based on leading tarot platforms
</script>

<style scoped>
/* Premium Animated Stars Background */
.stars-field {
  position: absolute;
  width: 200%;
  height: 200%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,215,0,0.4), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.2), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(139,92,246,0.3), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.2), transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: stars-move 120s linear infinite;
  opacity: 0.5;
}

.stars-2 {
  background-image: 
    radial-gradient(1px 1px at 50px 50px, rgba(255,255,255,0.2), transparent),
    radial-gradient(2px 2px at 100px 20px, rgba(255,215,0,0.3), transparent),
    radial-gradient(1px 1px at 150px 90px, rgba(255,255,255,0.1), transparent);
  animation-duration: 180s;
  animation-direction: reverse;
}

.stars-3 {
  background-image: 
    radial-gradient(1px 1px at 75px 25px, rgba(139,92,246,0.2), transparent),
    radial-gradient(2px 2px at 125px 75px, rgba(255,255,255,0.15), transparent);
  animation-duration: 240s;
}

@keyframes stars-move {
  from { transform: translateY(0px); }
  to { transform: translateY(-200px); }
}

/* Premium Badge Styles */
.premium-badge {
  @apply flex items-center gap-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transition: all 0.5s ease;
}

.premium-badge:hover {
  @apply border-yellow-400/30 bg-gradient-to-r from-yellow-400/10 to-white/10;
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255,215,0,0.2);
}

.premium-badge-icon {
  @apply text-3xl;
  filter: drop-shadow(0 0 10px rgba(255,215,0,0.5));
}

.premium-badge-text {
  @apply text-left;
}

/* Luxury CTA Button */
.luxury-cta-button {
  @apply relative transform transition-all duration-500;
  filter: drop-shadow(0 20px 40px rgba(255,215,0,0.3));
}

.luxury-cta-button:hover {
  transform: translateY(-4px) scale(1.02);
  filter: drop-shadow(0 30px 60px rgba(255,215,0,0.5));
}

/* Luxury Feature Cards */
.luxury-feature-card {
  @apply relative bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl transition-all duration-700;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.luxury-feature-card:hover {
  @apply border-white/30;
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.luxury-icon {
  @apply inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400/20 to-purple-400/20 backdrop-blur-sm border border-yellow-400/30;
  filter: drop-shadow(0 0 20px rgba(255,215,0,0.3));
}

/* Pricing Cards - Ultra Premium */
.pricing-card-global {
  @apply relative bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border rounded-3xl p-8 transition-all duration-700;
  box-shadow: 0 15px 50px rgba(0,0,0,0.4);
}

.pricing-card-global.basic {
  @apply border-blue-400/30;
}

.pricing-card-global.professional {
  @apply border-green-400/30;
}

.pricing-card-global.featured {
  @apply border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 to-transparent;
  transform: scale(1.05);
}

.pricing-card-global.keen-style {
  @apply border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 to-transparent;
}

.pricing-card-global.vip {
  @apply border-purple-400/30;
}

.pricing-card-global.california-style {
  @apply border-purple-400/40 bg-gradient-to-br from-purple-400/10 to-transparent;
}

.pricing-card-global.ultra {
  @apply border-yellow-400/50 bg-gradient-to-br from-yellow-400/15 to-purple-400/10;
}

.pricing-card-global.premium-global {
  @apply border-yellow-400/60 bg-gradient-to-br from-yellow-400/20 to-purple-400/15;
}

.pricing-card-global:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 80px rgba(0,0,0,0.5);
}

.pricing-card-global.featured:hover {
  transform: translateY(-10px) scale(1.07);
}

/* Platform Badges */
.platform-badge {
  @apply absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-700 to-slate-600 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20;
}

.platform-badge.california {
  @apply bg-gradient-to-r from-purple-600 to-purple-700;
}

.ultra-badge {
  @apply bg-gradient-to-r from-yellow-500 to-yellow-600 text-black;
}

.popular-badge-global {
  @apply absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-bold px-6 py-2 rounded-full;
  box-shadow: 0 0 20px rgba(255,215,0,0.6);
  animation: pulse-glow 2s ease-in-out infinite;
}

.satisfaction-badge {
  @apply absolute -top-2 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.6); }
  50% { box-shadow: 0 0 30px rgba(255,215,0,0.9); }
}

/* CTA Buttons */
.cta-button-mysticsense {
  @apply w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300;
}

.cta-button-asknow {
  @apply w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300;
}

.cta-button-keen {
  @apply w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300;
  box-shadow: 0 0 20px rgba(255,215,0,0.4);
}

.cta-button-california {
  @apply w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300;
}

.cta-button-ultra {
  @apply w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300;
  box-shadow: 0 0 30px rgba(255,215,0,0.6);
}

/* Testimonial Cards */
.testimonial-card-enhanced {
  @apply relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 transition-all duration-500;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.testimonial-card-enhanced:hover {
  @apply border-yellow-400/30;
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(255,215,0,0.2);
}

/* Policy Cards */
.policy-card {
  @apply bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border border-white/15 rounded-2xl p-6 transition-all duration-500;
}

.policy-card.satisfaction {
  @apply border-green-400/30 bg-gradient-to-br from-green-400/5 to-white/3;
}

.policy-card.quality {
  @apply border-blue-400/30 bg-gradient-to-br from-blue-400/5 to-white/3;
}

.policy-card.spiritual {
  @apply border-purple-400/30 bg-gradient-to-br from-purple-400/5 to-white/3;
}

/* Category Cards */
.category-card {
  @apply relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border border-white/15 rounded-2xl p-8 transition-all duration-500;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.category-card:hover {
  @apply border-yellow-400/30;
  transform: translateY(-8px);
  box-shadow: 0 15px 50px rgba(255,215,0,0.2);
}

/* Stats */
.stat-item {
  @apply transform hover:scale-110 transition-all duration-300;
}

/* Trust Badges */
.trust-badge {
  @apply flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-all duration-300;
}

/* Premium Gold Color */
.text-gold {
  color: #ffd700;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .luxury-feature-card:hover,
  .pricing-card-global:hover {
    transform: none;
  }
  
  .pricing-card-global.featured {
    transform: none;
  }
  
  .stars-field {
    animation-duration: 200s;
  }
  
  .luxury-cta-button:hover {
    transform: none;
  }
}
</style>
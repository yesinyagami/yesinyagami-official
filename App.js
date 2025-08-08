import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Mail, Star, Sparkles, Eye, Heart, Zap, Coffee, Crown, Shield } from 'lucide-react';
import './App.css';
import BuyMeACoffeeButton from './BuyMeACoffeeButton.jsx';
import SecretReading from './SecretReading.jsx';
import CoffeePay from './PaymentSystem.js';

// 導入圖像（假設已放置在assets目錄）
import avatarImage from './assets/IMG_6220.JPG';
import strengthCard from './assets/strength.png';
import empressCard from './assets/empress.png';
import devilCard from './assets/devil.png';

// 塔羅牌數據（示例，需擴展至78張）
const tarotCards = [
  {
    id: 'strength',
    name: { zh: '力量', en: 'Strength', ja: '力' },
    image: strengthCard,
    element: '火',
    symbol: '太陽',
    keywords: { zh: ['內在力量', '勇氣', '耐心'], en: ['Inner strength', 'Courage', 'Patience'], ja: ['内なる力', '勇気', '忍耐'] },
    keywordsReversed: { zh: ['自我懷疑', '缺乏信心', '失控'], en: ['Self-doubt', 'Lack of confidence', 'Loss of control'], ja: ['自己不信', '自信の欠如', '制御不能'] },
    description: { zh: '力量牌代表內在的勇氣和精神力量。', en: 'Strength represents inner courage and spiritual power.', ja: '力のカードは内なる勇気と精神的な力を象徴します。' },
    meaningUpright: { zh: '你擁有克服挑戰的力量。', en: 'You have the strength to overcome challenges.', ja: 'あなたには挑戦を克服する力があります。' },
    meaningReversed: { zh: '你可能正在經歷自我懷疑。', en: 'You may be experiencing self-doubt.', ja: 'あなたは自己不信を経験しているかもしれません。' },
  },
  {
    id: 'empress',
    name: { zh: '皇后', en: 'The Empress', ja: '女帝' },
    image: empressCard,
    element: '土',
    symbol: '金星',
    keywords: { zh: ['豐收', '創造力', '母性'], en: ['Abundance', 'Creativity', 'Nurturing'], ja: ['豊穣', '創造性', '育む力'] },
    keywordsReversed: { zh: ['依賴', '創造力阻塞', '忽視自我'], en: ['Dependency', 'Creative block', 'Neglect of self'], ja: ['依存', '創造性の停滞', '自己無視'] },
    description: { zh: '皇后牌象徵生育和創造力。', en: 'The Empress symbolizes fertility and creativity.', ja: '女帝は豊穣と創造性を象徴します。' },
    meaningUpright: { zh: '你的創造力將帶來豐收。', en: 'Your creativity will bring abundance.', ja: 'あなたの創造性は豊穣をもたらします。' },
    meaningReversed: { zh: '你可能感到創造力受阻。', en: 'You may feel creatively blocked.', ja: 'あなたは創造性が停滞しているかもしれません。' },
  },
  {
    id: 'devil',
    name: { zh: '惡魔', en: 'The Devil', ja: '悪魔' },
    image: devilCard,
    element: '土',
    symbol: '土星',
    keywords: { zh: ['束縛', '誘惑', '物質慾望'], en: ['Bondage', 'Temptation', 'Materialism'], ja: ['束縛', '誘惑', '物質主義'] },
    keywordsReversed: { zh: ['解放', '克服誘惑', '自由'], en: ['Freedom', 'Overcoming temptation', 'Liberation'], ja: ['解放', '誘惑の克服', '自由'] },
    description: { zh: '惡魔牌代表物質束縛和誘惑。', en: 'The Devil represents material bondage and temptation.', ja: '悪魔は物質的な束縛と誘惑を象徴します。' },
    meaningUpright: { zh: '你可能被物質慾望束縛。', en: 'You may be bound by material desires.', ja: 'あなたは物質的な欲望に縛られているかもしれません。' },
    meaningReversed: { zh: '你正在尋求解放。', en: 'You are seeking liberation.', ja: 'あなたは解放を求めています。' },
  },
  // 需添加其餘75張牌，參考Rider-Waite塔羅牌
];

// 多語言翻譯
const translations = {
  zh: {
    title: 'YESINYAGAMI',
    subtitle: '奇幻小說家的神秘塔羅占卜',
    welcome: '歡迎來到神秘的塔羅世界',
    emailPlaceholder: '請輸入您的Email',
    pinPlaceholder: '請輸入您的4位數PIN碼',
    verifyPin: '驗證PIN碼',
    question: '請輸入您的問題',
    drawCard: '抽取塔羅牌',
    newReading: '新的占卜',
    spiritualInsight: '靈性洞察',
    poeticInterpretation: '詩意解讀',
    practicalAdvice: '實用建議',
    adminMode: '管理員模式',
    unlimitedAccess: '無限使用權限',
  },
  en: {
    title: 'YESINYAGAMI',
    subtitle: 'Mystical Tarot Reading by Fantasy Novelist',
    welcome: 'Welcome to the Mystical Tarot World',
    emailPlaceholder: 'Enter your Email',
    pinPlaceholder: 'Enter your 4-digit PIN',
    verifyPin: 'Verify PIN',
    question: 'Enter your question',
    drawCard: 'Draw Tarot Card',
    newReading: 'New Reading',
    spiritualInsight: 'Spiritual Insight',
    poeticInterpretation: 'Poetic Interpretation',
    practicalAdvice: 'Practical Advice',
    adminMode: 'Admin Mode',
    unlimitedAccess: 'Unlimited Access',
  },
  ja: {
    title: 'YESINYAGAMI',
    subtitle: 'ファンタジー小説家の神秘的なタロット占い',
    welcome: '神秘的なタロットの世界へようこそ',
    emailPlaceholder: 'メールアドレスを入力してください',
    pinPlaceholder: '4桁のピンを入力してください',
    verifyPin: 'ピンの検証',
    question: '質問を入力してください',
    drawCard: 'タロットカードを引く',
    newReading: '新しいリーディング',
    spiritualInsight: 'スピリチュアルな洞察',
    poeticInterpretation: '詩的な解釈',
    practicalAdvice: '実際的なアドバイス',
    adminMode: '管理者モード',
    unlimitedAccess: '無制限アクセス',
  },
};

// AI生成塔羅解讀（使用Gemini或GPT API）
async function generateTarotReading(card, question, isReversed, language) {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // 或使用GPT API KEY
  const API_URL = 'https://api.gemini.com/v1/completions'; // 假設Gemini API端點，需替換為實際URL

  const prompt = `Provide a detailed tarot reading for the question: "${question}". The drawn card is "${card.name[language]}" (${isReversed ? 'Reversed' : 'Upright'}). Include spiritual insight, poetic interpretation, and practical advice. Return the response in ${language === 'zh' ? 'Chinese' : language === 'en' ? 'English' : 'Japanese'}.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    return {
      spiritualInsight: data.choices[0].text.split('Spiritual Insight: ')[1]?.split('Poetic Interpretation: ')[0] || 'Spiritual insight based on the card.',
      poeticInterpretation: data.choices[0].text.split('Poetic Interpretation: ')[1]?.split('Practical Advice: ')[0] || 'Poetic interpretation of the card.',
      practicalAdvice: data.choices[0].text.split('Practical Advice: ')[1] || 'Practical advice for the situation.',
    };
  } catch (error) {
    console.error('Error generating tarot reading:', error);
    return {
      spiritualInsight: translations[language].error || 'Error generating insight.',
      poeticInterpretation: translations[language].error || 'Error generating interpretation.',
      practicalAdvice: translations[language].error || 'Error generating advice.',
    };
  }
}

function App() {
  const [language, setLanguage] = useState('zh');
  const [email, setEmail] = useState('');
  const [userPin, setUserPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const t = translations[language];

  // 檢查管理員狀態
  const checkAdminStatus = (email, pin) => {
    return email === 'yagami8095@hotmail.com' && pin === '2652';
  };

  // 處理PIN碼驗證
  const handlePinVerification = () => {
    if (!email || !email.includes('@')) {
      alert(t.emailError || '請輸入有效的Email地址');
      return;
    }
    if (userPin.length !== 4 || !userPin.match(/^\d{4}$/)) {
      alert(t.pinError || 'PIN碼必須是4位數字');
      return;
    }
    const adminStatus = checkAdminStatus(email, userPin);
    setIsAdmin(adminStatus);
    setIsVerified(true);
    navigate('/main');
    alert(adminStatus ? t.adminLoginSuccess || '管理員登錄成功！' : t.loginSuccess || '登錄成功！');
  };

  // 抽牌邏輯
  const handleDrawCard = async () => {
    if (!question.trim()) {
      alert(t.questionError || '請輸入問題');
      return;
    }
    setIsLoading(true);
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const isReversed = Math.random() > 0.5;
    setCurrentCard({ ...randomCard, isReversed });
    const readingData = await generateTarotReading(randomCard, question, isReversed, language);
    setReading(readingData);
    setIsLoading(false);
    navigate('/result');
  };

  // 星空背景動畫
  const StarField = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <StarField />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 語言選擇 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-black/30 rounded-lg p-1 backdrop-blur-sm">
            {Object.keys(translations).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-md transition-all ${
                  language === lang ? 'bg-yellow-500 text-black font-bold' : 'text-yellow-300 hover:text-yellow-100'
                }`}
              >
                {lang === 'zh' ? '中文' : lang === 'en' ? 'English' : '日本語'}
              </button>
            ))}
          </div>
        </div>

        <Routes>
          <Route
            path="/login"
            element={
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl">
                    <img src={avatarImage} alt="YESINYAGAMI Avatar" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-4xl font-bold text-yellow-300 mb-2">{t.title}</h1>
                  <p className="text-yellow-100 text-lg">{t.subtitle}</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">{t.welcome}</h2>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-yellow-400/50 rounded-lg text-yellow-100 placeholder-yellow-300/70 focus:outline-none focus:border-yellow-400"
                    />
                    <input
                      type="text"
                      placeholder={t.pinPlaceholder}
                      value={userPin}
                      onChange={(e) => setUserPin(e.target.value.slice(0, 4))}
                      className="w-full px-4 py-3 bg-black/50 border border-yellow-400/50 rounded-lg text-yellow-100 placeholder-yellow-300/70 focus:outline-none focus:border-yellow-400"
                    />
                    <button
                      onClick={handlePinVerification}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105"
                    >
                      {t.verifyPin}
                    </button>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/main"
            element={
              isVerified ? (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 mr-4">
                        <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-yellow-300">{t.title}</h2>
                        {isAdmin && (
                          <p className="text-green-300 text-sm">
                            <Crown className="w-4 h-4 inline mr-1" />
                            {t.adminMode} | {t.unlimitedAccess}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 mb-6">
                    <h3 className="text-xl font-bold text-purple-300 mb-4">{t.question}</h3>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder={t.questionPlaceholder || '例如：我的愛情運勢如何？'}
                      className="w-full px-4 py-3 bg-black/50 border border-purple-400/50 rounded-lg text-purple-100 placeholder-purple-300/70 focus:outline-none focus:border-purple-400 resize-none"
                      rows="3"
                    />
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleDrawCard}
                      disabled={!question.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? t.loading || '占卜中...' : t.drawCard}
                    </button>
                  </div>
                </div>
              ) : (
                navigate('/login')
              )
            }
          />
          <Route
            path="/result"
            element={
              isVerified && currentCard && reading ? (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-block relative">
                      <img
                        src={currentCard.image}
                        alt={currentCard.name[language]}
                        className={`w-64 h-auto rounded-2xl shadow-2xl border-4 border-yellow-400 ${currentCard.isReversed ? 'transform rotate-180' : ''}`}
                      />
                      <div className="absolute -top-4 -right-4 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">
                        {currentCard.isReversed ? t.reversed || '逆位' : t.upright || '正位'}
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-yellow-300 mt-6 mb-2">{currentCard.name[language]}</h2>
                  </div>
                  <div className="space-y-6 mb-8">
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
                      <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                        <Sparkles className="w-6 h-6 mr-2" />
                        {t.spiritualInsight}
                      </h3>
                      <p className="text-blue-100 leading-relaxed">{reading.spiritualInsight}</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                      <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
                        <Heart className="w-6 h-6 mr-2" />
                        {t.poeticInterpretation}
                      </h3>
                      <p className="text-purple-100 leading-relaxed">{reading.poeticInterpretation}</p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                      <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center">
                        <Zap className="w-6 h-6 mr-2" />
                        {t.practicalAdvice}
                      </h3>
                      <p className="text-green-100 leading-relaxed">{reading.practicalAdvice}</p>
                    </div>
                  </div>
                  <div className="mb-8">
                    <BuyMeACoffeeButton
                      language={language}
                      onPaymentClick={() => {
                        CoffeePay.handlePayment({
                          card: currentCard,
                          question,
                          isReversed: currentCard.isReversed,
                        });
                      }}
                      tarotData={{ card: currentCard, question, isReversed: currentCard.isReversed }}
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        setCurrentCard(null);
                        setReading(null);
                        setQuestion('');
                        navigate('/main');
                      }}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
                    >
                      {t.newReading}
                    </button>
                  </div>
                </div>
              ) : (
                navigate('/login')
              )
            }
          />
          <Route
            path="/secret"
            element={
              isVerified ? (
                <SecretReading language={language} tarotData={{ card: currentCard, question, isReversed: currentCard?.isReversed }} />
              ) : (
                navigate('/login')
              )
            }
          />
          <Route path="/" element={<navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
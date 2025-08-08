import React, { useState, useEffect } from 'react';
import { Crown, Star, Sparkles, Heart, Zap, Shield, Eye, Coffee } from 'lucide-react';
import CoffeePay from './PaymentSystem.js';

const SecretReading = ({ language = 'zh', tarotData = null }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deepReading, setDeepReading] = useState(null);

  const texts = {
    zh: {
      title: '🎉 感謝您的支持！',
      subtitle: '您現在可以查看完整的深度塔羅解讀',
      deepAnalysis: '深度分析',
      pastPresentFuture: '過去 • 現在 • 未來',
      personalGuidance: '個人化指引',
      actionPlan: '實用行動方案',
      validUntil: '有效期至',
      paymentExpired: '付費已過期',
      renewPayment: '重新付費',
      backToMain: '返回主頁',
    },
    en: {
      title: '🎉 Thank You for Your Support!',
      subtitle: 'You can now view the complete deep tarot reading',
      deepAnalysis: 'Deep Analysis',
      pastPresentFuture: 'Past • Present • Future',
      personalGuidance: 'Personal Guidance',
      actionPlan: 'Action Plan',
      validUntil: 'Valid until',
      paymentExpired: 'Payment Expired',
      renewPayment: 'Renew Payment',
      backToMain: 'Back to Main',
    },
    ja: {
      title: '🎉 ご支援ありがとうございます！',
      subtitle: '完全な深層タロットリーディングをご覧いただけます',
      deepAnalysis: '深層分析',
      pastPresentFuture: '過去 • 現在 • 未来',
      personalGuidance: '個人的なガイダンス',
      actionPlan: 'アクションプラン',
      validUntil: '有効期限',
      paymentExpired: '支払い期限切れ',
      renewPayment: '支払いを更新',
      backToMain: 'メインに戻る',
    },
  };

  const text = texts[language] || texts.zh;

  useEffect(() => {
    const checkPaymentStatus = async () => {
      setIsLoading(true);
      try {
        const status = await CoffeePay.getPaidStatus();
        setPaymentStatus(status);
        if (status.isValid && !status.isExpired) {
          const generateDeepReading = (data) => {
            if (!data || !data.card) return;
            const card = data.card;
            const question = data.question;
            const isReversed = data.isReversed;
            const reading = {
              deepAnalysis: `${card.name[language]}牌在您的問題「${question}」中展現了深層的意義。${isReversed ? '逆位' : '正位'}的${card.name[language]}象徵著${isReversed ? card.meaningReversed[language] : card.meaningUpright[language]}。`,
              pastPresentFuture: {
                past: `過去：您經歷的挑戰為現在的情況奠定了基礎。${card.name[language]}牌顯示您過去的經驗中蘊含著重要的智慧。`,
                present: `現在：當前的狀況需要您運用${card.name[language]}牌所代表的品質。這是一個關鍵的轉折點。`,
                future: `未來：如果您能夠理解並應用${card.name[language]}牌的教導，未來將會帶來積極的轉變和成長。`,
              },
              personalGuidance: [
                `擁抱${card.name[language]}牌所代表的${card.keywords[language][0]}，這將成為您前進的動力。`,
                `注意${card.keywords[language][1]}在您生活中的體現，它將指引您做出正確的決定。`,
                `培養${card.keywords[language][2]}的品質，這將幫助您克服當前的挑戰。`,
                `記住${card.name[language]}牌的核心訊息：${card.description[language]}`,
              ],
              actionPlan: [
                '在接下來的一週內，每天花10分鐘冥想這張牌的意義',
                '將這次占卜的洞察記錄在日記中，定期回顧',
                '在面對相關決定時，回想這張牌給您的指引',
                '保持開放的心態，接受宇宙為您安排的機會',
              ],
            };
            setDeepReading(reading);
          };
          generateDeepReading(status.tarotData || tarotData);
        }
      } catch (error) {
        console.error('檢查付費狀態失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkPaymentStatus();
  }, [tarotData, language]); // 修正：添加 language 到依賴陣列

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-yellow-300">{text.loading || '驗證付費狀態中...'}</p>
        </div>
      </div>
    );
  }

  if (!paymentStatus || !paymentStatus.isValid || paymentStatus.isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-400/30">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-300 mb-4">{text.paymentExpired}</h2>
          <p className="text-red-100 mb-6">{text.renewPrompt || '請完成付費以查看深度解讀內容'}</p>
          <button
            onClick={() => window.location.href = '/main'}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-800 transition-all"
          >
            {text.renewPayment}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
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
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-400 mr-2" />
            <Coffee className="w-8 h-8 text-amber-400 mr-2" />
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-yellow-300 mb-2">{text.title}</h1>
          <p className="text-yellow-100 text-lg">{text.subtitle}</p>
          <p className="text-green-300 text-sm mt-2">
            {text.validUntil}: {new Date(new Date(paymentStatus.paidAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString()}
          </p>
        </div>
        {deepReading && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
              <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-2" />
                {text.deepAnalysis}
              </h2>
              <p className="text-purple-100 leading-relaxed text-lg">{deepReading.deepAnalysis}</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/30">
              <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                {text.pastPresentFuture}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-blue-200 mb-3">{text.past || '過去'}</h3>
                  <p className="text-blue-100">{deepReading.pastPresentFuture.past}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-blue-200 mb-3">{text.present || '現在'}</h3>
                  <p className="text-blue-100">{deepReading.pastPresentFuture.present}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-blue-200 mb-3">{text.future || '未來'}</h3>
                  <p className="text-blue-100">{deepReading.pastPresentFuture.future}</p>
                </div>
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
              <h2 className="text-2xl font-bold text-green-300 mb-6 flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                {text.personalGuidance}
              </h2>
              <div className="space-y-4">
                {deepReading.personalGuidance.map((guidance, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-green-100">{guidance}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
              <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2" />
                {text.actionPlan}
              </h2>
              <div className="space-y-4">
                {deepReading.actionPlan.map((action, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <Zap className="w-3 h-3 text-black" />
                    </div>
                    <p className="text-yellow-100">{action}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={() => window.location.href = '/main'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                {text.backToMain}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretReading;
import React, { useState } from 'react';
import { Coffee } from 'lucide-react';

const BuyMeACoffeeButton = ({ language = 'zh', onPaymentClick, tarotData = null, className = '' }) => {
  const [isHover, setIsHover] = useState(false);

  const texts = {
    zh: {
      title: '解鎖深度解讀',
      subtitle: '獲得專業塔羅師的完整分析',
      price: '$4.99',
      button: '立即解鎖',
      features: ['1000+字深度解析', '過去現在未來分析', '個人化指引建議', '實用行動方案'],
    },
    en: {
      title: 'Unlock Deep Reading',
      subtitle: 'Get complete analysis from professional tarot reader',
      price: '$4.99',
      button: 'Unlock Now',
      features: ['1000+ words deep analysis', 'Past Present Future reading', 'Personalized guidance', 'Practical action plan'],
    },
    ja: {
      title: '深層リーディング解除',
      subtitle: 'プロのタロット師による完全な分析を取得',
      price: '$4.99',
      button: '今すぐ解除',
      features: ['1000+語の深層分析', '過去現在未来のリーディング', '個人化されたガイダンス', '実用的な行動計画'],
    },
  };

  const text = texts[language] || texts.zh;

  return (
    <div className={`bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-6 border border-amber-400/50 shadow-xl ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Coffee className="w-8 h-8 text-amber-200 mr-2" />
          <h3 className="text-xl font-bold text-white">{text.title}</h3>
        </div>
        <p className="text-amber-100 text-sm mb-4">{text.subtitle}</p>
        <div className="bg-black/20 rounded-lg p-4 mb-4">
          <div className="text-2xl font-bold text-amber-200 mb-2">{text.price}</div>
          <ul className="text-amber-100 text-xs space-y-1">
            {text.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-amber-300 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => onPaymentClick(tarotData)}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className={`w-full bg-white text-amber-700 font-bold py-3 rounded-lg transition-all duration-300 ${isHover ? 'bg-amber-50 transform scale-105 shadow-lg' : ''}`}
        >
          <div className="flex items-center justify-center">
            <Coffee className="w-5 h-5 mr-2" />
            {text.button}
          </div>
        </button>
        <p className="text-amber-200 text-xs mt-3">
          {language === 'zh' ? '安全付費 • 24小時內有效' : language === 'en' ? 'Secure Payment • Valid for 24 hours' : 'セキュア決済 • 24時間有効'}
        </p>
      </div>
    </div>
  );
};

export default BuyMeACoffeeButton;
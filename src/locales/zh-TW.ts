/**
 * Traditional Chinese Language Pack for Night God Tarot
 * 繁體中文語言包 - 夜神塔羅
 * 
 * Replace this content with your Traditional Chinese translations
 */

import type { Translations } from './en'

export const zhTW: Translations = {
  // =================== APP NAVIGATION ===================
  nav: {
    home: '首頁',
    reading: '占卜', 
    about: '關於',
    demo: '占卜'
  },

  // =================== HOME PAGE ===================
  home: {
    title: '解鎖你的神聖命運',
    subtitle: '體驗最先進的AI驅動塔羅占卜，融合古老智慧與尖端科技。透過無限Monica AI智能，解開過去、現在與未來的奧秘。',
    
    // Trust indicators
    trustIndicators: {
      free: '100% 免費開始',
      ai: 'AI智能洞察', 
      instant: '即時結果'
    },

    // Call to action
    cta: {
      primaryButton: '獲取免費占卜',
      secondaryButton: '觀看示範'
    },

    // Features section
    features: {
      aiWisdom: {
        title: 'AI驅動智慧',
        description: '運用Monica AI的無限力量，存取Claude、GPT、Yi和Gemini模型，獲得神聖洞察。'
      },
      novel: {
        title: '31萬字小說',
        description: '整合神秘故事資料庫，為您的占卜提供豐富背景和深度敘事智慧。'
      },
      membership: {
        title: '會員等級',
        description: '選擇您的靈性旅程：自由靈魂、月影或夜神會員等級。'
      }
    },

    // Ready section
    ready: {
      title: '準備好探索您的命運了嗎？'
    },

    // Support section  
    support: {
      title: '支持神聖工作'
    }
  },

  // PUT YOUR TRADITIONAL CHINESE TRANSLATIONS HERE
  // Replace all the English text with Traditional Chinese

  demo: {
    title: '神聖塔羅占卜',
    subtitle: '體驗AI指導的塔羅智慧力量。選擇您的牌卡，接收多重AI智能協作的洞察。',
    
    question: {
      title: '提出您的問題',
      placeholder: '您從神聖領域尋求什麼指引？（可選 - 留空進行一般占卜）'
    },

    cardSelection: {
      title: '選擇您的牌卡',
      selectedCount: '已選擇：{count}/3 張牌',
      clearButton: '清除選擇',
      shuffleButton: '洗牌'
    },

    readingButton: {
      loading: '正在諮詢神聖...',
      ready: '揭示神聖智慧'
    },

    results: {
      positions: {
        past: '過去/基礎',
        present: '現在/挑戰', 
        future: '未來/結果'
      },
      sections: {
        collectiveWisdom: '集體智慧',
        personalAnalysis: '個人分析',
        wisdomIntegration: '智慧整合', 
        poeticExpression: '詩意表達',
        finalWisdom: '最終智慧'
      },
      actions: {
        newReading: '新占卜',
        shareReading: '分享占卜'
      }
    }
  },

  // Continue translating all sections...
  // Add your full Traditional Chinese translations here

  about: {
    title: '關於夜神塔羅',
    sections: {
      mission: {
        title: '我們的使命',
        description: '夜神塔羅結合古老智慧與尖端AI技術，為現代求道者提供神聖指引。我們的平台運用Monica AI的無限力量，整合多重AI智能提供深刻洞察。'
      },
      technology: {
        title: '技術',
        description: '我們的系統使用精密的AI編排方法，特色包括：',
        features: [
          'Monica AI主系統：無限存取Yi、Claude、GPT和Gemini模型',
          '集體智慧搜索：來自全球意識的即時洞察',
          '個人分析：深度心理剖析和指引',
          '智慧整合：多重AI觀點的綜合', 
          '詩意昇華：洞察的藝術轉化'
        ]
      },
      contact: {
        title: '聯絡與支持',
        description: '加入我們的神秘社群，體驗神聖指引的未來。',
        buttons: {
          tryReading: '嘗試占卜',
          contactUs: '聯絡我們'
        }
      }
    }
  },

  // Add all other sections with Traditional Chinese translations...

  payment: {
    coffee: {
      title: '請我喝咖啡',
      subtitle: '單次捐款支持',
      amounts: [
        { value: 3, label: '咖啡' },
        { value: 5, label: '拿鐵' },
        { value: 10, label: '慷慨' },
        { value: 25, label: '支持者' }
      ],
      benefits: [
        '支持神秘開發',
        '加入我們的支持者社群'
      ],
      customAmount: '自訂金額',
      donateButton: '捐款 ${amount}'
    },

    membership: {
      title: 'iPass Money',
      subtitle: '安全會員升級',
      tiers: {
        moonShadow: {
          name: '月影',
          price: 5,
          features: [
            '無限占卜',
            '進階AI解讀',
            '隱藏神諭存取', 
            '小說智慧整合',
            '優先支持'
          ]
        },
        nightGod: {
          name: '夜神', 
          price: 12,
          features: [
            '月影的所有功能',
            '個人AI神諭',
            '自訂占卜風格',
            '匯出和分享占卜',
            'VIP社群存取'
          ]
        }
      },
      upgradeButton: '升級到 {tier}',
      processing: '處理中...',
      security: [
        '256位元SSL加密',
        '100% 安全付款',
        '30天退款保證'
      ]
    }
  },

  paymentResults: {
    success: {
      title: '付款成功！',
      subtitle: '感謝您的支持。您的神聖旅程持續中...',
      details: {
        title: '付款詳情',
        transactionId: '交易ID：',
        amount: '金額：',
        date: '日期：',
        membership: '會員：'
      },
      actions: {
        startReading: '開始您的占卜',
        returnHome: '返回首頁'
      },
      newBenefits: '您的新福利',
      thankYou: '"您的支持幫助我們維持古老智慧與現代技術的神聖連結。願您的占卜為您的靈性旅程帶來清晰和指引。"',
      team: '— 夜神塔羅團隊'
    },

    cancel: {
      title: '付款已取消',
      subtitle: '您的付款已取消。您的帳戶未被收費。',
      whatHappened: {
        title: '發生了什麼？',
        points: [
          '付款過程在完成前被取消',
          '未處理任何付款', 
          '您的帳戶保持不變',
          '您隨時可以重試'
        ]
      },
      actions: {
        retry: '重試付款',
        continueFreee: '繼續使用免費版本'
      },
      help: {
        title: '需要幫助？',
        description: '如果您在付款時遇到問題或對我們的會員等級有疑問：',
        contactSupport: '聯絡支持',
        learnMore: '了解更多'
      },
      freeFeatures: {
        title: '您仍可以享受：',
        features: [
          '帶AI解讀的免費塔羅占卜',
          '存取78張傳統塔羅牌',
          '基本小說智慧整合'
        ]
      }
    }
  },

  cards: {
    meanings: {
      'The Fool': {
        upright: '新開始、純真、自發性、自由精神',
        reversed: '魯莽、被利用、不體貼',
        description: '愚者代表新開始和無限潛力。'
      },
      'The Magician': {
        upright: '顯化、足智多謀、力量、靈感行動', 
        reversed: '操控、計劃不當、未開發的才能',
        description: '魔術師代表顯化和個人力量。'
      }
      // Add all your card meanings in Traditional Chinese...
    }
  },

  novel: {
    chapters: [
      {
        id: 'chapter1',
        title: '您的第一章標題',
        content: '您的完整第一章內容在這裡...',
        themes: ['主題1', '主題2'],
        symbols: ['符號1', '符號2'],
        lifeLessons: ['教訓1', '教訓2']
      }
      // Add all your chapters in Traditional Chinese...
    ]
  },

  common: {
    loading: '載入中...',
    error: '發生錯誤',
    tryAgain: '重試',
    cancel: '取消',
    confirm: '確認',
    save: '保存',
    close: '關閉'
  }
}
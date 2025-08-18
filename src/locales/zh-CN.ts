/**
 * Simplified Chinese Language Pack for Night God Tarot
 * 简体中文语言包 - 夜神塔罗
 * 
 * Replace this content with your Simplified Chinese translations
 */

import type { Translations } from './en'

export const zhCN: Translations = {
  // =================== APP NAVIGATION ===================
  nav: {
    home: '首页',
    reading: '占卜', 
    about: '关于',
    demo: '占卜'
  },

  // =================== HOME PAGE ===================
  home: {
    title: '解锁你的神圣命运',
    subtitle: '体验最先进的AI驱动塔罗占卜，融合古老智慧与尖端科技。通过无限Monica AI智能，解开过去、现在与未来的奥秘。',
    
    // Herlean poem (Chinese version)
    herleanPoem: {
      original: '命运之门今开启，\n智慧之光照前路，\n星辰指引真理径，\n神圣旅程始于此。',
      translation: '命运之门今开启，\n智慧之光照前路，\n星辰指引真理径，\n神圣旅程始于此。'
    },
    
    // Trust indicators
    trustIndicators: {
      free: '100% 免费开始',
      ai: 'AI智能洞察', 
      instant: '即时结果'
    },

    // Call to action
    cta: {
      primaryButton: '获取免费占卜',
      secondaryButton: '观看演示'
    },

    // Features section
    features: {
      aiWisdom: {
        title: 'AI驱动智慧',
        description: '运用Monica AI的无限力量，访问Claude、GPT、Yi和Gemini模型，获得神圣洞察。'
      },
      novel: {
        title: '31万字小说',
        description: '集成神秘故事数据库，为您的占卜提供丰富背景和深度叙事智慧。'
      },
      membership: {
        title: '会员等级',
        description: '选择您的灵性旅程：自由灵魂、月影或夜神会员等级。'
      }
    },

    // Ready section
    ready: {
      title: '准备好探索您的命运了吗？'
    },

    // Support section  
    support: {
      title: '支持神圣工作'
    }
  },

  // PUT YOUR SIMPLIFIED CHINESE TRANSLATIONS HERE
  // Replace all the English text with Simplified Chinese

  demo: {
    title: '神圣塔罗占卜',
    subtitle: '体验AI指导的塔罗智慧力量。选择您的牌卡，接收多重AI智能协作的洞察。',
    
    question: {
      title: '提出您的问题',
      placeholder: '您从神圣领域寻求什么指引？（可选 - 留空进行一般占卜）'
    },

    cardSelection: {
      title: '选择您的牌卡',
      selectedCount: '已选择：{count}/3 张牌',
      clearButton: '清除选择',
      shuffleButton: '洗牌'
    },

    readingButton: {
      loading: '正在咨询神圣...',
      ready: '揭示神圣智慧'
    },

    results: {
      positions: {
        past: '过去/基础',
        present: '现在/挑战', 
        future: '未来/结果'
      },
      sections: {
        collectiveWisdom: '集体智慧',
        personalAnalysis: '个人分析',
        wisdomIntegration: '智慧整合', 
        poeticExpression: '诗意表达',
        finalWisdom: '最终智慧'
      },
      actions: {
        newReading: '新占卜',
        shareReading: '分享占卜'
      }
    }
  },

  // Continue translating all sections...
  // Add your full Simplified Chinese translations here

  about: {
    title: '关于夜神塔罗',
    sections: {
      mission: {
        title: '我们的使命',
        description: '夜神塔罗结合古老智慧与尖端AI技术，为现代求道者提供神圣指引。我们的平台运用Monica AI的无限力量，整合多重AI智能提供深刻洞察。'
      },
      technology: {
        title: '技术',
        description: '我们的系统使用精密的AI编排方法，特色包括：',
        features: [
          'Monica AI主系统：无限访问Yi、Claude、GPT和Gemini模型',
          '集体智慧搜索：来自全球意识的即时洞察',
          '个人分析：深度心理剖析和指引',
          '智慧整合：多重AI观点的综合', 
          '诗意升华：洞察的艺术转化'
        ]
      },
      contact: {
        title: '联系与支持',
        description: '加入我们的神秘社群，体验神圣指引的未来。',
        buttons: {
          tryReading: '尝试占卜',
          contactUs: '联系我们'
        }
      }
    }
  },

  // Add all other sections with Simplified Chinese translations...

  payment: {
    coffee: {
      title: '请我喝咖啡',
      subtitle: '单次捐款支持',
      amounts: [
        { value: 3, label: '咖啡' },
        { value: 5, label: '拿铁' },
        { value: 10, label: '慷慨' },
        { value: 25, label: '支持者' }
      ],
      benefits: [
        '支持神秘开发',
        '加入我们的支持者社群'
      ],
      customAmount: '自定金额',
      donateButton: '捐款 ${amount}'
    },

    membership: {
      title: 'iPass Money',
      subtitle: '安全会员升级',
      tiers: {
        moonShadow: {
          name: '月影',
          price: 5,
          features: [
            '无限占卜',
            '进阶AI解读',
            '隐藏神谕访问', 
            '小说智慧整合',
            '优先支持'
          ]
        },
        nightGod: {
          name: '夜神', 
          price: 12,
          features: [
            '月影的所有功能',
            '个人AI神谕',
            '自定占卜风格',
            '导出和分享占卜',
            'VIP社群访问'
          ]
        }
      },
      upgradeButton: '升级到 {tier}',
      processing: '处理中...',
      security: [
        '256位SSL加密',
        '100% 安全付款',
        '30天退款保证'
      ]
    }
  },

  paymentResults: {
    success: {
      title: '付款成功！',
      subtitle: '感谢您的支持。您的神圣旅程继续中...',
      details: {
        title: '付款详情',
        transactionId: '交易ID：',
        amount: '金额：',
        date: '日期：',
        membership: '会员：'
      },
      actions: {
        startReading: '开始您的占卜',
        returnHome: '返回首页'
      },
      newBenefits: '您的新福利',
      thankYou: '"您的支持帮助我们维持古老智慧与现代技术的神圣连接。愿您的占卜为您的灵性旅程带来清晰和指引。"',
      team: '— 夜神塔罗团队'
    },

    cancel: {
      title: '付款已取消',
      subtitle: '您的付款已取消。您的账户未被收费。',
      whatHappened: {
        title: '发生了什么？',
        points: [
          '付款过程在完成前被取消',
          '未处理任何付款', 
          '您的账户保持不变',
          '您随时可以重试'
        ]
      },
      actions: {
        retry: '重试付款',
        continueFreee: '继续使用免费版本'
      },
      help: {
        title: '需要帮助？',
        description: '如果您在付款时遇到问题或对我们的会员等级有疑问：',
        contactSupport: '联系支持',
        learnMore: '了解更多'
      },
      freeFeatures: {
        title: '您仍可以享受：',
        features: [
          '带AI解读的免费塔罗占卜',
          '访问78张传统塔罗牌',
          '基本小说智慧整合'
        ]
      }
    }
  },

  cards: {
    meanings: {
      'The Fool': {
        upright: '新开始、纯真、自发性、自由精神',
        reversed: '鲁莽、被利用、不体贴',
        description: '愚者代表新开始和无限潜力。'
      },
      'The Magician': {
        upright: '显化、足智多谋、力量、灵感行动', 
        reversed: '操控、计划不当、未开发的才能',
        description: '魔术师代表显化和个人力量。'
      }
      // Add all your card meanings in Simplified Chinese...
    }
  },

  novel: {
    chapters: [
      {
        id: 'chapter1',
        title: '您的第一章标题',
        content: '您的完整第一章内容在这里...',
        themes: ['主题1', '主题2'],
        symbols: ['符号1', '符号2'],
        lifeLessons: ['教训1', '教训2']
      }
      // Add all your chapters in Simplified Chinese...
    ]
  },

  common: {
    loading: '加载中...',
    error: '发生错误',
    tryAgain: '重试',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    close: '关闭'
  }
}
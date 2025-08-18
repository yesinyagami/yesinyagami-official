/**
 * Japanese Language Pack for Night God Tarot
 * 日本語言語パック - ナイトゴッドタロット
 * 
 * Replace this content with your Japanese translations
 */

import type { Translations } from './en'

export const ja: Translations = {
  // =================== APP NAVIGATION ===================
  nav: {
    home: 'ホーム',
    reading: 'リーディング', 
    about: 'について',
    demo: 'リーディング'
  },

  // =================== HOME PAGE ===================
  home: {
    title: 'あなたの神聖な運命を解き明かす',
    subtitle: '古代の知恵と最先端技術を融合した、最も先進的なAI駆動タロットリーディングを体験してください。無制限のMonica AI知能で、過去、現在、未来の謎を解き明かしましょう。',
    
    // Herlean poem (Japanese version)
    herleanPoem: {
      original: '神聖なる運命の扉よ、\n開かれし智慧の道、\n星々の導きと共に、\n真実への旅路。',
      translation: '神聖なる運命の扉よ、\n開かれし智慧の道、\n星々の導きと共に、\n真実への旅路。'
    },
    
    // Trust indicators
    trustIndicators: {
      free: '100% 無料で開始',
      ai: 'AI洞察力', 
      instant: '即座の結果'
    },

    // Call to action
    cta: {
      primaryButton: '無料リーディングを取得',
      secondaryButton: 'デモを見る'
    },

    // Features section
    features: {
      aiWisdom: {
        title: 'AI駆動の知恵',
        description: 'Monica AIの無限の力を活用し、Claude、GPT、Yi、Geminiモデルにアクセスして神聖な洞察を得ます。'
      },
      novel: {
        title: '31万語小説',
        description: '統合された神秘的ストーリーデータベースが、あなたのリーディングに豊かな文脈と深い物語の知恵を提供します。'
      },
      membership: {
        title: 'メンバーシップティア',
        description: 'あなたのスピリチュアルな旅を選択してください：フリースピリット、ムーンシャドウ、またはナイトゴッドメンバーシップレベル。'
      }
    },

    // Ready section
    ready: {
      title: 'あなたの運命を発見する準備はできましたか？'
    },

    // Support section  
    support: {
      title: '神聖な仕事をサポート'
    }
  },

  // PUT YOUR JAPANESE TRANSLATIONS HERE
  // Replace all the English text with Japanese

  demo: {
    title: '神聖なタロットリーディング',
    subtitle: 'AI誘導タロット知恵の力を体験してください。カードを選択し、調和して動作する複数のAI知能からの洞察を受け取ります。',
    
    question: {
      title: 'あなたの質問をする',
      placeholder: '神聖な領域からどのような指導を求めますか？（オプション - 一般的なリーディングの場合は空白のままにしてください）'
    },

    cardSelection: {
      title: 'あなたのカードを選択',
      selectedCount: '選択済み：{count}/3 枚',
      clearButton: '選択をクリア',
      shuffleButton: 'カードをシャッフル'
    },

    readingButton: {
      loading: '神聖なものに相談中...',
      ready: '神聖な知恵を明らかにする'
    },

    results: {
      positions: {
        past: '過去/基盤',
        present: '現在/挑戦', 
        future: '未来/結果'
      },
      sections: {
        collectiveWisdom: '集合的知恵',
        personalAnalysis: '個人分析',
        wisdomIntegration: '知恵の統合', 
        poeticExpression: '詩的表現',
        finalWisdom: '最終的な知恵'
      },
      actions: {
        newReading: '新しいリーディング',
        shareReading: 'リーディングを共有'
      },
      // Card flip poems in Japanese
      cardFlipPoems: {
        opening: {
          original: '神聖なる扉よ開かれん、\n智慧の光差し込みて、\n真実への道示さん。',
          translation: '神聖なる扉よ開かれん、\n智慧の光差し込みて、\n真実への道示さん。'
        },
        reflection: {
          original: '心の鏡に映りし姿、\n魂の声聞こえけり、\n導きの星輝きて。',
          translation: '心の鏡に映りし姿、\n魂の声聞こえけり、\n導きの星輝きて。'
        },
        guidance: {
          original: '運命の糸手繰りて、\n未来への扉開かん、\n神聖なる旅路かな。',
          translation: '運命の糸手繰りて、\n未来への扉開かん、\n神聖なる旅路かな。'
        }
      }
    }
  },

  // Continue translating all sections...
  // Add your full Japanese translations here

  about: {
    title: 'ナイトゴッドタロットについて',
    sections: {
      mission: {
        title: '私たちの使命',
        description: 'ナイトゴッドタロットは古代の知恵と最先端のAI技術を組み合わせて、現代の探求者に神聖な指導を提供します。私たちのプラットフォームはMonica AIの無限の力を活用し、複数のAI知能を統合して深い洞察を提供します。'
      },
      technology: {
        title: '技術',
        description: '私たちのシステムは洗練されたAIオーケストレーションアプローチを使用し、以下の特徴があります：',
        features: [
          'Monica AI主要システム：Yi、Claude、GPT、Geminiモデルへの無制限アクセス',
          '集合的知恵検索：グローバル意識からのリアルタイム洞察',
          '個人分析：深い心理プロファイリングと指導',
          '知恵の統合：複数のAI視点の統合', 
          '詩的昇華：洞察の芸術的変換'
        ]
      },
      contact: {
        title: '連絡とサポート',
        description: '私たちの神秘的なコミュニティに参加し、神聖な指導の未来を体験してください。',
        buttons: {
          tryReading: 'リーディングを試す',
          contactUs: 'お問い合わせ'
        }
      }
    }
  },

  // Add all other sections with Japanese translations...

  payment: {
    coffee: {
      title: 'コーヒーをおごって',
      subtitle: '一回限りの寄付サポート',
      amounts: [
        { value: 3, label: 'コーヒー' },
        { value: 5, label: 'ラテ' },
        { value: 10, label: '寛大' },
        { value: 25, label: 'サポーター' }
      ],
      benefits: [
        '神秘的な開発をサポート',
        'サポーターコミュニティに参加'
      ],
      customAmount: 'カスタム金額',
      donateButton: '${amount}を寄付'
    },

    membership: {
      title: 'iPass Money',
      subtitle: '安全なメンバーシップアップグレード',
      tiers: {
        moonShadow: {
          name: 'ムーンシャドウ',
          price: 5,
          features: [
            '無制限リーディング',
            '高度なAI解釈',
            '隠されたオラクルアクセス', 
            '小説知恵統合',
            '優先サポート'
          ]
        },
        nightGod: {
          name: 'ナイトゴッド', 
          price: 12,
          features: [
            'ムーンシャドウのすべて',
            '個人AIオラクル',
            'カスタムリーディングスタイル',
            'リーディングのエクスポートと共有',
            'VIPコミュニティアクセス'
          ]
        }
      },
      upgradeButton: '{tier}にアップグレード',
      processing: '処理中...',
      security: [
        '256ビットSSL暗号化',
        '100% 安全な支払い',
        '30日間返金保証'
      ]
    }
  },

  paymentResults: {
    success: {
      title: '支払い成功！',
      subtitle: 'サポートありがとうございます。あなたの神聖な旅が続きます...',
      details: {
        title: '支払い詳細',
        transactionId: 'トランザクションID：',
        amount: '金額：',
        date: '日付：',
        membership: 'メンバーシップ：'
      },
      actions: {
        startReading: 'リーディングを開始',
        returnHome: 'ホームに戻る'
      },
      newBenefits: 'あなたの新しい特典',
      thankYou: '"あなたのサポートは、古代の知恵と現代技術の神聖なつながりを維持するのに役立ちます。あなたのリーディングがスピリチュアルな旅に明晰さと指導をもたらしますように。"',
      team: '— ナイトゴッドタロットチーム'
    },

    cancel: {
      title: '支払いがキャンセルされました',
      subtitle: 'あなたの支払いがキャンセルされました。アカウントに請求はありません。',
      whatHappened: {
        title: '何が起こりましたか？',
        points: [
          '支払いプロセスが完了前にキャンセルされました',
          '支払いは処理されませんでした', 
          'あなたのアカウントは変更されていません',
          'いつでも再試行できます'
        ]
      },
      actions: {
        retry: '支払いを再試行',
        continueFreee: '無料版で続行'
      },
      help: {
        title: 'ヘルプが必要ですか？',
        description: '支払いで問題が発生している場合、またはメンバーシップティアについて質問がある場合：',
        contactSupport: 'サポートに連絡',
        learnMore: '詳細を学ぶ'
      },
      freeFeatures: {
        title: 'まだ楽しめること：',
        features: [
          'AI解釈付き無料タロットリーディング',
          '78枚の伝統的タロットカードへのアクセス',
          '基本的な小説知恵統合'
        ]
      }
    }
  },

  cards: {
    meanings: {
      'The Fool': {
        upright: '新しい始まり、無邪気さ、自発性、自由な精神',
        reversed: '無謀さ、利用される、無配慮',
        description: 'フールは新しい始まりと無限の可能性を表します。'
      },
      'The Magician': {
        upright: '顕現、機知、力、インスピレーションを受けた行動', 
        reversed: '操作、貧弱な計画、未開発の才能',
        description: 'マジシャンは顕現と個人的な力を表します。'
      }
      // Add all your card meanings in Japanese...
    }
  },

  novel: {
    chapters: [
      {
        id: 'chapter1',
        title: 'あなたの第1章タイトル',
        content: 'あなたの完全な第1章の内容がここに入ります...',
        themes: ['テーマ1', 'テーマ2'],
        symbols: ['シンボル1', 'シンボル2'],
        lifeLessons: ['レッスン1', 'レッスン2']
      }
      // Add all your chapters in Japanese...
    ]
  },

  common: {
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    tryAgain: '再試行',
    cancel: 'キャンセル',
    confirm: '確認',
    save: '保存',
    close: '閉じる'
  }
}
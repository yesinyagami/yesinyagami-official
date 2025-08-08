const CoffeePay = (() => {
  const STORAGE_KEY = 'yesinyagami_bmac_paid_status';
  const SECRET_KEY = 'yesinyagami-tarot-secret-2025';
  const BMAC_URL = 'https://buymeacoffee.com/yesinyagami';

  async function generateSignature(keyStr, message) {
    const enc = new TextEncoder();
    const keyData = enc.encode(keyStr);
    const msgData = enc.encode(message);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    return btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
  }

  async function verifySignature(keyStr, message, signatureBase64) {
    const generatedSig = await generateSignature(keyStr, message);
    return generatedSig === signatureBase64;
  }

  async function setPaidStatus(tarotData = null) {
    const paidAt = new Date().toISOString();
    const paymentData = {
      paidAt,
      tarotData: tarotData || null,
      paymentId: 'bmac_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    };
    const data = JSON.stringify(paymentData);
    const signature = await generateSignature(SECRET_KEY, data);
    const storeData = JSON.stringify({ ...paymentData, signature });
    localStorage.setItem(STORAGE_KEY, storeData);
    return paymentData.paymentId;
  }

  async function getPaidStatus() {
    const storeData = localStorage.getItem(STORAGE_KEY);
    if (!storeData) {
      return { paidAt: null, isValid: false, isExpired: true, tarotData: null };
    }
    try {
      const { paidAt, signature, tarotData, paymentId } = JSON.parse(storeData);
      if (!paidAt || !signature) {
        return { paidAt: null, isValid: false, isExpired: true, tarotData: null };
      }
      const dataToVerify = JSON.stringify({ paidAt, tarotData, paymentId });
      const isValid = await verifySignature(SECRET_KEY, dataToVerify, signature);
      if (!isValid) {
        return { paidAt: null, isValid: false, isExpired: true, tarotData: null };
      }
      const paidTime = new Date(paidAt).getTime();
      const now = Date.now();
      const expired = now - paidTime > 24 * 60 * 60 * 1000;
      return { paidAt, isValid: true, isExpired: expired, tarotData, paymentId };
    } catch (e) {
      return { paidAt: null, isValid: false, isExpired: true, tarotData: null };
    }
  }

  async function isPaid() {
    const status = await getPaidStatus();
    return status.isValid && !status.isExpired;
  }

  function clearPaidStatus() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function handlePayment(tarotData, bmacUrl = BMAC_URL) {
    const paymentData = {
      card: tarotData.card,
      question: tarotData.question,
      isReversed: tarotData.isReversed,
      timestamp: Date.now(),
    };
    sessionStorage.setItem('yesinyagami_pending_payment', JSON.stringify(paymentData));
    const paymentWindow = window.open(bmacUrl, '_blank', 'width=800,height=600');
    const checkPayment = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkPayment);
        setTimeout(() => {
          const confirmed = confirm('付費完成了嗎？點擊確定解鎖深度解讀！');
          if (confirmed) {
            setPaidStatus(paymentData).then(() => {
              window.location.href = '/secret';
            });
          }
        }, 1000);
      }
    }, 1000);
    setTimeout(() => clearInterval(checkPayment), 30000);
  }

  return { setPaidStatus, getPaidStatus, isPaid, clearPaidStatus, handlePayment };
})();

export default CoffeePay;
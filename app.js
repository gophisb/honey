// ============================
// HOUD HONEY - Main JavaScript
// ============================

(function () {
  'use strict';

  // ---------- DOM Elements ----------
  const langToggle = document.getElementById('languageToggle');
  const html = document.documentElement;

  // Product / Size / Quantity
  const productRadios = document.getElementsByName('product');
  const sizeRadios = document.getElementsByName('size');
  const decreaseBtn = document.getElementById('decreaseQuantity');
  const increaseBtn = document.getElementById('increaseQuantity');
  const quantityDisplay = document.getElementById('quantityDisplay');

  // Summary
  const summaryProduct = document.getElementById('summaryProduct');
  const summarySize = document.getElementById('summarySize');
  const summaryQuantity = document.getElementById('summaryQuantity');
  const totalPrice = document.getElementById('totalPrice');

  // Form
  const orderForm = document.getElementById('orderForm');
  const customerName = document.getElementById('customerName');
  const wilaya = document.getElementById('wilaya');
  const customerAddress = document.getElementById('customerAddress');
  const customerPhone = document.getElementById('customerPhone');

  // Footer
  const currentYearSpan = document.getElementById('currentYear');

  // ---------- State ----------
  let quantity = 1;
  let currentLang = 'ar'; // default Arabic

  // ---------- Helpers ----------
  const getSelectedProduct = () => {
    for (const radio of productRadios) {
      if (radio.checked) return radio.value;
    }
    return 'flower';
  };

  const getSelectedSize = () => {
    for (const radio of sizeRadios) {
      if (radio.checked) return radio.value;
    }
    return '1kg';
  };

  const getPrice = (product, size) => {
    // Base price 4500 DZD for 1kg
    if (size === '500g') return 2250;
    return 4500;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ar-DZ') + ' دج';
  };

  const updateSummary = () => {
    const productValue = getSelectedProduct();
    const sizeValue = getSelectedSize();

    // Product name
    const productName =
      productValue === 'flower' ? 'عسل مختلف الأزهار' : 'عسل الجبلي الفاخر';
    summaryProduct.textContent = productName;

    // Size
    const sizeText = sizeValue === '1kg' ? '1 كغ' : '500 غ';
    summarySize.textContent = sizeText;

    // Quantity
    summaryQuantity.textContent = quantity;

    // Total price
    const unitPrice = getPrice(productValue, sizeValue);
    const total = unitPrice * quantity;
    totalPrice.textContent = formatPrice(total);
  };

  // ---------- Event Listeners ----------

  // Product change
  productRadios.forEach((radio) => {
    radio.addEventListener('change', updateSummary);
  });

  // Size change
  sizeRadios.forEach((radio) => {
    radio.addEventListener('change', updateSummary);
  });

  // Quantity
  decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
      updateSummary();
    }
  });

  increaseBtn.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
    updateSummary();
  });

  // Form submit → WhatsApp
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const product = getSelectedProduct();
    const size = getSelectedSize();
    const unitPrice = getPrice(product, size);
    const total = unitPrice * quantity;

    const productName =
      product === 'flower' ? 'عسل مختلف الأزهار' : 'عسل الجبلي الفاخر';
    const sizeLabel = size === '1kg' ? '1 كيلوغرام' : '500 غرام';

    // Build message in Arabic (default)
    const message = `
مرحباً، أود طلب المنتج التالي:
- المنتج: ${productName}
- الحجم: ${sizeLabel}
- الكمية: ${quantity}
- السعر الإجمالي: ${formatPrice(total)}

معلومات التوصيل:
- الاسم: ${customerName.value.trim()}
- الولاية: ${wilaya.value}
- العنوان: ${customerAddress.value.trim()}
- رقم الهاتف: ${customerPhone.value.trim()}

شكراً!
    `.trim();

    const encoded = encodeURIComponent(message);
    const phone = '213663561135';
    const whatsappURL = `https://wa.me/${phone}?text=${encoded}`;

    window.open(whatsappURL, '_blank');
  });

  // ---------- Language Toggle ----------
  const updateLanguageUI = (lang) => {
    // Update HTML dir and lang
    html.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Toggle button text
    langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';

    // Update all elements with data-ar / data-en
    document.querySelectorAll('[data-ar]').forEach((el) => {
      const text = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (text !== null) {
        // For elements that may contain other children (like buttons with spans),
        // we set textContent only if the element's direct text is the one to change.
        // More robust: only change if the element's child is a text node or we just set textContent.
        // We'll set textContent carefully.
        el.textContent = text;
      }
    });

    // Restore quantity display (it's a number, not translated)
    quantityDisplay.textContent = quantity;
    // Update summary (names and prices are in Arabic numbers anyway)
    updateSummary();

    // Re-apply special button content (WhatsApp button has two spans)
    const whatsappBtn = document.querySelector('.btn-whatsapp');
    if (whatsappBtn) {
      // The button has two spans: first is emoji, second is text
      const spans = whatsappBtn.querySelectorAll('span');
      if (spans.length >= 2) {
        const textSpan = spans[1];
        const text = lang === 'ar' ? 'إرسال الطلب عبر واتساب' : 'Send Order via WhatsApp';
        textSpan.textContent = text;
      }
    }
  };

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    updateLanguageUI(currentLang);
  });

  // ---------- Footer Year ----------
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ---------- Initialize ----------
  updateSummary();
  // Set initial language to Arabic (already default)
  updateLanguageUI('ar');

  // Also update product selection from "Choose this honey" buttons (if used)
  document.querySelectorAll('.select-product').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = btn.getAttribute('data-product');
      if (product) {
        // Check corresponding radio
        const radio = document.querySelector(`input[name="product"][value="${product}"]`);
        if (radio) {
          radio.checked = true;
          updateSummary();
        }
        // Scroll to order section
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
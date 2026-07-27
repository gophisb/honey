// ============================
// HOUD HONEY - Main JavaScript
// ============================

(function () {
  'use strict';

  const langToggle = document.getElementById('languageToggle');
  const html = document.documentElement;

  const productRadios = document.getElementsByName('product');
  const sizeRadios = document.getElementsByName('size');

  const decreaseBtn = document.getElementById('decreaseQuantity');
  const increaseBtn = document.getElementById('increaseQuantity');
  const quantityDisplay = document.getElementById('quantityDisplay');

  const summaryProduct = document.getElementById('summaryProduct');
  const summarySize = document.getElementById('summarySize');
  const summaryQuantity = document.getElementById('summaryQuantity');
  const totalPrice = document.getElementById('totalPrice');

  const orderForm = document.getElementById('orderForm');
  const customerName = document.getElementById('customerName');
  const wilaya = document.getElementById('wilaya');
  const customerAddress = document.getElementById('customerAddress');
  const customerPhone = document.getElementById('customerPhone');

  const currentYearSpan = document.getElementById('currentYear');

  // ============================
  // STATE
  // ============================

  let quantity = 1;
  let currentLang = 'ar';

  // ============================
  // PRODUCT DATA
  // ============================

  const products = {
    flower: {
      ar: 'عسل مختلف الأزهار',
      en: 'All Blossoms Honey'
    },
    mountain: {
      ar: 'عسل الجبلي الفاخر',
      en: 'Luxury Mountain Honey'
    }
  };

  // ============================
  // GET SELECTED PRODUCT
  // ============================

  function getSelectedProduct() {
    for (const radio of productRadios) {
      if (radio.checked) {
        return radio.value;
      }
    }

    return 'flower';
  }

  // ============================
  // GET SELECTED SIZE
  // ============================

  function getSelectedSize() {
    for (const radio of sizeRadios) {
      if (radio.checked) {
        return radio.value;
      }
    }

    return '1kg';
  }

  // ============================
  // GET PRICE
  // ============================

  function getPrice(size) {

    // 1 KG = 4500 DZD
    if (size === '1kg') {
      return 4500;
    }

    // 500 G = نصف سعر 1 KG
    if (size === '500g') {
      return 2250;
    }

    return 4500;
  }

  // ============================
  // CALCULATE TOTAL
  // ============================

  function calculateTotal(size, quantity) {

    // SPECIAL OFFER
    // 3 x 1 KG = 12000 DZD
    if (size === '1kg' && quantity === 3) {
      return 12000;
    }

    const unitPrice = getPrice(size);

    return unitPrice * quantity;
  }

  // ============================
  // FORMAT PRICE
  // ============================

  function formatPrice(price) {

    return price.toLocaleString('ar-DZ') + ' دج';

  }

  // ============================
  // UPDATE ORDER SUMMARY
  // ============================

  function updateSummary() {

    const productValue = getSelectedProduct();
    const sizeValue = getSelectedSize();

    const productName =
      currentLang === 'ar'
        ? products[productValue].ar
        : products[productValue].en;

    const sizeText =
      currentLang === 'ar'
        ? (sizeValue === '1kg' ? '1 كغ' : '500 غ')
        : (sizeValue === '1kg' ? '1 KG' : '500 G');

    const total = calculateTotal(
      sizeValue,
      quantity
    );

    summaryProduct.textContent = productName;

    summarySize.textContent = sizeText;

    summaryQuantity.textContent = quantity;

    totalPrice.textContent =
      currentLang === 'ar'
        ? formatPrice(total)
        : total.toLocaleString('en-US') + ' DZD';

  }

  // ============================
  // PRODUCT CHANGE
  // ============================

  productRadios.forEach((radio) => {

    radio.addEventListener(
      'change',
      updateSummary
    );

  });

  // ============================
  // SIZE CHANGE
  // ============================

  sizeRadios.forEach((radio) => {

    radio.addEventListener(
      'change',
      updateSummary
    );

  });

  // ============================
  // DECREASE QUANTITY
  // ============================

  if (decreaseBtn) {

    decreaseBtn.addEventListener(
      'click',
      () => {

        if (quantity > 1) {

          quantity--;

          quantityDisplay.textContent =
            quantity;

          updateSummary();

        }

      }
    );

  }

  // ============================
  // INCREASE QUANTITY
  // ============================

  if (increaseBtn) {

    increaseBtn.addEventListener(
      'click',
      () => {

        quantity++;

        quantityDisplay.textContent =
          quantity;

        updateSummary();

      }
    );

  }

  // ============================
  // WHATSAPP ORDER
  // ============================

  if (orderForm) {

    orderForm.addEventListener(
      'submit',
      (event) => {

        event.preventDefault();

        const product =
          getSelectedProduct();

        const size =
          getSelectedSize();

        const total =
          calculateTotal(
            size,
            quantity
          );

        const productName =
          currentLang === 'ar'
            ? products[product].ar
            : products[product].en;

        const sizeLabel =
          currentLang === 'ar'
            ? (size === '1kg'
                ? '1 كيلوغرام'
                : '500 غرام')
            : (size === '1kg'
                ? '1 KG'
                : '500 G');

        let message;

        if (currentLang === 'ar') {

          message = `
مرحباً HOUD HONEY 🍯

أرغب في تأكيد طلبي:

🍯 المنتج:
${productName}

📦 الحجم:
${sizeLabel}

🔢 عدد العبوات:
${quantity}

💰 السعر الإجمالي:
${formatPrice(total)}

🚚 التوصيل:
مجاني

👤 معلومات الزبون:

الاسم:
${customerName.value.trim()}

الولاية:
${wilaya.value}

العنوان:
${customerAddress.value.trim()}

📱 رقم الهاتف:
${customerPhone.value.trim()}

شكراً لكم.
          `.trim();

        } else {

          message = `
Hello HOUD HONEY 🍯

I would like to confirm my order:

🍯 Product:
${productName}

📦 Size:
${sizeLabel}

🔢 Quantity:
${quantity}

💰 Total Price:
${total.toLocaleString('en-US')} DZD

🚚 Delivery:
FREE

👤 Customer Information:

Name:
${customerName.value.trim()}

Wilaya:
${wilaya.value}

Address:
${customerAddress.value.trim()}

📱 Phone:
${customerPhone.value.trim()}

Thank you.
          `.trim();

        }

        const encodedMessage =
          encodeURIComponent(message);

        // HOUD HONEY WhatsApp
        const phone =
          '213663561135';

        const whatsappURL =
          `https://wa.me/${phone}?text=${encodedMessage}`;

        window.open(
          whatsappURL,
          '_blank',
          'noopener,noreferrer'
        );

      }
    );

  }

  // ============================
  // LANGUAGE SYSTEM
  // ============================

  function updateLanguageUI(lang) {

    currentLang = lang;

    html.setAttribute(
      'lang',
      lang === 'ar'
        ? 'ar'
        : 'en'
    );

    html.setAttribute(
      'dir',
      lang === 'ar'
        ? 'rtl'
        : 'ltr'
    );

    if (langToggle) {

      langToggle.textContent =
        lang === 'ar'
          ? 'EN'
          : 'AR';

    }

    document
      .querySelectorAll('[data-ar]')
      .forEach((element) => {

        const text =
          lang === 'ar'
            ? element.getAttribute('data-ar')
            : element.getAttribute('data-en');

        if (text !== null) {

          element.textContent =
            text;

        }

      });

    // Update input placeholders
    const nameInput =
      document.getElementById(
        'customerName'
      );

    const addressInput =
      document.getElementById(
        'customerAddress'
      );

    const phoneInput =
      document.getElementById(
        'customerPhone'
      );

    if (nameInput) {

      nameInput.placeholder =
        lang === 'ar'
          ? 'اكتب اسمك الكامل'
          : 'Enter your full name';

    }

    if (addressInput) {

      addressInput.placeholder =
        lang === 'ar'
          ? 'اكتب عنوان التوصيل بالتفصيل'
          : 'Enter your full delivery address';

    }

    if (phoneInput) {

      phoneInput.placeholder =
        lang === 'ar'
          ? '06 XX XX XX XX'
          : '06 XX XX XX XX';

    }

    // Update quantity
    if (quantityDisplay) {

      quantityDisplay.textContent =
        quantity;

    }

    updateSummary();

    // WhatsApp button
    const whatsappBtn =
      document.querySelector(
        '.btn-whatsapp'
      );

    if (whatsappBtn) {

      const spans =
        whatsappBtn.querySelectorAll(
          'span'
        );

      if (spans.length >= 2) {

        spans[1].textContent =
          lang === 'ar'
            ? 'إرسال الطلب عبر واتساب'
            : 'Send Order via WhatsApp';

      }

    }

  }

  // ============================
  // LANGUAGE BUTTON
  // ============================

  if (langToggle) {

    langToggle.addEventListener(
      'click',
      () => {

        currentLang =
          currentLang === 'ar'
            ? 'en'
            : 'ar';

        updateLanguageUI(
          currentLang
        );

      }
    );

  }

  // ============================
  // CURRENT YEAR
  // ============================

  if (currentYearSpan) {

    currentYearSpan.textContent =
      new Date().getFullYear();

  }

  // ============================
  // PRODUCT SELECT BUTTONS
  // ============================

  document
    .querySelectorAll(
      '.select-product'
    )
    .forEach((button) => {

      button.addEventListener(
        'click',
        () => {

          const product =
            button.getAttribute(
              'data-product'
            );

          if (product) {

            const radio =
              document.querySelector(
                `input[name="product"][value="${product}"]`
              );

            if (radio) {

              radio.checked =
                true;

              updateSummary();

            }

          }

          const orderSection =
            document.getElementById(
              'order'
            );

          if (orderSection) {

            orderSection.scrollIntoView({
              behavior: 'smooth'
            });

          }

        }
      );

    });

  // ============================
  // INITIALIZE
  // ============================

  updateLanguageUI('ar');

})();
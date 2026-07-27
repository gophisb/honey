// ==================================================
// HOUD HONEY - Main JavaScript
// ==================================================

(function () {
  "use strict";

  // ==================================================
  // DOM ELEMENTS
  // ==================================================

  const langToggle = document.getElementById("languageToggle");
  const html = document.documentElement;

  // Product / Size / Quantity
  const productRadios = document.querySelectorAll('input[name="product"]');
  const sizeRadios = document.querySelectorAll('input[name="size"]');

  const decreaseBtn = document.getElementById("decreaseQuantity");
  const increaseBtn = document.getElementById("increaseQuantity");
  const quantityDisplay = document.getElementById("quantityDisplay");

  // Summary
  const summaryProduct = document.getElementById("summaryProduct");
  const summarySize = document.getElementById("summarySize");
  const summaryQuantity = document.getElementById("summaryQuantity");
  const totalPrice = document.getElementById("totalPrice");

  // Form
  const orderForm = document.getElementById("orderForm");
  const customerName = document.getElementById("customerName");
  const wilaya = document.getElementById("wilaya");
  const customerAddress = document.getElementById("customerAddress");
  const customerPhone = document.getElementById("customerPhone");

  // Footer
  const currentYearSpan = document.getElementById("currentYear");


  // ==================================================
  // STATE
  // ==================================================

  let quantity = 1;
  let currentLang = "ar";


  // ==================================================
  // PRODUCT DATA
  // ==================================================

  const products = {
    flower: {
      ar: "عسل مختلف الأزهار",
      en: "All Blossoms Honey"
    },

    mountain: {
      ar: "عسل الجبلي الفاخر",
      en: "Luxury Mountain Honey"
    }
  };


  // ==================================================
  // GET SELECTED PRODUCT
  // ==================================================

  function getSelectedProduct() {
    const selected = document.querySelector(
      'input[name="product"]:checked'
    );

    return selected ? selected.value : "flower";
  }


  // ==================================================
  // GET SELECTED SIZE
  // ==================================================

  function getSelectedSize() {
    const selected = document.querySelector(
      'input[name="size"]:checked'
    );

    return selected ? selected.value : "1kg";
  }


  // ==================================================
  // GET UNIT PRICE
  // ==================================================

  function getUnitPrice(size) {

    // 1 KG = 4500 DZD
    if (size === "1kg") {
      return 4500;
    }

    // 500 G = Half Price
    if (size === "500g") {
      return 2250;
    }

    return 4500;
  }


  // ==================================================
  // GET TOTAL PRICE
  // ==================================================

  function calculateTotal(size, qty) {

    // SPECIAL OFFER
    // 3 jars of 1 KG = 12000 DZD
    if (size === "1kg" && qty === 3) {
      return 12000;
    }

    // Normal calculation
    return getUnitPrice(size) * qty;
  }


  // ==================================================
  // FORMAT PRICE
  // ==================================================

  function formatPrice(price) {

    return (
      price.toLocaleString(
        currentLang === "ar" ? "ar-DZ" : "en-US"
      ) +
      (currentLang === "ar" ? " دج" : " DZD")
    );

  }


  // ==================================================
  // UPDATE ORDER SUMMARY
  // ==================================================

  function updateSummary() {

    const product = getSelectedProduct();
    const size = getSelectedSize();

    // Product name
    if (summaryProduct) {

      summaryProduct.textContent =
        products[product][currentLang];

    }


    // Size
    if (summarySize) {

      if (size === "1kg") {

        summarySize.textContent =
          currentLang === "ar"
            ? "1 كغ"
            : "1 KG";

      } else {

        summarySize.textContent =
          currentLang === "ar"
            ? "500 غ"
            : "500 G";

      }

    }


    // Quantity
    if (summaryQuantity) {

      summaryQuantity.textContent = quantity;

    }


    // Total
    const total = calculateTotal(
      size,
      quantity
    );

    if (totalPrice) {

      totalPrice.textContent =
        formatPrice(total);

    }

  }


  // ==================================================
  // QUANTITY - DECREASE
  // ==================================================

  if (decreaseBtn) {

    decreaseBtn.addEventListener(
      "click",
      function () {

        if (quantity > 1) {

          quantity--;

          quantityDisplay.textContent =
            quantity;

          updateSummary();

        }

      }
    );

  }


  // ==================================================
  // QUANTITY - INCREASE
  // ==================================================

  if (increaseBtn) {

    increaseBtn.addEventListener(
      "click",
      function () {

        quantity++;

        quantityDisplay.textContent =
          quantity;

        updateSummary();

      }
    );

  }


  // ==================================================
  // PRODUCT CHANGE
  // ==================================================

  productRadios.forEach(
    function (radio) {

      radio.addEventListener(
        "change",
        updateSummary
      );

    }
  );


  // ==================================================
  // SIZE CHANGE
  // ==================================================

  sizeRadios.forEach(
    function (radio) {

      radio.addEventListener(
        "change",
        updateSummary
      );

    }
  );


  // ==================================================
  // LANGUAGE SYSTEM
  // ==================================================

  function updateLanguageUI(lang) {

    currentLang = lang;

    // HTML language
    html.setAttribute(
      "lang",
      lang === "ar"
        ? "ar"
        : "en"
    );

    // Direction
    html.setAttribute(
      "dir",
      lang === "ar"
        ? "rtl"
        : "ltr"
    );


    // Language button
    if (langToggle) {

      langToggle.textContent =
        lang === "ar"
          ? "EN"
          : "AR";

    }


    // Translate elements
    document
      .querySelectorAll(
        "[data-ar][data-en]"
      )
      .forEach(
        function (element) {

          const text =
            lang === "ar"
              ? element.getAttribute("data-ar")
              : element.getAttribute("data-en");

          if (text !== null) {

            element.textContent =
              text;

          }

        }
      );


    // Restore quantity
    if (quantityDisplay) {

      quantityDisplay.textContent =
        quantity;

    }


    // Update summary
    updateSummary();

  }


  // ==================================================
  // LANGUAGE TOGGLE
  // ==================================================

  if (langToggle) {

    langToggle.addEventListener(
      "click",
      function () {

        const newLang =
          currentLang === "ar"
            ? "en"
            : "ar";

        updateLanguageUI(
          newLang
        );

      }
    );

  }


  // ==================================================
  // ORDER FORM → WHATSAPP
  // ==================================================

  if (orderForm) {

    orderForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        // Get data
        const product =
          getSelectedProduct();

        const size =
          getSelectedSize();

        const total =
          calculateTotal(
            size,
            quantity
          );


        // Product name
        const productName =
          products[product][currentLang];


        // Size name
        const sizeLabel =
          size === "1kg"
            ? (
                currentLang === "ar"
                  ? "1 كيلوغرام"
                  : "1 KG"
              )
            : (
                currentLang === "ar"
                  ? "500 غرام"
                  : "500 G"
              );


        // Special offer text
        let offerText = "";

        if (
          size === "1kg" &&
          quantity === 3
        ) {

          offerText =
            currentLang === "ar"
              ? "\n🎁 العرض الخاص: 3 عبوات 1 كغ بسعر 12000 دج"
              : "\n🎁 Special Offer: 3 x 1 KG jars for 12000 DZD";

        }


        // WhatsApp message
        let message;


        if (currentLang === "ar") {

          message = `
مرحباً HOUD HONEY 🍯

أرغب في طلب:

🍯 المنتج: ${productName}
⚖️ الحجم: ${sizeLabel}
📦 عدد العبوات: ${quantity}
💰 المجموع: ${formatPrice(total)}
🚚 التوصيل: مجاني
${offerText}

👤 معلومات الزبون:

الاسم: ${customerName.value.trim()}
الولاية: ${wilaya.value}
العنوان: ${customerAddress.value.trim()}
الهاتف: ${customerPhone.value.trim()}

شكراً لكم 🌟
          `.trim();

        } else {

          message = `
Hello HOUD HONEY 🍯

I would like to order:

🍯 Product: ${productName}
⚖️ Size: ${sizeLabel}
📦 Quantity: ${quantity}
💰 Total: ${formatPrice(total)}
🚚 Delivery: FREE
${offerText}

👤 Customer Information:

Name: ${customerName.value.trim()}
Wilaya: ${wilaya.value}
Address: ${customerAddress.value.trim()}
Phone: ${customerPhone.value.trim()}

Thank you 🌟
          `.trim();

        }


        // WhatsApp Number
        const phone =
          "213663561135";


        // Encode message
        const encodedMessage =
          encodeURIComponent(
            message
          );


        // WhatsApp URL
        const whatsappURL =
          `https://wa.me/${phone}?text=${encodedMessage}`;


        // Open WhatsApp
        window.open(
          whatsappURL,
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  }


  // ==================================================
  // PRODUCT SELECTION BUTTONS
  // ==================================================

  document
    .querySelectorAll(
      ".select-product"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            const product =
              button.getAttribute(
                "data-product"
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
                "order"
              );


            if (orderSection) {

              orderSection.scrollIntoView(
                {
                  behavior: "smooth"
                }
              );

            }

          }
        );

      }
    );


  // ==================================================
  // FOOTER YEAR
  // ==================================================

  if (currentYearSpan) {

    currentYearSpan.textContent =
      new Date().getFullYear();

  }


  // ==================================================
  // INITIALIZE
  // ==================================================

  updateLanguageUI("ar");

})();
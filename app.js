/* =========================================================
   HOUD HONEY — APP.JS
   Order System + Pricing + WhatsApp
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. SETTINGS
    ===================================================== */

    const WHATSAPP_NUMBER = "213663561135";

    const PRICES = {
        flower: {
            name: "عسل مختلف الأزهار",
            nameEn: "Wildflower Honey",
            price1kg: 4500,
            price500g: 2250
        },

        mountain: {
            name: "عسل الجبلي الفاخر",
            nameEn: "Premium Mountain Honey",
            price1kg: 4500,
            price500g: 2250
        }
    };

    const OFFER = {
        quantity: 3,
        pricePerKg: 4000,
        total: 12000
    };


    /* =====================================================
       2. ELEMENTS
    ===================================================== */

    const productInputs =
        document.querySelectorAll(
            'input[name="product"]'
        );

    const sizeInputs =
        document.querySelectorAll(
            'input[name="size"]'
        );

    const quantityElement =
        document.getElementById("quantity");

    const minusButton =
        document.getElementById("quantity-minus");

    const plusButton =
        document.getElementById("quantity-plus");

    const productNameElement =
        document.getElementById("summary-product");

    const sizeNameElement =
        document.getElementById("summary-size");

    const quantitySummary =
        document.getElementById("summary-quantity");

    const priceElement =
        document.getElementById("summary-price");

    const discountElement =
        document.getElementById("summary-discount");

    const totalElement =
        document.getElementById("summary-total");

    const whatsappButton =
        document.getElementById("whatsapp-order");

    const languageButton =
        document.getElementById("language-toggle");


    /* =====================================================
       3. CURRENT ORDER
    ===================================================== */

    let quantity = 1;

    let currentLanguage = "ar";


    /* =====================================================
       4. GET SELECTED PRODUCT
    ===================================================== */

    function getSelectedProduct() {

        const selected =
            document.querySelector(
                'input[name="product"]:checked'
            );

        if (!selected) {

            return "flower";

        }

        return selected.value;

    }


    /* =====================================================
       5. GET SELECTED SIZE
    ===================================================== */

    function getSelectedSize() {

        const selected =
            document.querySelector(
                'input[name="size"]:checked'
            );

        if (!selected) {

            return "1kg";

        }

        return selected.value;

    }


    /* =====================================================
       6. GET UNIT PRICE
    ===================================================== */

    function getUnitPrice() {

        const product =
            getSelectedProduct();

        const size =
            getSelectedSize();

        if (
            size === "500g"
        ) {

            return PRICES[product].price500g;

        }

        return PRICES[product].price1kg;

    }


    /* =====================================================
       7. CALCULATE ORDER
    ===================================================== */

    function calculateOrder() {

        const product =
            getSelectedProduct();

        const size =
            getSelectedSize();

        const unitPrice =
            getUnitPrice();

        let subtotal =
            unitPrice * quantity;

        let discount = 0;

        let total =
            subtotal;


        /*
         * SPECIAL OFFER
         *
         * 3 × 1kg
         * 4000 DZD each
         * Total = 12000 DZD
         */

        if (
            size === "1kg" &&
            quantity === 3
        ) {

            total =
                OFFER.total;

            discount =
                subtotal - total;

        }


        /*
         * 4+ BOTTLES
         *
         * Optional bulk discount
         * 4000 DZD per 1kg bottle
         */

        if (
            size === "1kg" &&
            quantity >= 4
        ) {

            total =
                quantity *
                OFFER.pricePerKg;

            discount =
                subtotal - total;

        }


        return {

            product,
            size,
            quantity,
            unitPrice,
            subtotal,
            discount,
            total

        };

    }


    /* =====================================================
       8. UPDATE ORDER SUMMARY
    ===================================================== */

    function updateSummary() {

        const order =
            calculateOrder();

        const product =
            PRICES[order.product];


        /* Product */

        if (productNameElement) {

            productNameElement.textContent =
                currentLanguage === "ar"
                    ? product.name
                    : product.nameEn;

        }


        /* Size */

        if (sizeNameElement) {

            sizeNameElement.textContent =
                order.size === "1kg"
                    ? "1 كغ"
                    : "500 غ";

        }


        /* Quantity */

        if (quantitySummary) {

            quantitySummary.textContent =
                order.quantity;

        }


        /* Price */

        if (priceElement) {

            priceElement.textContent =
                formatPrice(
                    order.subtotal
                );

        }


        /* Discount */

        if (discountElement) {

            if (
                order.discount > 0
            ) {

                discountElement.textContent =
                    "-" +
                    formatPrice(
                        order.discount
                    );

            } else {

                discountElement.textContent =
                    "0 دج";

            }

        }


        /* Total */

        if (totalElement) {

            totalElement.textContent =
                formatPrice(
                    order.total
                );

        }


        /* Update quantity display */

        if (quantityElement) {

            quantityElement.textContent =
                quantity;

        }


        /*
         * Add visual offer message
         */

        updateOfferMessage();

    }


    /* =====================================================
       9. FORMAT PRICE
    ===================================================== */

    function formatPrice(price) {

        return new Intl.NumberFormat(
            "fr-DZ"
        ).format(price) + " دج";

    }


    /* =====================================================
       10. QUANTITY — PLUS
    ===================================================== */

    if (plusButton) {

        plusButton.addEventListener(
            "click",
            () => {

                if (
                    quantity < 20
                ) {

                    quantity++;

                    updateSummary();

                }

            }
        );

    }


    /* =====================================================
       11. QUANTITY — MINUS
    ===================================================== */

    if (minusButton) {

        minusButton.addEventListener(
            "click",
            () => {

                if (
                    quantity > 1
                ) {

                    quantity--;

                    updateSummary();

                }

            }
        );

    }


    /* =====================================================
       12. PRODUCT CHANGE
    ===================================================== */

    productInputs.forEach(
        input => {

            input.addEventListener(
                "change",
                updateSummary
            );

        }
    );


    /* =====================================================
       13. SIZE CHANGE
    ===================================================== */

    sizeInputs.forEach(
        input => {

            input.addEventListener(
                "change",
                updateSummary
            );

        }
    );


    /* =====================================================
       14. OFFER MESSAGE
    ===================================================== */

    function updateOfferMessage() {

        const offerMessage =
            document.getElementById(
                "offer-message"
            );

        if (!offerMessage) {

            return;

        }


        if (
            getSelectedSize() === "1kg" &&
            quantity === 3
        ) {

            offerMessage.textContent =
                "🎁 عرض خاص: 3 عبوات × 1 كغ = 12,000 دج";

            offerMessage.classList.remove(
                "hidden"
            );

        } else {

            offerMessage.classList.add(
                "hidden"
            );

        }

    }


    /* =====================================================
       15. WHATSAPP ORDER
    ===================================================== */

    if (whatsappButton) {

        whatsappButton.addEventListener(
            "click",
            () => {

                sendWhatsAppOrder();

            }
        );

    }


    /* =====================================================
       16. SEND ORDER TO WHATSAPP
    ===================================================== */

    function sendWhatsAppOrder() {

        const order =
            calculateOrder();


        /*
         * CUSTOMER INFORMATION
         */

        const customerName =
            document.getElementById(
                "customer-name"
            )?.value.trim() || "";


        const customerPhone =
            document.getElementById(
                "customer-phone"
            )?.value.trim() || "";


        const wilaya =
            document.getElementById(
                "wilaya"
            )?.value || "";


        const address =
            document.getElementById(
                "customer-address"
            )?.value.trim() || "";


        const notes =
            document.getElementById(
                "customer-notes"
            )?.value.trim() || "";


        /*
         * BASIC VALIDATION
         */

        if (
            !customerName ||
            !customerPhone ||
            !wilaya ||
            !address
        ) {

            alert(
                currentLanguage === "ar"
                    ? "يرجى إدخال الاسم ورقم الهاتف والولاية والعنوان قبل إرسال الطلب."
                    : "Please enter your name, phone number, wilaya and address before placing your order."
            );

            return;

        }


        /*
         * PRODUCT NAME
         */

        const product =
            PRICES[
                order.product
            ];


        const productName =
            currentLanguage === "ar"
                ? product.name
                : product.nameEn;


        /*
         * SIZE
         */

        const sizeText =
            order.size === "1kg"
                ? "1 كغ"
                : "500 غ";


        /*
         * WHATSAPP MESSAGE
         */

        let message = "";


        if (
            currentLanguage === "ar"
        ) {

            message =
`🍯 *طلب جديد — HOUD HONEY*

━━━━━━━━━━━━━━

📦 *المنتج:* ${productName}

⚖️ *الحجم:* ${sizeText}

🔢 *الكمية:* ${order.quantity}

💰 *السعر قبل التخفيض:* ${formatPrice(order.subtotal)}

🎁 *التخفيض:* ${formatPrice(order.discount)}

💎 *الإجمالي:* ${formatPrice(order.total)}

🚚 *التوصيل:* مجاني

━━━━━━━━━━━━━━

👤 *اسم الزبون:* ${customerName}

📱 *رقم الهاتف:* ${customerPhone}

📍 *الولاية:* ${wilaya}

🏠 *العنوان:* ${address}

📝 *ملاحظات:* ${notes || "لا توجد"}

━━━━━━━━━━━━━━

🍯 *HOUD HONEY*
✨ شكراً لاختياركم عسل هود الفاخر.`;

        } else {

            message =
`🍯 *NEW ORDER — HOUD HONEY*

━━━━━━━━━━━━━━

📦 *Product:* ${productName}

⚖️ *Size:* ${sizeText}

🔢 *Quantity:* ${order.quantity}

💰 *Price before discount:* ${formatPrice(order.subtotal)}

🎁 *Discount:* ${formatPrice(order.discount)}

💎 *Total:* ${formatPrice(order.total)}

🚚 *Delivery:* FREE

━━━━━━━━━━━━━━

👤 *Customer:* ${customerName}

📱 *Phone:* ${customerPhone}

📍 *Wilaya:* ${wilaya}

🏠 *Address:* ${address}

📝 *Notes:* ${notes || "None"}

━━━━━━━━━━━━━━

🍯 *HOUD HONEY*
✨ Thank you for choosing premium Houd Honey.`;

        }


        /*
         * OPEN WHATSAPP
         */

        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(
                message
            );


        window.open(
            whatsappURL,
            "_blank"
        );

    }


    /* =====================================================
       17. LANGUAGE SWITCH
    ===================================================== */

    if (languageButton) {

        languageButton.addEventListener(
            "click",
            () => {

                currentLanguage =
                    currentLanguage === "ar"
                        ? "en"
                        : "ar";


                document.documentElement.lang =
                    currentLanguage;


                document.documentElement.dir =
                    currentLanguage === "ar"
                        ? "rtl"
                        : "ltr";


                updateLanguage();

                updateSummary();

            }
        );

    }


    /* =====================================================
       18. SIMPLE LANGUAGE SYSTEM
    ===================================================== */

    function updateLanguage() {

        const elements =
            document.querySelectorAll(
                "[data-ar][data-en]"
            );


        elements.forEach(
            element => {

                element.textContent =
                    currentLanguage === "ar"
                        ? element.dataset.ar
                        : element.dataset.en;

            }
        );


        if (languageButton) {

            languageButton.textContent =
                currentLanguage === "ar"
                    ? "EN"
                    : "ع";

        }

    }


    /* =====================================================
       19. INITIALIZE
    ===================================================== */

    updateSummary();

    updateLanguage();


    /* =====================================================
       20. CONSOLE MESSAGE
    ===================================================== */

    console.log(
        "🍯 HOUD HONEY — Application initialized successfully."
    );

});

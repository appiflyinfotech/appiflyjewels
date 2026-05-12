document.addEventListener('DOMContentLoaded', function() {
  const couponInput = document.getElementById('cart-coupon-input');
  const applyBtn = document.getElementById('cart-coupon-apply');
  const messageEl = document.getElementById('cart-coupon-message');
  const checkoutBtn = document.getElementById('checkout');

  if (!applyBtn || !couponInput) return;

  // Load existing coupon from session storage
  const savedCoupon = sessionStorage.getItem('applied_coupon');
  if (savedCoupon) {
    couponInput.value = savedCoupon;
    updateCheckoutUrl(savedCoupon);
  }

  applyBtn.addEventListener('click', function() {
    const code = couponInput.value.trim();
    if (code === '') {
      showMessage('Please enter a coupon code.', 'error');
      return;
    }

    // In a real scenario, you might want to validate the code via a backend call.
    // Here we just apply it to the checkout URL.
    showMessage('Coupon applied! Discount will be visible at checkout.', 'success');
    sessionStorage.setItem('applied_coupon', code);
    updateCheckoutUrl(code);
  });

  function showMessage(msg, type) {
    messageEl.textContent = msg;
    messageEl.className = 'cart-coupon-message ' + type;
  }

  function updateCheckoutUrl(code) {
    if (!checkoutBtn) return;
    
    // We can't easily change the form action because it's usually just /cart
    // But we can add a hidden input to the form or append it to the URL on submit.
    
    let form = document.querySelector('form[action="/cart"]');
    if (!form) form = document.getElementById('cart');
    
    if (form) {
      let discountInput = form.querySelector('input[name="discount"]');
      if (!discountInput) {
        discountInput = document.createElement('input');
        discountInput.type = 'hidden';
        discountInput.name = 'discount';
        form.appendChild(discountInput);
      }
      discountInput.value = code;
    }
  }
  
  // Also handle cases where checkout button is clicked directly
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
      const code = couponInput.value.trim();
      if (code !== '') {
        updateCheckoutUrl(code);
      }
    });
  }
});

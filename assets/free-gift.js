document.addEventListener('DOMContentLoaded', function() {
  const addGiftBtn = document.querySelector('.add-free-gift-btn');
  const giftLogicData = document.querySelector('.free-gift-logic-data');

  if (addGiftBtn) {
    addGiftBtn.addEventListener('click', function() {
      const variantId = this.dataset.variantId;
      addGiftToCart(variantId);
    });
  }

  function addGiftToCart(variantId) {
    let formData = {
      'items': [{
        'id': variantId,
        'quantity': 1,
        'properties': {
          '_free_gift': 'true'
        }
      }]
    };

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Error adding free gift to cart');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  // Optional: Auto-remove gift if no longer eligible
  if (giftLogicData) {
    const isEligible = giftLogicData.dataset.eligible === 'true';
    const inCart = giftLogicData.dataset.inCart === 'true';
    const variantId = giftLogicData.dataset.giftVariantId;

    if (!isEligible && inCart) {
      removeGiftFromCart(variantId);
    }
  }

  function removeGiftFromCart(variantId) {
    let formData = {
      'updates': {}
    };
    formData.updates[variantId] = 0;

    fetch(window.Shopify.routes.root + 'cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
});

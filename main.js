window.onload = function(){
  document.querySelector(".page-loader").classList.add("hide-loader");
  setTimeout(() => {
    document.querySelector(".page-loader").remove();
  }, 500);
}

document.addEventListener("DOMContentLoaded", async function(){
 
  var cartIcon = document.querySelector(".cart-icon");
  var scrollUpIcon = document.querySelector(".scroll-up");
  var numOfItemsInCart = 0;
  var cart = [];
  var df = 20;
  var subtotal = 0;
  var total = 0;
  var currentSection = "menu";

  document.querySelector("#df").textContent = df;

  document.querySelectorAll(".nav li").forEach(function(li){
    li.addEventListener("click", function(){

      document.querySelectorAll(".menu-wrapper > div." + currentSection).forEach(function(el){el.classList.add("d-none")});
      
      let id = li.getAttribute("data-id");
      currentSection = id;
      document.querySelectorAll(".menu-wrapper > div." + currentSection).forEach(function(el){el.classList.remove("d-none")});
      document.querySelectorAll(".nav li").forEach(function(li){if(li.classList.contains("active"))(li.classList.remove("active"))});
      li.classList.add("active");
      
      document.querySelector(".cart-items-wrapper").innerHTML = "";
      total = 0;
      subtotal = 0;
      if (cart.length > 0) {
        cartIcon.classList.remove("d-none");
      }
      
    })
  })

  document.querySelector(".menu-wrapper").addEventListener("scroll", () => {
    if (!document.querySelector(".menu-wrapper .menu").classList.contains("d-none")) {
      if (document.querySelector(".menu-wrapper").scrollTop > 200) {
        if (scrollUpIcon.classList.contains("d-none")) scrollUpIcon.classList.remove("d-none");
      } else {
        if (!scrollUpIcon.classList.contains("d-none")) scrollUpIcon.classList.add("d-none");
      }
    }
  });

  window.addEventListener("scroll", () => {
    if (!document.querySelector(".menu-wrapper .menu").classList.contains("d-none")) {
      if (document.documentElement.scrollTop > 200) {
        if (scrollUpIcon.classList.contains("d-none")) scrollUpIcon.classList.remove("d-none");
      } else {
        if (!scrollUpIcon.classList.contains("d-none")) scrollUpIcon.classList.add("d-none");
      }
    }
  });
  
  scrollUpIcon.addEventListener("click", function(){
    document.querySelector(".categories-selector").scrollIntoView({behavior: 'smooth', block: 'center'});
  })

  const [res1, res2] = await Promise.all([
    fetch('./data/categories.json'),
    fetch('./data/products.json')
  ]);

  const [categories, products] = await Promise.all([
    res1.json(),
    res2.json()
  ]);

  categories.forEach(function(category){
    document.querySelector(".categories-selector").insertAdjacentHTML("beforeend", `
    <option value="${category.id}">${category.name}</option>`);
  });

  function addToCart(itemId){
    
    if (document.querySelectorAll(".empty-text").length > 0) document.querySelector(".empty-text").remove();

    let item = products.find(product => product.id == itemId);
    item['qty'] = 1;
    item['total'] = item.price;
    cart.push(item);

  }

  function deleteCartItem(itemId){
    numOfItemsInCart -= 1;
   
    let index = cart.findIndex(item => item.id == itemId);
    cart.splice(index, 1);

    document.querySelector(".menu-item" + itemId).classList.remove("item-selected");
    document.querySelector(".menu-item" + itemId).querySelector(".selected-item-overlay").classList.add("d-none");

    cartIsEmpty();
    checkTotal();
  }

  function cartIsEmpty(){
    document.querySelector(".num-of-items").textContent = cart.length;
    if (cart.length == 0) {
      cartIcon.classList.add("d-none");
      document.querySelector(".cart-items-wrapper").insertAdjacentHTML("afterbegin", `
      <div class="fs-16 text-center empty-text" style="padding:15px 0;">Your cart is empty.</div>`)
    } else {
      if (document.querySelectorAll(".empty-text").length > 0) document.querySelector(".empty-text").remove();
    }
  }

  function checkTotal(){
    subtotal = 0;
    total = 0;
    cart.forEach(function(item){
      subtotal += item.total;
    });
    total = subtotal + df;
    document.querySelector("#cart-subtotal").textContent = subtotal;
    document.querySelector("#cart-total").textContent = total;
  }

  function displayCartItems(){
    cart.forEach(function(item){
      let c = categories.find(category => category.id == item.category);
      document.querySelector(".cart-items-wrapper").insertAdjacentHTML("beforeend", `
      <div class="cart-item cart-item${item.id}">
        <div class="item-img-preview">
            <img src="${item.img_url}"/>
        </div>
        <div>
            <div class="pos-right">
              <div class="delete-cart-item" data-id="${item.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="13px" height="13px" viewBox="0 0 24 24" fill="none">
                    <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"/>
                  </svg>
              </div>
                
            </div>
            <div class="flex-column">
                <span style=""><span class=" fs-16">${item.name}</span><br><span class="fs-11" style="font-style:italic;">${c.name}</span></span>
                <div style="height:5px;"></div>
                <span class="fs-11">&nbsp;&nbsp;Quantity:</span>
                <div class="cart-item-bottom-wrapper">
                    <div class="qty-btns">
                        <div class="dec" data-id="${item.id}">
                            <svg width="clamp(0.875rem, 0.8345rem + 0.2027vw, 1.0625rem)" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1H13.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <span class="fs-13 text-qty${item.id}">${item.qty}</span>
                        </div>
                        <div class="inc" data-id="${item.id}">
                            <svg width="clamp(0.875rem, 0.8345rem + 0.2027vw, 1.0625rem)" height="clamp(0.875rem, 0.8345rem + 0.2027vw, 1.0625rem)" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.83325 8.50001H14.1666M8.49992 2.83334V14.1667" stroke="black" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div style="display: flex;align-items: end;">
                        <span class="fs-16">P <span id="item-total">${item.total}</span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>`);
    });

    document.querySelectorAll(".inc").forEach(function(el){
      el.addEventListener("click", function(){
        let id = el.getAttribute("data-id");
        let item = cart.find(p => p.id == id);
        item.qty += 1;
        item.total = item.price * item.qty;
        document.querySelector(".text-qty" + id).textContent = item.qty;
        document.querySelector(`.cart-item${id} #item-total`).textContent = item.total;

        checkTotal();
        
      });
    });

    document.querySelectorAll(".dec").forEach(function(el){
      el.addEventListener("click", function(){
        let id = el.getAttribute("data-id");
        let item = cart.find(p => p.id == id);
        if (item.qty > 1) {
          item.qty -= 1;
          item.total = item.price * item.qty;
          document.querySelector(".text-qty" + id).textContent = item.qty;
          document.querySelector(`.cart-item${id} #item-total`).textContent = item.total;

          checkTotal();
        }
      });
    });

    document.querySelectorAll(".delete-cart-item").forEach(function(deleteBtn){
      deleteBtn.addEventListener("click", function(){
        let id = deleteBtn.getAttribute("data-id");
        deleteCartItem(id);
        document.querySelector(".cart-item" + id).remove();
      })
    })
  }

  products.forEach(function(product){
    let img = new Image();
    img.src = product.img_url;
    img.addEventListener("load", () => {
      document.querySelector(".foods-list").insertAdjacentHTML("beforeend", `
        <div class="item menu-item${product.id}" data-id="${product.id}" data-category="${product.category}">
          <div class="item-image position-relative">
            ${img.outerHTML}
            <div class="selected-item-overlay d-none">
              <div class="fs-16 bold" style="color:#fff;display:flex;flex-direction:column;align-items:center;"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                
                Selected
              </div>
            </div>
          </div>
          <div class="item-desc" style="margin-top:3px;display:flex !important;flex-direction:column;">
            <div style="flex:1;">
              <span class="fs-16">${product.name}</span>
            </div>
            <div class="pos-right"><span class="bold fs-16">P ${product.price}</span></div>
          </div
        </div>
      `);

      const newItem = document.querySelector(".foods-list").lastElementChild;
      newItem.addEventListener("click", function() {
        if (!newItem.classList.contains("item-selected")) {
          
          if (cartIcon.classList.contains("d-none")) cartIcon.classList.remove("d-none");

          newItem.classList.add("item-selected");
          newItem.querySelector(".selected-item-overlay").classList.remove("d-none");
          addToCart(newItem.getAttribute("data-id"));

          if (window.innerWidth > 1024) {
            let imgClone = newItem.querySelector("img").cloneNode(true);
            moveToCartAnimation(imgClone, newItem.querySelector("img"), document.body);
          } else {
            numOfItemsInCart += 1;
            cartIcon.querySelector(".num-of-items").textContent = numOfItemsInCart;
          }

        } else {
          deleteCartItem(newItem.getAttribute("data-id"));
        }
      });
    });
  })

  document.querySelector(".categories-selector").addEventListener("change", function(){
    let category_id = this.value;
    if (category_id !== '') {
      document.querySelectorAll(".item").forEach(function(item){
        if (item.getAttribute("data-category") == category_id) {
          if (item.classList.contains("d-none")) item.classList.remove("d-none");
        } else {
          item.classList.add("d-none");
        }
      });
    } else {
      document.querySelectorAll(".item").forEach(function(item){
        if (item.classList.contains("d-none")) item.classList.remove("d-none");
      });
    }
  });

  cartIcon.addEventListener("click", function(){
    document.querySelectorAll(".menu-wrapper > div.cart").forEach(function(el){el.classList.remove("d-none")});
    document.querySelectorAll(".menu-wrapper > div." + currentSection).forEach(function(el){el.classList.add("d-none")});
    displayCartItems();
    checkTotal();
    if (!scrollUpIcon.classList.contains("d-none")) scrollUpIcon.classList.add("d-none");
    this.classList.add("d-none");

    currentSection = "cart";
  });

  function backToMenu(){
    document.querySelectorAll(".nav li").forEach(function(li){if(li.classList.contains("active"))(li.classList.remove("active"))});
    document.querySelector(".nav li[data-id='menu']").classList.add("active");
    currentSection = "menu";
  }

  document.querySelectorAll(".back-to-menu").forEach(function(btn){
    btn.addEventListener("click", function(){
      document.querySelectorAll(".menu-wrapper > div." + currentSection).forEach(function(el){el.classList.add("d-none")});
      document.querySelectorAll(".menu-wrapper > div.menu").forEach(function(el){el.classList.remove("d-none")});
      document.querySelector(".cart-items-wrapper").innerHTML = "";
      total = 0;
      subtotal = 0;
      if (cart.length > 0) {
        cartIcon.classList.remove("d-none");
      }

      backToMenu();
    });
  })

  document.querySelector(".custom-order-heading").addEventListener("click", function(){
    if (!document.querySelector(".custom-order-wrapper").classList.contains("active")) {
      document.querySelector(".custom-order-wrapper").classList.add("active");
    } else {
      document.querySelector(".custom-order-wrapper").classList.remove("active");
    }
  });

  document.querySelector("textarea.custom-order").addEventListener("input", function(){
    if (this.value !== '') {
      if (document.querySelector(".custom-order-label").classList.contains("d-none")) {
        document.querySelector(".custom-order-label").classList.remove("d-none")
      }
    } else {
      document.querySelector(".custom-order-label").classList.add("d-none")
    }
    document.querySelector(".custom-order-text").textContent = this.value;
  })

  

  document.querySelector(".proceed-btn").addEventListener("click", function(){
    document.querySelector(".modal").classList.remove("d-none");
    document.documentElement.style.overflow = "hidden";

    document.querySelector(".list-of-orders").innerHTML = "";
    
    cart.forEach(function(item){
      document.querySelector(".list-of-orders").insertAdjacentHTML("afterbegin", `
      <span class="fs-13">${item.qty} ${item.name}</span>`);
    
    });
  });

  document.querySelector("input[name='location']").addEventListener("input", function(){
    document.querySelector("#location-text").textContent = this.value;
    checkRequiredFields();
  });

  document.querySelector("input[name='name']").addEventListener("input", function(){
    if (document.querySelector("input[name='contact']").value !== '') {
      if (document.querySelector(".split-text").classList.contains("d-none")) document.querySelector(".split-text").classList.remove("d-none");
    } else {
      if (!document.querySelector(".split-text").classList.contains("d-none")) document.querySelector(".split-text").classList.add("d-none");
    }
    document.querySelector("#name-text").textContent = this.value;
    checkRequiredFields();
  });

  document.querySelector("input[name='contact']").addEventListener("input", function(){
    if (document.querySelector("input[name='name']").value !== '') {
      if (document.querySelector(".split-text").classList.contains("d-none")) document.querySelector(".split-text").classList.remove("d-none");
    } else {
      if (!document.querySelector(".split-text").classList.contains("d-none")) document.querySelector(".split-text").classList.add("d-none");
    }
    document.querySelector("#contact-text").textContent = this.value;
    checkRequiredFields();
  });

  document.querySelector("select[name='mop']").addEventListener("change", function(){
    document.querySelector("#mop-text").textContent = this.value;
  })

  document.querySelector(".modal .exit-modal").addEventListener("click", function(){
    document.documentElement.style.overflow = "auto";
    document.querySelector(".modal").classList.add("d-none");
  })

  function organizeDetails(){
   
    document.querySelector("textarea.to-copy").value = "Orders:";
    cart.forEach(function(item){
      document.querySelector("textarea.to-copy").value += "\n  " + item.qty + " " + item.name;
    });

    let loc, name, con, custom;
    loc = document.querySelector("input[name='location']");
    name = document.querySelector("input[name='name']");
    con = document.querySelector("input[name='contact']");
    custom = document.querySelector("textarea.custom-order");
    if (custom.value !== '') {
      document.querySelector("textarea.to-copy").value += "\n\nCustom orders:";
      document.querySelector("textarea.to-copy").value += "\n  " + custom.value;
    }
    if (loc.value !== '') {
      document.querySelector("textarea.to-copy").value += "\n\nLocation:";
      document.querySelector("textarea.to-copy").value += "\n  " + loc.value;
    }
    if (name.value !== '') {
      document.querySelector("textarea.to-copy").value += "\n\nName & Contact:";
      document.querySelector("textarea.to-copy").value += "\n  " + name.value;
      if (con.value !== '') {
        document.querySelector("textarea.to-copy").value += " | " + con.value;
      }
    } else {
      if (con.value !== '') {
        document.querySelector("textarea.to-copy").value += "\n\nName & Contact:";
        document.querySelector("textarea.to-copy").value += "\n  " + con.value;
      }
    }

    document.querySelector("textarea.to-copy").value += "\n\nMode of Payment:";
    document.querySelector("textarea.to-copy").value += "\n  " + document.querySelector("select[name='mop']").value;
    
  }

  function checkRequiredFields(){
    let loc, name, con;
    loc = document.querySelector("input[name='location']");
    name = document.querySelector("input[name='name']");
    con = document.querySelector("input[name='contact']");
    if (loc.value !== '' && name.value !== '' && con.value !== '') {
      document.querySelector(".order-now-btn").classList.remove("disabled-btn");
    } else {
      if (!document.querySelector(".order-now-btn").classList.contains("disabled-btn")) document.querySelector(".order-now-btn").classList.add("disabled-btn");
    }
  }

  document.querySelector(".order-now-btn").addEventListener("click", function(){
    if (!this.classList.contains("disabled-btn")) {
      document.querySelector(".redirecting-modal").classList.remove("d-none");
      organizeDetails();
      let order_details = document.querySelector("textarea.to-copy").value;
      navigator.clipboard.writeText(order_details);
      document.querySelector(".modal .exit-modal").click();
      setTimeout(() => {
        document.querySelector(".redirecting-modal").classList.add("d-none");
        window.open('https://m.me/61579248399955', '_blank');
      }, 3000);
    }
  })

  function moveToCartAnimation(clone, original, container){
    clone.classList.add("moving-item");
    clone.style.height = "100px";
    clone.style.width = "100px";
    clone.style.objectFit = "cover";

    let target = document.querySelector(".cart-icon");

    let rect = original.getBoundingClientRect();
    let targetRect = target.getBoundingClientRect();
    let containerRect = container.getBoundingClientRect();

    clone.style.position = "absolute";
    clone.style.top = (rect.top - containerRect.top + window.scrollY) + "px";
    clone.style.left = (rect.left - containerRect.left + window.scrollX) + "px";
    clone.style.transition = "all 0.8s ease";
    clone.style.zIndex = "1000";

    document.body.appendChild(clone);

    setTimeout(() => {
      clone.style.top = (targetRect.top - containerRect.top + window.scrollY) + "px";
      clone.style.left = (targetRect.left - containerRect.left + window.scrollX) + "px";
    }, 50);

    clone.addEventListener('transitionend', () => {
      numOfItemsInCart += 1;
      cartIcon.querySelector(".num-of-items").textContent = numOfItemsInCart;
      clone.remove();
    }, { once: true });

  }
  
})
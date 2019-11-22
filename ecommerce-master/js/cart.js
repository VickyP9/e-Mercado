let productUnitCost = 0;
let productCurrency = "";
let subtotal = 0;
let shippingPercentage = 0.15;
let total = 0;
let paymentTypeSelected = false;
const CREDIT_CARD_PAYMENT = "Tarjeta de crédito";
const BANKING_PAYMENT = "Transferencia bancaria";
let ERROR_MSG = "Ha habido un error :(, verifica qué pasó.";

//Función que se utiliza para actualizar los costos de publicación 
function updateTotalCosts() {

    let subTotalCostHTML = document.getElementById("subtotal");
    let shippingCostHTML = document.getElementById("shippingCost");
    let totalCostHTML = document.getElementById("totalCost");

    let shippingCost = Math.round(shippingPercentage * subtotal);

    subTotalCostHTML.innerHTML = productCurrency + " " + subtotal;
    shippingCostHTML.innerHTML = productCurrency + " " + shippingCost;
    totalCostHTML.innerHTML = productCurrency + " " + (subtotal + shippingCost);
}

function updateSubtotal() {
    let count = parseInt(document.getElementById("productCount").value);
    subtotal = count * productUnitCost;
    document.getElementById("productSubtotal").innerHTML = productCurrency + " " + subtotal;
    document.getElementById("cartBadge").innerHTML = count;
    updateTotalCosts();
}

function showPaymentTypeNotSelected() {
    document.getElementById("paymentTypeFeedback").style.display = "block";
}

function hidePaymentTypeNotSelected() {
    document.getElementById("paymentTypeFeedback").style.display = "none";
}

function showArticles(articles) {

    let htmlContentToCart = "";

    for (let i = 0; i < articles.length; i++) {
        productUnitCost = articles[i].unitCost;
        productCurrency = articles[i].currency;

        htmlContentToCart += `
    
        <tr>
            <td><img src='`+ articles[i].src + `' width="100px"></td>
            <td>`+ articles[i].name + `</td>
            <td>`+ articles[i].currency + " " + articles[i].unitCost + `</td>
            <td><input class="form-control" style="width:75px;" type="number" id="productCount" value="`+ articles[i].count + `" min="1"></td>
            <td><span id="productSubtotal"></span></td>
        </tr>  
        
        `

        document.getElementById("cart_info_container").innerHTML = htmlContentToCart;
        document.getElementById("productName").value = articles[i].name;

        updateSubtotal();

        document.getElementById("productCount").addEventListener("change", function () {
            updateSubtotal();
        });
    }
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById("premiumshipping").addEventListener("change", function () {
        shippingPercentage = 0.15;
        updateTotalCosts();
    });

    document.getElementById("expressshipping").addEventListener("change", function () {
        shippingPercentage = 0.07;
        updateTotalCosts();
    });

    document.getElementById("standardshipping").addEventListener("change", function () {
        shippingPercentage = 0.05;
        updateTotalCosts();
    });

    document.getElementById("creditCardPaymentRadio").addEventListener("change", function () {
        document.getElementById("creditCardNumber").disabled = false;
        document.getElementById("creditCardSecurityCode").disabled = false;
        document.getElementById("dueDate").disabled = false;
        document.getElementById("bankAccountNumber").disabled = true;

        document.getElementById("paymentType").innerHTML = CREDIT_CARD_PAYMENT;

        paymentTypeSelected = true;
        hidePaymentTypeNotSelected();
    });

    document.getElementById("bankingRadio").addEventListener("change", function () {
        document.getElementById("bankAccountNumber").disabled = false;
        document.getElementById("creditCardNumber").disabled = true;
        document.getElementById("creditCardSecurityCode").disabled = true;
        document.getElementById("dueDate").disabled = true;

        document.getElementById("paymentType").innerHTML = BANKING_PAYMENT;

        paymentTypeSelected = true;
        hidePaymentTypeNotSelected();
    });

    getJSONData(CART_INFO_URL).then(function (resultObj) {
        if (resultObj.status === 'ok') {
            showArticles(resultObj.data.articles);
        }
    });
});

var cartForm = document.getElementById("cartForm");

cartForm.addEventListener("submit", function (e) {
    let shippingStreet = document.getElementById("shippingStreet");
    let shippingNumber = document.getElementById("shippingNumber");
    let shippingCorner = document.getElementById("shippingCorner");
    let incompleteInfo = false;

    shippingStreet.classList.remove('is-invalid');
    shippingNumber.classList.remove('is-invalid');
    shippingCorner.classList.remove('is-invalid');

    if (shippingStreet.value === "") {
        shippingStreet.classList.add('is-invalid');
        incompleteInfo = true;
    }

    if (shippingNumber.value === "") {
        shippingNumber.classList.add('is-invalid');
        incompleteInfo = true;
    }

    if (shippingCorner.value === "") {
        shippingCorner.classList.add('is-invalid');
        incompleteInfo = true;
    }

    if (!paymentTypeSelected) {
        showPaymentTypeNotSelected();
        incompleteInfo = true;
    }

    if (!incompleteInfo) {

        getJSONData(CART_BUY_URL).then(function (resultObj) {
            let showMsg = "";

            if (resultObj.status === 'ok') {
                showMsg = resultObj.data.msg;
            }
            else if (resultObj.status === 'error') {
                showMsg = ERROR_MSG;
            }

            bootbox.alert(showMsg, null);

        })
    }

    if (e.preventDefault) e.preventDefault();
    return false;

});


var product = {};

function showImagesGallery(array){

    let htmlContentToAppend = "";

    for (let i=0; i < array.length; i++) {
        let imageSrc = array [i];
    

    htmlContentToAppend += `
    <div class="col-lg-3 col-md-4 col-6">
        <div class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
        </div>
    </div>
    `

    document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
} 


document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            product = resultObj.data;

            let productNameHTML  = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCurrencyHTML = document.getElementById("productCurrency");
            let productCostHTML = document.getElementById("productCost");
            let productCategoryHTML = document.getElementById("productCategory");
            let productSoldCountHTML = document.getElementById("productSoldCount");
        
            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCurrencyHTML.innerHTML = product.currency;
            productCostHTML.innerHTML = product.cost;
            productCategoryHTML.innerHTML = product.category;
            productSoldCountHTML.innerHTML = product.soldCount;

            showImagesGallery(product.images);
        }
    });
});
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COST = "Cant.";
var currentProductsArray= [];
var productsArray = undefined;
var currentSortCriteria = undefined;
var minCost = undefined;
var maxCost = undefined;


function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b){
            if (a.name < b.name){return -1;}
            if (a.name > b.name){return 1;}
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b){
            if (a.name > b.name){return -1;}
            if (a.name < b.name){return 1;}
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COST){
        result = array.sort(function (a, b){
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost > bCost){return -1};
            if (aCost < bCost){return 1};
            return 0;
        });
    }

    return result;

}

function showProductsList(){
    
    let htmlContentToProducts = "";
    for(let i = 0; i < currentProductsArray.length ; i++){
        let product = currentProductsArray[i];

        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) && ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))){

        htmlContentToProducts += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt="` + `" class="img-thumbnail">
                </div>
                <div class="col"> ` + product.name + `</div>
                <div class="col"> ` + product.description + `</div>
                <div class="col"> ` + product.cost + `</div>
                <div class="col"> ` + product.currency + `</div>
                <div class="col"> ` + product.soldCount + `</div>

            </div>
        </div>
        `
        }   

        document.getElementById("product-list-container").innerHTML = htmlContentToProducts;
    }

}

function sortAndShowProducts (sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined){
        currentProductsArray = productsArray;
    }
    
    currentProductsArray = sortProducts (currentSortCriteria, currentProductsArray);

    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(result){
        if (result.status === "ok")
        {
            productsArray = result.data;
            sortAndShowProducts(ORDER_ASC_BY_NAME ,productsArray);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCost").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_COST);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCost").addEventListener("click", function(){
        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt (minCost)) >= 0){
            minCost = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt (maxCost)) >= 0){
            maxCost = parseInt(maxCost);
        }
        else{
            maxCost = undefined;
        }

        showProductsList();

    });
});
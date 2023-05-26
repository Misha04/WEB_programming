(function (global) {

    let ns = {};

    const ALL_CATEGORIES_URL = "data/categories.json";
    const CATALOG_ITEMS_URL = "data/catalog/";

    const HOME_STATIC_CONTENT_HTML = "snippets/home-snippet.html";
    const CATEGORIES_TITLE_HTML = "snippets/categories-title-snippet.html";
    const CATEGORY_HTML = "snippets/category-snippet.html";

    const CATALOG_ITEMS_TITLE_HTML = "snippets/catalog-items-title-snippet.html";
    const CATALOG_ITEM_PREVIEW_HTML = "snippets/catalog-item-preview-snippet.html";
    const ABOUT_US_HTML = "snippets/about_us-snippet.html";

    let insertHtml = function (selector, html) {
        let targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    let showLoading = function (selector) {
        let html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif' alt='loading' /></div>";
        insertHtml(selector, html);
    };

    let insertProperty = function (string, propName, propValue) {
        let propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

    let switchCatalogToActive = function (selectedItem) {
        removeAllActiveSelectors();

        let classes = document.querySelector("#navbarDropdown").className;
        classes += " active";
        document.querySelector("#navbarDropdown").className = classes;

        classes = document.querySelector("#nav" + selectedItem).className;
        classes += " active";
        document.querySelector("#nav" + selectedItem).className = classes;
    };

    let switchAboutUsToActive = function () {
        removeAllActiveSelectors();

        let classes = document.querySelector("#navAboutUsButton").className;
        classes += " active";
        document.querySelector("#navAboutUsButton").className = classes;
    };

    let removeAllActiveSelectors = function() {
        document.querySelectorAll(".active").forEach(function (item) {
            item.className = item.className.replace(new RegExp("active", "g"), "");
        });
    };

    document.addEventListener("DOMContentLoaded", function (event) {
        showLoading("#content");
        $ajaxUtils
            .sendGetRequest(
                ALL_CATEGORIES_URL,
                function (categories) {
                    $ajaxUtils.sendGetRequest(
                        HOME_STATIC_CONTENT_HTML,
                        function (homeStaticHtml) {
                            $ajaxUtils.sendGetRequest(
                                CATEGORIES_TITLE_HTML,
                                function (categoriesTitleHtml) {
                                    $ajaxUtils.sendGetRequest(
                                        CATEGORY_HTML,
                                        function (categoriesHtml) {
                                            let homeHtmlView =
                                                buildHomeViewHtml(
                                                    categories,
                                                    homeStaticHtml,
                                                    categoriesTitleHtml,
                                                    categoriesHtml
                                                );
                                            insertHtml("#content", homeHtmlView);
                                        },
                                        false);
                                },
                                false);
                        },
                        false);
                });

    });

    function buildHomeViewHtml(categories, homeStaticContent, categoriesTitleHtml, categoryHtml) {
        let finalHtml = homeStaticContent;
        finalHtml += categoriesTitleHtml;
        finalHtml += "<div class='container'>";
        finalHtml += "<section class='row'>";

        for (let i = 0; i < categories.length; i++) {
            let html = categoryHtml;
            let name = "" + categories[i].name;
            html = insertProperty(html, "name", name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        finalHtml += "</div>";
        return finalHtml;
    }

    ns.loadCategoryItems = function (categoryName) {
        showLoading("#content");
        switchCatalogToActive(categoryName);
        $ajaxUtils.sendGetRequest(
            CATALOG_ITEMS_URL + categoryName + ".json",
            buildAndShowCatalogItemsHTML);
    };

    function buildAndShowCatalogItemsHTML(categoryCatalogItems) {
        $ajaxUtils.sendGetRequest(
            CATALOG_ITEMS_TITLE_HTML,
            function (catalogItemsTitleHtml) {
                $ajaxUtils.sendGetRequest(
                    CATALOG_ITEM_PREVIEW_HTML,
                    function (catalogItemPreviewHtml) {
                        let catalogItemsViewHtml = buildCatalogItemsViewHtml(
                            categoryCatalogItems,
                            catalogItemsTitleHtml,
                            catalogItemPreviewHtml);
                        insertHtml("#content", catalogItemsViewHtml);
                    },
                    false);
            },
            false);
    }

    function buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemsTitleHtml, catalogItemPreviewHtml) {
        catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "name", categoryCatalogItems.category.name);
        catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "notes", categoryCatalogItems.category.notes);

        let finalHtml = catalogItemsTitleHtml;
        finalHtml += "<div class='container'>";
        finalHtml += "<section class='row'>";

        let catalogItems = categoryCatalogItems.catalog_items;
        let categoryShortName = categoryCatalogItems.category.short_name;

        for (let i = 0; i < catalogItems.length; i++) {
            let html = catalogItemPreviewHtml;
            html = insertProperty(html, "short_name", catalogItems[i].short_name);
            html = insertProperty(html, "name", catalogItems[i].name);
            html = insertProperty(html, "id", catalogItems[i].id);
            html = insertProperty(html, "rating", catalogItems[i].rating);
            html = insertProperty(html, "description", catalogItems[i].description);
            html = insertProperty(html, "categoryShortName", categoryShortName);
            finalHtml += html;
        }

        finalHtml += "</section>";
        finalHtml += "</div>";
        return finalHtml;
    }

    ns.loadAboutUsPage = function () {
        showLoading("#content");
        $ajaxUtils.sendGetRequest(
            ABOUT_US_HTML,
            function (aboutUsHtml) {
                switchAboutUsToActive();
                insertHtml("#content", aboutUsHtml);
            },
            false);
    }
    ns.sayHello=function() {
        var name = document.getElementById("nameInput").value;
        alert("Ти молодець, " + name + "!");
    }


    ns.bag = function(){
        let a = document.getElementById("floatingInputM").value;
        if(a!=undefined||a!==null){
                document.getElementById("result").innerText = a+" We will call you in 5 minutes";
            
        }
        else{
            document.getElementById("result").innerText = "Enter the phone number";
        }
    }

    global.$ns = ns;



})(window);

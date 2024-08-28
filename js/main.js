import { findElement } from "./functions.js";

import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
const swiper = new Swiper(".swiper", {
	// direction: 'vertical',
	loop: true,
	spaceBetween: 30,
	effect: `fade`,
	// If we need pagination
	pagination: {
		el: ".swiper-pagination",
	},
	autoplay: {
		delay: 2000,
	},

	// Navigation arrows
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
});

const elWrapper = findElement(".item_block");
const elProductTemplate = findElement("template");
const elLoader = findElement(".loader");
const paginationBtn = findElement(".pagination_btn");
const elCategories = findElement("#categories");
const elFormEdit = findElement("#form-edit");
const elEditBtn = findElement("#edit-btn");
let products = [];
// let limit = 8;

// function getProducts() {
// 	fetch(`https://fakestoreapi.com/products?limit=${limit}`)
// 		.then((res) => res.json())
// 		.then((json) => {
// 			// console.log(json);
// 			productsx = json;
// 			elLoader.style.display = "none";
// 			renderProducts(products);
// 		});
// }

async function getProducts() {
	let res = await fetch(`https://fakestoreapi.com/products`);
	let data = await res.json();
	products = data;
	elLoader.style.display = "none";
	renderProducts(data);
}

fetch("https://fakestoreapi.com/products/categories")
	.then((res) => res.json())
	.then((json) => {
		// console.log(json)
		elCategories.textContent = "";

		json.forEach((category) => {
			// console.log(category);
			const newElement = document.createElement("a");
			newElement.className = "cat_list_it_link";
			newElement.innerHTML = category;
			elCategories.appendChild(newElement);
		});
	});
getProducts();
elCategories.addEventListener("click", (evt) => {
	// console.log(evt.target);
	fetch(`https://fakestoreapi.com/products/category/${evt.target.textContent}`)
		.then((res) => res.json())
		.then((json) => {
			renderProducts(json);
		});
});

function renderProducts(list = products, parent = elWrapper) {
	parent.textContent = null;
	list.forEach((product) => {
		const newTemplate = elProductTemplate.content.cloneNode(true);

		const itemImg = newTemplate.querySelector(".item_block_img");
		const elTitle = newTemplate.querySelector(".item_title");
		const elMonthlyPayment = newTemplate.querySelector(".monthly_payment");
		const elRealPrice = newTemplate.querySelector(".old_price");
		const elSalePrice = newTemplate.querySelector(".new_price");
		const elFavoriteBtn = newTemplate.querySelector(".heart_icon");
		const elShopBtn = newTemplate.querySelector(".shop_btn");
		const elEditBtn = newTemplate.querySelector(".edit_btn");

		elEditBtn.dataset.id = product.id;
		elFavoriteBtn.dataset.id = product.id;
		itemImg.src = product.image;
		elTitle.textContent = product.title;
		elMonthlyPayment.textContent = product.price;
		elRealPrice.textContent = product.rating;
		elShopBtn.dataset.id = product.id;

		parent.appendChild(newTemplate);
	});
}


// Edit Btn






elWrapper.addEventListener("click", (evt) => {
	if (evt.target.className.includes("edit_btn")) {
		const id = evt.target.dataset.id;

		fetch(`https://fakestoreapi.com/products/${id}`)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);

				elFormEdit.img.value = data.image;
				elFormEdit.title.value = data.title;
				elFormEdit.description.value = data.description;
				elFormEdit.real_price.value = data.price;
				elFormEdit.category.value = data.category;

				elEditBtn.addEventListener("click", (evt) => {
					fetch(`https://fakestoreapi.com/products/${id}`, {
						method: "PUT",
						body: JSON.stringify({
							title: elFormEdit.title.value,
							price: elFormEdit.real_price.value,
							description: elFormEdit.description.value,
							image: elFormEdit.img.value,
							category: elFormEdit.category.value,
						}),
					})
					.then((res) => res.json())
					.then((json) => console.log(json));
				});
			});
	}
});


paginationBtn.addEventListener("click", () => {
	limit += 10;
	elWrapper.textContent = "";
	elLoader.style.display = "block";
	getProducts();
	if (limit === 20) {
		paginationBtn.style.display = "none";
	}
});

const sectionEl = document.querySelector("section");
sectionEl.addEventListener("click", (evt) => {
	if (evt.target.className === "heart_icon") {
		const id = Number(evt.target.dataset.id);
		for (let i = 0; i < products.length; i++) {
			if (products[i].id === id) {
				products[i].isLiked = !products[i].isLiked;
			}
		}
		renderProducts(products);
	}
});

const elSearchInput = document.querySelector(".search_input");
const elSubmitBtn = document.querySelector("#submit_btn");

elSubmitBtn.addEventListener("click", () => {
	const query = elSearchInput.value.toLowerCase();
	const filteredArray = products.filter((item) => item.title.toLowerCase().includes(query));
	renderProducts(filteredArray);
});

renderProducts();

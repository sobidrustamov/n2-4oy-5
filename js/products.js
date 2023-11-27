document.addEventListener("DOMContentLoaded", async () => {
  axios.defaults.baseURL = "http://localhost:3000";

  let tbody = document.querySelector("tbody");
  let createProductModal = document.querySelector("#create-product-modal");
  let editProductModal = document.querySelector("#edit-product-modal");

  let createProductModalInstance = null;
  createProductModal.addEventListener("shown.bs.modal", function () {
    createProductModalInstance =
      bootstrap.Modal.getInstance(createProductModal);
  });

  let editProductModalInstance = null;
  editProductModal.addEventListener("shown.bs.modal", function () {
    editProductModalInstance = bootstrap.Modal.getInstance(editProductModal);
  });

  const updateProduct = (product) => {
    let tr = document.querySelector(`#product-${product.id}`);

    let tds = [
      product.id,
      `<img
          src="${product.image}"
          alt=""
          class="rounded-circle object-fit-cover"
          width="50"
          height="50"
        />`,
      `${product.product_name}`,
      product.price,
      product.category,
      product.company,
      product.description,
    ];

    tds.forEach((td, index) => {
      tr.children[index].innerHTML = td;
    });
  };

  const appendProduct = (product) => {
    let tr = document.createElement("tr");
    tr.id = `product-${product.id}`;

    let tds = [
      product.id,
      `<img
          src="${product.image}"
          alt=""
          class="rounded-circle object-fit-cover"
          width="50"
          height="50"
        />`,
      product.product_name,
      product.price,
      product.category,
      product.company,
      product.description,
    ];

    tds.forEach((td) => {
      let tdElement = document.createElement("td");
      tdElement.classList.add("align-middle");
      tdElement.innerHTML = td;
      tr.append(tdElement);
    });

    let actionsTd = document.createElement("td");
    let editBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");
    actionsTd.classList.add("align-middle");
    editBtn.classList.add("btn", "btn-success", "btn-sm");
    editBtn.innerHTML =
      '<span class="material-icons-outlined fs-5"> edit </span>';
    deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
    deleteBtn.innerHTML =
      '<span class="material-icons-outlined fs-5"> delete </span>';

    actionsTd.append(editBtn, deleteBtn);

    tr.append(actionsTd);

    tbody.append(tr);

    deleteBtn.addEventListener("click", async () => {
      tr.remove();

      await axios.delete(`/products/${product.id}`);
    });

    editBtn.addEventListener("click", () => {
      let form = document.querySelector("#edit-product-form");
      new bootstrap.Modal("#edit-product-modal").show();

      form.querySelector("#edit-product-name").value = product.product_name;
      form.querySelector("#edit-company").value = product.company;
      form.querySelector("#edit-price").value = product.price;
      form.querySelector("#edit-description").value = product.description;
      form.querySelector("#edit-category").value = product.category;
      form.querySelector("#edit-image").value = product.image;

      document
        .querySelector("#edit-product-btn")
        .addEventListener("click", async () => {
          let product_name = form[0].value;
          let price = +form[1].value;
          let description = form[2].value;
          let company = form[3].value;
          let category = form[4].value;
          let image = form[5].value;

          let newProductInfo = {
            product_name,
            company,
            price,
            description,
            category,
            image,
          };

          let { data } = await axios.put(
            `/products/${product.id}`,
            newProductInfo
          );

          updateProduct(data);

          editProductModalInstance.hide();
        });
    });
  };

  let products = await axios.get("/products");

  products.data.forEach(appendProduct);

  let createProductBtn = document.querySelector("#create-product-btn");

  async function createProduct() {
    let form = document.querySelector("#create-product-form");

    let product_name = form[0].value;
    let price = +form[1].value;
    let description = form[2].value;
    let company = form[3].value;
    let category = form[4].value;
    let image = form[5].value;

    let newProduct = {
      product_name,
      company,
      price,
      description,
      category,
      image,
    };

    // await fetch("http://localhost:3000/users", {
    //   method: "POST",
    //   body: JSON.stringify(newUser),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }).then((res) => res.json());

    let res = await axios.post("/products", newProduct);

    form.reset();

    createProductModalInstance.hide();

    appendProduct(res.data);
  }

  createProductBtn.addEventListener("click", createProduct);
});

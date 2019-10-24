import axios from "axios";

export async function getProducts(cpf) {
  var url =
    "https://api.descontofocado.gpa.digital/v2/promotions/CRM5?cpf=" + cpf;

  var result = await axios.get(url);

  return transform(result.data.data);
}

export async function activeDiscount(cpf, code) {
  var url = "https://api.descontofocado.gpa.digital/pa/focused/activating";

  var data = { promotion_id: code, cpf: cpf, channel: "SPA" };

  return axios({
    method: "POST",
    url,
    data,
    validateStatus: function(status) {
      return status >= 200 && status <= 399; // default
    }
  });
}

function transform(data) {
  const { categories } = data;

  const products = [];
  categories.forEach(category => {
    const { promotions } = category;

    promotions.forEach(promotion => {
      const {
        end_date_days,
        is_activated,
        images,
        offer_code,
        product_name,
        promo_percent
      } = promotion;

      products.push({
        days: end_date_days,
        activated: is_activated,
        image: images && images.length ? images[0].img_url : "",
        code: offer_code,
        name: product_name,
        discount: promo_percent
      });
    });
  });

  return products;
}

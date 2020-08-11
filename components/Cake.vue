<template>
  <div class="cake-card" :style="{backgroundColor: cake.color.rgba}">
    <div class="cake-label" :style="{backgroundImage: `url(/img/${cake.url})`}">
      <p class="name">{{cake.name}}</p>
      <p class="price">${{cake.price}}</p>
      <div class="cake-quantity" :class="{'cake-quantity-show': cake.selected}">
        <div class="cake-quantity-val">{{cake.quantity}}</div>
        <div class="plusminus">
          <div @click="(e) => plusmin(e, cake, 1)">+</div>
          <div @click="(e) => plusmin(e, cake, -1)">-</div>
        </div>
      </div>
    </div>
    <div class="cake-description" v-html="cake.description"></div>
  </div>
</template>

<script>
export default {
  props: ["cake"],
  methods: {
    plusmin: function(e, cake, inc) {
      e.stopPropagation();
      cake.quantity =
        cake.quantity === 1 && inc == -1 ? cake.quantity : cake.quantity + inc;
    }
  },filters: {
    decodeHTML(str) {
    // Temp div to render html internally
    let decode = $('<div />').html(str);

    // Add rendered html to DOM
    return $(decode);
    }
  }
};
</script>

<style>
.cake-card {
  min-width: 350px;
  min-height: 400px;
  display: inline-block;
  /* margin: 20px; */
  overflow: hidden;
  position: relative;
  padding: 0;
  border-radius: 8px;
  box-shadow: 0px 8px 15px 0px rgb(154, 122, 110);
  background-color: #eee;
  

  /* padding: 20px; */
}
.cake-card:hover {
  box-shadow: 0px 16px 20px 0px rgb(154, 122, 110);
  /* transform: perspective(40em) rotateX(-10deg); */
  /* transform-origin: center bottom; */
  transition: transform 0.1s ease-in, box-shadow 0.2s ease-in;
  /* border: 4px solid white; */
  cursor: pointer;
}
.cake-card.selected {
  border: 4px solid #cc1e2f;
  transition: border 0.2s ease-out;
}
.cake-card.selected:hover {
  transform: perspective(0) rotateX(0);
  box-shadow: 0 0 0 0;
  /* transition: box-shadow 0.2s ease, border 0.2s ease; */
}
.cake-label {
  /* background-image: url(~assets/img/cheese.jpg); */
  width: 100%;
  height: 200px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  background-color: rgba(0, 0, 0, 0.3);
  background-blend-mode: multiply;
  background-size: cover;
  background-position-y: center;
  font-family: 'Libre Baskerville', serif;
}
.cake-description {
  margin: 15px;
  font-family: 'Karla';
}
p.price {
  font-size: 44px;
  font-weight: 600;
}
p.name {
  font-size: 28px;
  margin-top: 34px;
}
.cake-quantity {
  font-size: 2.2rem;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  right: 0;
  display: none;
}
.cake-quantity-val {
  margin: 50% 5px 0 0;
}
.cake-quantity-show {
  display: inline-flex;
}
.plusminus {
  text-align: center;
}
</style>

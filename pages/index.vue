<template>
  <div class>
    <h1>SWEET & SAVOURY DELIGHTS FRIDAY!!!</h1>
    <main class>
      <Cake
        v-for="(cake, index) in cakes"
        @click.native="select(cake)"
        :key="index"
        :cake="cake"
        :class="{ selected: cake.selected}"
      />
    </main>
    <div class="row">
      <div class="cake-submit-container">
        <input
          type="submit"
          class="btn btn-lg btn-danger cake-submit"
          value="Next"
          data-target="#exampleModal"
          :disabled="selected.length < 1"
          @click="next"
          v-if="cakes.length"
        />
        <!-- <span :style="{display: choose}">[Choose one]</span> -->
      </div>
    </div>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Confirm order</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="order">
            <div class="modal-body">
              <span>You order:</span>
              <ul>
                <li v-for="(s, index) in selected" :key="index">{{s.quantity}}x - {{s.name}}</li>
              </ul>
              <div class="form-group">
                Contact Info:
                <input
                  class="form-control"
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  v-model="name"
                />
                <input
                  class="form-control"
                  type="tel"
                  placeholder="876 (optional)"
                  name="phone"
                  required
                  v-model="tel"
                />
              </div>
            </div>
            <div class="modal-footer">
              <span class="order-success" :style="{display: success}">Got your order ✔️</span>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-danger">Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cake from "@/components/Cake.vue";
import axios from "axios";

export default {
  components: {
    Cake
  },
  data() {
    return {
      cakes: [],
      selected: [],
      name: "",
      tel: "",
      success: "none"
    };
  },
  methods: {
    next: function() {
      if (this.selected.length) $("#exampleModal").modal("toggle");
    },
    order: async function() {
      let order = {
        name: this.name,
        tel: this.tel,
        cake: this.selected
      };
      let { data, status } = await axios.post("/api/order/new", order);

      if (status === 200) {
        this.success = "inline";

        setTimeout(() => {
          $("#exampleModal").modal("hide");
          this.success = "none";
          this.selected = [];
          this.cakes.map(cake => {
            cake.selected = false;
            cake.quantity = 1;
          });
        }, 3000);
      }
    },
    select: function(cake) {
      if (!cake.selected) {
        this.selected.push(cake);
        cake.selected = !cake.selected;
      } else {
        let index = this.selected.indexOf(cake);
        if (index > -1) {
          this.selected.splice(index, 1);
          cake.selected = !cake.selected;
        }
      }
    }
  },
  async created() {
    let { data } = await axios.get("/api/cake");
    await data.map(c => {
      c.selected = false;
      c.quantity = 1;
    });
    this.cakes = await data;
  }
};
</script>

<style>
body {
  font-size: 16px;
  background: #f5c0ad;
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;
  padding: 20px;
}
h1 {
  font-family: "Abril Fatface";
  white-space: wrap;
  font-size: 4vw;
  line-height: 1.2;
  padding: 0 20px;
  text-align: center;
  color: #d6a694;
  margin-bottom: 5rem;
  margin-top: 5rem;
}
main {
  margin: 0 auto;
  width: 60%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  align-items: center;
  grid-auto-flow: row dense;
  grid-gap: 20px;
}
@media only screen and (max-width: 720px) {
  main {
    grid-template-columns: 1fr;
    width: unset;
  }
  h1 {
    font-size: 2rem;
    margin: 0.5rem 0 1.5rem 0;
    /* display: none; */
  }
}
.form-control {
  margin-top: 20px;
}
.cake-submit-container {
  margin: 0 auto;
}
.cake-submit {
  margin: 30px 0;
  width: 130px;
  height: 60px;
}
</style>

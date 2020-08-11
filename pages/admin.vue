<template>
  <div class="container" v-if="loggedIn">
    <h1>Admin</h1>

    <div class="tabs">
      <div class="tab">
        <input type="radio" name="tabgroup" id="tab-1" checked />
        <label for="tab-1">Orders</label>
        <div class="content">
          <h3>Orders</h3>
          <table id="tab" class="per-person table table-bordered">
            <thead>
              <tr>
                <th>contact</th>
                <th>order cost</th>
                <th>cake</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, index) in orders" :key="index">
                <td>{{order.name}} ({{order.tel}})</td>
                <td>${{order.cake | getOrderCost }}</td>
                <td class="cake-chip-td">
                  <div class="cake-chip" v-for="(cake, jndex) in order.cake" :key="jndex">
                    {{cake.name}}
                    <span class="badge badge-dark">{{cake.quantity}}</span>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>grand total</td>
                <td>${{orders | getTotalCost}}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="tab">
        <input type="radio" name="tabgroup" id="tab-2" />
        <label for="tab-2">Breakdown</label>
        <div class="content">
          <h3>Break Down</h3>
          <div class="row">
            <div class="col-md-6">
              <table class="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>cake</th>
                    <th>quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(total, index) in totals" :key="index">
                    <td>{{total.name}}</td>
                    <td>{{total.quantity}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="tab">
        <input type="radio" name="tabgroup" id="tab-3" />
        <label for="tab-3">Menu</label>
        <div class="content">
          <h3>Menu</h3>
          <div v-for="(cake,index) in cakes" :key="index" class="item-container">
            <div class="item">
              <span>{{cake.name}}</span>
              <span>${{cake.price}}</span>
              <input
                class="sitch"
                type="checkbox"
                @change="e => updateAvail(e,cake)"
                v-model="cake.available"
              />
              <div class="mod">
                <i class="fas fa-edit" @click="e => edit(e, cake)"></i>
                <i class="fas fa-trash-alt" @click="() => deleteCake(cake._id)"></i>
              </div>
            </div>
            <!-- <div v-if="cake.variants.length>0">
              <div v-for="(v, index) in cake.variants" :key="index" class="item sub-item">
                <span>{{v.name}}</span>
                <span>${{v.price}}</span>
                <input
                  class="sitch"
                  type="checkbox"
                  @change="e => updateAvail(e,cake)"
                  v-model="v.available"
                />
                <div class="mod">
                  <i class="fas fa-edit" @click="e => console.log('clicked')"></i>
                  <i class="fas fa-trash-alt" @click="() => deleteCake(cake._id)"></i>
                </div>
              </div>
            </div> -->
          </div>
          <form @submit.prevent="addCake">
            <div class="item">
              <input type="text" placeholder="Name" v-model="newCake.name" />
              <input type="number" placeholder="Cost" v-model="newCake.price" />
              <!-- <input type="text" placeholder="Picture" v-model="newCake.url" /> -->
              <input type="file" @change="imageSelect" accept="image/jpeg,image/jpg,image/png">
              <input
                type="submit"
                style="position: absolute; left: -9999px; width: 1px; height: 1px;"
                tabindex="-1"
              />
            </div>
          </form>
        </div>
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
            <h5 class="modal-title" id="exampleModalLabel">Edit cake</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="updateCake">
            <div class="modal-body">
              <div class="form-group">
                Name:
                <input
                  class="form-control"
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  v-model="editCake.name"
                />
                 Price:
                <input
                  class="form-control"
                  type="text"
                  placeholder="0.00"
                  name="price"
                  v-model="editCake.price"
                />
                URL:
                <input
                  class="form-control"
                  type="text"
                  placeholder="http://..."
                  name="url"
                  v-model="editCake.url"
                />
                <div>Description:</div> 
                <editor
                  v-model="editCake.description"
                  api-key="80xo7uxsrkxe54w9op08802by3wxce1kcwrfbboo2pj35ya0"
                  :init="{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help'
                  }"
                />
              </div>                
            </div>
            <div class="modal-footer">
              <!-- <span class="order-success" :style="{display: success}">Got your order ✔️</span> -->
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-danger">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Editor from '@tinymce/tinymce-vue'
import FastAverageColor from 'fast-average-color';

export default {
  components: {
     'editor': Editor,
   },
  data() {
    return {
      orders: [],
      cakes: [],
      newCake: {},
      editCake: {},
      date: "",
      loggedIn: false,
    };
  },
  filters: {
    getOrderCost: cake => {
      return cake
        .map(cake => cake.price * cake.quantity)
        .reduce((a, c) => a + c);
    },
    getTotalCost: orders => {
      if (orders.length) {
        return orders
          .map(order =>
            order.cake
              .map(cake => cake.price * cake.quantity)
              .reduce((a, c) => a + c)
          )
          .reduce((a, c) => a + c);
      }
      return "0";
    }
  },
  methods: {
    imageSelect: function(e) {
      this.newCake.image = e.target.files[0];
      const fac = new FastAverageColor()
      var img = new Image();
      img.src = URL.createObjectURL(e.target.files[0]);

      fac.getColorAsync(img, { algorithm: 'simple', mode: 'precision' })
      .then(color => {
          this.newCake.color = color;
          // console.log(color)
      })
      .catch(e => {
          console.error(e);
      });
    },
    edit: function(e, cake) {
      this.editCake = cake;
      $("#exampleModal").modal("toggle");
    },
    async updateCake() {
      let { data } = await axios.patch(`api/cake/${this.editCake._id}`, {
        ...this.editCake
      });
      this.editCake = {};
      $("#exampleModal").modal("hide");
    },
    GetThisWeekStart() {
      var today = moment();
      var dasystoThisMonday = today.isoWeekday() - 1;
      var thisMonday = today.subtract(dasystoThisMonday, "days");

      return thisMonday.startOf("day").format("x");
    },

    GetThisWeekEnd() {
      var today = moment();
      var dasystoThisFriday = 5 - today.isoWeekday();
      var thisFriday = today.add(dasystoThisFriday, "days");

      return thisFriday.endOf("day").format("x");
    },
    async updateAvail(e, cake) {
      let { data } = await axios.patch(`api/cake/${cake._id}`, {
        ...cake,
        available: e.target.checked
      });
    },
    async addCake() {
      var form_data = new FormData();
      // for ( var key in this.newCake ) {
      //   form_data.append(key, this.newCake[key]);
      // }   
      form_data.append('name', this.newCake.name);
      form_data.append('price', this.newCake.price);
      form_data.append('image', this.newCake.image);
      form_data.append('color', JSON.stringify(this.newCake.color))
      try {
        let { status } = await axios.post("/api/cake", form_data);
        if (status === 200) {
          let { data } = await axios.get("/api/cake");
          this.cakes = data;
          this.newCake = {};
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteCake(id) {
      try {
        // let conf = 
        if (confirm("Sure?")){
          let { status } = await axios.delete(`/api/cake/${id}`);
          if (status === 200) {
            let { data } = await axios.get("/api/cake");
            this.cakes = data;
          }
        }
        
      } catch (err) {
        console.error(err);
      }
    }
  },
  computed: {
    totals: function() {
      let names = [
        ...new Set(
          [].concat
            .apply(
              [],
              this.orders.map(o => o.cake)
            )
            .map(({ name }) => name)
        )
      ];

      let orders = [].concat.apply(
        [],
        this.orders.map(o => o.cake)
      );
      return names.map(name => ({
        name: name,
        quantity: orders
          .filter(order => name === order.name)
          .map(a => a.quantity)
          .reduce((a, c) => a + c)
      }));
    }
  },
  async created() {
    try {
      let token = window.localStorage.getItem("token");

      let { data, status } = await axios.post(
        "/api/login/access",
        {},
        {
          headers: {
            authorization: token
          }
        }
      );
      if (status === 200) {
        let res = await axios.all([
          axios.get(
            `api/order?mon=${this.GetThisWeekStart()}&fri=${this.GetThisWeekEnd()}`
          ),
          axios.get("/api/cake")
        ]);
        this.orders = await res[0].data;
        this.cakes = await res[1].data;
        this.loggedIn = true;
        await this.$nextTick(function() {
          $("#tab").DataTable({});
        });
      }
    } catch (err) {
      this.$router.replace({ name: "login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: block;
}
.inner-table {
  padding: 0 !important;
}
td > .table {
  margin-bottom: 0;
}
.cake-chip-td {
  padding-bottom: 0;
}
.per-person th:first-child {
  width: 30%;
}
td > .table > tr > td {
  border-top: none;
  width: 50%;
}
.cake-chip {
  padding: 6px 12px;
  background-color: pink;
  display: inline-block;
  border-radius: 16px;
  margin: 0px 0 12px 8px;
  font-size: 12px;
  /* color: white; */
}
tfoot {
  font-weight: 700;
}
.tabs {
  position: relative;
  // set height to be even for all tab groups
  height: calc(100vh - 200px);
  display: block;
  margin: 1em auto 0;
  width: 100%;
}

.tab {
  float: left;

  label {
    cursor: pointer;
    font-size: 1.2em;
    border-radius: 5px;
    padding: 0.5em 1em;
    color: #333;
  }

  [type="radio"] {
    position: absolute;
    clip: rect(0, 0, 0, 0);

    &:checked ~ label {
      background: rgb(83, 83, 83);
      color: white;
    }

    &:checked ~ label ~ .content {
      z-index: 1;
      display: block;
      h3 {
        margin-top: 1rem;
        margin-bottom: 1rem;
      }
    }
  }
}

.content {
  display: none;
  // background: white;
  border-radius: 0 5px 5px;
  position: absolute;
  width: 100%;
  top: 3.2em;
  left: 0;
  right: 0;
  bottom: 0;
}

.item {
  // max-wid  th: 40vw;
  display: grid;
  grid-template-columns: 250px 100px max-content max-content max-content;
  grid-gap: 10px;

  margin-top: 2rem;
  align-items: center;
  &:last-of-type {
    margin-bottom: 0;
  }
}
.item-container {
  margin-bottom: 2rem;
  &:first-of-type {
    margin-bottom: 0;
  }
}
.sub-item {
  margin-left: 20px;
  margin-top: 0.5rem;
}
.switch {
  cursor: pointer;
  &:focus {
    outline: none;
  }
}

.fa-trash-alt:hover {
  color: rgb(255, 122, 122);
}
.fa-edit:hover {
  color: rgb(122, 122, 255);
}
.item > .mod {
  cursor: pointer;
  opacity: 0.1;
}
.mod {
  margin-left: 20px;
}
.item:hover > .mod {
  opacity: 1;
}
// .add-item {
//   cursor: pointer;
//   opacity: 0.3;
//   &:hover {
//     opacity: 1;
//   }
//   label {
//     font-size: 1rem;
//     padding: 0;
//     input {
//       display: none;
//     }
//   }
// }
form > .item {
  margin-top: 40px;
}
</style>
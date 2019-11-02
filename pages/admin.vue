<template>
  <div class="container" v-if="loggedIn">
    <h1>Admin</h1>

    <div class="tabs">
      <div class="tab">
        <input type="radio" name="tabgroup" id="tab-1" checked />
        <label for="tab-1">Per Person</label>
        <div class="content">
          <h3>Per Person</h3>
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
          <div v-for="(cake,index) in cakes" :key="index" class="item">
            <span>{{cake.name}}</span>
            <input
              class="sitch"
              type="checkbox"
              @change="e => updateAvail(e,cake._id)"
              v-model="cake.available"
            />
            <div class="mod">
              <i class="fas fa-edit"></i>
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      orders: [],
      cakes: [],
      date: "",
      loggedIn: false
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
    async updateAvail(e, id) {
      let a = e.target.checked;
      let { data } = await axios.patch(`api/cake/available/${id}`, {
        available: e.target.checked
      });
      console.log(a);
    }
  },
  computed: {
    totals: function() {
      let names = [
        ...new Set(
          [].concat
            .apply([], this.orders.map(o => o.cake))
            .map(({ name }) => name)
        )
      ];

      let orders = [].concat.apply([], this.orders.map(o => o.cake));
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
      h3 {
        margin-top: 1rem;
        margin-bottom: 1rem;
      }
    }
  }
}

.content {
  background: white;
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
  grid-template-columns: 300px max-content max-content max-content;
  grid-gap: 10px;

  margin-bottom: 2rem;
  align-items: center;
  &:last-of-type {
    margin-bottom: 0;
  }
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
</style>
<template>
  <div class="container" v-if="loggedIn">
    <h1>Admin</h1>

    <h3>break down</h3>
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
    <h3>per person</h3>
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
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      orders: [],
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
        let { data } = await axios.get(
          `api/order?mon=${this.GetThisWeekStart()}&fri=${this.GetThisWeekEnd()}`
        );
        this.orders = await data;
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

<style scoped>
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
</style>

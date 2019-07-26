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
          <tfoot>
            <tr>
              <td>grand total</td>
              <td>${{orders | getTotalCost}}</td>
            </tr>
          </tfoot>
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
    </table>
  </div>
</template>

<script>
import axios from "axios";
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
      // console.log(cake.map(cake => cake.price * cake.quantity));
      return cake
        .map(cake => cake.price * cake.quantity)
        .reduce((a, c) => a + c);
      // return "k";
    },
    getTotalCost: orders => {
      return orders
        .map(order =>
          order.cake
            .map(cake => cake.price * cake.quantity)
            .reduce((a, c) => a + c)
        )
        .reduce((a, c) => a + c);
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
        let { data } = await axios.get("/api/order");
        this.orders = await data;
        this.loggedIn = true;
        await this.$nextTick(function() {
          $("#tab").DataTable({
            // dom: 'lf<"datepicker">rtip'
            // dom: 'lf<"datepicker">rtip'
          });
          // $("div.datepicker").append(
          //   "<label>Date:<input id='datetimepicker' class='form-control form-control-sm' type='text'></label>"
          // );
          // $("div.datepicker").css({
          //   display: "inline",
          //   float: "right",
          //   "text-align": "right",
          //   padding: 0
          // });
          // $("div.datepicker").value = new Date().toISOString().substr(0, 10);
          // .replace(/-/g, "/");
          // $("div.datepicker > label > input").datepicker({
          // $("#datetimepicker").datepicker({
          //   defaultDate: "18/07/2019"
          // });
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
  margin: 0px 0 8px 8px;
  font-size: 12px;
  /* color: white; */
}
tfoot {
  font-weight: 700;
}
</style>

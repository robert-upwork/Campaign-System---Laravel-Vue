<template>
  <section class="content-wrapper" style="min-height: 960px;">
    <section class="content-header">
      <h1>Key Answers</h1>
    </section>

    <section class="content">
      <div class="panel panel-success">
        <div class="panel-heading">Filter Key Information</div>
        <div class="panel-body" v-if="!loading">
          <!-- <router-link :to="{ name: 'tests.index' ,  params: { id: testinfo.id }}"> -->
          <h2>{{filterKey.name}}</h2>
          <!-- </router-link> -->
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header with-border">
              <h3 class="box-title">List</h3>
            </div>
            <div class="box-body">
              <!-- <back-buttton></back-buttton> -->
              <router-link
                v-if="$can('filter_key_view')"
                :to="{ name: 'filter.keys.show', params: { id: filterKeyId }}"
                class="btn btn-default btn-sm"
              >
                <span class="glyphicon glyphicon-chevron-left"></span> Back to Filter Key
              </router-link>
            </div>
            <div class="box-body">
              <div class="btn-group">
                <router-link
                  v-if="$can(xprops.permission_prefix + 'create')"
                  :to="{ name: xprops.route + '.create', params: { id: filterKeyId }}"
                  class="btn btn-success btn-sm"
                >
                  <i class="fa fa-plus"></i> Add new
                </router-link>
                <button
                  type="button"
                  class="btn btn-default btn-sm"
                  @click="fetchData(filterKeyId)"
                >
                  <i class="fa fa-refresh" :class="{'fa-spin': loading}"></i> Refresh
                </button>
              </div>
            </div>

            <div class="box-body">
              <div class="row" v-if="loading">
                <div class="col-xs-4 col-xs-offset-4">
                  <div class="alert text-center">
                    <i class="fa fa-spin fa-refresh"></i> Loading
                  </div>
                </div>
              </div>

              <datatable
                v-if="!loading"
                :columns="columns"
                :data="data"
                :total="total"
                :query="query"
                :xprops="xprops"
                filterable
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DatatableActions from "../../dtmodules/DatatableActions";

export default {
  data() {
    return {
      columns: [
        {
          title: "#",
          field: "id",
          sortable: true,
          colStyle: "width: 50px;"
        },
        {
          title: "Title",
          field: "title",
          sortable: true
        },
        {
          title: "Actions",
          tdComp: DatatableActions,
          visible: true,
          thClass: "text-right",
          tdClass: "text-right",
          colStyle: "width: 130px;"
        }
      ],
      query: {
        sort: "id",
        order: "desc"
      },
      xprops: {
        module: "KeyAnswersIndex",
        route: "key.answers",
        permission_prefix: "key_answer_"
      },
      filterKeyId: this.$route.params.id
    };
  },
  created() {
    this.$root.relationships = this.relationships;

    this.fetchData(this.filterKeyId);
  },
  destroyed() {
    this.resetState();
  },
  computed: {
    ...mapGetters("KeyAnswersIndex", [
      "data",
      "filterKey",
      "total",
      "loading",
      "relationships"
    ])
  },
  watch: {
    "$route.params": function() {
      this.fetchData(this.$route.params.id);
    },
    query: {
      handler(query) {
        this.setQuery(query);
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("KeyAnswersIndex", ["fetchData", "setQuery", "resetState"])
  }
};
</script>

<style scoped>
</style>

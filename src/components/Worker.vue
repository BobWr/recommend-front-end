<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div style="margin-top: 15px;">
          <el-input placeholder="搜索关键字" v-model="serchWord" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" v-on:click="search()"></el-button>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3" :offset="6">
        <el-table
          ref="singleTable"
          highlight-current-row
          @current-change="handleCurrentChange"
          :data="keywords"
          style="width: 100%;margin-bottom: 20px;margin-top: 17px;"
          border
          row-key="id"
        >
          <el-table-column prop="keywordsContent" label="keyword" sortable></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="9">
        <el-form status-icon label-width="100px">
          <div style="margin: 17px;"></div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 17, maxRows: 888}"
            placeholder="请输入内容"
            v-model="content"
          ></el-input>
          <div style="margin: 17px;"></div>
          <el-form-item>
            <el-button type="primary" style="width: 37%; float: right;" @click="addMsg()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Worker",
  data() {
    return {
      msg: "Welcome W",
      serchWord: "",
      keywords: "",
      content: "",
      currentKeyword: ""
    };
  },
  methods: {
    search: function() {
      this.$axios
        .get(
          this.$HOST +
            "recommend/v1/worker/getAllKeywords?content=" +
            this.serchWord
        )
        .then(res => {
          this.keywords = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    addMsg: function() {
      if (this.currentKeyword.length == 0) {
        this.$alert("请选择当前任务keyword！", "提交失败", {
          confirmButtonText: "确定"
        });
      }

      //   alert(this.currentKeyword + "---" + this.content);
      //   return;

      this.$axios
        .post(
          this.$HOST +
            "recommend/v1/worker/addMsg?keyWord=" +
            this.currentKeyword +
            "&content=" +
            this.content
        )
        .then(res => {
          this.$alert("", "提交成功", {
            confirmButtonText: "确定"
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    create: function() {
      this.$axios
        .get(
          this.$HOST +
            "recommend/v1/worker/getAllKeywords?content=" +
            this.serchWord
        )
        .then(res => {
          this.keywords = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.currentKeyword = val.keywordsContent;
      this.$message({
        type: "warning",
        message: "当前任务keyword切换为： " + "[ " + this.currentKeyword + " ]"
      });
    }
  },
  created: function() {
    this.create();
  }
};
</script>

<style scoped>
h1 {
  color: #409eff;
}
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>




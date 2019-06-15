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
          <el-table-column fixed="right" label="操作" width="67">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, keywords)"
                type="text"
                size="small"
              >取消订阅</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="9">
        <el-table
          :data="messages"
          style="width: 100%;margin-bottom: 20px;margin-top: 17px;"
          border
          row-key="id"
        >
          <!-- <el-table-column prop="date" label="date" sortable width="180"></el-table-column> -->
          <el-table-column prop="content" label="content" sortable></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      msg: "Sublt",
      serchWord: "",
      keywords: "",
      messages: "",
      currentKeyword: ""
    };
  },
  methods: {
    deleteRow(index, rows) {
      this.$confirm(
        "取消订阅后将接收不到邮件推送，您确定取消订阅此关键字吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success",
          center: true
        }
      ).then(() => {
        this.$axios
          .get(
            this.$HOST +
              "sublt/v1/user/deleteKeyword?userName=" +
              rows[index].userName +
              "&content=" +
              rows[index].keywordsContent
          )
          .then(res => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            console.log(rows);
            rows.splice(index, 1);
            console.log(rows);
            // handleCurrentChange(rows[1]);
            console.log(res);
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    search: function() {
      if (this.serchWord == "") {
        this.create();
        return;
      }

      this.$axios
        .get(
          this.$HOST +
            "sublt/v1/user/getKeywordsByContent?userName=test&content=" +
            this.serchWord
        )
        .then(res => {
          if (res.data.length == 0) {
            this.$confirm("您还没有监听此关键字，是否添加监听?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "success",
              center: true
            }).then(() => {
              this.$prompt("请输入用户名", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              })
                .then(({ value }) => {
                  this.$axios
                    .post(
                      this.$HOST +
                        "sublt/v1/user/addKeyWord?userName=" +
                        value +
                        "&keyWord=" +
                        this.serchWord
                    )
                    .then(res => {
                      this.$message({
                        type: "success",
                        message: "监听成功!"
                      });
                      console.log(res);
                    })
                    .catch(error => {
                      this.$message({
                        type: "success",
                        message: "监听失败!"
                      });
                      console.log(error);
                    });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "操作已取消"
                  });
                });
              // this.addKeyWord();
            });
            this.keywords = "";
            this.messages = "";
          } else {
            this.keywords = res.data;
            if (this.keywords.length != 0) {
              console.log(this.keywords[0].keywordsContent);
              this.$axios
                .get(
                  this.$HOST +
                    "sublt/v1/user/getMsgByKeyword?keyword=" +
                    this.keywords[0].keywordsContent
                )
                .then(res => {
                  this.messages = res.data;
                  console.log(res);
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addKeyWord: function() {
      this.$axios
        .post(
          this.$HOST +
            "sublt/v1/user/addKeyWord?userName=test&keyWord=" +
            this.serchWord
        )
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    },
    create: function() {
      this.$axios
        .get(this.$HOST + "sublt/v1/user/getAllKeywords?userName=test")
        .then(res => {
          this.keywords = res.data;
          if (this.keywords.length != 0) {
            console.log(this.keywords[0].keywordsContent);
            this.$axios
              .get(
                this.$HOST +
                  "sublt/v1/user/getMsgByKeyword?keyword=" +
                  this.keywords[0].keywordsContent
              )
              .then(res => {
                this.messages = res.data;
                console.log(res);
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.currentKeyword = val.keywordsContent;
      if (this.currentKeyword.length != 0) {
        this.$axios
          .get(
            this.$HOST +
              "sublt/v1/user/getMsgByKeyword?keyword=" +
              this.currentKeyword
          )
          .then(res => {
            this.messages = res.data;
            console.log(res);
          })
          .catch(error => {
            console.log(error);
          });
      }
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




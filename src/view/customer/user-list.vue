<template>
  <div class="container">
    <div class="top_container">
      <a class="title">用户列表</a>
    </div>
    <el-table :data="userList" style="width: 100%" :stripe="true" height="600">
      <el-table-column prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="img" label="头像" width="150">
        <el-image v-if="scope.row.avatar_url" slot-scope="scope" :src="scope.row.avatar_url"
                  style="width: 80px; height: 80px"></el-image>
      </el-table-column>
      <el-table-column prop="nick_name" label="昵称" width="150"></el-table-column>
      <el-table-column prop="gender" label="性别" width="80"></el-table-column>
      <el-table-column prop="country" label="国家" width="120"></el-table-column>
      <el-table-column prop="province" label="省份" width="100"></el-table-column>
      <el-table-column prop="city" label="城市" width="100"></el-table-column>
      <el-table-column prop="create_time" label="注册时间" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
<!--          <el-button type="primary" plain size="mini" @click="handerDetail(scope.row.id)">详情</el-button>-->
          <el-button type="danger" v-permission="{ permission: '删除SPU', type: 'disabled' }"
                     size="mini" plain @click="handlerRemove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
<!--    <page @page-event="pageEmit" :current-page="this.$data.page"-->
<!--          :total="this.total" :page-size="this.pageSize" :remove-flag="this.removeFlag"></page>-->
  </div>
</template>

<script>
import { User } from '../../model/user'
import Page from '../../component/custom/page'
import { getSlashYMDHMS } from '../../util/date-1'

export default {
  name: 'user',
  components: { Page },
  props: {
  },
  created() {
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const users = await User.getUsers()
      console.log(users)
      this.formateDate(users.items)
      this.formatGender(users.items)
      this.$data.userList = users.items
    },
    handlerRemove() {
    },
    /**
     * 格式化创建时间
     * @param items
     */
    formateDate(items) {
      items.forEach(item => {
        item.create_time = getSlashYMDHMS(item.create_time)
      })
    },
    /**
     * 格式化性别显示
     * @param items
     */
    formatGender(items) {
      items.forEach(item => {
        if (item.gender === 1) {
          item.gender = '男'
        } else {
          item.gender = '女'
        }
      })
    },
  },
  data() {
    return {
      userList: null
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    padding: 0 30px 10px 30px;
    position: relative;
  }
  .top_container {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .title {
    color: $theme;
  }
</style>
